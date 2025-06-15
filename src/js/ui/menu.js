import { safeQuerySelector } from "../utils.js";

export function initMobileMenu() {
  const mobileToggle = safeQuerySelector(
    '[data-collapse-toggle="mobile-menu"]',
  );
  const mobileMenu = document.getElementById("mobile-menu");

  if (mobileToggle && mobileMenu) {
    mobileToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("hidden");
    });
  }
}
