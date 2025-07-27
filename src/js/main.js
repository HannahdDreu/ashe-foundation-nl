import { LanguageManager } from "./language-manager.js";
import { CookieManager } from "./cookie-manager.js";
import { initMobileMenu } from "./ui/menu.js";
import { initTeamCarousel } from "./ui/carousel.js";
import { initLazyLoading } from "./ui/lazyload.js";
import { initVideoPlayer } from "./ui/video.js";
import { initModals } from "./ui/modals.js";
import { initWaterProjectPage } from "./pages/water-project.js";
import { initNaserianPage } from "./pages/naserian.js";
import { initFinancieelPage } from "./pages/financieel.js";
import { initNewsletterSignup } from "./newsletter.js";
import { initSocialShare } from "./social.js";
import { boostInitialPerformance } from "./performance.js";
import { initProjectsCarousel } from "./ui/projects-carousel.js";

document.addEventListener("DOMContentLoaded", () => {
  console.log("Initializing application modules...");

  try {
    // Core language and cookie management
    LanguageManager.initLanguage();
    LanguageManager.initLanguageToggleListeners();
    CookieManager.initCookieBanner();

    // UI Components
    initMobileMenu();
    initTeamCarousel();
    initProjectsCarousel(); 
    initLazyLoading();
    initVideoPlayer(); 
    initModals();

    // Initialize team modals for "Who We Are" page
    initTeamModals();

    // Page-specific initializers
    initWaterProjectPage();
    initNaserianPage();
    initFinancieelPage();

    // Features
    initNewsletterSignup();
    initSocialShare();

    // Update internal links after language is set
    LanguageManager.updateInternalLinksWithLangParam();

    console.log("All modules initialized successfully");
  } catch (error) {
    console.error("Error during module initialization:", error);
  }
});

// Team modals function (for "Who We Are" page)
function initTeamModals() {
  // Make openModal function globally available for onclick handlers in HTML
  window.openModal = openModal;
  window.closeModal = closeCurrentModal;

  // Handle close buttons
  document.querySelectorAll(".close-modal").forEach((button) => {
    button.addEventListener("click", closeCurrentModal);
  });

  // Close modal when clicking outside
  window.addEventListener("click", (e) => {
    if (e.target.classList.contains("modal")) {
      closeCurrentModal();
    }
  });

  // Close modal with Escape key
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeCurrentModal();
    }
  });
}

function openModal(modalId) {
  console.log("Opening modal:", modalId);

  const modal = document.getElementById(modalId);
  if (!modal) {
    console.error("Modal not found:", modalId);
    return;
  }

  // Show the modal
  modal.style.display = "block";
  modal.classList.remove("hidden");
  modal.classList.add("show");
  modal.setAttribute("aria-hidden", "false");

  // Prevent body scrolling
  document.body.style.overflow = "hidden";

  // Focus on close button for accessibility
  const closeButton = modal.querySelector(".close-modal");
  if (closeButton) {
    setTimeout(() => {
      closeButton.focus();
    }, 100);
  }
}

function closeCurrentModal() {
  const modal = document.querySelector(".modal.show, .modal:not(.hidden)");
  if (!modal) return;

  console.log("Closing modal:", modal.id);

  // Hide the modal
  modal.classList.remove("show");
  modal.classList.add("hidden");
  modal.setAttribute("aria-hidden", "true");

  // Restore body scrolling
  document.body.style.overflow = "";

  // Fade out effect
  setTimeout(() => {
    modal.style.display = "none";
  }, 300);
}

// Initialize performance optimizations on window load
window.addEventListener("load", () => {
  try {
    boostInitialPerformance();
    console.log("Performance optimizations applied");
  } catch (error) {
    console.error("Error applying performance optimizations:", error);
  }
});
