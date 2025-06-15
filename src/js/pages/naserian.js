export function initNaserianPage() {
  const naserianContainer = document.getElementById("naserian-project");
  if (!naserianContainer) return;

  const copyButton = naserianContainer.querySelector("[data-copy]");
  const input = naserianContainer.querySelector("input");

  if (copyButton && input) {
    copyButton.addEventListener("click", () => {
      input.select();
      document.execCommand("copy");
    });
  }
}
