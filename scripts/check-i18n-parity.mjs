// Self-QA script: verifies TR/EN key parity in i18n.js and that every
// data-i18n / data-i18n-attr key referenced in template.html exists in both
// locale dictionaries. Run with: node scripts/check-i18n-parity.mjs
//
// Reads template.html (the single source of markup), not the generated
// index.html / en/index.html — those are build output (see
// scripts/build.mjs) and by design no longer contain the raw
// data-i18n="key" scaffolding text this script parses for; they contain
// the already-baked locale strings instead.
//
// Exits 0 on full parity, 1 if any gap is found (safe to wire into CI).
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const projectRoot = dirname(dirname(fileURLToPath(import.meta.url)));
const i18nSource = readFileSync(join(projectRoot, "i18n.js"), "utf8");
const htmlSource = readFileSync(join(projectRoot, "template.html"), "utf8");

/** Extracts all quoted translation keys from a `tr: { ... }` / `en: { ... }` block. */
function extractKeysForLocale(source, localeLabel) {
  const localeStart = source.indexOf(`${localeLabel}: {`);
  const braceStart = source.indexOf("{", localeStart);

  let depth = 0;
  let blockEnd = braceStart;
  for (let i = braceStart; i < source.length; i++) {
    if (source[i] === "{") depth++;
    if (source[i] === "}") {
      depth--;
      if (depth === 0) {
        blockEnd = i;
        break;
      }
    }
  }

  const block = source.slice(braceStart, blockEnd);
  const keyPattern = /"([a-zA-Z0-9.]+)":/g;
  const keys = new Set();
  let match;
  while ((match = keyPattern.exec(block)) !== null) {
    keys.add(match[1]);
  }
  return keys;
}

/** Extracts every i18n key referenced from HTML via data-i18n / data-i18n-attr. */
function extractKeysUsedInHtml(source) {
  const keys = new Set();

  const textKeyPattern = /data-i18n="([a-zA-Z0-9.]+)"/g;
  let match;
  while ((match = textKeyPattern.exec(source)) !== null) keys.add(match[1]);

  const attrKeyPattern = /data-i18n-attr="[a-zA-Z]+:([a-zA-Z0-9.]+)"/g;
  while ((match = attrKeyPattern.exec(source)) !== null) keys.add(match[1]);

  return keys;
}

function difference(setA, setB) {
  return [...setA].filter((item) => !setB.has(item));
}

const trKeys = extractKeysForLocale(i18nSource, "tr");
const enKeys = extractKeysForLocale(i18nSource, "en");
const htmlKeys = extractKeysUsedInHtml(htmlSource);

const onlyInTr = difference(trKeys, enKeys);
const onlyInEn = difference(enKeys, trKeys);
const missingFromTr = difference(htmlKeys, trKeys);
const missingFromEn = difference(htmlKeys, enKeys);

console.log(`TR keys: ${trKeys.size}, EN keys: ${enKeys.size}, HTML references: ${htmlKeys.size}`);

const hasGaps =
  onlyInTr.length > 0 || onlyInEn.length > 0 || missingFromTr.length > 0 || missingFromEn.length > 0;

if (onlyInTr.length > 0) console.log("Keys only in TR:", onlyInTr);
if (onlyInEn.length > 0) console.log("Keys only in EN:", onlyInEn);
if (missingFromTr.length > 0) console.log("HTML keys missing from TR dict:", missingFromTr);
if (missingFromEn.length > 0) console.log("HTML keys missing from EN dict:", missingFromEn);

console.log(hasGaps ? "\nFAIL — i18n parity gaps found." : "\nPASS — full TR/EN parity.");
process.exit(hasGaps ? 1 : 0);
