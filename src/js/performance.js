export function boostInitialPerformance() {
  const heavyScripts = document.querySelectorAll("[data-defer-script]");
  heavyScripts.forEach((script) => {
    const newScript = document.createElement("script");
    newScript.src = script.getAttribute("data-defer-script");
    newScript.defer = true;
    document.body.appendChild(newScript);
  });
}
