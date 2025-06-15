export function initTeamModals() {
  // Make openModal function globally available for onclick handlers in HTML
  window.openModal = openModal;
  window.closeModal = closeCurrentModal;

  // Also handle close buttons
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
