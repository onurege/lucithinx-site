// Build script: single source of truth (template.html + i18n.js) → two
// fully static, SEO-crawlable outputs (index.html for TR, en/index.html
// for EN). Zero dependencies — Node built-ins only.
//
// Why this exists: the site used to ship one URL ("/") that swapped text
// client-side via JS. Crawlers that don't execute JS (or execute it but
// only ever see one URL) never discovered the English content, so English
// queries had nothing indexable to match. Baking both locales into their
// own real URLs, each with correct <html lang>, canonical, hreflang, and
// JSON-LD, fixes that — while keeping a single copy source (i18n.js) so
// translators never touch HTML and the two pages can't drift apart.
//
// Run with: node scripts/build.mjs
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { createHash } from "node:crypto";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const SITE_ORIGIN = "https://lucithinx.com";

// ---------------------------------------------------------------------
// 1. Load the single source of truth: template markup + translation data.
// ---------------------------------------------------------------------

const templateSource = readFileSync(join(projectRoot, "template.html"), "utf8");

// i18n.js declares `const translations = {...}` as a browser global — the
// simplest zero-dependency way to reuse that exact object here is to
// evaluate the file body and hand back the value, without pulling in a
// module loader or a JSON duplicate that could drift from the JS source.
function loadTranslations() {
  const i18nSource = readFileSync(join(projectRoot, "i18n.js"), "utf8");
  const factory = new Function(`"use strict";\n${i18nSource}\nreturn translations;`);
  return factory();
}

const translations = loadTranslations();

// ---------------------------------------------------------------------
// 2. Locale-specific page metadata (URLs, hreflang, og:locale, JSON-LD).
// ---------------------------------------------------------------------

const LOCALES = {
  tr: {
    lang: "tr",
    url: `${SITE_ORIGIN}/`,
    outputPath: join(projectRoot, "index.html"),
    ogLocale: "tr_TR",
    ogLocaleAlternate: "en_US",
  },
  en: {
    lang: "en",
    url: `${SITE_ORIGIN}/en/`,
    outputPath: join(projectRoot, "en", "index.html"),
    ogLocale: "en_US",
    ogLocaleAlternate: "tr_TR",
  },
};

const HREFLANG_BLOCK = `
  <link rel="alternate" hreflang="tr" href="${SITE_ORIGIN}/" />
  <link rel="alternate" hreflang="en" href="${SITE_ORIGIN}/en/" />
  <link rel="alternate" hreflang="x-default" href="${SITE_ORIGIN}/" />`;

/** Builds the <head> SEO block (canonical, hreflang, OG locale, robots) for one locale. */
function buildHeadSeoBlock(localeKey) {
  const locale = LOCALES[localeKey];
  return [
    `<!-- Canonical: replace with the real production domain before going live. -->`,
    `<link rel="canonical" href="${locale.url}" />`,
    HREFLANG_BLOCK.trim(),
    ``,
    `<meta name="robots" content="index,follow" />`,
    ``,
    `<!-- Open Graph -->`,
    `<meta property="og:type" content="website" />`,
    `<meta property="og:site_name" content="lucithinx" />`,
    `<meta property="og:url" content="${locale.url}" />`,
    `<meta property="og:title" data-i18n-attr="content:meta.title" content="${escapeHtmlAttr(translations[localeKey]["meta.title"])}" />`,
    `<meta property="og:description" data-i18n-attr="content:meta.description" content="${escapeHtmlAttr(translations[localeKey]["meta.description"])}" />`,
    `<meta property="og:image" content="${SITE_ORIGIN}/assets/og-image.png" />`,
    `<meta property="og:image:type" content="image/png" />`,
    `<meta property="og:image:width" content="1200" />`,
    `<meta property="og:image:height" content="630" />`,
    `<meta property="og:locale" content="${locale.ogLocale}" />`,
    `<meta property="og:locale:alternate" content="${locale.ogLocaleAlternate}" />`,
    ``,
    `<!-- Twitter Card -->`,
    `<meta name="twitter:card" content="summary_large_image" />`,
    `<meta name="twitter:title" data-i18n-attr="content:meta.title" content="${escapeHtmlAttr(translations[localeKey]["meta.title"])}" />`,
    `<meta name="twitter:description" data-i18n-attr="content:meta.description" content="${escapeHtmlAttr(translations[localeKey]["meta.description"])}" />`,
    `<meta name="twitter:image" content="${SITE_ORIGIN}/assets/og-image.png" />`,
  ].join("\n  ");
}

/** Minimal HTML-attribute escaping for values interpolated into double-quoted attrs. */
function escapeHtmlAttr(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/"/g, "&quot;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;");
}

// ---------------------------------------------------------------------
// 3. JSON-LD — generated from i18n.js data only (no invented facts: no
//    ratings, reviews, prices, or sameAs profiles that don't exist).
// ---------------------------------------------------------------------

function buildJsonLd(localeKey) {
  const dict = translations[localeKey];
  const locale = LOCALES[localeKey];

  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "lucithinx",
    url: SITE_ORIGIN,
    logo: `${SITE_ORIGIN}/assets/og-image.png`,
    description: dict["meta.description"],
  };

  const softwareApplication = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "lucithinx",
    applicationCategory: "BusinessApplication",
    operatingSystem: "Web",
    description: dict["meta.description"],
  };

  const faqPage = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [1, 2, 3, 4, 5].map((n) => ({
      "@type": "Question",
      name: dict[`faq.q${n}.question`],
      acceptedAnswer: {
        "@type": "Answer",
        text: dict[`faq.q${n}.answer`],
      },
    })),
  };

  return [organization, softwareApplication, faqPage];
}

/**
 * Serializes JSON-LD objects into inline <script type="application/ld+json">
 * blocks. JSON.stringify guarantees valid JSON syntax; we additionally
 * escape "</" so a literal "</script>" can never appear inside the JSON
 * string and prematurely close the block (defense in depth, not required
 * by any current copy, but cheap and correct).
 */
function renderJsonLdScripts(objects) {
  return objects
    .map((obj) => {
      const json = JSON.stringify(obj, null, 2).replace(/<\//g, "<\\/");
      return `<script type="application/ld+json">\n${json}\n</script>`;
    })
    .join("\n  ");
}

// ---------------------------------------------------------------------
// 4. Bake data-i18n / data-i18n-attr content into the template for one
//    locale. The data-i18n* attributes are left in place on purpose —
//    see the comment at the top of template.html.
// ---------------------------------------------------------------------

/** Replaces the text content of every `data-i18n="key"` element with its baked value. */
function bakeTextNodes(html, dict) {
  // Matches an opening tag carrying data-i18n="key", captures up to the
  // matching closing tag for THAT element. Templates here never nest a
  // data-i18n node inside another data-i18n node, so a non-greedy match up
  // to the next matching close tag name is sufficient and keeps this a
  // plain regex pass (no HTML parser dependency, by design — zero deps).
  return html.replace(
    /(<([a-zA-Z0-9]+)\b[^>]*\bdata-i18n="([a-zA-Z0-9.]+)"[^>]*>)([\s\S]*?)(<\/\2>)/g,
    (match, openTag, tagName, key, _oldContent, closeTag) => {
      const value = dict[key];
      if (value === undefined) return match;
      return `${openTag}${escapeHtmlText(value)}${closeTag}`;
    }
  );
}

/** Replaces the attribute value targeted by every `data-i18n-attr="attr:key"` node. */
function bakeAttrNodes(html, dict) {
  return html.replace(
    /<([a-zA-Z0-9]+)\b([^>]*\bdata-i18n-attr="([a-zA-Z]+):([a-zA-Z0-9.]+)"[^>]*)>/g,
    (match, tagName, attrs, attributeName, key) => {
      const value = dict[key];
      if (value === undefined) return match;
      const attrPattern = new RegExp(`\\b${attributeName}="[^"]*"`);
      const updatedAttrs = attrPattern.test(attrs)
        ? attrs.replace(attrPattern, `${attributeName}="${escapeHtmlAttr(value)}"`)
        : `${attrs} ${attributeName}="${escapeHtmlAttr(value)}"`;
      return `<${tagName}${updatedAttrs}>`;
    }
  );
}

function escapeHtmlText(value) {
  return String(value).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

// ---------------------------------------------------------------------
// 5. Render one locale's full page.
// ---------------------------------------------------------------------

// Strips the authoring-only doc comment at the top of template.html (the
// "SOURCE TEMPLATE — do not deploy this file directly" block). Two
// reasons: (1) it's internal build documentation, not something a visitor
// or crawler needs to download; (2) that comment's own prose mentions the
// literal placeholder tokens (e.g. "__HEAD_SEO__ -> ...") as documentation
// text, which would otherwise be the FIRST match `String.replace` finds —
// stripping the comment before doing token replacement removes that
// collision at the source instead of working around it with fragile
// ordering or replaceAll-from-the-end tricks.
function stripLeadingDocComment(html) {
  return html.replace(/^<!--[\s\S]*?-->\s*/, "");
}

function renderPage(localeKey) {
  const dict = translations[localeKey];
  const locale = LOCALES[localeKey];

  let html = stripLeadingDocComment(templateSource);
  html = html.replace('lang="__LANG__"', `lang="${locale.lang}"`);
  html = html.replace("__HEAD_SEO__", buildHeadSeoBlock(localeKey));
  html = html.replace("__JSONLD__", renderJsonLdScripts(buildJsonLd(localeKey)));
  html = bakeTextNodes(html, dict);
  html = bakeAttrNodes(html, dict);

  // Sync the language switcher's aria-pressed state with the page's own
  // locale (the *other* language link stays a plain, unpressed link to
  // navigate away — see app.js for why this is a real link, not a toggle).
  html = syncLangSwitchButtons(html, locale.lang);

  return html;
}

/** Sets aria-pressed="true" on the lang-switch link matching this page's own locale. */
function syncLangSwitchButtons(html, activeLang) {
  return html.replace(
    /<a class="lang-btn" data-lang="(tr|en)" href="([^"]*)" aria-pressed="[a-z]+">/g,
    (match, lang, href) => `<a class="lang-btn" data-lang="${lang}" href="${href}" aria-pressed="${String(lang === activeLang)}">`
  );
}

// ---------------------------------------------------------------------
// 6. CSP hashing — the JSON-LD blocks are inline <script> tags, which
//    the existing `script-src 'self'` CSP directive blocks by default.
//    Rather than weakening the policy with 'unsafe-inline', compute the
//    sha256 hash of each inline script's exact text content and add it
//    as a 'sha256-...' source to script-src in netlify.toml. This keeps
//    the CSP as tight as an allowlist can be: only these exact, known
//    script bodies are permitted, nothing else inline can ever run.
// ---------------------------------------------------------------------

/**
 * Extracts inline <script>...</script> bodies (not external src="" scripts)
 * from HTML. HTML comments are stripped first so documentation text that
 * merely mentions "<script>" (e.g. inside an authoring note) can never be
 * mistaken for a real inline script and hashed into the CSP.
 */
function extractInlineScriptBodies(html) {
  const withoutComments = html.replace(/<!--[\s\S]*?-->/g, "");
  const bodies = [];
  const pattern = /<script(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/g;
  let match;
  while ((match = pattern.exec(withoutComments)) !== null) {
    bodies.push(match[1]);
  }
  return bodies;
}

/** CSP source-expression form: 'sha256-<base64 digest>' per the CSP3 spec. */
function cspHashOf(scriptBody) {
  const digest = createHash("sha256").update(scriptBody, "utf8").digest("base64");
  return `'sha256-${digest}'`;
}

function updateNetlifyCsp(hashes) {
  const netlifyPath = join(projectRoot, "netlify.toml");
  const original = readFileSync(netlifyPath, "utf8");

  const uniqueHashes = [...new Set(hashes)];
  const hashSources = uniqueHashes.join(" ");

  const cspLinePattern = /(Content-Security-Policy = "default-src 'self'; script-src 'self')((?: 'sha256-[^']*')*)(;)/;
  if (!cspLinePattern.test(original)) {
    throw new Error("build.mjs: could not locate the CSP script-src directive in netlify.toml — aborting to avoid shipping a stale policy.");
  }

  const updated = original.replace(cspLinePattern, (_m, prefix, _oldHashes, suffix) => {
    return hashSources.length > 0 ? `${prefix} ${hashSources}${suffix}` : `${prefix}${suffix}`;
  });

  writeFileSync(netlifyPath, updated, "utf8");
  return uniqueHashes;
}

// ---------------------------------------------------------------------
// 7. Write outputs.
// ---------------------------------------------------------------------

function writeLocalePage(localeKey) {
  const locale = LOCALES[localeKey];
  const html = renderPage(localeKey);
  mkdirSync(dirname(locale.outputPath), { recursive: true });
  writeFileSync(locale.outputPath, html, "utf8");
  return html;
}

function main() {
  const trHtml = writeLocalePage("tr");
  const enHtml = writeLocalePage("en");

  const allInlineScriptBodies = [
    ...extractInlineScriptBodies(trHtml),
    ...extractInlineScriptBodies(enHtml),
  ];
  const hashes = allInlineScriptBodies.map(cspHashOf);
  const appliedHashes = updateNetlifyCsp(hashes);

  console.log(`Built ${LOCALES.tr.outputPath}`);
  console.log(`Built ${LOCALES.en.outputPath}`);
  console.log(`Updated netlify.toml CSP script-src with ${appliedHashes.length} sha256 hash(es) for inline JSON-LD.`);
}

main();
