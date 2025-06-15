/**
 * Enhanced Google Tag Manager Implementation
 * - Privacy-first approach
 * - Performance optimized
 * - Error handling improved
 * - Keyboard accessibility enhanced
 * - Support for consent revocation
 */

// MOVED OUTSIDE: GTM Configuration (for global access)
const GTM_CONFIG = {
  id: "GTM-MDTTVCKD",
  dataLayerName: "dataLayer",
  environment: "production",
};

(function () {
  // Version tracking
  const VERSION = "1.3.0";

  // Initialize consent management
  let consentManager = {
    // Check user's cookie consent preference from localStorage
    getConsentStatus: function () {
      try {
        return localStorage.getItem("cookieConsent");
      } catch (e) {
        console.warn("Error accessing localStorage:", e);
        return null;
      }
    },

    // Set consent status with error handling
    setConsentStatus: function (status) {
      try {
        localStorage.setItem("cookieConsent", status);
        return true;
      } catch (e) {
        console.warn("Error setting localStorage:", e);
        return false;
      }
    },

    // Clear consent status (for testing)
    clearConsentStatus: function () {
      try {
        localStorage.removeItem("cookieConsent");
        return true;
      } catch (e) {
        console.warn("Error clearing localStorage:", e);
        return false;
      }
    },
  };

  // Utility to check if GTM is already loaded
  function isGTMLoaded() {
    return typeof window[GTM_CONFIG.dataLayerName] !== "undefined";
  }

  // MODIFIED: Main GTM loading function - now only sets up enhanced tracking
  // (GTM itself is loaded by gtm-consent-mode.js)
  function loadGTM() {
    if (!isGTMLoaded()) {
      console.warn("GTM not loaded by consent mode - this shouldn't happen");
      return false;
    }

    try {
      console.log("Setting up enhanced GTM tracking");
      // GTM is already loaded, just set up enhanced features
      initializeEnhancedDataLayer();
      setupEnhancedEventTracking();
      return true;
    } catch (e) {
      console.error("Error setting up enhanced GTM tracking:", e);
      return false;
    }
  }

  // MODIFIED: Function to disable tracking (but not remove GTM entirely)
  // GTM stays loaded for debugging, but consent is set to denied
  function removeGTM() {
    try {
      console.log("Disabling GTM tracking via consent mode");
      // Don't actually remove GTM scripts (for debugging)
      // Consent is handled by gtm-consent-mode.js
      return true;
    } catch (e) {
      console.error("Error disabling GTM tracking:", e);
      return false;
    }
  }

  // Function to show feedback message
  function showFeedbackMessage(message) {
    // Create a temporary message element
    const feedbackElement = document.createElement("div");
    feedbackElement.style.position = "fixed";
    feedbackElement.style.bottom = "20px";
    feedbackElement.style.left = "50%";
    feedbackElement.style.transform = "translateX(-50%)";
    feedbackElement.style.padding = "10px 20px";
    feedbackElement.style.backgroundColor = "#57CC99"; // Using your green color
    feedbackElement.style.color = "white";
    feedbackElement.style.borderRadius = "4px";
    feedbackElement.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
    feedbackElement.style.zIndex = "9999";
    feedbackElement.textContent = message;

    // Add to DOM
    document.body.appendChild(feedbackElement);

    // Remove after 3 seconds
    setTimeout(() => {
      if (document.body.contains(feedbackElement)) {
        document.body.removeChild(feedbackElement);
      }
    }, 3000);
  }

  // Get cookie preferences - UPDATED: Removed marketing cookies
  function getCookiePreferences() {
    try {
      const prefs = localStorage.getItem("cookiePreferences");
      return prefs ? JSON.parse(prefs) : { necessary: true, analytics: false };
    } catch (e) {
      console.warn("Error getting cookie preferences:", e);
      return { necessary: true, analytics: false };
    }
  }

  // Show the cookie preferences modal - using existing HTML modal
  function showCookiePreferencesModal() {
    console.log("Opening cookie preferences modal");

    // Get the existing modal from the HTML
    const modal = document.getElementById("cookie-preferences-modal");

    if (!modal) {
      console.warn("Cookie preferences modal not found in the HTML");
      return;
    }

    // Update toggle states to match current preferences BEFORE showing the modal
    updateModalToggles();

    // Show the modal according to the CSS structure
    modal.style.display = "block";

    // Important: Add the show class to make it visible with opacity
    setTimeout(() => {
      modal.classList.add("show");
    }, 10);

    document.body.style.overflow = "hidden"; // Prevent scrolling

    // Apply translations
    translateCookieModal();

    // Set up listeners if not already done
    setupCookiePreferencesModalListeners(modal);

    // Trap focus in modal for accessibility
    trapFocusInModal(modal);
  }

  // Update modal toggles based on saved preferences
  function updateModalToggles() {
    try {
      // Get current preferences
      const preferences = getCookiePreferences();

      // Update modal toggles
      const analyticsToggle = document.getElementById("analytics-cookies");
      // Note: We still handle the marketing toggle if it exists in the DOM
      const marketingToggle = document.getElementById("marketing-cookies");

      if (analyticsToggle) {
        analyticsToggle.checked = preferences.analytics;
        updateToggleUI(analyticsToggle);
      }

      // Even though we don't use marketing cookies anymore, we still handle the UI
      // if the element exists in the DOM
      if (marketingToggle) {
        marketingToggle.checked = false; // Always off since we're not using marketing cookies
        updateToggleUI(marketingToggle);
      }

      console.log("Updated modal toggles with preferences:", preferences);
    } catch (e) {
      console.error("Error updating modal toggles:", e);
    }
  }

  // Set up event listeners for the cookie modal
  function setupCookiePreferencesModalListeners(modal) {
    // Close button
    const closeButton = modal.querySelector(".close-modal");
    if (closeButton && !closeButton._hasListener) {
      closeButton.addEventListener("click", function () {
        modal.style.display = "none";
        document.body.style.overflow = ""; // Restore scrolling
      });
      closeButton._hasListener = true;
    }

    // Save button
    const saveButton = modal.querySelector("#save-cookie-preferences");
    if (saveButton && !saveButton._hasListener) {
      saveButton.addEventListener("click", function () {
        saveCookiePreferences();
      });
      saveButton._hasListener = true;
    }

    // Cancel button
    const cancelButton = modal.querySelector("#close-cookie-preferences");
    if (cancelButton && !cancelButton._hasListener) {
      cancelButton.addEventListener("click", function () {
        modal.style.display = "none";
        document.body.style.overflow = ""; // Restore scrolling
      });
      cancelButton._hasListener = true;
    }

    // Close when clicking outside modal content
    if (!modal._hasOutsideClickListener) {
      modal.addEventListener("click", function (event) {
        if (event.target === modal) {
          modal.style.display = "none";
          document.body.style.overflow = ""; // Restore scrolling
        }
      });
      modal._hasOutsideClickListener = true;
    }

    // Toggle handling with event delegation - FIXED
    if (!modal._hasToggleListener) {
      modal.addEventListener("click", function (event) {
        const toggleContainer = event.target.closest(".relative.inline-block");
        if (toggleContainer) {
          const toggleInput = toggleContainer.querySelector(
            'input[type="checkbox"]',
          );
          if (toggleInput && !toggleInput.disabled) {
            // Explicitly toggle the checked state
            toggleInput.checked = !toggleInput.checked;
            console.log(
              `Toggle ${toggleInput.id} clicked, new state:`,
              toggleInput.checked,
            );

            // Use the SINGLE updateToggleUI function from window
            if (typeof window.updateToggleUI === "function") {
              window.updateToggleUI(toggleInput);
            }
          }
        }
      });
      modal._hasToggleListener = true;
    }
  }

  // Translate the cookie modal
  function translateCookieModal() {
    const modal = document.getElementById("cookie-preferences-modal");
    if (!modal) {
      console.warn("Cookie modal not found for translation");
      return;
    }

    // Get current language
    const currentLang = window.LanguageManager
      ? window.LanguageManager.getCurrentLanguage()
      : localStorage.getItem("asheLanguage") || "nl";

    console.log("Translating cookie modal to:", currentLang);

    // Apply translations if translations object exists
    if (window.translations && window.translations[currentLang]) {
      // Find all elements with data-lang-key within the modal
      const elementsWithKeys = modal.querySelectorAll("[data-lang-key]");
      elementsWithKeys.forEach((element) => {
        const key = element.getAttribute("data-lang-key");
        if (window.translations[currentLang][key]) {
          element.innerHTML = window.translations[currentLang][key];
        } else {
          console.warn(
            `Missing translation for key "${key}" in language "${currentLang}"`,
          );
        }
      });

      console.log("Cookie modal translation completed");
    } else {
      console.warn("Translations not available for language:", currentLang);
    }
  }

  // Update toggle UI appearance
  function updateToggleUI(toggleInput) {
    if (!toggleInput) {
      console.warn("No toggle element provided to updateToggleUI");
      return;
    }

    // Find the toggle container
    const toggleContainer =
      toggleInput.closest(".relative.inline-block") || toggleInput.parentNode;
    if (!toggleContainer) {
      console.warn("Toggle container not found for", toggleInput.id);
      return;
    }

    // Find track and thumb within the container
    // Use multiple selector strategies for better compatibility
    const track =
      toggleContainer.querySelector("span.absolute.inset-0") ||
      toggleContainer.querySelector("span:nth-child(2)") ||
      toggleContainer.querySelectorAll("span")[0];

    const thumb =
      toggleContainer.querySelector("span.absolute.h-5.w-5") ||
      toggleContainer.querySelector("span:nth-child(3)") ||
      toggleContainer.querySelectorAll("span")[1];

    if (!track || !thumb) {
      console.warn("Toggle UI elements not found for", toggleInput.id);
      return;
    }

    // Apply the appropriate styles - using both direct styles and classes
    if (toggleInput.checked) {
      // Active state - orange background
      track.style.backgroundColor = "#E07A5F"; // terracotta color
      track.classList.add("bg-terracotta");
      track.classList.remove("bg-gray-200");
      thumb.style.transform = "translateX(1.5rem)";
    } else {
      // Inactive state - gray background
      track.style.backgroundColor = "#E2E8F0"; // gray-200 color
      track.classList.remove("bg-terracotta");
      track.classList.add("bg-gray-200");
      thumb.style.transform = "translateX(0)";
    }
  }

  // MODIFIED: Save cookie preferences - updated for consent mode
  function saveCookiePreferences() {
    try {
      // Find the toggle that was actually clicked/changed

      // Get both possible toggles
      const analyticsToggleModal = document.getElementById("analytics-cookies");
      const analyticsTogglePrivacy = document.getElementById(
        "analytics-cookies-privacy",
      );

      // Determine which one to use - prioritize the one in the visible container
      let analyticsToggle;
      const modal = document.getElementById("cookie-preferences-modal");

      // If modal is visible, use that toggle
      if (
        modal &&
        (modal.style.display === "block" || modal.style.display === "flex")
      ) {
        analyticsToggle = analyticsToggleModal;
      } else {
        // Otherwise use the privacy page toggle
        analyticsToggle = analyticsTogglePrivacy;
      }

      // If neither is found, try the other one as fallback
      if (!analyticsToggle) {
        analyticsToggle = analyticsToggleModal || analyticsTogglePrivacy;
      }

      if (!analyticsToggle) {
        console.warn("Could not find any analytics toggle element");
        return;
      }

      // CRITICAL: Get the actual checked state from the determined toggle
      const isAnalyticsChecked = analyticsToggle.checked;
      console.log("Toggle state before saving:", isAnalyticsChecked);

      // Save new preferences
      const newPreferences = {
        necessary: true,
        analytics: isAnalyticsChecked,
      };

      console.log("Saving cookie preferences:", newPreferences);
      localStorage.setItem("cookiePreferences", JSON.stringify(newPreferences));

      // ADDED: Update Google Consent Mode
      if (typeof window.updateGoogleConsent === "function") {
        window.updateGoogleConsent(newPreferences.analytics);
      }

      // MODIFIED: Set consent status but don't load/remove GTM
      // (GTM is always loaded, consent controls the data collection)
      if (newPreferences.analytics) {
        localStorage.setItem("cookieConsent", "accepted");
        // Set up enhanced tracking if not already done
        setTimeout(() => {
          initializeEnhancedDataLayer();
          setupEnhancedEventTracking();
        }, 500);
      } else {
        localStorage.setItem("cookieConsent", "declined");
        // GTM stays loaded but tracking is disabled via consent mode
      }

      // Get the current language for feedback message
      const currentLang = window.LanguageManager
        ? window.LanguageManager.getCurrentLanguage()
        : localStorage.getItem("asheLanguage") || "nl";

      const message =
        currentLang === "nl"
          ? "Cookie instellingen opgeslagen."
          : "Cookie settings saved.";
      showFeedbackMessage(message);

      // Update ALL toggles to match the saved preferences
      if (analyticsToggleModal && analyticsToggleModal !== analyticsToggle) {
        analyticsToggleModal.checked = newPreferences.analytics;
        updateToggleUI(analyticsToggleModal);
      }

      if (
        analyticsTogglePrivacy &&
        analyticsTogglePrivacy !== analyticsToggle
      ) {
        analyticsTogglePrivacy.checked = newPreferences.analytics;
        updateToggleUI(analyticsTogglePrivacy);
      }

      // Hide cookie banner if it exists
      const cookieBanner = document.querySelector(".cookie-banner");
      if (cookieBanner) {
        cookieBanner.style.display = "none";
      }

      // Hide modal if it's open
      if (
        modal &&
        (modal.style.display === "block" || modal.style.display === "flex")
      ) {
        modal.style.display = "none";
        document.body.style.overflow = ""; // Re-enable scrolling
      }
    } catch (e) {
      console.error("Error saving cookie preferences:", e);
    }
  }

  // Handle partial consent - UPDATED: Simplified since we only use analytics now
  function handlePartialConsent(preferences) {
    // For consent mode, we just update the consent status
    if (typeof window.updateGoogleConsent === "function") {
      window.updateGoogleConsent(preferences.analytics);
    }
  }

  // Update privacy page cookie UI - UPDATED: Removed marketing cookies
  function updatePrivacyPageCookieUI() {
    const preferences = getCookiePreferences();

    const analyticsTogglePrivacy = document.getElementById(
      "analytics-cookies-privacy",
    );
    // We still handle the marketing toggle if it exists in the DOM
    const marketingTogglePrivacy = document.getElementById(
      "marketing-cookies-privacy",
    );

    if (analyticsTogglePrivacy) {
      analyticsTogglePrivacy.checked = preferences.analytics;
      updateToggleUI(analyticsTogglePrivacy);
    }

    // Even though we don't use marketing cookies, handle the UI if it exists
    if (marketingTogglePrivacy) {
      marketingTogglePrivacy.checked = false; // Always off
      updateToggleUI(marketingTogglePrivacy);
    }
  }

  // Function to trap keyboard focus within modal for accessibility
  function trapFocusInModal(modalElement) {
    const focusableElements = modalElement.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );

    if (focusableElements.length === 0) return;

    const firstElement = focusableElements[0];
    const lastElement = focusableElements[focusableElements.length - 1];

    // Focus the first element when modal opens
    firstElement.focus();

    // Remove any existing event listener to avoid duplicates
    if (modalElement._keydownHandler) {
      modalElement.removeEventListener("keydown", modalElement._keydownHandler);
    }

    // Create handler function
    modalElement._keydownHandler = function (e) {
      if (e.key === "Tab") {
        // Handle tabbing to keep focus in modal
        if (e.shiftKey && document.activeElement === firstElement) {
          e.preventDefault();
          lastElement.focus();
        } else if (!e.shiftKey && document.activeElement === lastElement) {
          e.preventDefault();
          firstElement.focus();
        }
      } else if (e.key === "Escape") {
        // Close modal on Escape key
        modalElement.style.display = "none";
        document.body.style.overflow = ""; // Re-enable scrolling
      }
    };

    // Add the new handler
    modalElement.addEventListener("keydown", modalElement._keydownHandler);
  }

  // MODIFIED: Initialize based on consent - updated for consent mode
  function initializeBasedOnConsent() {
    const cookieConsent = consentManager.getConsentStatus();
    const preferences = getCookiePreferences();

    // GTM is already loaded by consent mode, just set up enhanced tracking if consented
    if (
      cookieConsent === "accepted" ||
      (preferences.analytics && cookieConsent !== "declined")
    ) {
      console.log("Setting up enhanced tracking - user has consented");
      // Small delay to ensure GTM is ready
      setTimeout(() => {
        initializeEnhancedDataLayer();
        setupEnhancedEventTracking();
      }, 500);
      trackConsentChangeEnhanced("granted");
    } else {
      console.log("GTM loaded but analytics disabled via consent");
      trackConsentChangeEnhanced("denied");
    }
  }

  // Function to initialize the toggle elements - UPDATED: Removed marketing cookies references
  function initializeToggleElements() {
    try {
      // Get current preferences
      const preferences = getCookiePreferences();
      console.log(
        "Initializing toggle elements with preferences:",
        preferences,
      );

      // Privacy page toggles
      const analyticsTogglePrivacy = document.getElementById(
        "analytics-cookies-privacy",
      );
      // We still handle the marketing toggle UI if it exists in the DOM
      const marketingTogglePrivacy = document.getElementById(
        "marketing-cookies-privacy",
      );

      // Set toggle states for privacy page
      if (analyticsTogglePrivacy) {
        analyticsTogglePrivacy.checked = preferences.analytics;
        updateToggleUI(analyticsTogglePrivacy);
      }

      // Even though we don't use marketing cookies, set UI state if it exists
      if (marketingTogglePrivacy) {
        marketingTogglePrivacy.checked = false; // Always off
        updateToggleUI(marketingTogglePrivacy);
      }

      // Modal toggles - only update if modal exists in DOM
      const modal = document.getElementById("cookie-preferences-modal");
      if (modal) {
        const analyticsToggle = document.getElementById("analytics-cookies");
        if (analyticsToggle) {
          analyticsToggle.checked = preferences.analytics;
          updateToggleUI(analyticsToggle);
        }
      }

      console.log("Toggle elements initialized with saved preferences");
    } catch (e) {
      console.error("Error initializing toggle elements:", e);
    }
  }

  // Setup event listeners for the cookie consent banner and preferences
  function setupConsentListeners() {
    console.log("Setting up consent listeners");

    // Cookie preferences button in banner
    const preferencesButton = document.getElementById(
      "cookie-preferences-button",
    );
    if (preferencesButton && !preferencesButton._hasListener) {
      console.log("Found preferences button, attaching listener");
      preferencesButton.addEventListener("click", function (e) {
        e.preventDefault();
        console.log("Preferences button clicked");
        showCookiePreferencesModal();

        // Hide the cookie banner
        const cookieBanner = document.querySelector(".cookie-banner");
        if (cookieBanner) {
          cookieBanner.style.display = "none";
        }
      });
      preferencesButton._hasListener = true;
    }

    // MODIFIED: Accept button in banner - updated for consent mode
    const confirmButton = document.getElementById("rcc-confirm-button");
    if (confirmButton && !confirmButton._hasListener) {
      confirmButton.addEventListener("click", function () {
        // Accept all cookies - UPDATED: Removed marketing cookies
        localStorage.setItem(
          "cookiePreferences",
          JSON.stringify({
            necessary: true,
            analytics: true,
          }),
        );
        consentManager.setConsentStatus("accepted");

        // Update Google Consent Mode
        if (typeof window.updateGoogleConsent === "function") {
          window.updateGoogleConsent(true);
        }

        // Set up enhanced tracking
        setTimeout(() => {
          initializeEnhancedDataLayer();
          setupEnhancedEventTracking();
        }, 500);

        // Get the current language for feedback message
        const currentLang = window.LanguageManager
          ? window.LanguageManager.getCurrentLanguage()
          : localStorage.getItem("asheLanguage") || "nl";

        const message =
          currentLang === "nl"
            ? "Cookie instellingen opgeslagen."
            : "Cookie settings saved.";
        showFeedbackMessage(message);

        // Hide cookie banner
        const cookieBanner = document.querySelector(".cookie-banner");
        if (cookieBanner) {
          cookieBanner.style.display = "none";
        }
      });
      confirmButton._hasListener = true;
    }

    // MODIFIED: Decline button in banner - updated for consent mode
    const declineButton = document.getElementById("rcc-decline-button");
    if (declineButton && !declineButton._hasListener) {
      declineButton.addEventListener("click", function () {
        // Decline all optional cookies - UPDATED: Removed marketing cookies
        localStorage.setItem(
          "cookiePreferences",
          JSON.stringify({
            necessary: true,
            analytics: false,
          }),
        );
        consentManager.setConsentStatus("declined");

        // Update Google Consent Mode
        if (typeof window.updateGoogleConsent === "function") {
          window.updateGoogleConsent(false);
        }

        // Get the current language for feedback message
        const currentLang = window.LanguageManager
          ? window.LanguageManager.getCurrentLanguage()
          : localStorage.getItem("asheLanguage") || "nl";

        const message =
          currentLang === "nl"
            ? "Cookie instellingen opgeslagen. Tracking is uitgeschakeld."
            : "Cookie settings saved. Tracking is disabled.";
        showFeedbackMessage(message);

        // Hide cookie banner
        const cookieBanner = document.querySelector(".cookie-banner");
        if (cookieBanner) {
          cookieBanner.style.display = "none";
        }
      });
      declineButton._hasListener = true;
    }

    // Privacy page cookie management
    const savePrivacyPrefs = document.getElementById("save-cookie-preferences");
    if (savePrivacyPrefs && !savePrivacyPrefs._hasListener) {
      savePrivacyPrefs.addEventListener("click", function () {
        saveCookiePreferences();
      });
      savePrivacyPrefs._hasListener = true;
    }

    // MODIFIED: "Delete all cookies" button - updated for consent mode
    const revokeAllCookies = document.getElementById("revoke-all-cookies");
    if (revokeAllCookies && !revokeAllCookies._hasListener) {
      revokeAllCookies.addEventListener("click", function () {
        // Clear all preferences and decline all cookies
        localStorage.setItem(
          "cookiePreferences",
          JSON.stringify({
            necessary: true,
            analytics: false,
          }),
        );
        consentManager.setConsentStatus("declined");

        // Update Google Consent Mode
        if (typeof window.updateGoogleConsent === "function") {
          window.updateGoogleConsent(false);
        }

        // IMPORTANT: Update checkbox state BEFORE updating UI
        const analyticsToggle = document.getElementById(
          "analytics-cookies-privacy",
        );
        if (analyticsToggle) {
          analyticsToggle.checked = false;
          updateToggleUI(analyticsToggle);
        }

        // Also update the modal toggle if it exists
        const modalAnalyticsToggle =
          document.getElementById("analytics-cookies");
        if (modalAnalyticsToggle) {
          modalAnalyticsToggle.checked = false;
          updateToggleUI(modalAnalyticsToggle);
        }

        // Get the current language for feedback message
        const currentLang = window.LanguageManager
          ? window.LanguageManager.getCurrentLanguage()
          : localStorage.getItem("asheLanguage") || "nl";

        const message =
          currentLang === "nl"
            ? "Alle cookies zijn verwijderd."
            : "All cookies have been removed.";
        showFeedbackMessage(message);
      });
      revokeAllCookies._hasListener = true;
    }

    // Set up privacy page toggle event delegation
    const privacySettings = document.querySelector(
      ".bg-gray-100.p-6.rounded-lg.mb-6.border.border-gray-200",
    );
    if (privacySettings && !privacySettings._hasToggleListener) {
      privacySettings.addEventListener("click", function (event) {
        const toggleContainer = event.target.closest(".relative.inline-block");
        if (toggleContainer) {
          const toggleInput = toggleContainer.querySelector(
            'input[type="checkbox"]',
          );
          if (toggleInput && !toggleInput.disabled) {
            toggleInput.checked = !toggleInput.checked;
            updateToggleUI(toggleInput);
          }
        }
      });
      privacySettings._hasToggleListener = true;
    }

    // Listen for language change events
    if (!window._languageChangeListenerAttached) {
      document.addEventListener("languageChanged", function () {
        console.log("Language change detected - updating cookie texts");

        // Update cookie banner text
        const cookieBanner = document.querySelector(".cookie-banner");
        if (cookieBanner && cookieBanner.style.display !== "none") {
          const currentLang = window.LanguageManager
            ? window.LanguageManager.getCurrentLanguage()
            : localStorage.getItem("asheLanguage") || "nl";

          if (window.translations && window.translations[currentLang]) {
            const elementsWithKeys =
              cookieBanner.querySelectorAll("[data-lang-key]");
            elementsWithKeys.forEach((element) => {
              const key = element.getAttribute("data-lang-key");
              if (window.translations[currentLang][key]) {
                element.innerHTML = window.translations[currentLang][key];
              }
            });
          }
        }

        // Update cookie modal if it's open
        const cookieModal = document.getElementById("cookie-preferences-modal");
        if (
          cookieModal &&
          (cookieModal.style.display === "block" ||
            cookieModal.style.display === "flex")
        ) {
          translateCookieModal();
        }
      });

      window._languageChangeListenerAttached = true;
    }
  }

  // Execute when DOM is fully loaded
  function onDOMReady() {
    // Initialize toggle elements
    initializeToggleElements();

    // Set up cookie consent listeners
    setupConsentListeners();

    // Initialize enhanced tracking if already consented
    initializeBasedOnConsent();

    // Show cookie banner if no consent yet
    const cookieConsent = consentManager.getConsentStatus();
    if (cookieConsent === null) {
      const cookieBanner = document.querySelector(".cookie-banner");
      if (cookieBanner) {
        // Apply translations before showing
        const currentLang = window.LanguageManager
          ? window.LanguageManager.getCurrentLanguage()
          : localStorage.getItem("asheLanguage") || "nl";

        if (window.translations && window.translations[currentLang]) {
          const elementsWithKeys =
            cookieBanner.querySelectorAll("[data-lang-key]");
          elementsWithKeys.forEach((element) => {
            const key = element.getAttribute("data-lang-key");
            if (window.translations[currentLang][key]) {
              element.innerHTML = window.translations[currentLang][key];
            }
          });
        }

        cookieBanner.style.display = "block";
      }
    }

    console.log("GTM and cookie consent initialized");
  }

  // Check if document is already loaded
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", onDOMReady);
  } else {
    onDOMReady();
  }

  // Expose API for testing and debugging (only in development)
  if (
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1"
  ) {
    window._gtmDebug = {
      version: VERSION,
      load: loadGTM,
      remove: removeGTM,
      isLoaded: isGTMLoaded,
      getConsent: consentManager.getConsentStatus,
      setConsent: consentManager.setConsentStatus,
      clearConsent: consentManager.clearConsentStatus,
    };
  }

  // Make key functions globally accessible
  window.showCookiePreferencesModal = showCookiePreferencesModal;
  window.updateToggleUI = updateToggleUI;
  window.translateCookieModal = translateCookieModal;
  window.saveCookiePreferences = saveCookiePreferences;
  window.initializeToggleElements = initializeToggleElements;
})();

// Enhanced dataLayer initialization
function initializeEnhancedDataLayer() {
  // Only initialize if GTM is being loaded
  if (window[GTM_CONFIG.dataLayerName]) {
    // Push enhanced page view data
    const pageData = {
      event: "page_view_enhanced",
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
      language: document.documentElement.lang || "nl",
      site_section: getSiteSection(),
      user_type: "visitor",
    };

    window[GTM_CONFIG.dataLayerName].push(pageData);
    console.log("Enhanced page tracking initialized:", pageData);
  }
}

// Helper function to determine site section
function getSiteSection() {
  const path = window.location.pathname;
  if (path === "/" || path === "/index.html") return "home";
  if (path.includes("/project")) return "projects";
  if (path.includes("/doneer") || path.includes("/donate")) return "donation";
  if (path.includes("/contact")) return "contact";
  if (path.includes("/wiewijzijn")) return "about";
  if (path.includes("/watwedoen")) return "what-we-do";
  if (path.includes("/blog")) return "blog";
  return "other";
}

// Enhanced event tracking functions
function setupEnhancedEventTracking() {
  // Only set up if GTM is loaded and dataLayer exists
  if (!window[GTM_CONFIG.dataLayerName]) {
    console.warn("Enhanced tracking not initialized - dataLayer not available");
    return;
  }

  console.log("Setting up enhanced GA4 event tracking");

  // Track donation interactions
  trackDonationEvents();

  // Track navigation
  trackNavigationEvents();

  // Track content engagement
  trackContentEngagement();

  // Track form interactions
  trackFormInteractions();

  // Track file downloads
  trackFileDownloads();

  // Track external links
  trackExternalLinks();
}

// Donation tracking (crucial for nonprofits)
function trackDonationEvents() {
  document.addEventListener("click", function (e) {
    const target = e.target.closest(
      'a[href*="doneer"], a[href*="donate"], .donate-btn, [data-donate]',
    );
    if (target && window[GTM_CONFIG.dataLayerName]) {
      window[GTM_CONFIG.dataLayerName].push({
        event: "donation_click",
        event_category: "donation",
        event_action: "click",
        event_label: target.textContent.trim() || "donation_button",
        page_location: window.location.href,
        click_text: target.textContent.trim(),
      });
      console.log("Donation click tracked:", target.textContent.trim());
    }
  });

  // Track donation form submissions
  document.addEventListener("submit", function (e) {
    if (
      e.target.matches('form[action*="donate"], .donation-form') &&
      window[GTM_CONFIG.dataLayerName]
    ) {
      window[GTM_CONFIG.dataLayerName].push({
        event: "donation_form_submit",
        event_category: "donation",
        event_action: "form_submit",
        form_id: e.target.id || "donation_form",
      });
      console.log("Donation form submission tracked");
    }
  });
}

// Navigation tracking
function trackNavigationEvents() {
  document.addEventListener("click", function (e) {
    const link = e.target.closest("a");
    if (link && link.href && window[GTM_CONFIG.dataLayerName]) {
      const isInternal = link.hostname === window.location.hostname;
      const linkText = link.textContent.trim();

      if (isInternal) {
        window[GTM_CONFIG.dataLayerName].push({
          event: "internal_link_click",
          event_category: "navigation",
          event_action: "internal_click",
          event_label: linkText,
          link_url: link.href,
          link_text: linkText,
        });
      }
    }
  });
}

// Content engagement tracking
function trackContentEngagement() {
  // Track video plays
  document.addEventListener("click", function (e) {
    if (
      e.target.closest(".play-btn, [data-video]") &&
      window[GTM_CONFIG.dataLayerName]
    ) {
      window[GTM_CONFIG.dataLayerName].push({
        event: "video_play",
        event_category: "content",
        event_action: "video_play",
        page_location: window.location.href,
      });
      console.log("Video play tracked");
    }
  });

  // Track modal opens
  document.addEventListener("click", function (e) {
    const modalTrigger = e.target.closest("[data-modal], .modal-trigger");
    if (modalTrigger && window[GTM_CONFIG.dataLayerName]) {
      window[GTM_CONFIG.dataLayerName].push({
        event: "modal_open",
        event_category: "content",
        event_action: "modal_view",
        event_label: modalTrigger.dataset.modal || "unknown_modal",
      });
      console.log("Modal open tracked:", modalTrigger.dataset.modal);
    }
  });

  // Track scroll depth
  let scrollDepthTracked = [];
  window.addEventListener(
    "scroll",
    throttle(function () {
      const scrollPercent = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
          100,
      );

      [25, 50, 75, 90].forEach((threshold) => {
        if (
          scrollPercent >= threshold &&
          !scrollDepthTracked.includes(threshold) &&
          window[GTM_CONFIG.dataLayerName]
        ) {
          scrollDepthTracked.push(threshold);
          window[GTM_CONFIG.dataLayerName].push({
            event: "scroll_depth",
            event_category: "content",
            event_action: "scroll",
            event_label: threshold + "%",
            scroll_depth: threshold,
          });
          console.log("Scroll depth tracked:", threshold + "%");
        }
      });
    }, 1000),
  );
}

// Form interaction tracking
function trackFormInteractions() {
  // Track newsletter signups
  document.addEventListener("submit", function (e) {
    if (
      e.target.matches(
        'form[aria-labelledby="newsletter-subtitle"], .newsletter-form',
      ) &&
      window[GTM_CONFIG.dataLayerName]
    ) {
      window[GTM_CONFIG.dataLayerName].push({
        event: "newsletter_signup",
        event_category: "engagement",
        event_action: "form_submit",
        form_name: "newsletter",
      });
      console.log("Newsletter signup tracked");
    }
  });

  // Track contact form submissions
  document.addEventListener("submit", function (e) {
    if (
      e.target.matches('.contact-form, form[action*="contact"]') &&
      window[GTM_CONFIG.dataLayerName]
    ) {
      window[GTM_CONFIG.dataLayerName].push({
        event: "contact_form_submit",
        event_category: "engagement",
        event_action: "form_submit",
        form_name: "contact",
      });
      console.log("Contact form submission tracked");
    }
  });
}

// File download tracking
function trackFileDownloads() {
  document.addEventListener("click", function (e) {
    const link = e.target.closest("a");
    if (link && link.href && window[GTM_CONFIG.dataLayerName]) {
      const fileExtension = link.href.split(".").pop().toLowerCase();
      if (
        ["pdf", "doc", "docx", "xls", "xlsx", "zip"].includes(fileExtension)
      ) {
        window[GTM_CONFIG.dataLayerName].push({
          event: "file_download",
          event_category: "content",
          event_action: "download",
          event_label: link.href,
          file_extension: fileExtension,
          file_name: link.href.split("/").pop(),
        });
        console.log("File download tracked:", link.href.split("/").pop());
      }
    }
  });
}

// External link tracking
function trackExternalLinks() {
  document.addEventListener("click", function (e) {
    const link = e.target.closest("a");
    if (
      link &&
      link.href &&
      link.hostname !== window.location.hostname &&
      window[GTM_CONFIG.dataLayerName]
    ) {
      window[GTM_CONFIG.dataLayerName].push({
        event: "external_link_click",
        event_category: "navigation",
        event_action: "external_click",
        event_label: link.href,
        link_url: link.href,
        link_domain: link.hostname,
      });
      console.log("External link tracked:", link.hostname);
    }
  });
}

// Enhanced language change tracking
function trackLanguageChangeEnhanced(language) {
  if (window[GTM_CONFIG.dataLayerName]) {
    window[GTM_CONFIG.dataLayerName].push({
      event: "language_change",
      event_category: "user_preference",
      event_action: "language_switch",
      event_label: language,
      new_language: language,
    });
    console.log("Language change tracked:", language);
  }
}

// Enhanced cookie consent tracking
function trackConsentChangeEnhanced(consentStatus) {
  if (window[GTM_CONFIG.dataLayerName]) {
    window[GTM_CONFIG.dataLayerName].push({
      event: "consent_update",
      event_category: "privacy",
      event_action: "consent_change",
      event_label: consentStatus,
      consent_status: consentStatus,
    });
    console.log("Consent change tracked:", consentStatus);
  }
}

// Utility function for throttling
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
