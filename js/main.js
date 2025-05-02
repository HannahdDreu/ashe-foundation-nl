// ==========================================
// UTILITY FUNCTIONS
// ==========================================

// Helper functions for safer DOM operations and performance
function safeQuerySelector(selector, context = document) {
  try {
    return context.querySelector(selector);
  } catch (e) {
    console.warn(`Error selecting ${selector}:`, e);
    return null;
  }
}

function safeQuerySelectorAll(selector, context = document) {
  try {
    return context.querySelectorAll(selector);
  } catch (e) {
    console.warn(`Error selecting ${selector}:`, e);
    return [];
  }
}

function debounce(func, wait = 100) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

// Show feedback message (used in multiple places)
function showFeedbackMessage(message, duration = 3000) {
  const feedbackElement = document.createElement('div');
  feedbackElement.style.position = 'fixed';
  feedbackElement.style.bottom = '20px';
  feedbackElement.style.left = '50%';
  feedbackElement.style.transform = 'translateX(-50%)';
  feedbackElement.style.padding = '10px 20px';
  feedbackElement.style.backgroundColor = '#57CC99';
  feedbackElement.style.color = 'white';
  feedbackElement.style.borderRadius = '4px';
  feedbackElement.style.boxShadow = '0 2px 10px rgba(0,0,0,0.2)';
  feedbackElement.style.zIndex = '9999';
  feedbackElement.textContent = message;
  
  document.body.appendChild(feedbackElement);
  
  setTimeout(() => {
    if (document.body.contains(feedbackElement)) {
      document.body.removeChild(feedbackElement);
    }
  }, duration);
}

// ==========================================
// LANGUAGE MANAGEMENT
// ==========================================

// Language detection and management module
const LanguageManager = (function() {
  let currentLanguage = "nl";
  
  // Domain detection and handling
  function detectLanguageFromDomain() {
    const hostname = window.location.hostname;
    const urlParams = new URLSearchParams(window.location.search);
    const langParam = urlParams.get("lang");

    // First check if lang parameter exists
    if (langParam === "en" || langParam === "nl") {
      return langParam;
    }

    // Otherwise, determine from domain
    if (hostname.endsWith(".net")) {
      return "en";
    } else if (hostname.endsWith(".nl")) {
      return "nl";
    }

    // Default fallback
    return "nl";
  }

  // Function to switch language with domain support
  function switchLanguage(lang, changeDomain = false) {
    try {
      console.log(`Switching to ${lang}, changeDomain: ${changeDomain}`);
      currentLanguage = lang;

      // Update all elements with data-lang-key attribute
      safeQuerySelectorAll("[data-lang-key]").forEach((element) => {
        const key = element.getAttribute("data-lang-key");
        if (translations[lang] && translations[lang][key]) {
          element.innerHTML = translations[lang][key];
        }
      });

      // Update active language in UI
      safeQuerySelectorAll(
        "#lang-nl, #lang-nl-desktop, #lang-en, #lang-en-desktop"
      ).forEach((btn) => {
        btn.classList.remove("active-lang");
      });

      // Set active languages
      if (lang === "nl") {
        _updateDutchElements(true);
      } else {
        _updateEnglishElements(true);
      }

      // Update footer links
      updateFooterLinks(lang);

      // Update "Read more/less" buttons on projecten page
      updateReadMoreButtons(lang);

      // Store language preference in localStorage
      try {
        localStorage.setItem("asheLanguage", lang);
      } catch (e) {
        console.log("localStorage not available");
      }

      // Update HTML lang attribute
      document.documentElement.lang = lang;
      // Dispatch a custom event for language change
      try {
        const event = new CustomEvent("languageChanged", { detail: { language: lang } });
        document.dispatchEvent(event);
        console.log("Language change event dispatched");
      } catch (e) {
        console.error("Error dispatching language change event:", e);
      }

      // Update cookie texts if the function exists
      if (typeof window.translateCookieModal === 'function') {
        window.translateCookieModal();
      }
      
      // Update cookie banner texts
      updateCookieBannerTexts();

      // For netlify dev or local environment, just use the lang parameter
      if (
        !changeDomain ||
        window.location.hostname === "localhost" ||
        window.location.hostname.includes("netlify.app") ||
        window.location.hostname.includes("127.0.0.1")
      ) {
        const url = new URL(window.location);
        url.searchParams.set("lang", lang);
        window.history.replaceState({}, "", url);
        console.log("Using URL parameter for language: " + url.href);
        // Run update links immediately
        updateInternalLinksWithLangParam();
        return;
      }

      // Create new URL for domain change
      try {
        _handleDomainChange(lang);
      } catch (error) {
        console.error("Error during language domain change:", error);
        // Fallback: just use language parameter
        const url = new URL(window.location);
        url.searchParams.set("lang", lang);
        window.history.replaceState({}, "", url);
        updateInternalLinksWithLangParam();
      }
    } catch (e) {
      console.error("Error switching language:", e);
    }
  }
  // Helper function for English language elements
  function _updateEnglishElements(active) {
    const langEn = safeQuerySelector("#lang-en");
    const langEnDesktop = safeQuerySelector("#lang-en-desktop");
    if (langEn) langEn.classList.toggle("active-lang", active);
    if (langEnDesktop) langEnDesktop.classList.toggle("active-lang", active);

    // Update water project display if elements exist
    const waterProjectNl = document.getElementById("water-project-nl");
    const waterProjectEn = document.getElementById("water-project-en");
    if (waterProjectNl && waterProjectEn) {
      waterProjectNl.classList.toggle("hidden", active);
      waterProjectEn.classList.toggle("hidden", !active);
    }

    // Update graph in modal if open
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

    // Update ToC download buttons if they exist
    const tocDownloadNl = document.getElementById("toc-download-nl-modal");
    const tocDownloadEn = document.getElementById("toc-download-en-modal");
    if (tocDownloadNl && tocDownloadEn) {
      tocDownloadNl.classList.toggle("hidden", active);
      tocDownloadEn.classList.toggle("hidden", !active);
    }
  }
  
  // Helper function for Dutch language elements
  function _updateDutchElements(active) {
    const langNl = safeQuerySelector("#lang-nl");
    const langNlDesktop = safeQuerySelector("#lang-nl-desktop");
    if (langNl) langNl.classList.toggle("active-lang", active);
    if (langNlDesktop) langNlDesktop.classList.toggle("active-lang", active);

    // Update water project display if elements exist
    const waterProjectNl = document.getElementById("water-project-nl");
    const waterProjectEn = document.getElementById("water-project-en");
    if (waterProjectNl && waterProjectEn) {
      waterProjectNl.classList.toggle("hidden", !active);
      waterProjectEn.classList.toggle("hidden", active);
    }
    // Update graph in modal if open
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

    // Update ToC download buttons if they exist
    const tocDownloadNl = document.getElementById("toc-download-nl-modal");
    const tocDownloadEn = document.getElementById("toc-download-en-modal");
    if (tocDownloadNl && tocDownloadEn) {
      tocDownloadNl.classList.toggle("hidden", !active);
      tocDownloadEn.classList.toggle("hidden", active);
    }
  }
  
  // Helper function for domain changes
  function _handleDomainChange(lang) {
    // Current location info
    const currentDomain = window.location.hostname;
    const currentPath = window.location.pathname;
    const currentSearch = window.location.search;
    const currentHash = window.location.hash;

    // Create new URL with appropriate domain
    let newDomain;
    if (lang === "en" && !currentDomain.endsWith(".net")) {
      newDomain = currentDomain.replace(/\.nl$/, ".net");
      if (newDomain === currentDomain) {
        // If domain didn't change, it might not have .nl ending
        newDomain = "ashefoundation.net";
      }
    } else if (lang === "nl" && !currentDomain.endsWith(".nl")) {
      newDomain = currentDomain.replace(/\.net$/, ".nl");
      if (newDomain === currentDomain) {
        // If domain didn't change, it might not have .net ending
        newDomain = "ashefoundation.nl";
      }
    } else {
      // No domain change needed
      newDomain = currentDomain;
    }

    // Only redirect if domain changed
    if (newDomain !== currentDomain) {
      const protocol = window.location.protocol;
      // Build new URL
      let newUrl = `${protocol}//${newDomain}${currentPath}`;

      // Create URLSearchParams for query parameters
      const params = new URLSearchParams(currentSearch);

      // Add/update language parameter
      params.set("lang", lang);

      // Add search params to URL
      if (params.toString()) {
        newUrl += "?" + params.toString();
      }

      // Add hash if exists
      if (currentHash) {
        newUrl += currentHash;
      }

      console.log("Redirecting to: " + newUrl);
      // Redirect to new domain
      window.location.href = newUrl;
    } else {
      // No domain change, just update URL parameter
      const url = new URL(window.location);
      url.searchParams.set("lang", lang);
      window.history.replaceState({}, "", url);
      updateInternalLinksWithLangParam();
    }
  }
  // Footer link updates based on language selection
  function updateFooterLinks(lang) {
    try {
      // Toggle visibility of language-specific links
      if (lang === "nl") {
        // Show Dutch links
        safeQuerySelectorAll(".footer-privacy-nl, .footer-terms-nl").forEach(
          (el) => {
            el.classList.remove("hidden");
          }
        );
        // Hide English links
        safeQuerySelectorAll(".footer-privacy-en, .footer-terms-en").forEach(
          (el) => {
            el.classList.add("hidden");
          }
        );
      } else {
        // Show English links
        safeQuerySelectorAll(".footer-privacy-en, .footer-terms-en").forEach(
          (el) => {
            el.classList.remove("hidden");
          }
        );
        // Hide Dutch links
        safeQuerySelectorAll(".footer-privacy-nl, .footer-terms-nl").forEach(
          (el) => {
            el.classList.add("hidden");
          }
        );
      }
    } catch (e) {
      console.error("Error updating footer links:", e);
    }
  }
  
  // Update "Read more/less" buttons on projecten page based on language
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
  // Add language parameter to all internal links
  function updateInternalLinksWithLangParam() {
    try {
      const lang = currentLanguage;

      if (lang) {
        // Add language parameter to all internal links
        safeQuerySelectorAll("a").forEach(function (link) {
          // Skip if link has no href
          if (!link.href) return;

          // Skip language toggle links
          if (
            link.id === "lang-nl" ||
            link.id === "lang-en" ||
            link.id === "lang-nl-desktop" ||
            link.id === "lang-en-desktop"
          )
            return;

          // Only process internal links (same domain or relative links)
          if (
            !link.href.startsWith("http") ||
            link.href.includes(window.location.hostname)
          ) {
            // Skip external links that open in new tabs
            if (link.target === "_blank" && link.href.startsWith("http"))
              return;

            // Create URL object
            try {
              const url = new URL(link.href);
              // Only add param if it doesn't already exist
              if (!url.searchParams.has("lang")) {
                url.searchParams.set("lang", lang);
                link.href = url.href;
              }
            } catch (e) {
              // Handle relative URLs
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
  
  // Initialize language toggle event listeners
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
  // Get current language
  function getCurrentLanguage() {
    return currentLanguage;
  }
  
  // Initialize language
  function initLanguage() {
    const detectedLanguage = detectLanguageFromDomain();
    let userPreference;
    
    try {
      userPreference = localStorage.getItem("asheLanguage");
    } catch (e) {
      console.log("localStorage not available");
    }
    
    // If user preference exists and differs from domain language, we have options:
    // 1. Honor the domain (good for SEO)
    // 2. Honor user preference (good for user experience)
    // Here we prioritize domain, but you can change this logic if preferred
    const languageToUse = detectedLanguage || userPreference || "nl";
    console.log("Initializing with language:", languageToUse);
    
    // Apply the language
    switchLanguage(languageToUse, false);
  }
  
  // Public API
  return {
    initLanguage,
    initLanguageToggleListeners,
    switchLanguage,
    getCurrentLanguage,
    updateInternalLinksWithLangParam,
    updateFooterLinks,
    updateReadMoreButtons
  };
})();

// ==========================================
// COOKIE MANAGEMENT
// ==========================================

// Simplified Cookie management module that defers to gtm.js
const CookieManager = (function() {
  // Update cookie banner texts based on current language
  function updateCookieBannerTexts() {
    const cookieBanner = document.querySelector('.cookie-banner');
    if (!cookieBanner) return;
    
    const currentLang = LanguageManager.getCurrentLanguage();
    
    if (window.translations && window.translations[currentLang]) {
      const elementsWithLangKey = cookieBanner.querySelectorAll('[data-lang-key]');
      elementsWithLangKey.forEach(element => {
        const key = element.getAttribute('data-lang-key');
        if (window.translations[currentLang][key]) {
          element.innerHTML = window.translations[currentLang][key];
        }
      });
      
      console.log("Cookie banner texts updated to", currentLang);
    }
  }
  
  // Initialize cookie banner visibility
  function initCookieBanner() {
    const cookieBanner = safeQuerySelector(".cookie-banner");
    if (!cookieBanner) return;
    
    try {
      // Check if user has already made a choice
      const cookieConsent = localStorage.getItem("cookieConsent");
      
      if (cookieConsent === null) {
        // No choice made yet, apply translations before showing
        updateCookieBannerTexts();
        
        // Show the banner
        cookieBanner.style.display = "block";
      } else {
        // User already made a choice, hide banner
        cookieBanner.style.display = "none";
      }
    } catch (e) {
      console.error("Error initializing cookie banner:", e);
    }
  }
  
  // Return minimal public API - defer to gtm.js for the rest
  return {
    initCookieBanner,
    updateCookieBannerTexts
  };
})();

// ==========================================
// UI COMPONENTS
// ==========================================

// UI components module
const UIComponents = (function() {
  // Mobile menu functionality
  function initMobileMenu() {
    const mobileToggle = safeQuerySelector('[data-collapse-toggle="mobile-menu"]');
    const mobileMenu = document.getElementById("mobile-menu");

    if (mobileToggle && mobileMenu) {
      mobileToggle.addEventListener("click", function () {
        mobileMenu.classList.toggle("hidden");
      });
    }
  }
  
  // Team Carousel Functionality
  function initTeamCarousel() {
    const carousel = document.getElementById("team-carousel");
    if (!carousel) return;
    
    const carouselInner = safeQuerySelector(".carousel-inner", carousel);
    const prevButton = document.getElementById("carousel-prev");
    const nextButton = document.getElementById("carousel-next");
    const indicators = safeQuerySelectorAll(".carousel-indicator", carousel);

    let currentSlide = 0;
    const slides = safeQuerySelectorAll(".carousel-item", carousel);
    const totalSlides = slides.length;
    let autoSlideInterval;

    // Initialize carousel
    function updateCarousel() {
      try {
        // Update slide position
        if (carouselInner) {
          carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
        }

        // Update indicators
        indicators.forEach((indicator, index) => {
          if (index === currentSlide) {
            indicator.classList.add("active");
          } else {
            indicator.classList.remove("active");
          }
        });
      } catch (e) {
        console.error("Error updating carousel:", e);
      }
    }

    if (carouselInner) {
      updateCarousel();

      // Event listeners for buttons
      if (prevButton) {
        prevButton.addEventListener("click", () => {
          currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
          updateCarousel();
        });
      }

      if (nextButton) {
        nextButton.addEventListener("click", () => {
          currentSlide = (currentSlide + 1) % totalSlides;
          updateCarousel();
        });
      }
      // Event listeners for indicators
      indicators.forEach((indicator, index) => {
        indicator.addEventListener("click", () => {
          currentSlide = index;
          updateCarousel();
        });
      });

      // Auto slide (optional)
      autoSlideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();}, 7000);

        // Pause auto slide on hover
        carousel.addEventListener("mouseenter", () => {
          clearInterval(autoSlideInterval);
        });
  
        carousel.addEventListener("mouseleave", () => {
          autoSlideInterval = setInterval(() => {
            currentSlide = (currentSlide + 1) % totalSlides;
            updateCarousel();
          }, 7000);
        });
      }
    }
    
    // Graph Modal Functionality for Home Page
    function initGraphModal() {
      const viewGraphBtnNl = document.getElementById("view-graph-btn-nl");
      const viewGraphBtnEn = document.getElementById("view-graph-btn-en");
      const graphModal = document.getElementById("graph-modal");
      const closeModal = document.getElementById("close-modal");
  
      if (!(viewGraphBtnNl || viewGraphBtnEn) || !graphModal || !closeModal) return;
  
      function openGraphModal() {
        try {
          graphModal.classList.remove("hidden");
          document.body.style.overflow = "hidden"; // Prevent scrolling
        } catch (e) {
          console.error("Error opening graph modal:", e);
        }
      }
  
      function closeGraphModal() {
        try {
          graphModal.classList.add("hidden");
          document.body.style.overflow = ""; // Restore scrolling
        } catch (e) {
          console.error("Error closing graph modal:", e);
        }
      }
  
      // Open modal on button click
      if (viewGraphBtnNl) {
        viewGraphBtnNl.addEventListener("click", openGraphModal);
      }
      if (viewGraphBtnEn) {
        viewGraphBtnEn.addEventListener("click", openGraphModal);
      }
  
      // Close modal on button click
      closeModal.addEventListener("click", closeGraphModal);
  
      // Close modal on clicking outside
      graphModal.addEventListener("click", function (e) {
        if (e.target === graphModal) {
          closeGraphModal();
        }
      });
  
      // Close modal on Escape key
      document.addEventListener("keydown", function (e) {
        if (
          e.key === "Escape" &&
          graphModal &&
          !graphModal.classList.contains("hidden")
        ) {
          closeGraphModal();
        }
      });
    }
    // Projects Page Carousel Functionality
    function initProjectsCarousel() {
      const projectsCarousel = document.getElementById("carousel");
      if (!projectsCarousel) return;
      
      const prevButton = document.getElementById("prev");
      const nextButton = document.getElementById("next");
      const cards = safeQuerySelectorAll(".project-card");
      const indicatorsContainer = safeQuerySelector(".carousel-indicators");
      let autoSlideInterval;
      let currentIndex = 0;
  
      // First, let's clear and rebuild the indicators to match the number of cards
      if (indicatorsContainer) {
        try {
          indicatorsContainer.innerHTML = "";
  
          // Create the correct number of indicators
          cards.forEach((_, index) => {
            const indicator = document.createElement("button");
            indicator.className = "w-3 h-3 mx-1 rounded-full carousel-indicator";
            indicator.classList.add(index === 0 ? "bg-rose-600" : "bg-gray-300");
            if (index === 0) indicator.classList.add("active");
            indicatorsContainer.appendChild(indicator);
          });
        } catch (e) {
          console.error("Error setting up carousel indicators:", e);
        }
      }
  
      // Get the newly created indicators
      const indicators = safeQuerySelectorAll(".carousel-indicator");
  
      // Function to determine visible cards based on screen width
      function getVisibleCards() {
        if (window.innerWidth >= 1024) {
          // lg breakpoint
          return 3; // Show 3 cards on large screens
        } else if (window.innerWidth >= 768) {
          // md breakpoint
          return 2; // Show 2 cards on medium screens
        } else {
          return 1; // Show 1 card on small screens
        }
      }
  
      // Update carousel position and indicators
      function updateProjectsCarousel() {
        try {
          // Get card width including margins
          if (cards.length === 0) return;
  
          const card = cards[0];
          const cardStyle = window.getComputedStyle(card);
          const cardWidth =
            card.offsetWidth +
            parseInt(cardStyle.marginLeft) +
            parseInt(cardStyle.marginRight);
  
          // Determine how many cards are visible at once
          const visibleCards = getVisibleCards();
  
          // Calculate how many "pages" of cards we have
          const numPages = Math.ceil((cards.length - visibleCards + 1) / 1);
  
          // Ensure currentIndex doesn't exceed maximum
          currentIndex = Math.min(currentIndex, numPages - 1);
  
          // Calculate scroll position - move by one card at a time
          const scrollPosition = currentIndex * cardWidth;
  
          // Smooth scroll to the position
          projectsCarousel.scrollTo({
            left: scrollPosition,
            behavior: "smooth",
          });
          // Update the indicators
          indicators.forEach((indicator, index) => {
            if (index === currentIndex) {
              indicator.classList.add("active");
              indicator.classList.remove("bg-gray-300");
              indicator.classList.add("bg-rose-600");
              indicator.style.transform = "scale(1.2)";
            } else {
              indicator.classList.remove("active");
              indicator.classList.remove("bg-rose-600");
              indicator.classList.add("bg-gray-300");
              indicator.style.transform = "scale(1)";
            }
          });
  
          // Update button states
          if (prevButton) {
            prevButton.disabled = currentIndex === 0;
            prevButton.style.opacity = currentIndex === 0 ? "0.5" : "1";
          }
  
          if (nextButton) {
            nextButton.disabled = currentIndex === numPages - 1;
            nextButton.style.opacity =
              currentIndex === numPages - 1 ? "0.5" : "1";
          }
        } catch (e) {
          console.error("Error updating projects carousel:", e);
        }
      }
  
      // Previous button click event
      if (prevButton) {
        prevButton.addEventListener("click", () => {
          if (currentIndex > 0) {
            currentIndex--;
            updateProjectsCarousel();
          }
        });
      }
  
      // Next button click event
      if (nextButton) {
        nextButton.addEventListener("click", () => {
          const visibleCards = getVisibleCards();
          const numPages = Math.ceil((cards.length - visibleCards + 1) / 1);
  
          if (currentIndex < numPages - 1) {
            currentIndex++;
            updateProjectsCarousel();
          }
        });
      }
  
      // Indicator click events
      indicators.forEach((indicator, index) => {
        indicator.addEventListener("click", () => {
          currentIndex = index;
          updateProjectsCarousel();
        });
      });
  
      // Handle window resize with debounce
      window.addEventListener("resize", debounce(updateProjectsCarousel, 150));
  
      // Initialize the carousel
      updateProjectsCarousel();
  
      // Auto-cycling functionality
      function startAutoSlide() {
        autoSlideInterval = setInterval(() => {
          const visibleCards = getVisibleCards();
          const numPages = Math.ceil((cards.length - visibleCards + 1) / 1);
  
          if (currentIndex < numPages - 1) {
            currentIndex++;
          } else {
            currentIndex = 0;
          }
          updateProjectsCarousel();
        }, 7000);
      }
  
      function stopAutoSlide() {
        clearInterval(autoSlideInterval);
      }
  
      // Start auto-sliding
      startAutoSlide();
  
      // Pause on hover
      projectsCarousel.addEventListener("mouseenter", stopAutoSlide);
      projectsCarousel.addEventListener("mouseleave", startAutoSlide);
    }
    // Toggle functionality for read more buttons
    function initReadMoreToggles() {
      const toggleHelp = document.getElementById("toggle-help");
      const helpMore = document.getElementById("help-more");
  
      if (toggleHelp && helpMore) {
        toggleHelp.addEventListener("click", function () {
          try {
            helpMore.classList.toggle("hidden");
            const currentLanguage = localStorage.getItem("asheLanguage") || "nl";
            this.textContent = helpMore.classList.contains("hidden")
              ? currentLanguage === "nl"
                ? "Lees meer"
                : "Read more"
              : currentLanguage === "nl"
                ? "Lees minder"
                : "Read less";
          } catch (e) {
            console.error("Error toggling help section:", e);
          }
        });
      }
  
      const toggleDecision = document.getElementById("toggle-decision");
      const decisionMore = document.getElementById("decision-more");
  
      if (toggleDecision && decisionMore) {
        toggleDecision.addEventListener("click", function () {
          try {
            decisionMore.classList.toggle("hidden");
            const currentLanguage = localStorage.getItem("asheLanguage") || "nl";
            this.textContent = decisionMore.classList.contains("hidden")
              ? currentLanguage === "nl"
                ? "Lees meer"
                : "Read more"
              : currentLanguage === "nl"
                ? "Lees minder"
                : "Read less";
          } catch (e) {
            console.error("Error toggling decision section:", e);
          }
        });
      }
    }
    
    // Video player functionality
    function initVideoPlayers() {
      const videoPlayers = safeQuerySelectorAll(".play-btn");
  
      videoPlayers.forEach((button) => {
        // Skip for Naserian page - it has its own video handler
        if (button.closest(".naserian-story")) return;
  
        const videoContainer = button.closest(".overflow-hidden");
        if (!videoContainer) return;
  
        const video = videoContainer.querySelector("video");
        if (!video) return;
  
        button.addEventListener("click", function () {
          try {
            if (video.paused) {
              video.play();
              this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>`;
            } else {
              video.pause();
              this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>`;
            }
          } catch (e) {
            console.error("Error toggling video play state:", e);
          }
        });
        // Reset video when it ends
        video.addEventListener("ended", function () {
          try {
            button.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>`;
          } catch (e) {
            console.error("Error handling video end:", e);
          }
        });
      });
    }
    
    // Load lazysizes script dynamically
    function initLazyLoading() {
      if (typeof lazySizes === "undefined") {
        const lazyScript = document.createElement("script");
        lazyScript.src =
          "https://cdnjs.cloudflare.com/ajax/libs/lazysizes/5.3.2/lazysizes.min.js";
        lazyScript.async = true;
        document.body.appendChild(lazyScript);
  
        // Initialize when lazysizes is loaded
        lazyScript.onload = function () {
          // Initialize lazysizes for background images
          document.addEventListener("lazybeforeunveil", function (e) {
            var bg = e.target.getAttribute("data-bg");
            if (bg) {
              e.target.style.backgroundImage = "url(" + bg + ")";
            }
          });
        };
      }
    }
    
    // Enhanced lazy loading for images
    function initEnhancedLazyLoading() {
      try {
        if ("IntersectionObserver" in window) {
          const lazyImages = safeQuerySelectorAll('img[loading="lazy"]');
  
          const imageObserver = new IntersectionObserver(
            (entries, observer) => {
              entries.forEach((entry) => {
                if (entry.isIntersecting) {
                  const lazyImage = entry.target;
  
                  // Preload image
                  if (lazyImage.dataset.src) {
                    lazyImage.src = lazyImage.dataset.src;
                    lazyImage.classList.add("lazyloaded");
                  }
  
                  // Stop observing this image
                  observer.unobserve(lazyImage);
                }
              });
            },
            {
              rootMargin: "50px 0px", // Start loading a bit before image enters viewport
              threshold: 0.01,
            }
          );
  
          lazyImages.forEach((img) => {
            // Use data-src for actual image source
            if (img.dataset.src) {
              imageObserver.observe(img);
            }
          });
        } else {
          // Fallback for browsers that don't support IntersectionObserver
          // Simply show all lazy images
          safeQuerySelectorAll('img[loading="lazy"]').forEach((img) => {
            if (img.dataset.src) {
              img.src = img.dataset.src;
            }
          });
        }
      } catch (e) {
        console.error("Error initializing enhanced lazy loading:", e);
      }
    }
    
    // Public API
    return {
      initMobileMenu,
      initTeamCarousel,
      initGraphModal,
      initProjectsCarousel,
      initReadMoreToggles,
      initVideoPlayers,
      initLazyLoading,
      initEnhancedLazyLoading
    };
  })();

  // ==========================================
// SPECIAL PAGE FUNCTIONALITY
// ==========================================

// Water Project Page Specific functionality
const WaterProjectPage = (function() {
  function init() {
    // Donation Form Animation
    const donationForm = safeQuerySelector(".donation-form-container");
    if (!donationForm) return;

    // Animate the progress bar on scroll
    const animateOnScroll = () => {
      try {
        const progressBar = safeQuerySelector(".progress-bar");
        if (progressBar) {
          const progressBarPosition = progressBar.getBoundingClientRect().top;
          const screenPosition = window.innerHeight / 1.3;

          if (progressBarPosition < screenPosition) {
            progressBar.style.width = "65%";
          }
        }
      } catch (e) {
        console.error("Error animating progress bar:", e);
      }
    };

    // Listen for scroll events with debounce for better performance
    window.addEventListener("scroll", debounce(animateOnScroll, 50));

    // Trigger once on page load to check initial visibility
    animateOnScroll();

    // Smooth scroll to donation section when "Help now" or "Donate now" is clicked
    const donateLinks = safeQuerySelectorAll('a[href="#donation-section"]');

    donateLinks.forEach((link) => {
      link.addEventListener("click", function (e) {
        try {
          e.preventDefault();

          const targetSection = document.getElementById("donation-section");
          if (targetSection) {
            targetSection.scrollIntoView({
              behavior: "smooth",
            });
          }
        } catch (e) {
          console.error("Error scrolling to donation section:", e);
        }
      });
    });
  }
  
  return { init };
})();

// Naserian Page Specific functionality
const NaserianPage = (function() {
  function init() {
    // Wait for a short delay to ensure all elements are fully loaded and rendered
    setTimeout(function () {
      console.log("Initializing Naserian video player...");

      // Target specifically the video container inside the naserian-story
      const videoContainer = safeQuerySelector(
        ".naserian-story .overflow-hidden.relative.rounded-xl"
      );

      if (!videoContainer) {
        console.log("Naserian video container not found on this page");
        return;
      }

      const video = videoContainer.querySelector("video");
      const playButton = videoContainer.querySelector(".play-btn");
      const overlay = videoContainer.querySelector(".absolute");

      console.log("Found elements:", {
        videoContainer: !!videoContainer,
        video: !!video,
        playButton: !!playButton,
        overlay: !!overlay,
      });

      if (video && playButton && overlay) {
        try {
          // Remove any existing event listeners (to avoid conflicts)
          const newPlayButton = playButton.cloneNode(true);
          playButton.parentNode.replaceChild(newPlayButton, playButton);

          // Add the event listener to the new button
          newPlayButton.addEventListener("click", function (e) {
            console.log("Play button clicked");
            e.preventDefault();
            e.stopPropagation();

            if (video.paused) {
              // Play the video
              video
                .play()
                .then(() => {
                  console.log("Video playing successfully");
                  // Update button to show pause icon
                  this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>`;
                  // Hide the overlay
                  overlay.style.opacity = "0";
                })
                .catch((err) => {
                  console.error("Error playing video:", err);
                });
            } else {
              // Pause the video
              video.pause();
              console.log("Video paused");

              // Update button to show play icon
              this.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>`;

              // Show the overlay
              overlay.style.opacity = "0.8";
            }

            return false;
          });

          // Handle video ending
          video.addEventListener("ended", function () {
            console.log("Video ended");

            // Reset play button icon
            newPlayButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>`;

            // Show the overlay
            overlay.style.opacity = "0.8";
          });

          // Make video clickable to toggle play/pause (but only if the click is directly on the video)
          video.addEventListener("click", function (e) {
            // Only handle direct clicks on the video element
            if (e.target === this) {
              console.log("Video element clicked");

              if (this.paused) {
                this.play().then(() => {
                  // Update button to show pause icon
                  newPlayButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>`;
                  // Hide the overlay
                  overlay.style.opacity = "0";
                });
              } else {
                this.pause();
                // Update button to show play icon
                newPlayButton.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>`;
                // Show the overlay
                overlay.style.opacity = "0.8";
              }
            }
          });

          console.log("Naserian video player initialized successfully");
        } catch (e) {
          console.error("Error initializing Naserian video player:", e);
        }
      } else {
        console.warn(
          "Could not find all required elements for the Naserian video player"
        );
      }
    }, 500); // Short delay to ensure DOM is fully loaded
  }
  
  return { init };
})();

// Financieel page specific functionality
const FinancieelPage = (function() {
  function init() {
    // Update language toggle to show correct annual report section
    const originalSwitchLanguage = window.switchLanguage;
    if (typeof originalSwitchLanguage === "function") {
      window.switchLanguage = function (lang) {
        try {
          // First call the original function
          originalSwitchLanguage(lang);

          // Toggle annual report sections based on language
          const annualReportNl = document.getElementById("annual-report-nl");
          const annualReportEn = document.getElementById("annual-report-en");

          if (annualReportNl && annualReportEn) {
            if (lang === "nl") {
              annualReportNl.classList.remove("hidden");
              annualReportEn.classList.add("hidden");
            } else {
              annualReportNl.classList.add("hidden");
              annualReportEn.classList.remove("hidden");
            }
          }
        } catch (e) {
          console.error("Error in financieel page language switch:", e);
        }
      };
    }
  }
  
  return { init };
})();

// ==========================================
// PERFORMANCE MONITORING
// ==========================================

// Performance monitoring module
const PerformanceMonitor = (function() {
  function init() {
    window.addEventListener("load", () => {
      if ("performance" in window) {
        try {
          const pageLoadTime = performance.now();
          const navigationEntries = performance.getEntriesByType("navigation")[0];

          if (navigationEntries) {
            // Detailed performance metrics
            const metrics = {
              totalLoadTime: pageLoadTime.toFixed(2),
              domLoadTime:
                navigationEntries.domContentLoadedEventEnd -
                navigationEntries.navigationStart,
              firstContentfulPaint:
                navigationEntries.firstContentfulPaint -
                navigationEntries.navigationStart,
              timeToInteractive:
                navigationEntries.domInteractive -
                navigationEntries.navigationStart,
              fullPageLoadTime:
                navigationEntries.loadEventEnd - navigationEntries.navigationStart,
            };

            console.group("Page Performance Metrics");
            console.log("Total Load Time:", metrics.totalLoadTime, "ms");
            console.log("DOM Load Time:", metrics.domLoadTime, "ms");
            console.log(
              "First Contentful Paint:",
              metrics.firstContentfulPaint,
              "ms"
            );
            console.log("Time to Interactive:", metrics.timeToInteractive, "ms");
            console.log("Full Page Load Time:", metrics.fullPageLoadTime, "ms");
            console.groupEnd();

            // Optional: Send metrics to analytics or performance monitoring service
            if (window.dataLayer) {
              window.dataLayer.push({
                event: "performance_metrics",
                total_load_time: metrics.totalLoadTime,
                dom_load_time: metrics.domLoadTime,
                first_contentful_paint: metrics.firstContentfulPaint,
                time_to_interactive: metrics.timeToInteractive,
                full_page_load_time: metrics.fullPageLoadTime,
              });
            }
          }
        } catch (e) {
          console.error("Error collecting performance metrics:", e);
        }
      }
    });
  }
  
  return { init };
})();

// ==========================================
// NEWSLETTER SUBSCRIPTION MODULE
// ==========================================

// Newsletter management module to handle Laposta API integration
const NewsletterManager = (function() {
  // Configuration
  const config = {
    // Netlify Function endpoint
    functionUrl: '/.netlify/functions/subscribe'
  };

  // Initialize newsletter form
  function init() {
    const newsletterForm = safeQuerySelector('form[aria-labelledby="newsletter-subtitle"]');
    
    if (!newsletterForm) {
      console.warn('Newsletter form not found on this page');
      return;
    }

    // Add the feedback message container if it doesn't exist
    if (!newsletterForm.querySelector('#newsletter-result')) {
      const feedbackEl = document.createElement('div');
      feedbackEl.id = 'newsletter-result';
      feedbackEl.className = 'hidden rounded-md p-4 mb-4';
      feedbackEl.setAttribute('aria-live', 'polite');
      
      const messagePara = document.createElement('p');
      messagePara.className = 'text-sm font-medium';
      feedbackEl.appendChild(messagePara);
      
      // Insert it at the top of the form
      newsletterForm.insertBefore(feedbackEl, newsletterForm.firstChild);
    }

    // Add form submission event listener
    newsletterForm.addEventListener('submit', handleFormSubmit);
    
    console.log('Newsletter form initialized');
  }

  // Handle form submission
  async function handleFormSubmit(event) {
    event.preventDefault();
    
    try {
      // Show loading state
      const submitButton = event.target.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;
      
      // Get form data
      const email = event.target.querySelector('#email').value.trim();
      const name = event.target.querySelector('#name').value.trim();
      const consentCheckbox = event.target.querySelector('#newsletter-consent');
      const consentChecked = consentCheckbox ? consentCheckbox.checked : false;
      
      // Validate form data - Enhanced validation
      let errors = [];
      
      if (!email) {
        errors.push(LanguageManager.getCurrentLanguage() === 'nl' 
          ? 'E-mailadres is verplicht' 
          : 'Email address is required');
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.push(LanguageManager.getCurrentLanguage() === 'nl' 
          ? 'Voer een geldig e-mailadres in' 
          : 'Please enter a valid email address');
      }
      
      if (!name) {
        errors.push(LanguageManager.getCurrentLanguage() === 'nl' 
          ? 'Naam is verplicht' 
          : 'Name is required');
      }
      
      // Explicitly check the consent checkbox
      if (!consentChecked) {
        errors.push(LanguageManager.getCurrentLanguage() === 'nl' 
          ? 'Je moet akkoord gaan met onze voorwaarden' 
          : 'You must agree to our terms');
          
        // Highlight the checkbox or its label to draw attention
        if (consentCheckbox) {
          const consentLabel = event.target.querySelector('label[for="newsletter-consent"]');
          if (consentLabel) {
            consentLabel.classList.add('text-red-600', 'font-bold');
            // Remove highlighting after 3 seconds
            setTimeout(() => {
              consentLabel.classList.remove('text-red-600', 'font-bold');
            }, 3000);
          }
        }
      }
      
      // If there are any validation errors, display them and stop form submission
      if (errors.length > 0) {
        showFormFeedback(
          event.target,
          errors.join('. '),
          true // Show as error
        );
        return; // Stop form submission process
      }
      
      // If we got here, validation passed - proceed with form submission
      submitButton.disabled = true;
      submitButton.textContent = LanguageManager.getCurrentLanguage() === 'nl' 
        ? 'Even geduld...' 
        : 'Please wait...';
      
      // Clear any previous feedback
      clearFormFeedback(event.target);
      
      // Split name into first name and last name
      const nameParts = name.split(' ');
      const firstName = nameParts[0] || '';
      const lastName = nameParts.slice(1).join(' ') || '';
      
      console.log('Mapped to first name:', firstName);
      console.log('Mapped to last name:', lastName);
      
      // Prepare the data for our Netlify Function
      const userData = {
        email: email,
        name: name
      };
      
      // Subscribe via our Netlify Function
      const response = await subscribeViaFunction(userData);
      
      if (response.success) {
        // Show success message in form
        showFormFeedback(
          event.target,
          LanguageManager.getCurrentLanguage() === 'nl'
            ? 'Bedankt voor je aanmelding!'
            : 'Thank you for subscribing!',
          false
        );
        
        // Also show the popup message
        showFeedbackMessage(
          LanguageManager.getCurrentLanguage() === 'nl'
            ? 'Bedankt voor je aanmelding!'
            : 'Thank you for subscribing!',
          5000
        );
        
        // Reset form
        event.target.reset();
      } else {
        // Check if this is a duplicate email (already subscribed)
        if (response.error && (
            response.error.includes('exists') || 
            response.error.includes('already subscribed'))) {
          
          showFormFeedback(
            event.target,
            LanguageManager.getCurrentLanguage() === 'nl'
              ? 'Je bent al aangemeld voor onze nieuwsbrief. Bedankt voor je interesse!'
              : 'You are already subscribed to our newsletter. Thank you for your interest!',
            false  // Show as success, not as error
          );
          
          // Also show popup
          showFeedbackMessage(
            LanguageManager.getCurrentLanguage() === 'nl'
              ? 'Je bent al aangemeld voor onze nieuwsbrief.'
              : 'You are already subscribed to our newsletter.',
            5000
          );
        } else {
          throw new Error(response.error || 'An error occurred');
        }
      }
    } catch (error) {
      console.error('Newsletter signup error:', error);
      
      // Show error message in form
      showFormFeedback(
        event.target,
        error.message || (LanguageManager.getCurrentLanguage() === 'nl'
          ? 'Er is iets misgegaan. Probeer het later opnieuw.'
          : 'Something went wrong. Please try again later.'),
        true
      );
      
      // Also show popup error message
      showFeedbackMessage(
        error.message || (LanguageManager.getCurrentLanguage() === 'nl'
          ? 'Er is iets misgegaan. Probeer het later opnieuw.'
          : 'Something went wrong. Please try again later.'),
        5000,
        true
      );
    } finally {
      // Reset button state
      const submitButton = event.target.querySelector('button[type="submit"]');
      submitButton.disabled = false;
      submitButton.textContent = LanguageManager.getCurrentLanguage() === 'nl'
        ? 'Inschrijven'
        : 'Subscribe';
    }
  }

  // Call our Netlify Function to handle the Laposta API communication
  async function subscribeViaFunction(userData) {
    try {
      // Create the request options for our Netlify Function
      const requestOptions = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(userData)
      };
      
      // Make the API request to our Netlify Function
      const response = await fetch(config.functionUrl, requestOptions);
      const data = await response.json();
      
      // Check for successful response
      if (response.ok && data && data.success) {
        return { success: true, data: data.data };
      } else {
        // Handle errors from our Netlify Function
        return { 
          success: false, 
          error: data.error || (LanguageManager.getCurrentLanguage() === 'nl'
            ? 'Er is iets misgegaan. Probeer het later opnieuw.'
            : 'Something went wrong. Please try again later.')
        };
      }
    } catch (error) {
      console.error('API error:', error);
      return { 
        success: false, 
        error: LanguageManager.getCurrentLanguage() === 'nl'
          ? 'Verbindingsprobleem. Controleer je internetverbinding en probeer het opnieuw.'
          : 'Connection problem. Please check your internet connection and try again.'
      };
    }
  }

  // Helper function to show feedback in the form
  function showFormFeedback(form, message, isError = false) {
    const feedbackElement = form.querySelector('#newsletter-result');
    if (!feedbackElement) return;
    
    // Set the message
    const feedbackText = feedbackElement.querySelector('p');
    if (feedbackText) {
      feedbackText.textContent = message;
    }
    
    // Set the appropriate styling
    feedbackElement.classList.remove('hidden', 'bg-red-50', 'text-red-800', 'bg-green-50', 'text-green-800');
    
    if (isError) {
      feedbackElement.classList.add('bg-red-50', 'text-red-800');
    } else {
      feedbackElement.classList.add('bg-green-50', 'text-green-800');
    }
  }

  // Helper function to clear feedback in the form
  function clearFormFeedback(form) {
    const feedbackElement = form.querySelector('#newsletter-result');
    if (!feedbackElement) return;
    
    feedbackElement.classList.add('hidden');
    const feedbackText = feedbackElement.querySelector('p');
    if (feedbackText) {
      feedbackText.textContent = '';
    }
  }

  // Return public API
  return {
    init
  };
})();

// ==========================================
// SOCIAL SHARING MODULE
// ==========================================

// Social sharing functionality
const SocialSharingManager = (function() {
  // Initialize sharing functionality
  function init() {
    // Instagram copy to clipboard functionality
    initInstagramSharing();
    
    // Initialize dynamic link sharing URLs
    updateSharingLinks();
    
    // Listen for language changes to update sharing links
    document.addEventListener('languageChanged', function(event) {
      updateSharingLinks();
    });
  }
  
  // Initialize Instagram sharing functionality
  function initInstagramSharing() {
    const instagramCopyBtn = document.getElementById('instagram-copy');
    const instagramContent = document.getElementById('instagram-content');
    const instagramTooltip = document.getElementById('instagram-tooltip');
    
    if (!instagramCopyBtn || !instagramContent) return;
    
    instagramCopyBtn.addEventListener('click', function() {
      try {
        // Get current page info
        const pageUrl = window.location.href;
        const pageTitle = document.title;
        
        // Get the summary from the first paragraph or meta description
        let pageSummary = "";
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          pageSummary = metaDescription.getAttribute('content');
        } else {
          const firstParagraph = document.querySelector('article p');
          if (firstParagraph) {
            pageSummary = firstParagraph.textContent.substring(0, 150) + '...';
          }
        }
        
        // Create dynamic Instagram content
        const hashTags = '#Tanzania #Maasai #CleanWater #Drought #ClimateChange #HumanitarianAid #ASHE #NGO';
        
        // Update the textarea content based on current language
        const currentLang = LanguageManager.getCurrentLanguage();
        const emoji = '🌊 ';
        const readMoreText = currentLang === 'nl' ? 'Lees meer op:' : 'Read more at:';
        
        // Update the textarea content
        instagramContent.value = `${emoji}${pageTitle}\n\n${pageSummary.substring(0, 150)}\n\n${readMoreText} ${pageUrl}\n\n${hashTags}`;
        
        // Select the text and copy to clipboard
        instagramContent.select();
        document.execCommand('copy');
        
        // Show the tooltip with proper language
        if (instagramTooltip) {
          instagramTooltip.textContent = currentLang === 'nl' ? 'Gekopieerd naar klembord!' : 'Copied to clipboard!';
          instagramTooltip.classList.add('opacity-100');
          
          setTimeout(function() {
            instagramTooltip.classList.remove('opacity-100');
          }, 2000);
        } else {
          // If tooltip element doesn't exist, use the global feedback message
          showFeedbackMessage(
            currentLang === 'nl' ? 'Gekopieerd naar klembord!' : 'Copied to clipboard!',
            2000
          );
        }
      } catch (e) {
        console.error('Error copying Instagram content:', e);
        
        // Show error feedback
        const currentLang = LanguageManager.getCurrentLanguage();
        showFeedbackMessage(
          currentLang === 'nl' 
            ? 'Kopiëren mislukt. Probeer opnieuw.'
            : 'Copy failed. Please try again.',
          2000
        );
      }
    });
  }
  
  // Update social sharing links with the current page info
  function updateSharingLinks() {
    try {
      // Get the current page URL, use canonical URL if available
      let pageUrl = '';
      
      // First try to get the canonical URL if one exists
      const canonicalLink = document.querySelector('link[rel="canonical"]');
      if (canonicalLink && canonicalLink.href) {
        pageUrl = canonicalLink.href;
      } else {
        pageUrl = window.location.href;
      }
      
      // For LOCAL TESTING ONLY - Use a production URL when in localhost environment
      if (pageUrl.includes('localhost') || pageUrl.includes('127.0.0.1')) {
        // For demonstration purposes, use the canonical URL from meta tags if available
        const ogUrl = document.querySelector('meta[property="og:url"]');
        if (ogUrl && ogUrl.content) {
          pageUrl = ogUrl.content;
        } else {
          // Fallback to a hard-coded production URL
          pageUrl = 'https://ashefoundation.nl/blog';
        }
        console.log('Local environment detected, using public URL for sharing:', pageUrl);
      }
      
      // Make sure the URL doesn't have any quotes or other issues
      pageUrl = pageUrl.trim();
      
      // Get page title and description
      let pageTitle = document.title;
      let pageSummary = "";
      
      // Try to get title and description from Open Graph meta tags first
      const ogTitle = document.querySelector('meta[property="og:title"]');
      const ogDescription = document.querySelector('meta[property="og:description"]');
      
      if (ogTitle && ogTitle.content) {
        pageTitle = ogTitle.content;
      }
      
      if (ogDescription && ogDescription.content) {
        pageSummary = ogDescription.content;
      } else {
        // Fallback to meta description
        const metaDescription = document.querySelector('meta[name="description"]');
        if (metaDescription) {
          pageSummary = metaDescription.getAttribute('content');
        } else {
          // Last resort: get from first paragraph
          const firstParagraph = document.querySelector('article p');
          if (firstParagraph) {
            pageSummary = firstParagraph.textContent.substring(0, 150) + '...';
          }
        }
      }
      
      // Current language for tailoring share text
      const currentLang = LanguageManager.getCurrentLanguage();
      
      // Update LinkedIn sharing link
      const linkedinLink = document.querySelector('a[aria-label="Deel op LinkedIn"]');
      if (linkedinLink) {
        // Use the most reliable LinkedIn sharing format
        linkedinLink.href = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(pageUrl)}`;
        
        // Log for debugging
        console.log('LinkedIn share URL set to:', linkedinLink.href);
      }
      
      // Update Facebook sharing link
      const facebookLink = document.querySelector('a[aria-label="Deel op Facebook"]');
      if (facebookLink) {
        facebookLink.href = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(pageUrl)}&quote=${encodeURIComponent(pageTitle + ' - ' + pageSummary.substring(0, 100))}`;
      }
      
      // Update Twitter/X sharing link
      const twitterLink = document.querySelector('a[aria-label="Deel op Twitter/X"]');
      if (twitterLink) {
        twitterLink.href = `https://twitter.com/intent/tweet?url=${encodeURIComponent(pageUrl)}&text=${encodeURIComponent(pageTitle + '\n\n' + pageSummary.substring(0, 100))}`;
      }
    } catch (e) {
      console.error('Error updating sharing links:', e);
    }
  }
  
  // Return public API
  return {
    init
  };
})();


// ==========================================
// APPLICATION INITIALIZATION
// ==========================================

// Main initialization on DOM Content Loaded
document.addEventListener("DOMContentLoaded", function () {
  // Initialize language manager
  LanguageManager.initLanguage();
  LanguageManager.initLanguageToggleListeners();

  // Initialize cookie banner (simplified version that defers to gtm.js)
  CookieManager.initCookieBanner();
  
  // Initialize UI components
  UIComponents.initMobileMenu();
  UIComponents.initTeamCarousel();
  UIComponents.initGraphModal();
  UIComponents.initProjectsCarousel();
  UIComponents.initReadMoreToggles();
  UIComponents.initVideoPlayers();
  UIComponents.initLazyLoading();
  
  // Initialize Newsletter form if it exists on the page
  if (document.querySelector('form[aria-labelledby="newsletter-subtitle"]')) {
    NewsletterManager.init();
  }

  // Initialize social sharing functionality if sharing elements exist
  if (document.getElementById('instagram-copy')) {
    SocialSharingManager.init();
  }
  
  // Check if we're on special pages and initialize accordingly
  if (document.querySelector('.donation-form-container')) {
    WaterProjectPage.init();
  }
  
  if (document.querySelector('.naserian-story')) {
    NaserianPage.init();
  }
  
  if (document.getElementById('annual-report-nl') || document.getElementById('annual-report-en')) {
    FinancieelPage.init();
  }
});

// Initialize enhanced lazy loading and performance monitoring on window load
window.addEventListener("load", function() {
  UIComponents.initEnhancedLazyLoading();
  PerformanceMonitor.init();
});
