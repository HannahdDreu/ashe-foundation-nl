import { showFeedbackMessage } from "./utils.js";
import { LanguageManager } from "./language-manager.js";

export function initNewsletterSignup() {
  // Look for the newsletter form using the correct selector
  const form =
    document.querySelector('form[aria-labelledby="newsletter-subtitle"]') ||
    document.getElementById("newsletter-form");

  if (!form) {
    console.log("Newsletter form not found on this page");
    return;
  }

  // Add the feedback message container if it doesn't exist
  if (!form.querySelector("#newsletter-result")) {
    const feedbackEl = document.createElement("div");
    feedbackEl.id = "newsletter-result";
    feedbackEl.className = "hidden rounded-md p-4 mb-4";
    feedbackEl.setAttribute("aria-live", "polite");

    const messagePara = document.createElement("p");
    messagePara.className = "text-sm font-medium";
    feedbackEl.appendChild(messagePara);

    // Insert it at the top of the form
    form.insertBefore(feedbackEl, form.firstChild);
  }

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    try {
      const submitButton = form.querySelector('button[type="submit"]');
      const originalButtonText = submitButton.textContent;

      const email = form.querySelector("#email").value.trim();
      const name = form.querySelector("#name").value.trim();
      const consentCheckbox = form.querySelector("#newsletter-consent");
      const consentChecked = consentCheckbox ? consentCheckbox.checked : false;

      let errors = [];

      if (!email) {
        errors.push(
          LanguageManager.getCurrentLanguage() === "nl"
            ? "E-mailadres is verplicht"
            : "Email address is required",
        );
      } else if (!/\S+@\S+\.\S+/.test(email)) {
        errors.push(
          LanguageManager.getCurrentLanguage() === "nl"
            ? "Voer een geldig e-mailadres in"
            : "Please enter a valid email address",
        );
      }

      if (!name) {
        errors.push(
          LanguageManager.getCurrentLanguage() === "nl"
            ? "Naam is verplicht"
            : "Name is required",
        );
      }

      if (!consentChecked) {
        errors.push(
          LanguageManager.getCurrentLanguage() === "nl"
            ? "Je moet akkoord gaan met onze voorwaarden"
            : "You must agree to our terms",
        );

        if (consentCheckbox) {
          const consentLabel = form.querySelector(
            'label[for="newsletter-consent"]',
          );
          if (consentLabel) {
            consentLabel.classList.add("text-red-600", "font-bold");
            setTimeout(() => {
              consentLabel.classList.remove("text-red-600", "font-bold");
            }, 3000);
          }
        }
      }

      if (errors.length > 0) {
        showFormFeedback(form, errors.join(". "), true);
        return;
      }

      submitButton.disabled = true;
      submitButton.textContent =
        LanguageManager.getCurrentLanguage() === "nl"
          ? "Even geduld..."
          : "Please wait...";

      clearFormFeedback(form);

      const userData = {
        email: email,
        name: name,
      };

      const response = await subscribeViaFunction(userData);

      if (response.success) {
        showFormFeedback(
          form,
          LanguageManager.getCurrentLanguage() === "nl"
            ? "Bedankt voor je aanmelding!"
            : "Thank you for subscribing!",
          false,
        );

        showFeedbackMessage(
          LanguageManager.getCurrentLanguage() === "nl"
            ? "Bedankt voor je aanmelding!"
            : "Thank you for subscribing!",
          5000,
        );

        form.reset();
      } else {
        if (
          response.error &&
          (response.error.includes("exists") ||
            response.error.includes("already subscribed"))
        ) {
          showFormFeedback(
            form,
            LanguageManager.getCurrentLanguage() === "nl"
              ? "Je bent al aangemeld voor onze nieuwsbrief. Bedankt voor je interesse!"
              : "You are already subscribed to our newsletter. Thank you for your interest!",
            false,
          );

          showFeedbackMessage(
            LanguageManager.getCurrentLanguage() === "nl"
              ? "Je bent al aangemeld voor onze nieuwsbrief."
              : "You are already subscribed to our newsletter.",
            5000,
          );
        } else {
          throw new Error(response.error || "An error occurred");
        }
      }
    } catch (error) {
      console.error("Newsletter signup error:", error);

      showFormFeedback(
        form,
        error.message ||
          (LanguageManager.getCurrentLanguage() === "nl"
            ? "Er is iets misgegaan. Probeer het later opnieuw."
            : "Something went wrong. Please try again later."),
        true,
      );

      showFeedbackMessage(
        error.message ||
          (LanguageManager.getCurrentLanguage() === "nl"
            ? "Er is iets misgegaan. Probeer het later opnieuw."
            : "Something went wrong. Please try again later."),
        5000,
        true,
      );
    } finally {
      const submitButton = form.querySelector('button[type="submit"]');
      submitButton.disabled = false;
      submitButton.textContent =
        LanguageManager.getCurrentLanguage() === "nl"
          ? "Inschrijven"
          : "Subscribe";
    }
  });

  async function subscribeViaFunction(userData) {
    try {
      const requestOptions = {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(userData),
      };

      const response = await fetch(
        "/.netlify/functions/subscribe",
        requestOptions,
      );
      const data = await response.json();

      if (response.ok && data && data.success) {
        return { success: true, data: data.data };
      } else {
        return {
          success: false,
          error:
            data.error ||
            (LanguageManager.getCurrentLanguage() === "nl"
              ? "Er is iets misgegaan. Probeer het later opnieuw."
              : "Something went wrong. Please try again later."),
        };
      }
    } catch (error) {
      console.error("API error:", error);
      return {
        success: false,
        error:
          LanguageManager.getCurrentLanguage() === "nl"
            ? "Verbindingsprobleem. Controleer je internetverbinding en probeer het opnieuw."
            : "Connection problem. Please check your internet connection and try again.",
      };
    }
  }

  function showFormFeedback(form, message, isError = false) {
    const feedbackElement = form.querySelector("#newsletter-result");
    if (!feedbackElement) return;

    const feedbackText = feedbackElement.querySelector("p");
    if (feedbackText) {
      feedbackText.textContent = message;
    }

    feedbackElement.classList.remove(
      "hidden",
      "bg-red-50",
      "text-red-800",
      "bg-green-50",
      "text-green-800",
    );

    if (isError) {
      feedbackElement.classList.add("bg-red-50", "text-red-800");
    } else {
      feedbackElement.classList.add("bg-green-50", "text-green-800");
    }
  }

  function clearFormFeedback(form) {
    const feedbackElement = form.querySelector("#newsletter-result");
    if (!feedbackElement) return;

    feedbackElement.classList.add("hidden");
    const feedbackText = feedbackElement.querySelector("p");
    if (feedbackText) {
      feedbackText.textContent = "";
    }
  }
}
