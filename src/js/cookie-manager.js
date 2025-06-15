import { safeQuerySelector } from "./utils.js";

export const CookieManager = (function () {
  function updateCookieBannerTexts() {
    const banner = document.querySelector(".cookie-banner");
    if (!banner) return;

    // Get current language from LanguageManager without importing it
    const currentLang = getCurrentLanguageFromDOM() || "nl";

    // Use global translations object (set by LanguageManager)
    if (window.translations && window.translations[currentLang]) {
      const elements = banner.querySelectorAll("[data-lang-key]");
      elements.forEach((el) => {
        const key = el.getAttribute("data-lang-key");
        if (window.translations[currentLang][key]) {
          el.innerHTML = window.translations[currentLang][key];
        }
      });
    }
  }

  // Helper function to detect current language from DOM
  function getCurrentLanguageFromDOM() {
    const activeNl = document.querySelector(
      "#lang-nl.active-lang, #lang-nl-desktop.active-lang",
    );
    const activeEn = document.querySelector(
      "#lang-en.active-lang, #lang-en-desktop.active-lang",
    );

    if (activeEn) return "en";
    if (activeNl) return "nl";

    // Fallback to document language or URL parameter
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get("lang");
    return langParam || document.documentElement.lang || "nl";
  }

  function initCookieBanner() {
    const banner = safeQuerySelector(".cookie-banner");
    if (!banner) return;

    try {
      const consent = localStorage.getItem("cookieConsent");
      if (consent === null) {
        updateCookieBannerTexts();
        banner.style.display = "block";
      } else {
        banner.style.display = "none";
      }
    } catch (e) {
      console.error("Error initializing cookie banner:", e);
    }
  }

  return {
    initCookieBanner,
    updateCookieBannerTexts,
  };
})();
