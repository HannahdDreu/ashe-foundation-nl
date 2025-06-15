/**
 * GTM with Google Consent Mode
 */

// Step 1: Initialize consent mode BEFORE GTM loads
window.dataLayer = window.dataLayer || [];
function gtag() {
  dataLayer.push(arguments);
}

// Set default consent to denied (privacy-first)
gtag("consent", "default", {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
});

// Step 2: Load GTM immediately
(function (w, d, s, l, i) {
  w[l] = w[l] || [];
  w[l].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  var f = d.getElementsByTagName(s)[0],
    j = d.createElement(s),
    dl = l != "dataLayer" ? "&l=" + l : "";
  j.async = true;
  j.src = "https://www.googletagmanager.com/gtm.js?id=" + i + dl;
  f.parentNode.insertBefore(j, f);
})(window, document, "script", "dataLayer", "GTM-MDTTVCKD");

// Step 3: Function to update consent
function updateGoogleConsent(analyticsAccepted) {
  gtag("consent", "update", {
    analytics_storage: analyticsAccepted ? "granted" : "denied",
  });

  console.log(
    "Google Consent updated:",
    analyticsAccepted ? "granted" : "denied",
  );
}

// Step 4: Get cookie preferences (from your existing code)
function getCookiePreferences() {
  try {
    const prefs = localStorage.getItem("cookiePreferences");
    return prefs ? JSON.parse(prefs) : { necessary: true, analytics: false };
  } catch (e) {
    console.warn("Error getting cookie preferences:", e);
    return { necessary: true, analytics: false };
  }
}

// Step 5: Set initial consent based on saved preferences
document.addEventListener("DOMContentLoaded", function () {
  const preferences = getCookiePreferences();
  updateGoogleConsent(preferences.analytics);
  console.log(
    "Initial consent set based on preferences:",
    preferences.analytics,
  );
});

// Step 6: Make updateGoogleConsent available globally
window.updateGoogleConsent = updateGoogleConsent;
