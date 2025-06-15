import { safeQuerySelector, safeQuerySelectorAll } from "../utils.js";
import { LanguageManager } from "../language-manager.js";

export function initModals() {
  // Graph Modal
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
    viewGraphBtns.forEach((btn) => {
      btn.addEventListener("click", function () {
        try {
          graphModal.classList.remove("hidden");
          document.body.style.overflow = "hidden";
          graphModal.setAttribute("aria-hidden", "false");

          const currentLanguage = LanguageManager.getCurrentLanguage();
          prepareGraphModal(currentLanguage);
          trapFocusInModal(graphModal);
        } catch (e) {
          console.error("Error opening graph modal:", e);
        }
      });
    });

    closeModalBtn.addEventListener("click", () => closeModal(graphModal));
    graphModal.addEventListener("click", (e) => {
      if (e.target === graphModal) closeModal(graphModal);
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !graphModal.classList.contains("hidden")) {
        closeModal(graphModal);
      }
    });
  }

  // 'Wat Wij Doen' modals
  const modalCards = ["mission", "strategies", "toc", "team", "partner"];
  modalCards.forEach((id) => {
    const card = document.getElementById(`${id}-card`);
    if (card) {
      card.addEventListener("click", () => openModal(`${id}-modal`));
    }
  });

  safeQuerySelectorAll(".close-modal").forEach((btn) => {
    btn.addEventListener("click", () => closeCurrentModal());
  });

  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) closeCurrentModal();
  });

  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeCurrentModal();
  });

  const cardsLink = safeQuerySelector('a[href="#cards-section"]');
  if (cardsLink) {
    cardsLink.addEventListener("click", function (e) {
      e.preventDefault();
      const cardsSection = document.getElementById("cards-section");
      if (cardsSection) {
        cardsSection.scrollIntoView({ behavior: "smooth" });
      }
    });
  }

  // Listen for language changes
  document.addEventListener("languageChanged", function () {
    const cookieModal = document.getElementById("cookie-preferences-modal");
    if (cookieModal && cookieModal.style.display !== "none") {
      translateCookieModal();
    }
  });

  // Set up global functions for cookie modal
  if (typeof window.updateToggleUI !== "function") {
    window.updateToggleUI = updateToggleUIFallback;
  }
  if (typeof window.initializeToggleElements !== "function") {
    window.initializeToggles = initializeToggles;
  }
  window.translateCookieModal = translateCookieModal;
}

function openModal(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;

  modal.style.display = "block";
  setTimeout(() => {
    modal.classList.add("show");
    modal.setAttribute("aria-hidden", "false");
  }, 10);
  document.body.style.overflow = "hidden";

  const closeButton = modal.querySelector(".close-modal");
  if (closeButton) {
    setTimeout(() => {
      closeButton.focus();
      trapFocusInModal(modal);
    }, 100);
  }
}

function closeModal(modal) {
  modal.classList.add("hidden");
  document.body.style.overflow = "";
  modal.setAttribute("aria-hidden", "true");
}

function closeCurrentModal() {
  const modal = document.querySelector(".modal.show");
  if (!modal) return;

  modal.classList.remove("show");
  modal.setAttribute("aria-hidden", "true");
  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
  document.body.style.overflow = "";

  const modalId = modal.id;
  const trigger = document.querySelector(`[aria-controls="${modalId}"]`);
  if (trigger) trigger.focus();
}

function prepareGraphModal(currentLanguage) {
  const nlGraph = document.getElementById("nl-graph");
  const enGraph = document.getElementById("en-graph");
  const modalTitle = document.getElementById("modal-title");
  const modalExplanation = document.querySelector(
    '#graph-modal p[data-lang-key="graph-explanation"]',
  );

  if (!nlGraph || !enGraph || !modalTitle || !modalExplanation) return;

  // Use global translations object
  const translations = window.translations;
  if (!translations) return;

  if (currentLanguage === "nl") {
    nlGraph.classList.remove("hidden");
    enGraph.classList.add("hidden");
    modalTitle.textContent = translations.nl["water-project-graph"] || "";
    modalExplanation.textContent = translations.nl["graph-explanation"] || "";
  } else {
    nlGraph.classList.add("hidden");
    enGraph.classList.remove("hidden");
    modalTitle.textContent =
      translations.en["water-project-graph"] || "Water Project Graph";
    modalExplanation.textContent =
      translations.en["graph-explanation"] ||
      "This graph shows the current status of the water project and the funding needed to reach the goal.";
  }

  nlGraph.style.maxWidth = enGraph.style.maxWidth = "100%";
  nlGraph.style.height = enGraph.style.height = "auto";
}

function translateCookieModal() {
  const modal = document.getElementById("cookie-preferences-modal");
  if (!modal) return;

  const currentLang = LanguageManager.getCurrentLanguage();
  const translations = window.translations;

  if (translations && translations[currentLang]) {
    modal.querySelectorAll("[data-lang-key]").forEach((el) => {
      const key = el.getAttribute("data-lang-key");
      if (translations[currentLang][key]) {
        el.innerHTML = translations[currentLang][key];
      }
    });
  }
  initializeToggles(modal);
}

function initializeToggles(container) {
  if (!container) return;
  let preferences = { necessary: true, analytics: false, marketing: false };
  try {
    const stored = localStorage.getItem("cookiePreferences");
    if (stored) preferences = JSON.parse(stored);
  } catch (e) {
    console.warn("Error getting saved cookie preferences:", e);
  }

  container.querySelectorAll('input[type="checkbox"]').forEach((toggle) => {
    if (toggle.id.includes("necessary")) toggle.checked = true;
    if (toggle.id.includes("analytics")) toggle.checked = preferences.analytics;
    if (toggle.id.includes("marketing")) toggle.checked = preferences.marketing;

    if (typeof window.updateToggleUI === "function") {
      window.updateToggleUI(toggle);
    } else {
      updateToggleUIFallback(toggle);
    }
  });
}

function updateToggleUIFallback(toggleInput) {
  if (!toggleInput) return;
  const toggleContainer = toggleInput.closest(".relative.inline-block");
  if (!toggleContainer) return;

  const track = toggleContainer.querySelector("span.absolute.inset-0");
  const thumb = toggleContainer.querySelector("span.absolute.h-5.w-5");
  if (!track || !thumb) return;

  if (toggleInput.checked) {
    track.style.backgroundColor = "#E07A5F";
    track.classList.add("bg-terracotta");
    track.classList.remove("bg-gray-200");
    thumb.style.transform = "translateX(1.5rem)";
  } else {
    track.style.backgroundColor = "#E2E8F0";
    track.classList.remove("bg-terracotta");
    track.classList.add("bg-gray-200");
    thumb.style.transform = "translateX(0)";
  }
}

function trapFocusInModal(modalElement) {
  const focusableElements = modalElement.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  if (!focusableElements.length) return;

  const first = focusableElements[0];
  const last = focusableElements[focusableElements.length - 1];
  modalElement.addEventListener("keydown", function (e) {
    if (e.key === "Tab") {
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  });
  first.focus();
}
