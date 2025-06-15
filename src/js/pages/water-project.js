export function initWaterProjectPage() {
  const form = document.getElementById("donation-form");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const formData = new FormData(form);
    const queryString = new URLSearchParams(formData).toString();
    const baseUrl = form.getAttribute("action");
    window.location.href = `${baseUrl}?${queryString}`;
  });
}
