import { safeQuerySelector, safeQuerySelectorAll } from "./utils.js";
import { translations } from "./translations.js";

export const LanguageManager = (function () {
  let currentLanguage = "nl";

  // Make translations globally available when this module loads
  if (typeof window !== "undefined") {
    window.translations = translations;
  }

  function detectLanguageFromDomain() {
    const hostname = window.location.hostname;
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get("lang");

    if (langParam === "en" || langParam === "nl") {
      return langParam;
    }

    if (hostname.endsWith(".net")) return "en";
    if (hostname.endsWith(".nl")) return "nl";

    return "nl";
  }

  function switchLanguage(lang, changeDomain = false) {
    console.log("LanguageManager: Switching language to", lang);
    currentLanguage = lang;

    // Update all elements with data-lang-key attribute
    safeQuerySelectorAll("[data-lang-key]").forEach((element) => {
      const key = element.getAttribute("data-lang-key");
      if (translations[lang] && translations[lang][key]) {
        // Check if element is an input and has placeholder
        if (
          element.tagName === "INPUT" &&
          element.hasAttribute("placeholder")
        ) {
          element.placeholder = translations[lang][key];
        } else {
          // For all other elements, update innerHTML as before
          element.innerHTML = translations[lang][key];
        }
      }
    });

    // Update active language UI toggles
    safeQuerySelectorAll(
      "#lang-nl, #lang-nl-desktop, #lang-en, #lang-en-desktop",
    ).forEach((btn) => {
      btn.classList.remove("active-lang");
    });

    if (lang === "nl") {
      _updateDutchElements(true);
    } else {
      _updateEnglishElements(true);
    }

    updateFooterLinks(lang);
    updateReadMoreButtons(lang);

    try {
      localStorage.setItem("asheLanguage", lang);
    } catch (e) {
      console.warn("LocalStorage not available.");
    }

    document.documentElement.lang = lang;

    try {
      const event = new CustomEvent("languageChanged", {
        detail: { language: lang },
      });
      document.dispatchEvent(event);
      console.log("Language change event dispatched for:", lang);
    } catch (e) {
      console.error("Error dispatching language change event:", e);
    }

    // Update cookie modal if function exists
    if (typeof window.translateCookieModal === "function") {
      window.translateCookieModal();
    }

    // Simple cookie banner update - just call it if it exists
    if (typeof window.updateCookieBannerTexts === "function") {
      window.updateCookieBannerTexts();
    }

    if (
      !changeDomain ||
      window.location.hostname === "localhost" ||
      window.location.hostname.includes("netlify.app") ||
      window.location.hostname.includes("127.0.0.1")
    ) {
      const url = new URL(window.location);
      url.searchParams.set("lang", lang);
      window.history.replaceState({}, "", url);
      updateInternalLinksWithLangParam();
      return;
    }

    try {
      _handleDomainChange(lang);
    } catch (error) {
      console.error("Error during language domain change:", error);
      const url = new URL(window.location);
      url.searchParams.set("lang", lang);
      window.history.replaceState({}, "", url);
      updateInternalLinksWithLangParam();
    }
  }

  function _updateEnglishElements(active) {
    const langEn = safeQuerySelector("#lang-en");
    const langEnDesktop = safeQuerySelector("#lang-en-desktop");
    if (langEn) langEn.classList.toggle("active-lang", active);
    if (langEnDesktop) langEnDesktop.classList.toggle("active-lang", active);

    const waterProjectNl = document.getElementById("water-project-nl");
    const waterProjectEn = document.getElementById("water-project-en");
    if (waterProjectNl && waterProjectEn) {
      waterProjectNl.classList.toggle("hidden", active);
      waterProjectEn.classList.toggle("hidden", !active);
    }

    const graphModal = document.getElementById("graph-modal");
    const nlGraph = document.getElementById("nl-graph");
    const enGraph = document.getElementById("en-graph");
    if (
      graphModal &&
      !graphModal.classList.contains("hidden") &&
      nlGraph &&
      enGraph
    ) {
      nlGraph.classList.toggle("hidden", active);
      enGraph.classList.toggle("hidden", !active);
    }

    const tocDownloadNl = document.getElementById("toc-download-nl-modal");
    const tocDownloadEn = document.getElementById("toc-download-en-modal");
    if (tocDownloadNl && tocDownloadEn) {
      tocDownloadNl.classList.toggle("hidden", active);
      tocDownloadEn.classList.toggle("hidden", !active);
    }
  }

  function _updateDutchElements(active) {
    const langNl = safeQuerySelector("#lang-nl");
    const langNlDesktop = safeQuerySelector("#lang-nl-desktop");
    if (langNl) langNl.classList.toggle("active-lang", active);
    if (langNlDesktop) langNlDesktop.classList.toggle("active-lang", active);

    const waterProjectNl = document.getElementById("water-project-nl");
    const waterProjectEn = document.getElementById("water-project-en");
    if (waterProjectNl && waterProjectEn) {
      waterProjectNl.classList.toggle("hidden", !active);
      waterProjectEn.classList.toggle("hidden", active);
    }

    const graphModal = document.getElementById("graph-modal");
    const nlGraph = document.getElementById("nl-graph");
    const enGraph = document.getElementById("en-graph");
    if (
      graphModal &&
      !graphModal.classList.contains("hidden") &&
      nlGraph &&
      enGraph
    ) {
      nlGraph.classList.toggle("hidden", !active);
      enGraph.classList.toggle("hidden", active);
    }

    const tocDownloadNl = document.getElementById("toc-download-nl-modal");
    const tocDownloadEn = document.getElementById("toc-download-en-modal");
    if (tocDownloadNl && tocDownloadEn) {
      tocDownloadNl.classList.toggle("hidden", !active);
      tocDownloadEn.classList.toggle("hidden", active);
    }
  }

  function _handleDomainChange(lang) {
    const currentDomain = window.location.hostname;
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    const currentHash = window.location.hash;

    let newDomain;
    if (lang === "en" && !currentDomain.endsWith(".net")) {
      newDomain = currentDomain.replace(/\.nl$/, ".net");
      if (newDomain === currentDomain) {
        newDomain = "ashefoundation.net";
      }
    } else if (lang === "nl" && !currentDomain.endsWith(".nl")) {
      newDomain = currentDomain.replace(/\.net$/, ".nl");
      if (newDomain === currentDomain) {
        newDomain = "ashefoundation.nl";
      }
    } else {
      newDomain = currentDomain;
    }

    if (newDomain !== currentDomain) {
      const protocol = window.location.protocol;
      let newUrl = `${protocol}//${newDomain}${currentPath}`;

      const params = new URLSearchParams(currentSearch);
      params.set("lang", lang);

      if (params.toString()) {
        newUrl += "?" + params.toString();
      }

      if (currentHash) {
        newUrl += currentHash;
      }

      console.log("Redirecting to: " + newUrl);
      window.location.href = newUrl;
    } else {
      const url = new URL(window.location);
      url.searchParams.set("lang", lang);
      window.history.replaceState({}, "", url);
      updateInternalLinksWithLangParam();
    }
  }

  function updateFooterLinks(lang) {
    try {
      if (lang === "nl") {
        safeQuerySelectorAll(".footer-privacy-nl, .footer-terms-nl").forEach(
          (el) => {
            el.classList.remove("hidden");
          },
        );
        safeQuerySelectorAll(".footer-privacy-en, .footer-terms-en").forEach(
          (el) => {
            el.classList.add("hidden");
          },
        );
      } else {
        safeQuerySelectorAll(".footer-privacy-en, .footer-terms-en").forEach(
          (el) => {
            el.classList.remove("hidden");
          },
        );
        safeQuerySelectorAll(".footer-privacy-nl, .footer-terms-nl").forEach(
          (el) => {
            el.classList.add("hidden");
          },
        );
      }
    } catch (e) {
      console.error("Error updating footer links:", e);
    }
  }

  function updateReadMoreButtons(lang) {
    try {
      const toggleHelp = document.getElementById("toggle-help");
      const helpMore = document.getElementById("help-more");
      const toggleDecision = document.getElementById("toggle-decision");
      const decisionMore = document.getElementById("decision-more");

      if (toggleHelp && helpMore) {
        toggleHelp.textContent = helpMore.classList.contains("hidden")
          ? lang === "nl"
            ? "Lees meer"
            : "Read more"
          : lang === "nl"
            ? "Lees minder"
            : "Read less";
      }

      if (toggleDecision && decisionMore) {
        toggleDecision.textContent = decisionMore.classList.contains("hidden")
          ? lang === "nl"
            ? "Lees meer"
            : "Read more"
          : lang === "nl"
            ? "Lees minder"
            : "Read less";
      }
    } catch (e) {
      console.error("Error updating read more buttons:", e);
    }
  }

  function updateInternalLinksWithLangParam() {
    try {
      const lang = currentLanguage;

      if (lang) {
        safeQuerySelectorAll("a").forEach(function (link) {
          if (!link.href) return;
          if (
            link.id === "lang-nl" ||
            link.id === "lang-en" ||
            link.id === "lang-nl-desktop" ||
            link.id === "lang-en-desktop"
          )
            return;

          if (
            !link.href.startsWith("http") ||
            link.href.includes(window.location.hostname)
          ) {
            if (link.target === "_blank" && link.href.startsWith("http"))
              return;

            try {
              const url = new URL(link.href);
              if (!url.searchParams.has("lang")) {
                url.searchParams.set("lang", lang);
                link.href = url.href;
              }
            } catch (e) {
              if (link.href && !link.href.includes("?")) {
                link.href = link.href + "?lang=" + lang;
              } else if (link.href && !link.href.includes("lang=")) {
                link.href = link.href + "&lang=" + lang;
              }
            }
          }
        });
      }
    } catch (e) {
      console.error("Error updating internal links:", e);
    }
  }

  function initLanguageToggleListeners() {
    const langNl = safeQuerySelector("#lang-nl");
    if (langNl) {
      langNl.addEventListener("click", function (e) {
        e.preventDefault();
        switchLanguage("nl", true);
      });
    }

    const langNlDesktop = safeQuerySelector("#lang-nl-desktop");
    if (langNlDesktop) {
      langNlDesktop.addEventListener("click", function (e) {
        e.preventDefault();
        switchLanguage("nl", true);
      });
    }

    const langEn = safeQuerySelector("#lang-en");
    if (langEn) {
      langEn.addEventListener("click", function (e) {
        e.preventDefault();
        switchLanguage("en", true);
      });
    }

    const langEnDesktop = safeQuerySelector("#lang-en-desktop");
    if (langEnDesktop) {
      langEnDesktop.addEventListener("click", function (e) {
        e.preventDefault();
        switchLanguage("en", true);
      });
    }
  }

  function getCurrentLanguage() {
    return currentLanguage;
  }

  function initLanguage() {
    const detectedLanguage = detectLanguageFromDomain();
    let userPreference;

    try {
      userPreference = localStorage.getItem("asheLanguage");
    } catch (e) {
      console.log("localStorage not available");
    }

    const languageToUse = detectedLanguage || userPreference || "nl";
    switchLanguage(languageToUse, false);
  }

  return {
    initLanguage,
    initLanguageToggleListeners,
    switchLanguage,
    getCurrentLanguage,
    updateInternalLinksWithLangParam,
    updateFooterLinks,
    updateReadMoreButtons,
  };
})();

// Make switchLanguage globally available for onclick handlers
if (typeof window !== "undefined") {
  window.switchLanguage = LanguageManager.switchLanguage;
}
