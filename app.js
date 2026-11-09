"use strict";

/**
 * lucithinx marketing site — client behavior.
 *
 * No framework, no build step at runtime, no external requests. Four
 * responsibilities, each isolated in its own small init function so the
 * file stays scannable top to bottom (see Atlas readability standard:
 * colocation, single abstraction level per function).
 *
 *   1. i18n        — sync language-switcher UI with the page's own locale;
 *                    persist the visitor's preference for next visit.
 *                    (translation strings themselves live in i18n.js,
 *                    loaded before this file — see index.html)
 *   2. mobile nav   — toggle the collapsed nav list on small screens.
 *   3. accordion    — accessible FAQ disclosure widget.
 *   4. pilot form   — client-side-only validation + thank-you state.
 */

// ---------------------------------------------------------------------
// 1. i18n
// ---------------------------------------------------------------------
// Uses the global `translations` dictionary defined in i18n.js.
//
// SEO note: TR and EN now live at two real, crawlable URLs — "/" and
// "/en/" — each pre-baked server-side (see scripts/build.mjs) with its
// own <html lang>, canonical, and hreflang. That means the URL is the
// single source of truth for "which language is this page," and the
// language switcher's job shrank on purpose: it no longer swaps text in
// place (that would desync the URL from the rendered language, which is
// exactly what search engines penalize). It is now a real link to the
// sibling-locale URL — see the <a class="lang-btn" href="/en/"> markup in
// template.html. All this file does is:
//   - keep the switcher's aria-pressed state honest for the page it's on
//   - remember the visitor's last choice in localStorage for next visit
//     (deliberately NOT auto-redirecting on load — see initLanguageSwitcher)

const STORAGE_KEY_LANGUAGE = "lucithinx:lang";
const DEFAULT_LANGUAGE = "tr";

/** Persists the language choice; silently no-ops if storage is unavailable. */
function storeLanguage(language) {
  try {
    window.localStorage.setItem(STORAGE_KEY_LANGUAGE, language);
  } catch {
    // Ignore — persistence is a nice-to-have, not a hard requirement.
  }
}

/** Updates the language switcher buttons' pressed state for the current page. */
function updateLanguageSwitchButtons(language) {
  document.querySelectorAll(".lang-btn").forEach((button) => {
    const isActive = button.getAttribute("data-lang") === language;
    button.setAttribute("aria-pressed", String(isActive));
  });
}

/**
 * Syncs the switcher UI with the language this exact page was served in,
 * and remembers that choice for next visit.
 *
 * Deliberately does NOT compare against a previously stored preference and
 * auto-redirect: the visitor is already on a URL that determined the
 * language (they typed it, followed a link, or came from search) — silently
 * bouncing them to a different URL on load would be surprising and risks a
 * redirect loop if the two pages ever disagreed. Cross-language navigation
 * stays an explicit click on the switcher link.
 */
function initLanguageSwitcher() {
  const currentLanguage = document.documentElement.getAttribute("lang") === "en" ? "en" : DEFAULT_LANGUAGE;
  updateLanguageSwitchButtons(currentLanguage);
  storeLanguage(currentLanguage);
}

// ---------------------------------------------------------------------
// 2. Mobile navigation
// ---------------------------------------------------------------------

function initMobileNav() {
  const toggle = document.querySelector(".nav-toggle");
  const navList = document.getElementById("primary-nav-list");
  if (!toggle || !navList) return;

  toggle.addEventListener("click", () => {
    const isOpen = navList.classList.toggle("is-open");
    toggle.setAttribute("aria-expanded", String(isOpen));
  });

  // Close the menu after a nav link is chosen, so it doesn't linger open.
  navList.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      navList.classList.remove("is-open");
      toggle.setAttribute("aria-expanded", "false");
    });
  });
}

// ---------------------------------------------------------------------
// 3. Accordion (FAQ)
// ---------------------------------------------------------------------

/** Toggles a single accordion trigger/panel pair, closing its siblings. */
function toggleAccordionItem(trigger) {
  const panel = document.getElementById(trigger.getAttribute("aria-controls"));
  if (!panel) return;

  const isCurrentlyOpen = trigger.getAttribute("aria-expanded") === "true";

  document.querySelectorAll(".accordion-trigger").forEach((otherTrigger) => {
    const otherPanel = document.getElementById(otherTrigger.getAttribute("aria-controls"));
    otherTrigger.setAttribute("aria-expanded", "false");
    if (otherPanel) otherPanel.hidden = true;
  });

  if (!isCurrentlyOpen) {
    trigger.setAttribute("aria-expanded", "true");
    panel.hidden = false;
  }
}

function initAccordion() {
  document.querySelectorAll(".accordion-trigger").forEach((trigger) => {
    trigger.addEventListener("click", () => toggleAccordionItem(trigger));
  });
}

// ---------------------------------------------------------------------
// 4. Pilot form
// ---------------------------------------------------------------------

/** Returns true when every required pilot-form field has a non-empty value. */
function isPilotFormValid(form) {
  const requiredFields = ["name", "company", "email", "volume"];
  return requiredFields.every((fieldName) => form.elements[fieldName].value.trim() !== "");
}

// Pragmatic email shape check (not RFC 5322 exhaustive): catches the common
// "missing @" / "missing domain dot" mistakes without over-engineering a
// client-only check. Server-side validation remains required (see TODO below).
const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/** Returns true when the given string is shaped like a valid email address. */
function isValidEmail(value) {
  return EMAIL_PATTERN.test(value.trim());
}

function showPilotFormStatus(statusNode, message, isError) {
  statusNode.textContent = message;
  statusNode.classList.toggle("is-error", isError);
}

/**
 * Submits form data to Netlify Forms.
 *
 * Netlify statically scans the HTML at build time for `data-netlify="true"`
 * forms and wires up a handler automatically — no server code lives in this
 * repo. Submitting still requires this POST: Netlify's static scan only
 * *registers* the form shape; actual submissions arrive via this fetch (or a
 * native, non-JS form post — this fetch is progressive enhancement over
 * that baseline).
 *
 * Returns the fetch Promise so the caller can react to success/failure.
 */
function submitToNetlify(form) {
  const body = new URLSearchParams(new FormData(form)).toString();
  return fetch("/", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body,
  });
}

/**
 * Handles pilot form submission.
 *
 * Client-side validation (required fields + email shape) gates the request
 * exactly as before. Once valid, the form posts to Netlify Forms (see
 * `submitToNetlify`). On a host without a Netlify Forms endpoint behind it —
 * notably local development over file:// or `python3 -m http.server`, where
 * this fetch has nothing to talk to — the request fails and the user sees a
 * dedicated "submission failed" message instead of a false success state or
 * an unhandled rejection. Server-side spam/validation is Netlify's job
 * (honeypot field wired in index.html); this stays a static site.
 */
function handlePilotFormSubmit(event) {
  event.preventDefault();

  const form = event.currentTarget;
  const statusNode = document.getElementById("pilot-form-status");
  const language = document.documentElement.getAttribute("lang") || DEFAULT_LANGUAGE;
  const dictionary = translations[language];

  if (!isPilotFormValid(form)) {
    showPilotFormStatus(statusNode, dictionary["pilot.form.error"], true);
    return;
  }

  if (!isValidEmail(form.elements.email.value)) {
    showPilotFormStatus(statusNode, dictionary["pilot.form.errorEmail"], true);
    return;
  }

  submitToNetlify(form)
    .then((response) => {
      if (!response.ok) throw new Error(`Netlify Forms responded with ${response.status}`);
      showPilotFormStatus(statusNode, dictionary["pilot.form.success"], false);
      form.reset();
    })
    .catch(() => {
      // Expected in local development (no Netlify Forms endpoint behind
      // file:// or http.server) and on any non-Netlify host without a form
      // backend wired up — degrade gracefully instead of a false success
      // state or an unhandled rejection.
      showPilotFormStatus(statusNode, dictionary["pilot.form.errorSubmit"], true);
    });
}

function initPilotForm() {
  const form = document.getElementById("pilot-form");
  if (!form) return;
  form.addEventListener("submit", handlePilotFormSubmit);
}

// ---------------------------------------------------------------------
// Entry point
// ---------------------------------------------------------------------

document.addEventListener("DOMContentLoaded", () => {
  initLanguageSwitcher();
  initMobileNav();
  initAccordion();
  initPilotForm();
});
