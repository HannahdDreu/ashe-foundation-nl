import { translations } from "./translations.js";

export function initSocialShare() {
  const shareButtons = document.querySelectorAll("[data-share-url]");

  shareButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const url = button.getAttribute("data-share-url");
      if (navigator.share) {
        navigator.share({ url }).catch(console.error);
      } else {
        window.open(url, "_blank");
      }
    });
  });

  // Initialize Instagram copy functionality
  initInstagramCopy();
}

function initInstagramCopy() {
  const instagramButton = document.getElementById("instagram-copy");
  const instagramContent = document.getElementById("instagram-content");
  const tooltip = document.getElementById("instagram-tooltip");

  if (!instagramButton || !instagramContent) return;

  instagramButton.addEventListener("click", async () => {
    try {
      await navigator.clipboard.writeText(instagramContent.value.trim());

      // Show success tooltip
      if (tooltip) {
        tooltip.style.opacity = "1";
        setTimeout(() => {
          tooltip.style.opacity = "0";
        }, 2000);
      }

      console.log("Instagram content copied to clipboard");
    } catch (err) {
      console.error("Failed to copy to clipboard:", err);

      // Fallback: select the text
      instagramContent.select();
      document.execCommand("copy");

      if (tooltip) {
        tooltip.style.opacity = "1";
        setTimeout(() => {
          tooltip.style.opacity = "0";
        }, 2000);
      }
    }
  });
}
