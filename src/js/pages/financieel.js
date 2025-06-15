import { LanguageManager } from "../language-manager.js";

export function initFinancieelPage() {
  console.log("Initializing financieel page...");

  // Check if we're actually on the financieel page
  if (!window.location.pathname.includes("financieel")) {
    console.log("Not on financieel page, skipping initialization");
    return;
  }

  // Verify LanguageManager is available
  console.log("LanguageManager available?", typeof LanguageManager);
  console.log(
    "LanguageManager.switchLanguage?",
    typeof LanguageManager.switchLanguage,
  );
  console.log("window.switchLanguage?", typeof window.switchLanguage);

  // Check if language toggle buttons exist
  console.log("Language toggle buttons found:", {
    "lang-nl": !!document.getElementById("lang-nl"),
    "lang-en": !!document.getElementById("lang-en"),
    "lang-nl-desktop": !!document.getElementById("lang-nl-desktop"),
    "lang-en-desktop": !!document.getElementById("lang-en-desktop"),
  });

  // Handle language-specific annual report sections
  updateAnnualReportSections();

  // Listen for language changes
  document.addEventListener("languageChanged", function (event) {
    console.log("Language changed on financieel page:", event.detail.language);
    updateAnnualReportSections();
  });

  // Handle any toggle functionality if it exists
  const toggle = document.querySelector("[data-toggle]");
  const details = document.querySelector("[data-details]");

  if (toggle && details) {
    toggle.addEventListener("click", () => {
      details.classList.toggle("hidden");
    });
  }
}

function updateAnnualReportSections() {
  const currentLang = LanguageManager.getCurrentLanguage();
  console.log("Updating financieel page for language:", currentLang);

  // Toggle annual report sections based on language
  const annualReportNl = document.getElementById("annual-report-nl");
  const annualReportEn = document.getElementById("annual-report-en");

  if (annualReportNl && annualReportEn) {
    if (currentLang === "nl") {
      annualReportNl.classList.remove("hidden");
      annualReportEn.classList.add("hidden");
      console.log("Showing Dutch annual report section");
    } else {
      annualReportNl.classList.add("hidden");
      annualReportEn.classList.remove("hidden");
      console.log("Showing English annual report section");
    }
  } else {
    console.warn("Annual report sections not found:", {
      annualReportNl: !!annualReportNl,
      annualReportEn: !!annualReportEn,
    });
  }

  // Update any other language-specific content
  updateLanguageSpecificContent(currentLang);
}

function updateLanguageSpecificContent(currentLang) {
  // Update any language-specific content blocks if they exist
  const nlContent = document.querySelectorAll('.content-nl, [data-lang="nl"]');
  const enContent = document.querySelectorAll('.content-en, [data-lang="en"]');

  nlContent.forEach((element) => {
    if (currentLang === "nl") {
      element.classList.remove("hidden");
    } else {
      element.classList.add("hidden");
    }
  });

  enContent.forEach((element) => {
    if (currentLang === "en") {
      element.classList.remove("hidden");
    } else {
      element.classList.add("hidden");
    }
  });
}
