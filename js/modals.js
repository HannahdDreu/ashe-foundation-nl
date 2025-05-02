document.addEventListener("DOMContentLoaded", function () {
  // Import safety functions if they exist in the global scope
  const safeQuerySelector =
    window.safeQuerySelector ||
    function (selector, context = document) {
      try {
        return context.querySelector(selector);
      } catch (e) {
        console.warn(`Error selecting ${selector}:`, e);
        return null;
      }
    };

  const safeQuerySelectorAll =
    window.safeQuerySelectorAll ||
    function (selector, context = document) {
      try {
        return context.querySelectorAll(selector);
      } catch (e) {
        console.warn(`Error selecting ${selector}:`, e);
        return [];
      }
    };

    // Graph Modal Functionality
  try {
    const graphModal = document.getElementById("graph-modal");
    const viewGraphBtns = safeQuerySelectorAll(".view-graph-btn");
    const closeModalBtn = document.getElementById("close-modal");
    const nlGraph = document.getElementById("nl-graph");
    const enGraph = document.getElementById("en-graph");

    if (
      graphModal &&
      viewGraphBtns.length &&
      closeModalBtn &&
      nlGraph &&
      enGraph
    ) {
      // Open modal when any view graph button is clicked
      viewGraphBtns.forEach((btn) => {
        btn.addEventListener("click", function () {
          try {
            graphModal.classList.remove("hidden");
            document.body.style.overflow = "hidden"; // Prevent scrolling when modal is open
            graphModal.setAttribute("aria-hidden", "false");

            // Show correct language graph
            const currentLanguage =
              localStorage.getItem("asheLanguage") || "nl";

            if (currentLanguage === "nl") {
              nlGraph.classList.remove("hidden");
              enGraph.classList.add("hidden");
            } else {
              nlGraph.classList.add("hidden");
              enGraph.classList.remove("hidden");
            }
            trapFocusInModal(graphModal);
          } catch (e) {
            console.error("Error opening graph modal:", e);
          }
        });
      });

      // Close modal when close button is clicked
      closeModalBtn.addEventListener("click", function () {
        try {
          graphModal.classList.add("hidden");
          document.body.style.overflow = ""; // Re-enable scrolling
          graphModal.setAttribute("aria-hidden", "true");
        } catch (e) {
          console.error("Error closing graph modal:", e);
        }
      });

      // Close modal when clicking outside of content
      graphModal.addEventListener("click", function (event) {
        try {
          if (event.target === graphModal) {
            graphModal.classList.add("hidden");
            document.body.style.overflow = ""; // Re-enable scrolling
            graphModal.setAttribute("aria-hidden", "true");
          }
        } catch (e) {
          console.error("Error closing graph modal by outside click:", e);
        }
      });

      // Close modal with Escape key
      document.addEventListener("keydown", function (event) {
        try {
          if (
            event.key === "Escape" &&
            !graphModal.classList.contains("hidden")
          ) {
            graphModal.classList.add("hidden");
            document.body.style.overflow = ""; // Re-enable scrolling
            graphModal.setAttribute("aria-hidden", "true");
          }
        } catch (e) {
          console.error("Error closing graph modal with Escape key:", e);
        }
      });
    }
  } catch (e) {
    console.error("Error initializing graph modal:", e);
  }

  // "Wat Wij Doen" page modal functionality
  try {
    // Set up card click handlers
    const missionCard = document.getElementById("mission-card");
    if (missionCard) {
      missionCard.addEventListener("click", function () {
        openModal("mission-modal");
      });
    }

    const strategiesCard = document.getElementById("strategies-card");
    if (strategiesCard) {
      strategiesCard.addEventListener("click", function () {
        openModal("strategies-modal");
      });
    }

    const tocCard = document.getElementById("toc-card");
    if (tocCard) {
      tocCard.addEventListener("click", function () {
        openModal("toc-modal");
      });
    }

    const teamCard = document.getElementById("team-card");
    if (teamCard) {
      teamCard.addEventListener("click", function () {
        openModal("team-modal");
      });
    }

    const partnerCard = document.getElementById("partner-card");
    if (partnerCard) {
      partnerCard.addEventListener("click", function () {
        openModal("partner-modal");
      });
    }

    // Set up close buttons
    safeQuerySelectorAll(".close-modal").forEach((button) => {
      button.addEventListener("click", function () {
        closeCurrentModal();
      });
    });

    // Close modal when clicking outside of it
    window.addEventListener("click", function (event) {
      try {
        if (event.target.classList.contains("modal")) {
          closeCurrentModal();
        }
      } catch (e) {
        console.error("Error closing modal by outside click:", e);
      }
    });

    // Close modal with Escape key
    document.addEventListener("keydown", function (event) {
      try {
        if (event.key === "Escape") {
          closeCurrentModal();
        }
      } catch (e) {
        console.error("Error closing modal with Escape key:", e);
      }
    });

    // Smooth scroll to cards section when clicking on hero CTA
    const cardsLink = safeQuerySelector('a[href="#cards-section"]');
    if (cardsLink) {
      cardsLink.addEventListener("click", function (e) {
        try {
          e.preventDefault();
          const cardsSection = document.getElementById("cards-section");
          if (cardsSection) {
            cardsSection.scrollIntoView({
              behavior: "smooth",
            });
          }
        } catch (e) {
          console.error("Error scrolling to cards section:", e);
        }
      });
    }

    // Add translations for "Read more" button if translations exist
    if (typeof translations !== "undefined") {
      try {
        // Add Dutch translation if not exists
        if (translations.nl && !translations.nl["read-more"]) {
          translations.nl["read-more"] = "Lees meer";
        }

        // Add English translation if not exists
        if (translations.en && !translations.en["read-more"]) {
          translations.en["read-more"] = "Read more";
        }
      } catch (e) {
        console.error("Error adding translations for read more buttons:", e);
      }
    }
  } catch (e) {
    console.error("Error initializing wat-wij-doen page modals:", e);
  }

  // ==========================================
  // COOKIE SETTINGS FUNCTIONALITY
  // ==========================================
  
  // Use translateCookieModal from gtm.js if available, otherwise provide fallback
  window.translateCookieModal = function() {
    // If gtm.js has already defined this function and it's not this one
    if (typeof window.translateCookieModal === 'function' && 
        window.translateCookieModal !== this) {
      // Use the gtm.js version
      return window.translateCookieModal();
    }
    
    // Fallback implementation
    const modal = document.getElementById("cookie-preferences-modal");
    if (!modal) return;
    
    // Get current language
    const currentLang = window.LanguageManager ? 
      window.LanguageManager.getCurrentLanguage() : 
      (localStorage.getItem("asheLanguage") || "nl");
    
    // Apply translations if translations object exists
    if (window.translations && window.translations[currentLang]) {
      // Find all elements with data-lang-key within the modal
      const elementsWithKeys = modal.querySelectorAll("[data-lang-key]");
      elementsWithKeys.forEach(element => {
        const key = element.getAttribute("data-lang-key");
        if (window.translations[currentLang][key]) {
          element.innerHTML = window.translations[currentLang][key];
        }
      });
    }
    
    // Initialize toggles in the modal
    initializeToggles(modal);
  };
  
  // Defers to gtm.js function if available
  function initializeToggles(container) {
    // If gtm.js has already provided this function, use that instead
    if (typeof window.initializeToggleElements === 'function') {
      return window.initializeToggleElements();
    }
    
    if (!container) return;
    
    // Get saved preferences from localStorage
    let preferences = {necessary: true, analytics: false, marketing: false};
    try {
      const stored = localStorage.getItem("cookiePreferences");
      if (stored) {
        preferences = JSON.parse(stored);
      }
    } catch (e) {
      console.warn("Error getting saved cookie preferences:", e);
    }
    
    // Update all toggles in the container
    container.querySelectorAll('input[type="checkbox"]').forEach(toggle => {
      // Set toggle state based on preferences
      if (toggle.id.includes('necessary')) {
        toggle.checked = true; // Always true
      } else if (toggle.id.includes('analytics')) {
        toggle.checked = preferences.analytics;
      } else if (toggle.id.includes('marketing')) {
        toggle.checked = preferences.marketing;
      }
      
      // Update toggle appearance using the standard function if available
      if (typeof window.updateToggleUI === 'function') {
        window.updateToggleUI(toggle);
      } else {
        updateToggleUIFallback(toggle);
      }
    });
  }
  
  // Fallback toggle UI update if gtm.js function isn't available
  function updateToggleUIFallback(toggleInput) {
    if (!toggleInput) return;
    
    // Find toggle container and elements
    const toggleContainer = toggleInput.closest('.relative.inline-block');
    if (!toggleContainer) return;
    
    // Get the track and thumb elements
    const track = toggleContainer.querySelector('span.absolute.inset-0');
    const thumb = toggleContainer.querySelector('span.absolute.h-5.w-5');
    
    if (!track || !thumb) return;
    
    // Apply styles consistently
    if (toggleInput.checked) {
      // Active state - terracotta color
      track.style.backgroundColor = '#E07A5F';
      track.classList.add('bg-terracotta');
      track.classList.remove('bg-gray-200');
      thumb.style.transform = 'translateX(1.5rem)';
    } else {
      // Inactive state - gray color
      track.style.backgroundColor = '#E2E8F0';
      track.classList.remove('bg-terracotta');
      track.classList.add('bg-gray-200');
      thumb.style.transform = 'translateX(0)';
    }
  }

  // Listen for language change events to update cookie texts
  document.addEventListener("languageChanged", function() {
    // Update cookie modal if it's open
    const cookieModal = document.getElementById("cookie-preferences-modal");
    if (cookieModal && cookieModal.style.display !== 'none') {
      if (typeof window.translateCookieModal === 'function') {
        window.translateCookieModal();
      }
    }
  });
  
  // Export updateToggleUI to window if not already defined by gtm.js
  if (typeof window.updateToggleUI !== 'function') {
    window.updateToggleUI = updateToggleUIFallback;
  }
  
  // Export initializeToggles to window if not already defined by gtm.js
  if (typeof window.initializeToggleElements !== 'function') {
    window.initializeToggles = initializeToggles;
  }
});

// Function to open modal
function openModal(modalId) {
  try {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.style.display = "block";
      setTimeout(() => {
        modal.classList.add("show");
        modal.setAttribute("aria-hidden", "false");
      }, 10);

      // Prevent body scrolling
      document.body.style.overflow = "hidden";

      // Set focus on the modal for accessibility
      const closeButton = modal.querySelector(".close-modal");
      if (closeButton) {
        setTimeout(() => {
          closeButton.focus();
          trapFocusInModal(modal);
        }, 100);
      }
    }
  } catch (e) {
    console.error(`Error opening modal ${modalId}:`, e);
  }
}

// Function to close modal
function closeCurrentModal() {
  try {
    const openModal = document.querySelector(".modal.show");
    if (openModal) {
      openModal.classList.remove("show");
      openModal.setAttribute("aria-hidden", "true");

      setTimeout(() => {
        openModal.style.display = "none";
      }, 300);

      // Re-enable body scrolling
      document.body.style.overflow = "";

      // Return focus to the trigger element if possible
      const modalId = openModal.id;
      const trigger = document.querySelector(`[aria-controls="${modalId}"]`);
      if (trigger) {
        trigger.focus();
      }
    }
  } catch (e) {
    console.error("Error closing modal:", e);
  }
}

// Improve modal handling for the graph
function prepareGraphModal(currentLanguage) {
  const nlGraph = document.getElementById("nl-graph");
  const enGraph = document.getElementById("en-graph");
  const modalTitle = document.getElementById("modal-title");
  const modalExplanation = document.querySelector("#graph-modal p[data-lang-key='graph-explanation']");
  
  if (!nlGraph || !enGraph || !modalTitle || !modalExplanation) {
    console.error("Missing some graph modal elements");
    return;
  }
  
  // Update image visibility based on language
  if (currentLanguage === "nl") {
    nlGraph.classList.remove("hidden");
    enGraph.classList.add("hidden");
    
    // Make sure modal title and text is in Dutch
    if (translations && translations.nl) {
      if (translations.nl["water-project-graph"]) {
        modalTitle.textContent = translations.nl["water-project-graph"];
      }
      if (translations.nl["graph-explanation"]) {
        modalExplanation.textContent = translations.nl["graph-explanation"];
      }
    }
  } else {
    nlGraph.classList.add("hidden");
    enGraph.classList.remove("hidden");
    
    // Make sure modal title and text is in English
    if (translations && translations.en) {
      if (translations.en["water-project-graph"]) {
        modalTitle.textContent = translations.en["water-project-graph"];
      }
      if (translations.en["graph-explanation"]) {
        modalExplanation.textContent = translations.en["graph-explanation"];
      }
    } else {
      // Fallback English translations if not defined
      modalTitle.textContent = "Water Project Graph";
      modalExplanation.textContent = "This graph shows the current status of the water project and the funding needed to reach the goal.";
    }
  }
  
  // Force proper sizing for the graph images
  nlGraph.style.maxWidth = "100%";
  nlGraph.style.height = "auto";
  enGraph.style.maxWidth = "100%";
  enGraph.style.height = "auto";
}

// Function to trap keyboard focus within modal for accessibility
function trapFocusInModal(modalElement) {
  const focusableElements = modalElement.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
  );
  
  if (focusableElements.length === 0) return;
  
  const firstElement = focusableElements[0];
  const lastElement = focusableElements[focusableElements.length - 1];
  
  modalElement.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
      if (e.shiftKey && document.activeElement === firstElement) {
        e.preventDefault();
        lastElement.focus();
      } else if (!e.shiftKey && document.activeElement === lastElement) {
        e.preventDefault();
        firstElement.focus();
      }
    }
  });
  
  firstElement.focus();
}

