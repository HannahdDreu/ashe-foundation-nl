(function () {
  const t = document.createElement("link").relList;
  if (t && t.supports && t.supports("modulepreload")) return;
  for (const r of document.querySelectorAll('link[rel="modulepreload"]')) s(r);
  new MutationObserver((r) => {
    for (const d of r)
      if (d.type === "childList")
        for (const m of d.addedNodes)
          m.tagName === "LINK" && m.rel === "modulepreload" && s(m);
  }).observe(document, { childList: !0, subtree: !0 });
  function n(r) {
    const d = {};
    return (
      r.integrity && (d.integrity = r.integrity),
      r.referrerPolicy && (d.referrerPolicy = r.referrerPolicy),
      r.crossOrigin === "use-credentials"
        ? (d.credentials = "include")
        : r.crossOrigin === "anonymous"
          ? (d.credentials = "omit")
          : (d.credentials = "same-origin"),
      d
    );
  }
  function s(r) {
    if (r.ep) return;
    r.ep = !0;
    const d = n(r);
    fetch(r.href, d);
  }
})();
const g = { dataLayerName: "dataLayer" };
(function () {
  const e = "1.3.0";
  let t = {
    getConsentStatus: function () {
      try {
        return localStorage.getItem("cookieConsent");
      } catch (a) {
        return console.warn("Error accessing localStorage:", a), null;
      }
    },
    setConsentStatus: function (a) {
      try {
        return localStorage.setItem("cookieConsent", a), !0;
      } catch (o) {
        return console.warn("Error setting localStorage:", o), !1;
      }
    },
    clearConsentStatus: function () {
      try {
        return localStorage.removeItem("cookieConsent"), !0;
      } catch (a) {
        return console.warn("Error clearing localStorage:", a), !1;
      }
    },
  };
  function n() {
    return typeof window[g.dataLayerName] < "u";
  }
  function s() {
    if (!n())
      return (
        console.warn("GTM not loaded by consent mode - this shouldn't happen"),
        !1
      );
    try {
      return console.log("Setting up enhanced GTM tracking"), x(), M(), !0;
    } catch (a) {
      return console.error("Error setting up enhanced GTM tracking:", a), !1;
    }
  }
  function r() {
    try {
      return console.log("Disabling GTM tracking via consent mode"), !0;
    } catch (a) {
      return console.error("Error disabling GTM tracking:", a), !1;
    }
  }
  function d(a) {
    const o = document.createElement("div");
    (o.style.position = "fixed"),
      (o.style.bottom = "20px"),
      (o.style.left = "50%"),
      (o.style.transform = "translateX(-50%)"),
      (o.style.padding = "10px 20px"),
      (o.style.backgroundColor = "#57CC99"),
      (o.style.color = "white"),
      (o.style.borderRadius = "4px"),
      (o.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)"),
      (o.style.zIndex = "9999"),
      (o.textContent = a),
      document.body.appendChild(o),
      setTimeout(() => {
        document.body.contains(o) && document.body.removeChild(o);
      }, 3e3);
  }
  function m() {
    try {
      const a = localStorage.getItem("cookiePreferences");
      return a ? JSON.parse(a) : { necessary: !0, analytics: !1 };
    } catch (a) {
      return (
        console.warn("Error getting cookie preferences:", a),
        { necessary: !0, analytics: !1 }
      );
    }
  }
  function i() {
    console.log("Opening cookie preferences modal");
    const a = document.getElementById("cookie-preferences-modal");
    if (!a) {
      console.warn("Cookie preferences modal not found in the HTML");
      return;
    }
    c(),
      (a.style.display = "block"),
      setTimeout(() => {
        a.classList.add("show");
      }, 10),
      (document.body.style.overflow = "hidden"),
      y(),
      v(a),
      R(a);
  }
  function c() {
    try {
      const a = m(),
        o = document.getElementById("analytics-cookies"),
        l = document.getElementById("marketing-cookies");
      o && ((o.checked = a.analytics), k(o)),
        l && ((l.checked = !1), k(l)),
        console.log("Updated modal toggles with preferences:", a);
    } catch (a) {
      console.error("Error updating modal toggles:", a);
    }
  }
  function v(a) {
    const o = a.querySelector(".close-modal");
    o &&
      !o._hasListener &&
      (o.addEventListener("click", function () {
        (a.style.display = "none"), (document.body.style.overflow = "");
      }),
      (o._hasListener = !0));
    const l = a.querySelector("#save-cookie-preferences");
    l &&
      !l._hasListener &&
      (l.addEventListener("click", function () {
        j();
      }),
      (l._hasListener = !0));
    const u = a.querySelector("#close-cookie-preferences");
    u &&
      !u._hasListener &&
      (u.addEventListener("click", function () {
        (a.style.display = "none"), (document.body.style.overflow = "");
      }),
      (u._hasListener = !0)),
      a._hasOutsideClickListener ||
        (a.addEventListener("click", function (h) {
          h.target === a &&
            ((a.style.display = "none"), (document.body.style.overflow = ""));
        }),
        (a._hasOutsideClickListener = !0)),
      a._hasToggleListener ||
        (a.addEventListener("click", function (h) {
          const b = h.target.closest(".relative.inline-block");
          if (b) {
            const p = b.querySelector('input[type="checkbox"]');
            p &&
              !p.disabled &&
              ((p.checked = !p.checked),
              console.log(`Toggle ${p.id} clicked, new state:`, p.checked),
              typeof window.updateToggleUI == "function" &&
                window.updateToggleUI(p));
          }
        }),
        (a._hasToggleListener = !0));
  }
  function y() {
    const a = document.getElementById("cookie-preferences-modal");
    if (!a) {
      console.warn("Cookie modal not found for translation");
      return;
    }
    const o = window.LanguageManager
      ? window.LanguageManager.getCurrentLanguage()
      : localStorage.getItem("asheLanguage") || "nl";
    console.log("Translating cookie modal to:", o),
      window.translations && window.translations[o]
        ? (a.querySelectorAll("[data-lang-key]").forEach((u) => {
            const h = u.getAttribute("data-lang-key");
            window.translations[o][h]
              ? (u.innerHTML = window.translations[o][h])
              : console.warn(
                  `Missing translation for key "${h}" in language "${o}"`,
                );
          }),
          console.log("Cookie modal translation completed"))
        : console.warn("Translations not available for language:", o);
  }
  function k(a) {
    if (!a) {
      console.warn("No toggle element provided to updateToggleUI");
      return;
    }
    const o = a.closest(".relative.inline-block") || a.parentNode;
    if (!o) {
      console.warn("Toggle container not found for", a.id);
      return;
    }
    const l =
        o.querySelector("span.absolute.inset-0") ||
        o.querySelector("span:nth-child(2)") ||
        o.querySelectorAll("span")[0],
      u =
        o.querySelector("span.absolute.h-5.w-5") ||
        o.querySelector("span:nth-child(3)") ||
        o.querySelectorAll("span")[1];
    if (!l || !u) {
      console.warn("Toggle UI elements not found for", a.id);
      return;
    }
    a.checked
      ? ((l.style.backgroundColor = "#E07A5F"),
        l.classList.add("bg-terracotta"),
        l.classList.remove("bg-gray-200"),
        (u.style.transform = "translateX(1.5rem)"))
      : ((l.style.backgroundColor = "#E2E8F0"),
        l.classList.remove("bg-terracotta"),
        l.classList.add("bg-gray-200"),
        (u.style.transform = "translateX(0)"));
  }
  function j() {
    try {
      const a = document.getElementById("analytics-cookies"),
        o = document.getElementById("analytics-cookies-privacy");
      let l;
      const u = document.getElementById("cookie-preferences-modal");
      if (
        (u && (u.style.display === "block" || u.style.display === "flex")
          ? (l = a)
          : (l = o),
        l || (l = a || o),
        !l)
      ) {
        console.warn("Could not find any analytics toggle element");
        return;
      }
      const h = l.checked;
      console.log("Toggle state before saving:", h);
      const b = { necessary: !0, analytics: h };
      console.log("Saving cookie preferences:", b),
        localStorage.setItem("cookiePreferences", JSON.stringify(b)),
        typeof window.updateGoogleConsent == "function" &&
          window.updateGoogleConsent(b.analytics),
        b.analytics
          ? (localStorage.setItem("cookieConsent", "accepted"),
            setTimeout(() => {
              x(), M();
            }, 500))
          : localStorage.setItem("cookieConsent", "declined");
      const f =
        (window.LanguageManager
          ? window.LanguageManager.getCurrentLanguage()
          : localStorage.getItem("asheLanguage") || "nl") === "nl"
          ? "Cookie instellingen opgeslagen."
          : "Cookie settings saved.";
      d(f),
        a && a !== l && ((a.checked = b.analytics), k(a)),
        o && o !== l && ((o.checked = b.analytics), k(o));
      const w = document.querySelector(".cookie-banner");
      w && (w.style.display = "none"),
        u &&
          (u.style.display === "block" || u.style.display === "flex") &&
          ((u.style.display = "none"), (document.body.style.overflow = ""));
    } catch (a) {
      console.error("Error saving cookie preferences:", a);
    }
  }
  function R(a) {
    const o = a.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
    );
    if (o.length === 0) return;
    const l = o[0],
      u = o[o.length - 1];
    l.focus(),
      a._keydownHandler && a.removeEventListener("keydown", a._keydownHandler),
      (a._keydownHandler = function (h) {
        h.key === "Tab"
          ? h.shiftKey && document.activeElement === l
            ? (h.preventDefault(), u.focus())
            : !h.shiftKey &&
              document.activeElement === u &&
              (h.preventDefault(), l.focus())
          : h.key === "Escape" &&
            ((a.style.display = "none"), (document.body.style.overflow = ""));
      }),
      a.addEventListener("keydown", a._keydownHandler);
  }
  function G() {
    const a = t.getConsentStatus(),
      o = m();
    a === "accepted" || (o.analytics && a !== "declined")
      ? (console.log("Setting up enhanced tracking - user has consented"),
        setTimeout(() => {
          x(), M();
        }, 500),
        B("granted"))
      : (console.log("GTM loaded but analytics disabled via consent"),
        B("denied"));
  }
  function E() {
    try {
      const a = m();
      console.log("Initializing toggle elements with preferences:", a);
      const o = document.getElementById("analytics-cookies-privacy"),
        l = document.getElementById("marketing-cookies-privacy");
      if (
        (o && ((o.checked = a.analytics), k(o)),
        l && ((l.checked = !1), k(l)),
        document.getElementById("cookie-preferences-modal"))
      ) {
        const h = document.getElementById("analytics-cookies");
        h && ((h.checked = a.analytics), k(h));
      }
      console.log("Toggle elements initialized with saved preferences");
    } catch (a) {
      console.error("Error initializing toggle elements:", a);
    }
  }
  function V() {
    console.log("Setting up consent listeners");
    const a = document.getElementById("cookie-preferences-button");
    a &&
      !a._hasListener &&
      (console.log("Found preferences button, attaching listener"),
      a.addEventListener("click", function (p) {
        p.preventDefault(), console.log("Preferences button clicked"), i();
        const f = document.querySelector(".cookie-banner");
        f && (f.style.display = "none");
      }),
      (a._hasListener = !0));
    const o = document.getElementById("rcc-confirm-button");
    o &&
      !o._hasListener &&
      (o.addEventListener("click", function () {
        localStorage.setItem(
          "cookiePreferences",
          JSON.stringify({ necessary: !0, analytics: !0 }),
        ),
          t.setConsentStatus("accepted"),
          typeof window.updateGoogleConsent == "function" &&
            window.updateGoogleConsent(!0),
          setTimeout(() => {
            x(), M();
          }, 500);
        const f =
          (window.LanguageManager
            ? window.LanguageManager.getCurrentLanguage()
            : localStorage.getItem("asheLanguage") || "nl") === "nl"
            ? "Cookie instellingen opgeslagen."
            : "Cookie settings saved.";
        d(f);
        const w = document.querySelector(".cookie-banner");
        w && (w.style.display = "none");
      }),
      (o._hasListener = !0));
    const l = document.getElementById("rcc-decline-button");
    l &&
      !l._hasListener &&
      (l.addEventListener("click", function () {
        localStorage.setItem(
          "cookiePreferences",
          JSON.stringify({ necessary: !0, analytics: !1 }),
        ),
          t.setConsentStatus("declined"),
          typeof window.updateGoogleConsent == "function" &&
            window.updateGoogleConsent(!1);
        const f =
          (window.LanguageManager
            ? window.LanguageManager.getCurrentLanguage()
            : localStorage.getItem("asheLanguage") || "nl") === "nl"
            ? "Cookie instellingen opgeslagen. Tracking is uitgeschakeld."
            : "Cookie settings saved. Tracking is disabled.";
        d(f);
        const w = document.querySelector(".cookie-banner");
        w && (w.style.display = "none");
      }),
      (l._hasListener = !0));
    const u = document.getElementById("save-cookie-preferences");
    u &&
      !u._hasListener &&
      (u.addEventListener("click", function () {
        j();
      }),
      (u._hasListener = !0));
    const h = document.getElementById("revoke-all-cookies");
    h &&
      !h._hasListener &&
      (h.addEventListener("click", function () {
        localStorage.setItem(
          "cookiePreferences",
          JSON.stringify({ necessary: !0, analytics: !1 }),
        ),
          t.setConsentStatus("declined"),
          typeof window.updateGoogleConsent == "function" &&
            window.updateGoogleConsent(!1);
        const p = document.getElementById("analytics-cookies-privacy");
        p && ((p.checked = !1), k(p));
        const f = document.getElementById("analytics-cookies");
        f && ((f.checked = !1), k(f));
        const I =
          (window.LanguageManager
            ? window.LanguageManager.getCurrentLanguage()
            : localStorage.getItem("asheLanguage") || "nl") === "nl"
            ? "Alle cookies zijn verwijderd."
            : "All cookies have been removed.";
        d(I);
      }),
      (h._hasListener = !0));
    const b = document.querySelector(
      ".bg-gray-100.p-6.rounded-lg.mb-6.border.border-gray-200",
    );
    b &&
      !b._hasToggleListener &&
      (b.addEventListener("click", function (p) {
        const f = p.target.closest(".relative.inline-block");
        if (f) {
          const w = f.querySelector('input[type="checkbox"]');
          w && !w.disabled && ((w.checked = !w.checked), k(w));
        }
      }),
      (b._hasToggleListener = !0)),
      window._languageChangeListenerAttached ||
        (document.addEventListener("languageChanged", function () {
          console.log("Language change detected - updating cookie texts");
          const p = document.querySelector(".cookie-banner");
          if (p && p.style.display !== "none") {
            const w = window.LanguageManager
              ? window.LanguageManager.getCurrentLanguage()
              : localStorage.getItem("asheLanguage") || "nl";
            window.translations &&
              window.translations[w] &&
              p.querySelectorAll("[data-lang-key]").forEach((N) => {
                const C = N.getAttribute("data-lang-key");
                window.translations[w][C] &&
                  (N.innerHTML = window.translations[w][C]);
              });
          }
          const f = document.getElementById("cookie-preferences-modal");
          f &&
            (f.style.display === "block" || f.style.display === "flex") &&
            y();
        }),
        (window._languageChangeListenerAttached = !0));
  }
  function F() {
    if ((E(), V(), G(), t.getConsentStatus() === null)) {
      const o = document.querySelector(".cookie-banner");
      if (o) {
        const l = window.LanguageManager
          ? window.LanguageManager.getCurrentLanguage()
          : localStorage.getItem("asheLanguage") || "nl";
        window.translations &&
          window.translations[l] &&
          o.querySelectorAll("[data-lang-key]").forEach((h) => {
            const b = h.getAttribute("data-lang-key");
            window.translations[l][b] &&
              (h.innerHTML = window.translations[l][b]);
          }),
          (o.style.display = "block");
      }
    }
    console.log("GTM and cookie consent initialized");
  }
  document.readyState === "loading"
    ? document.addEventListener("DOMContentLoaded", F)
    : F(),
    (window.location.hostname === "localhost" ||
      window.location.hostname === "127.0.0.1") &&
      (window._gtmDebug = {
        version: e,
        load: s,
        remove: r,
        isLoaded: n,
        getConsent: t.getConsentStatus,
        setConsent: t.setConsentStatus,
        clearConsent: t.clearConsentStatus,
      }),
    (window.showCookiePreferencesModal = i),
    (window.updateToggleUI = k),
    (window.translateCookieModal = y),
    (window.saveCookiePreferences = j),
    (window.initializeToggleElements = E);
})();
function x() {
  if (window[g.dataLayerName]) {
    const e = {
      event: "page_view_enhanced",
      page_title: document.title,
      page_location: window.location.href,
      page_path: window.location.pathname,
      language: document.documentElement.lang || "nl",
      site_section: J(),
      user_type: "visitor",
    };
    window[g.dataLayerName].push(e),
      console.log("Enhanced page tracking initialized:", e);
  }
}
function J() {
  const e = window.location.pathname;
  return e === "/" || e === "/index.html"
    ? "home"
    : e.includes("/project")
      ? "projects"
      : e.includes("/doneer") || e.includes("/donate")
        ? "donation"
        : e.includes("/contact")
          ? "contact"
          : e.includes("/wiewijzijn")
            ? "about"
            : e.includes("/watwedoen")
              ? "what-we-do"
              : e.includes("/blog")
                ? "blog"
                : "other";
}
function M() {
  if (!window[g.dataLayerName]) {
    console.warn("Enhanced tracking not initialized - dataLayer not available");
    return;
  }
  console.log("Setting up enhanced GA4 event tracking"),
    K(),
    U(),
    Z(),
    Y(),
    $(),
    X();
}
function K() {
  document.addEventListener("click", function (e) {
    const t = e.target.closest(
      'a[href*="doneer"], a[href*="donate"], .donate-btn, [data-donate]',
    );
    t &&
      window[g.dataLayerName] &&
      (window[g.dataLayerName].push({
        event: "donation_click",
        event_category: "donation",
        event_action: "click",
        event_label: t.textContent.trim() || "donation_button",
        page_location: window.location.href,
        click_text: t.textContent.trim(),
      }),
      console.log("Donation click tracked:", t.textContent.trim()));
  }),
    document.addEventListener("submit", function (e) {
      e.target.matches('form[action*="donate"], .donation-form') &&
        window[g.dataLayerName] &&
        (window[g.dataLayerName].push({
          event: "donation_form_submit",
          event_category: "donation",
          event_action: "form_submit",
          form_id: e.target.id || "donation_form",
        }),
        console.log("Donation form submission tracked"));
    });
}
function U() {
  document.addEventListener("click", function (e) {
    const t = e.target.closest("a");
    if (t && t.href && window[g.dataLayerName]) {
      const n = t.hostname === window.location.hostname,
        s = t.textContent.trim();
      n &&
        window[g.dataLayerName].push({
          event: "internal_link_click",
          event_category: "navigation",
          event_action: "internal_click",
          event_label: s,
          link_url: t.href,
          link_text: s,
        });
    }
  });
}
function Z() {
  document.addEventListener("click", function (t) {
    t.target.closest(".play-btn, [data-video]") &&
      window[g.dataLayerName] &&
      (window[g.dataLayerName].push({
        event: "video_play",
        event_category: "content",
        event_action: "video_play",
        page_location: window.location.href,
      }),
      console.log("Video play tracked"));
  }),
    document.addEventListener("click", function (t) {
      const n = t.target.closest("[data-modal], .modal-trigger");
      n &&
        window[g.dataLayerName] &&
        (window[g.dataLayerName].push({
          event: "modal_open",
          event_category: "content",
          event_action: "modal_view",
          event_label: n.dataset.modal || "unknown_modal",
        }),
        console.log("Modal open tracked:", n.dataset.modal));
    });
  let e = [];
  window.addEventListener(
    "scroll",
    Q(function () {
      const t = Math.round(
        (window.scrollY / (document.body.scrollHeight - window.innerHeight)) *
          100,
      );
      [25, 50, 75, 90].forEach((n) => {
        t >= n &&
          !e.includes(n) &&
          window[g.dataLayerName] &&
          (e.push(n),
          window[g.dataLayerName].push({
            event: "scroll_depth",
            event_category: "content",
            event_action: "scroll",
            event_label: n + "%",
            scroll_depth: n,
          }),
          console.log("Scroll depth tracked:", n + "%"));
      });
    }, 1e3),
  );
}
function Y() {
  document.addEventListener("submit", function (e) {
    e.target.matches(
      'form[aria-labelledby="newsletter-subtitle"], .newsletter-form',
    ) &&
      window[g.dataLayerName] &&
      (window[g.dataLayerName].push({
        event: "newsletter_signup",
        event_category: "engagement",
        event_action: "form_submit",
        form_name: "newsletter",
      }),
      console.log("Newsletter signup tracked"));
  }),
    document.addEventListener("submit", function (e) {
      e.target.matches('.contact-form, form[action*="contact"]') &&
        window[g.dataLayerName] &&
        (window[g.dataLayerName].push({
          event: "contact_form_submit",
          event_category: "engagement",
          event_action: "form_submit",
          form_name: "contact",
        }),
        console.log("Contact form submission tracked"));
    });
}
function $() {
  document.addEventListener("click", function (e) {
    const t = e.target.closest("a");
    if (t && t.href && window[g.dataLayerName]) {
      const n = t.href.split(".").pop().toLowerCase();
      ["pdf", "doc", "docx", "xls", "xlsx", "zip"].includes(n) &&
        (window[g.dataLayerName].push({
          event: "file_download",
          event_category: "content",
          event_action: "download",
          event_label: t.href,
          file_extension: n,
          file_name: t.href.split("/").pop(),
        }),
        console.log("File download tracked:", t.href.split("/").pop()));
    }
  });
}
function X() {
  document.addEventListener("click", function (e) {
    const t = e.target.closest("a");
    t &&
      t.href &&
      t.hostname !== window.location.hostname &&
      window[g.dataLayerName] &&
      (window[g.dataLayerName].push({
        event: "external_link_click",
        event_category: "navigation",
        event_action: "external_click",
        event_label: t.href,
        link_url: t.href,
        link_domain: t.hostname,
      }),
      console.log("External link tracked:", t.hostname));
  });
}
function B(e) {
  window[g.dataLayerName] &&
    (window[g.dataLayerName].push({
      event: "consent_update",
      event_category: "privacy",
      event_action: "consent_change",
      event_label: e,
      consent_status: e,
    }),
    console.log("Consent change tracked:", e));
}
function Q(e, t) {
  let n;
  return function () {
    const s = arguments,
      r = this;
    n || (e.apply(r, s), (n = !0), setTimeout(() => (n = !1), t));
  };
}
window.dataLayer = window.dataLayer || [];
function P() {
  dataLayer.push(arguments);
}
P("consent", "default", {
  ad_storage: "denied",
  ad_user_data: "denied",
  ad_personalization: "denied",
  analytics_storage: "denied",
});
(function (e, t, n, s, r) {
  (e[s] = e[s] || []),
    e[s].push({ "gtm.start": new Date().getTime(), event: "gtm.js" });
  var d = t.getElementsByTagName(n)[0],
    m = t.createElement(n),
    i = "";
  (m.async = !0),
    (m.src = "https://www.googletagmanager.com/gtm.js?id=" + r + i),
    d.parentNode.insertBefore(m, d);
})(window, document, "script", "dataLayer", "GTM-MDTTVCKD");
function _(e) {
  P("consent", "update", { analytics_storage: e ? "granted" : "denied" }),
    console.log("Google Consent updated:", e ? "granted" : "denied");
}
function ee() {
  try {
    const e = localStorage.getItem("cookiePreferences");
    return e ? JSON.parse(e) : { necessary: !0, analytics: !1 };
  } catch (e) {
    return (
      console.warn("Error getting cookie preferences:", e),
      { necessary: !0, analytics: !1 }
    );
  }
}
document.addEventListener("DOMContentLoaded", function () {
  const e = ee();
  _(e.analytics),
    console.log("Initial consent set based on preferences:", e.analytics);
});
window.updateGoogleConsent = _;
function L(e, t = document) {
  try {
    return t.querySelector(e);
  } catch (n) {
    return console.warn(`Error selecting ${e}:`, n), null;
  }
}
function T(e, t = document) {
  try {
    return t.querySelectorAll(e);
  } catch (n) {
    return console.warn(`Error selecting ${e}:`, n), [];
  }
}
function ne(e, t = 3e3) {
  const n = document.createElement("div");
  (n.style.position = "fixed"),
    (n.style.bottom = "20px"),
    (n.style.left = "50%"),
    (n.style.transform = "translateX(-50%)"),
    (n.style.padding = "10px 20px"),
    (n.style.backgroundColor = "#57CC99"),
    (n.style.color = "white"),
    (n.style.borderRadius = "4px"),
    (n.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)"),
    (n.style.zIndex = "9999"),
    (n.textContent = e),
    document.body.appendChild(n),
    setTimeout(() => {
      document.body.contains(n) && document.body.removeChild(n);
    }, t);
}
const z = {
    nl: {
      "nav-home": "Home",
      "nav-what-we-do": "Wat wij doen",
      "nav-who-we-are": "Wie wij zijn",
      "nav-projects": "Projecten",
      "nav-contact": "Contact",
      "nav-donate": "Doneer",
      "footer-about":
        "Ashe Foundation werkt aan een wereld waarin de Maasai gemeenschap in Tanzania kansen heeft om het goede leven en het eigen geluk na te streven.",
      "footer-company": "Bedrijf",
      "footer-financial": "Jaarverslag en jaarrekeningen",
      "footer-team": "Ons team",
      "footer-contact-services": "Contact & Services",
      "footer-contact": "Contact",
      "footer-complaints": "Een opmerking of klacht?",
      "footer-legal": "Legal",
      "footer-privacy": "Privacy verklaring & Disclaimer",
      "footer-terms": "Algemene Voorwaarden",
      "cookie-title": "Cookies op deze website",
      "cookie-text-part1":
        "Wij gebruiken cookies om jou de beste ervaring op onze website te geven. In",
      "cookie-text-part2": "onze privacy verklaring",
      "cookie-text-part3": "lees je meer over de cookies die wij gebruiken.",
      "cookie-agree": "Ik ga akkoord",
      "cookie-disagree": "Niet akkoord",
      "hero-title":
        '"Een positieve impact op iemands leven creëert een dynamiek van wederzijdse dankbaarheid." - Ashe Foundation',
      "hero-subtitle":
        "Wij werken aan een wereld waarin de Maasai gemeenschap kansen heeft om het goede leven en het eigen geluk na te streven.",
      "hero-btn-projects": "Ontdek onze projecten",
      "hero-btn-help": "Help ons nu",
      "hero-cta": "Ontdek onze projecten",
      "ashe-meaning": `"Ashe betekent: 'bedankt' in Maa(sai) taal"`,
      "gallery-title": "In beeld",
      "gallery-subtitle":
        "Een kijkje in het leven van de Maasai gemeenschap in Tanzania",
      "gallery-img1": "Lokale landbouw",
      "gallery-img2": "Traditionele kleding",
      "gallery-img3": "Lokale kinderen",
      "gallery-img4": "Dagelijks leven",
      "impact-title": "Onze impact",
      "impact-subtitle":
        "Samen met onze donateurs maken we een meetbaar verschil voor de Maasai gemeenschap in Tanzania",
      "impact-stat1": "Schoolgang van de kinderen",
      "impact-stat2": "Gezinsleden direct meegeholpen uit de armoede",
      "impact-stat3": "Groei in zelfredzaamheid",
      "anbi-title": "ANBI Status",
      "anbi-subtitle":
        "Ashe Foundation is een officieel erkende ANBI stichting. Dit betekent dat donaties fiscaal aftrekbaar zijn.",
      "anbi-status-title": "Erkende ANBI Status",
      "anbi-status-text":
        "Als erkende ANBI stichting voldoen wij aan strenge eisen voor transparantie en effectiviteit. Dit biedt u de zekerheid dat uw donatie goed besteed wordt.",
      "payment-options-title": "Donatie mogelijkheden",
      "payment-option1": "iDeal",
      "payment-option2": "Bankoverschrijving",
      "payment-option3": "Periodieke Gift",
      "donate-now-button": "Doneer nu",
      "success-title": "Succesverhalen",
      "success-subtitle":
        "Ontdek hoe wij samen met jullie steun de levens van mensen veranderen.",
      "naserian-title": "Winkel van Naserian",
      "naserian-text":
        "Dankzij jullie donaties heeft Naserian haar eigen winkel kunnen openen. Deze mijlpaal geeft haar een stabiel inkomen en verandert het leven van haar gezin fundamenteel.",
      "neema-title": "Neema's Droom",
      "neema-text":
        "Als alleenstaande moeder van vijf kinderen droomde Neema van een eigen winkel. Met hulp van de Ashe Foundation is die droom werkelijkheid geworden, waarmee haar gezin nu zelfstandig kan leven.",
      "read-more": "Lees meer",
      "water-give": "Geef water. Geef leven.",
      "water-imagine": "Stel je voor:",
      "water-situation":
        "elke ochtend om 5 uur opstaan om kilometers te lopen naar een vervuilde waterpoel waar nét te weinig water is. Geen keuze. Kapotte kranen. Geen veilig alternatief.",
      "water-reality":
        "Voor de Maasai-gemeenschappen in Loolera en Lembapuli in Tanzania is dit dagelijkse realiteit. Maar samen brengen we daar verandering in.",
      "water-lifelines": "Samen leggen we levenslijnen aan",
      "water-solution":
        "Met €15.000 leggen we een duurzaam waterleidingsysteem aan waarmee meer dan 900 mensen elke dag toegang krijgen tot schoon en veilig drinkwater.",
      "water-for5": "Voor €5",
      "water-people3": "3 mensen geholpen",
      "water-for50": "Voor €50",
      "water-people30": "30 mensen geholpen",
      "water-for500": "Voor €500",
      "water-people300": "300 mensen geholpen",
      "water-sustainable": "Duurzaam systeem met waterleidingen",
      "water-local": "Lokale inbreng van de gemeenschap zelf",
      "water-impact":
        "Directe impact op gezondheid, onderwijs en bestaanszekerheid",
      "view-graph": "Bekijk infographic",
      "water-project-graph": "Project Water infographic",
      "graph-explanation":
        "Deze infographic toont de huidige status van het waterproject en de benodigde financiering om het doel te bereiken.",
      "donate-title": "Steun ons werk",
      "donate-text":
        "Een wereld waarin iedereen, ongeacht achtergrond, geslacht of overtuiging, de kans krijgt om geluk na te streven en zich volledig te ontwikkelen. Dat is waar Ashe Foundation voor staat. Word donateur en maak een blijvende impact voor de Maasai in Tanzania.",
      "become-donor": "Word donateur",
      "hero-title-1":
        "Ashe Foundation versterkt de bestaanszekerheid van de Maasai in Tanzania",
      "discover-title": "Ontdek wat wij doen",
      "mission-card-title": "Onze missie",
      "mission-card-desc":
        "Leer meer over onze missie om de Maasai gemeenschap te versterken",
      "strategies-card-title": "Onze strategieën",
      "strategies-card-desc":
        "Ontdek hoe wij duurzame verandering in de Maasai gemeenschap realiseren",
      "toc-card-title": "Theory of Change",
      "toc-card-desc":
        "Bekijk onze strategie voor korte, middellange en lange termijn resultaten",
      "team-card-title": "Ons team",
      "team-card-desc":
        "Maak kennis met ons bestuur, onze lokale partners en vrijwilligers",
      "partner-card-title": "Word partner",
      "partner-card-desc":
        "Ontdek hoe je als partner, sponsor of vrijwilliger kunt bijdragen",
      "projects-card-title": "Onze projecten",
      "projects-card-desc":
        "Bekijk de projecten waar wij aan werken in Tanzania",
      "mission-title": "Onze missie",
      "mission-p1":
        "Ashe Foundation werkt aan een wereld waarin de Maasai gemeenschap in Tanzania kansen heeft om het goede leven en het eigen geluk na te streven. Ongeacht de culturele achtergrond, het geslacht, levens- of geloofsovertuiging. Iedereen moet de kans hebben zich te ontplooien. Dat is waar Ashe Foundation voor staat.",
      "mission-p2":
        "Daarbij is bestaanszekerheid gegarandeerd. Ook de garantie tot voorzieningen in de basisbehoeften, zoals toegang tot voedsel, schoon drinkwater, medische voorzieningen, onderwijs, goede woonvoorzieningen en participatie binnen de eigen gemeenschap horen hierbij.",
      "mission-p3":
        "Ashe Foundation zet zich samen met de lokale Maasai gemeenschap in om sociaal-economische kansen te creëren. Met lokale samenwerkingen ondersteunt Ashe Foundation duurzame lokale projecten. De beoogde impact van Ashe Foundation is een wereld waarin de Maasai gemeenschap kansen heeft om het goede leven en hun eigen geluk na te streven.",
      "toc-title": "Theory of Change (ToC)",
      "toc-text":
        "In onze theory of change zijn onze korte, middellange- en lange termijn resultaten zichtbaar gemaakt. We bereiken deze resultaten door onze bovenstaande strategieën.",
      "download-toc-nl": "Download onze ToC",
      "strategies-title": "Onze strategieën",
      "strategy1-title": "Strategie 1:",
      "strategy1-p1":
        "Ashe Foundation ondersteunt op duurzame wijze lokale projecten die gedragen worden door de lokale Maasai gemeenschap. Door ondersteuning te bieden kunnen kansen gecreëerd worden om de sociaal-economische positie van de Maasai gemeenschap te versterken.",
      "strategy1-p2":
        "Deze strategie is direct gericht op het verbeteren van de leefomstandigheden van de Maasai gemeenschap. Het ondersteunen van de lokale projecten door Ashe Foundation gebeurt binnen vier domeinen:",
      "strategy1-domain1": "Inkomen",
      "strategy1-domain2": "Landbouw",
      "strategy1-domain3": "Zorg en Welzijn",
      "strategy1-domain4": "Onderwijs",
      "strategy2-title": "Strategie 2:",
      "strategy2-p1":
        "Ashe Foundation werkt nauw samen met lokale partners uit de Maasai gemeenschap. Het effect van onze nauwe samenwerking is dat de projecten hierdoor door de Maasai gemeenschap gedragen worden.",
      "strategy2-p2":
        "Deze strategie is erop gericht draagvlak en daardoor ook duurzaamheid te creëren. Het draagvlak door de Maasai gemeenschap komt ten goede aan de duurzaamheid van de projecten.",
      "partner-title": "Word partner, sponsor of vrijwilliger",
      "team-title": "Ons team",
      "team-title": "Ons team",
      "team-subtitle":
        "Samen werken wij aan een betere toekomst voor de Maasai gemeenschap",
      "board-title": "Het bestuur",
      "board-description":
        "Het bestuur van Ashe Foundation bestaat uit drie leden en zijn gezamenlijk bevoegd.<br />Er worden geen financiële uitkeringen gedaan aan de bestuurders van Ashe Foundation.<br /><br />Alle donaties aan Ashe Foundation worden slechts gebruikt voor de missie van Ashe Foundation.",
      "member-amy-name": "Amory Berkenveld - Oropi",
      "member-amy-title": "Oprichter en voorzitter",
      "member-amy-bio":
        "In 2023 heb ik Ashe Foundation opgericht met als doel duurzame verandering te brengen door nauw samen te werken met lokale leiders en gemeenschapsleden. Door te luisteren naar hun behoeften en ideeën, kunnen we projecten ontwikkelen die echt impact hebben.",
      "member-roxane-name": "Roxane Root",
      "member-roxane-title": "Secretaris",
      "member-roxane-bio":
        "Met een achtergrond in het secretariaat zal Roxane Root binnen Ashe Foundation de functie van secretaris vervullen. Zij zal ondersteuning bieden bij vergaderingen, waarin de op te nemen projecten besproken worden en bestuursbesluiten genomen worden.",
      "member-roxane-full-bio-2":
        "Deze vergaderingen zullen genotuleerd worden. In de basis hoort deze taak bij de secretaris. Roxane is heel erg dankbaar dat zij op deze manier kan bijdragen aan de welzijn van de maasai gemeenschap in Tanzania.",
      "member-hannah-name": "Hannah de Dreu",
      "member-hannah-title": "Penningmeester",
      "member-hannah-bio":
        "Toen ik hoorde over het werk van Ashe Foundation in Tanzania, was ik direct onder de indruk van de impact die zij maken binnen de Maasai-gemeenschap. De missie en de aanpak van de stichting spraken me aan, en ik wilde graag een bijdrage leveren.",
      "member-julia-name": "Julia Deijkers",
      "member-julia-title": "Social Media & Marketing",
      "member-julia-bio":
        "Mijn eerste ontmoeting met het Maasai-volk vond plaats tijdens een safari in Tanzania, waar ik ook Amy Berkenveld, oprichter van Stichting Ashe Foundation, voor het eerst ontmoette. Haar passie voor het verbeteren van de omstandigheden van de Maasai-gemeenschap maakte een blijvende indruk op mij.",
      "member-kangai-name": "Kangai Oropi",
      "member-kangai-title": "Lokale Partner",
      "member-kangai-bio":
        "Als lokale vertegenwoordiger in Tanzania ben ik de schakel tussen de stichting en de Maasai gemeenschap. Ik help bij het identificeren van behoeften en het implementeren van projecten die echt impact maken.",
      "volunteer-title": "Word vrijwilliger",
      "volunteer-description":
        "Wil je meehelpen bij onze missie? We zijn altijd op zoek naar gepassioneerde vrijwilligers die hun talenten willen inzetten voor de Maasai gemeenschap.",
      "volunteer-button": "Neem contact op",
      "member-amy-full-bio-3":
        "Met mijn bestuurskundige achtergrond en werkervaringen binnen het publieke domein breng ik praktische kennis en visie naar onze stichting. Ik geloof sterk in het principe van 'lokaal eigenaarschap' - projecten hebben alleen duurzame impact als de gemeenschap er volledig achter staat en actief betrokken is.",
      "member-amy-full-bio-4":
        "Als voorzitter werk ik nauw samen met onze partners, bestuursleden en vrijwilligers om ervoor te zorgen dat onze missie wordt verwezenlijkt: het creëren van een wereld waarin de Maasai gemeenschap kansen heeft om het goede leven en het eigen geluk na te streven.",
      "member-roxane-full-bio-1":
        "Met een achtergrond in het secretariaat zal Roxane Root binnen Ashe Foundation de functie van secretaris vervullen. Zij zal ondersteuning bieden bij vergaderingen, waarin de op te nemen projecten besproken worden en bestuursbesluiten genomen worden. Deze vergaderingen zullen genotuleerd worden en Roxane zal deze taak als secretaris op zich nemen.",
      "member-roxane-full-bio-2":
        "Deze vergaderingen zullen genotuleerd worden. In de basis hoort deze taak bij de secretaris. Roxane is heel erg dankbaar dat zij op deze manier kan bijdragen aan de welzijn van de maasai gemeenschap in Tanzania.",
      "member-hannah-full-bio-2":
        "Met mijn achtergrond in operations en digitale projecten ondersteun ik Ashe Foundation als penningmeester en beheer ik de website. Bij mijn huidige werk, bij een Insuretech houd ik me bezig met procesoptimalisatie en development, en die kennis zet ik met plezier ook voor de stichting in.",
      "member-hannah-full-bio-3":
        "Door mijn reizen en jaren in het buitenland heb ik geleerd met een open blik naar andere culturen te kijken. Het werk van Ashe Foundation sluit daar mooi op aan: betrokken, mensgericht en met oog voor samenwerking over grenzen heen.",
      "member-julia-full-bio-1":
        "Als fotograaf en content creator ben ik gespecialiseerd in het vastleggen en vertellen van authentieke verhalen. Na mijn reis naar Tanzania besloot ik mijn vaardigheden in te zetten om het verhaal van de Maasai gemeenschap en het werk van Ashe Foundation met de wereld te delen.",
      "member-julia-full-bio-2":
        "In mijn rol als verantwoordelijke voor social media en marketing ontwikkel ik strategieën om het bereik van Ashe Foundation te vergroten. Door middel van boeiende content, fotografie en verhalen breng ik de cultuur, uitdagingen en successen van de Maasai gemeenschap onder de aandacht van een breder publiek.",
      "member-julia-full-bio-3":
        "Ik geloof sterk in de kracht van visuele storytelling om bewustzijn te creëren en mensen te verbinden met onze missie. Door authentieke verhalen te delen, kunnen we niet alleen fondsen werven, maar ook begrip en waardering kweken voor de rijke cultuur en veerkracht van de Maasai.",
      "member-julia-full-bio-4":
        "Door mijn werk voor Ashe Foundation kan ik mijn passie voor fotografie en storytelling combineren met een betekenisvol doel: bijdragen aan positieve verandering voor een gemeenschap die me na aan het hart ligt.",
      "member-kangai-full-bio-1":
        "Geboren en getogen in de Maasai gemeenschap in Tanzania, heb ik een diepgaand begrip van onze cultuur, tradities en de uitdagingen waarmee we worden geconfronteerd. Mijn betrokkenheid bij Ashe Foundation komt voort uit mijn wens om mijn gemeenschap te helpen vooruitkomen zonder onze culturele identiteit te verliezen.",
      "member-kangai-full-bio-2":
        "Ik werk nauw samen met dorpsoudsten, gemeenschapsleiders en lokale belanghebbenden om de behoeften van onze gemeenschap in kaart te brengen en projecten te ontwikkelen die hierop aansluiten.",
      "member-kangai-full-bio-3":
        "Als coördinator van onze lokale projecten zorg ik ervoor dat alle initiatieven cultureel respectvol zijn, door de gemeenschap worden gedragen en duurzame impact hebben. Ik ben verantwoordelijk voor het dagelijks toezicht op projecten, het betrekken van gemeenschapsleden en het rapporteren over voortgang en resultaten.",
      "member-kangai-full-bio-4":
        "Ik ben trots op de manier waarop Ashe Foundation samenwerkt met onze gemeenschap - als echte partners met wederzijds respect. Door deze aanpak kunnen we projecten ontwikkelen die niet alleen tegemoetkomen aan onze onmiddellijke behoeften, maar ook bijdragen aan een sterkere, zelfvoorzienende toekomst voor de volgende generaties Maasai.",
      "projects-title": "Onze Projecten",
      "projects-subtitle":
        "Ontdek hoe wij samen met de Maasai gemeenschap aan een betere toekomst werken",
      "our-projects": "Onze Projecten",
      "projects-discover":
        "Ontdek hoe wij samen met de Maasai gemeenschap aan een betere toekomst werken",
      ongoing: "Lopend",
      "project-water": "Project Water",
      "water-description":
        "Het is dit jaar droger dan ooit in Tanzania. De inwoners van Loolera (circa 10.000 maasai) hebben onvoldoende schoon (drink)water. Hier gaat Ashe Foundation verandering in brengen.",
      "donate-here": "Doneer hier",
      "read-more": "Lees meer",
      "successfully-completed": "Succesvol voltooid",
      "naserian-shop": "Naserian's Winkel",
      "naserian-description":
        "Dankzij donaties hebben we Naserian geholpen haar winkel te openen. Dit project ondersteunt haar gezin en de lokale gemeenschap.",
      "neema-dream": "Neema's Droom",
      "neema-description":
        "Neema's droom om een eigen winkel te openen is gerealiseerd. Dit project versterkt haar gezin en de Maasai-gemeenschap.",
      "help-decision": "Hulp & Besluitvorming",
      "help-decision-subtitle":
        "Hoe we beslissen welke projecten te ondersteunen en hoe jij kunt helpen",
      "how-help": "Hoe kan je helpen?",
      "help-text":
        "Naar aanleiding van de schrijnende situatie van Naserian en andere Maasai vrouwen die hun echtgenoot hebben verloren is Project Enkishon ontstaan.",
      "help-more-text":
        "Hoewel in de patriarchale cultuur van de Maasai een verandering zichtbaar is, gaat de verandering nog langzaam. Vrouwen staan binnen de gemeenschap onder aan de maatschappelijke ladder en zijn daarom kwetsbaar binnen het systeem waarin zij leven. Het is daarom belangrijk om deze individuele kwetsbare vrouwen steun te bieden en hen weer in hun eigen kracht te zetten. Dit heeft niet alleen invloed op hun eigen leven, maar ook op die van hun kinderen, en daarmee dus ook toekomstige generaties. Met jouw financiële steun aan Ashe Foundation kunnen wij met elkaar meerdere Maasai vrouwen helpen een onderneming op te zetten. En daarmee de sociaal-economische positie van de Maasai vrouwen in Tanzania versterken. Ons streven is om in 2024 vijf vrouwen aan een onderneming te helpen.",
      "read-more-button": "Lees meer",
      "read-less-button": "Lees minder",
      "decision-process": "Het beslisproces",
      "decision-text":
        "Via onze lokale partner Kangai en de dorpsraad van Loolera kunnen vrouwen met een ondernemingsplan een aanvraag doen voor financiële steun van Ashe Foundation.",
      "decision-more-text":
        "Het is daarbij belangrijk om de aanvragen via de lokale partner te laten verlopen, zodat we bij de besluitnemers binnen de Maasai gemeenschap draagvlak creëren en daarmee de vrouwen duurzaam kunnen helpen. Het Bestuur van Ashe Foundation besluit gezamenlijk aan welke aanvragen de financiële steun gegeven wordt.",
      "news-updates": "Nieuws & Actualiteiten",
      "news-subtitle":
        "De laatste updates over onze projecten en de situatie in Tanzania",
      "drought-title":
        "Extreme droogte in Tanzania treft Maasai gemeenschap zwaar",
      "drought-text":
        "De aanhoudende droogte in Tanzania heeft ernstige gevolgen voor de Maasai gemeenschap in Loolera. De watervoorzieningen kunnen de groeiende vraag niet meer aan.",
      "entrepreneurs-title":
        "Vrouwelijke ondernemers bloeien ondanks moeilijke omstandigheden",
      "entrepreneurs-text":
        "Naserian en Neema, twee ondernemers die we hebben ondersteund, blijven groeien en inspireren andere vrouwen in de Maasai gemeenschap.",
      "village-meeting-title":
        "Dorpsvergadering kiest nieuwe prioriteiten voor hulp",
      "village-meeting-text":
        "Tijdens een recente dorpsvergadering in Loolera hebben gemeenschapsleiders en inwoners nieuwe prioriteiten vastgesteld voor lokale ontwikkelingsprojecten.",
      "view-all-news": "Bekijk alle nieuwsberichten",
      "suggest-project": "Idee voor een project?",
      "suggest-project-description":
        "We staan open voor nieuwe initiatieven die bijdragen aan ons doel.",
      "share-your-idea": "Deel jouw idee",
      "newsletter-title": "Blijf op de hoogte",
      "newsletter-text":
        "Schrijf je in voor onze nieuwsbrief en ontvang regelmatig updates over onze projecten en de impact die we samen maken.",
      "subscribe-newsletter": "Aanmelden voor nieuwsbrief",
      "coming-soon-title": "Binnenkort nieuwe updates",
      "coming-soon-text":
        "We werken hard aan nieuwe projecten en updates. Volg ons op social media voor de meest actuele informatie en verhalen uit Tanzania.",
      "follow-social-media": "Volg ons op social media",
      "contact-title": "Neem contact met ons op",
      "contact-subtitle":
        "Heb je vragen, suggesties of een leuk idee? We horen graag van je!",
      "financial-info-title": "Financiële gegevens",
      "statutory-name": "Statutaire naam:",
      "chamber-of-commerce": "Kamer van Koophandel:",
      "fiscal-number": "RSIN/Fiscaal nummer:",
      "account-number": "Rekeningnummer:",
      "view-annual-report": "Bekijk ons jaarverslag",
      "contact-us": "Neem contact op",
      "contact-tagline":
        '"Heb je vragen, suggesties of een leuk idee? Neem dan contact op."',
      "send-email": "Stuur een email",
      feedback: "Een opmerking of klacht?",
      "follow-us": "Volg ons",
      "social-media-text":
        "Volg ons op sociale media voor de laatste updates over onze projecten en activiteiten",
      "newsletter-title": "Blijf op de hoogte",
      "newsletter-subtitle": "Schrijf je in voor onze nieuwsbrief",
      "newsletter-description":
        "Ontvang updates over onze projecten, campagnes en acties direct in je inbox. We houden je graag op de hoogte van onze voortgang en impact.",
      "newsletter-email": "E-mailadres",
      "newsletter-name": "Naam",
      "newsletter-consent":
        "Ik geef toestemming aan ASHE Foundation om mijn gegevens te gebruiken voor het versturen van nieuwsbrieven en informatie over campagnes en activiteiten. Voor meer informatie zie onze privacyverklaring.",
      "newsletter-submit": "Inschrijven",
      "newsletter-privacy-notice":
        'Je kunt je op elk moment uitschrijven via de link onderaan elke e-mail. Door je aan te melden stem je ermee in dat wij je persoonlijke gegevens verwerken zoals beschreven in onze <a href="/privacystatement.html" class="text-terracotta hover:underline" target="_blank" rel="noopener" aria-label="Bekijk onze privacyverklaring (opent in nieuw tabblad)">privacyverklaring</a>.',
      "get-involved": "Word onderdeel van onze missie",
      "get-involved-text":
        "Help ons de bestaanszekerheid van de Maasai gemeenschap te versterken. Samen kunnen we een blijvende impact maken.",
      "donate-now": "Doneer nu",
      "see-projects": "Bekijk onze projecten",
      "project-water-title": "Project Water",
      "project-water-subtitle":
        "Een duurzaam waterproject in de binnenlanden van Tanzania",
      "gallery-img1": "Water halen",
      "gallery-img2": "Watervoorziening",
      "gallery-img3": "Maasai gemeenschap",
      "gallery-img4": "Droogte",
      "problem-title": "Het probleem",
      "problem-text":
        "De inwoners van Loolera en Lembapuli hebben onvoldoende schoon (drink)water. Hier brengt Ashe Foundation verandering in.",
      "goal-title": "Ons doel",
      "goal-text":
        "Dit project heeft als doel om voldoende schoon en veilig drinkwater toegankelijk te maken voor de gemeenschap in Loolera en Lambapuli.",
      "help-now": "Help nu",
      "cost-title": "Wat is er nodig?",
      "cost-text":
        "Om de waterleidingen te kunnen kopen en laten aanleggen is in totaal 15.000 euro nodig. En jouw hulp is daarbij hard nodig!",
      "cost-cta-1": "Doneer nu 5 euro en voorzie 3 mensen van schoon water.",
      "cost-cta-2": "Doneer 50 euro en voorzie 30 mensen van schoon water.",
      "donate-button": "Doneer nu",
      "impact-title-donate": "Impact van je donatie",
      "amount-reached": "€9,750 bereikt",
      "maasai-residents": "Maasai inwoners",
      "new-water-pipe": "Nieuwe waterleiding",
      "how-title": "Hoe gaan we dit doen?",
      "step1-title": "Huidige situatie",
      "how-text":
        "Loolera en Lembapuli zijn aanliggende dorpen in het binnenland van Tanzania waar meer dan 10.000 maasai families met hun veeteelt wonen. In beide dorpen is onvoldoende schoon (drink)water aanwezig.",
      "step2-title": "Het probleem",
      "how-text-2":
        "Dit betekent dat de vrouwen in de maasai gemeenschap 's nachts hun watertanks moeten vullen, zodat ze voldoende water kunnen halen voor hun families. De vrouwen die te laat zijn, die vinden de hond in de pot; er is geen schoon (drink)water voor de families. Hierdoor wijken ze uit naar vervuild water. Daarnaast betekent het tekort ook dat er te weinig schoon water aanwezig is in het ziekenhuis van beide dorpen met alle gevolgen van dien.",
      "step3-title": "Onze oplossing",
      "how-text-3":
        "Ashe Foundation gaat met dit initiatief de waterinfrastructuur aanpakken. Dit betekent concreet dat er nieuwe waterleidingen geplaatst worden van een berg die op 5km afstand van Loolera ligt. Hierdoor stroomt voldoende schoon water van de berg naar het water verzamelpunt. Dit heeft grote impact op alle ruim 10.000 maasai families. Nieuw aangelegde waterleidingen betekent schoon (drink) water voor iedereen! Dit doen we met lokale experts, zodat het onderhoud ook lokaal gedragen kan worden en dit project duurzaam is voor de toekomst",
      "quote-text":
        '"Sinds ik weer in Nederland ben verbaast het me hoe vanzelfsprekend ik het weer ben gaan vinden dat ik gewoon mijn kraan open kan doen en dat daar schoon water uitkomt. Een vanzelfsprekenheid die ik door mijn leven in Tanzania meer ben gaan waarderen."',
      "quote-author": "Amy, oprichter Ashe Foundation",
      "donate-title": "Doneer voor schoon drinkwater",
      "donate-text":
        "Jouw bijdrage maakt direct verschil voor de Maasai gemeenschap in Tanzania",
      "naserian-story-title": "Naserian's Verhaal",
      "naserian-story-subtitle":
        "Hoe een kleine winkel een familie nieuwe kansen biedt",
      "naserian-update-project-enkishon": "Update Project Enkishon",
      "naserian-fantastic-news": "Fantastisch nieuws!",
      "naserian-update-text-1":
        "De winkel van Naserian staat en zij is nu bijna 2 maanden haar winkel aan het runnen.",
      "naserian-update-text-2":
        "Dankzij jullie donaties hebben we ons doel behaald! Namelijk dat Naserian haar eigen winkel heeft kunnen openen. Een mijlpaal die haar leven en dat van haar kinderen fundamenteel verandert. Zij heeft nu namelijk een stabiele bron van inkomsten, waarmee ze haar gezin kan onderhouden en haar kinderen naar school kan sturen. Daarnaast is de winkel een belangrijke voorziening voor de lokale Maasai gemeenschap, waar bewoners hun kleren kunnen kopen zonder lange afstanden te hoeven afleggen.",
      "naserian-update-text-3":
        "Dit succes was niet mogelijk geweest zonder de steun van alle betrokken donateurs. Jullie bijdrage heeft een blijvende impact op het leven van Naserian en haar familie, en het geeft haar de kans om haar zelfstandigheid en toekomst op te bouwen. Nogmaals, hartelijk dank voor jullie vrijgevigheid en betrokkenheid bij dit mooie project!",
      "naserian-project-journey": "De reis van het project",
      "naserian-timeline-1-title": "Start van het project",
      "naserian-timeline-1-text":
        "Na het ontmoeten van Naserian en het horen van haar situatie, besloten we om een project te starten om haar te helpen een eigen kledingwinkel op te zetten.",
      "naserian-timeline-2-title": "Fondsenwerving",
      "naserian-timeline-2-text":
        "We begonnen met het werven van fondsen om de benodigde middelen te verzamelen voor het opzetten van de winkel.",
      "naserian-timeline-3-title": "Locatie gevonden",
      "naserian-timeline-3-text":
        "Een perfecte locatie voor de winkel werd gevonden in het dorp, goed bereikbaar voor de lokale gemeenschap.",
      "naserian-timeline-4-title": "Opening winkel",
      "naserian-timeline-4-text":
        "De winkel is officieel geopend! Naserian kan nu beginnen met de verkoop van kleding aan de lokale gemeenschap.",
      "naserian-timeline-5-title": "Eerste successen",
      "naserian-timeline-5-text":
        "Na twee maanden draait de winkel goed. Naserian heeft een stabiel inkomen en kan haar kinderen naar school sturen.",
      "naserian-photo-gallery": "Foto's van de winkel",
      "naserian-gallery-img1-caption": "De nieuwe winkel",
      "naserian-gallery-img2-caption":
        "Naserian met een aantal van haar kinderen",
      "naserian-gallery-img3-caption": "De kleding in de winkel",
      "naserian-impact-title": "De impact van het project",
      "naserian-impact-1-title": "Mensen uit de armoede geholpen",
      "naserian-impact-1-text":
        "Naserian kan nu haar gezin van nu inmiddels 3 kinderen onderhouden en hen naar school sturen.",
      "naserian-impact-2-title": "Vrouw als zelfstandige ondernemer",
      "naserian-impact-2-text":
        "Naserian is nu een zelfstandige ondernemer met haar eigen bedrijf in de gemeenschap.",
      "naserian-impact-3-title": "Mensen bereikt",
      "naserian-impact-3-text":
        "Lokale bewoners hebben nu toegang tot betaalbare kleding zonder ver te hoeven reizen.",
      "naserian-what-next-title": "Hoe nu verder?",
      "naserian-what-next-text":
        "We blijven op deze pagina updates geven over de kledingwinkel. Ook blijft Naserian begeleiding krijgen van Ashe Foundation om haar onderneming succesvol te houden. De begeleiding bestaat dan voornamelijk uit het adviseren over het inkopen van de kleding en de langetermijnvisie voor de kledingwinkel.",
      "naserian-back-to-projects": "Terug naar projecten",
      "naserian-support-more-projects": "Steun meer projecten",
      "naserian-help-more-title": "Help Meer Mensen",
      "naserian-help-more-text":
        "Met jouw steun kunnen we meer vrouwen zoals Naserian helpen. Samen maken we een blijvende impact op de levens van de Maasai gemeenschap.",
      "naserian-donate-here": "Doneer hier",
      "naserian-see-other-projects": "Bekijk andere projecten",
      "naserian-quote":
        '"Dankzij deze winkel kan ik nu in mijn eigen levensonderhoud voorzien en mijn kinderen naar school sturen. Ik ben zo dankbaar voor de steun die ik heb ontvangen. Ashe!"',
      "naserian-name": "Naserian",
      "neema-story-title": "Neema's Verhaal",
      "neema-story-subtitle":
        "Een nieuwe winkel, een nieuw begin voor een alleenstaande moeder",
      "update-project-neema": "Neema's droom wordt werkelijkheid",
      "fantastic-news": "Fantastisch nieuws!",
      "update-text-1":
        "Neema is een alleenstaande Maasai-vrouw die een paar jaar geleden haar man heeft verloren. Sindsdien staat zij er alleen voor met haar vijf kinderen, afhankelijk van het inkomen dat haar oudste zoon, Shilwa, verdient.",
      "update-text-2":
        "Dankzij jullie donaties is Neema's droom werkelijkheid geworden: een eigen winkel waar ze groenten, fruit, rijst, bonen en andere basislevensmiddelen verkoopt. Deze winkel biedt haar gezin niet alleen een stabiel inkomen, maar versterkt ook de hele Maasai-gemeenschap in Tanzania.",
      "update-text-3":
        "Neema straalt van trots achter haar toonbank, omringd door de levensmiddelen die haar leven en dat van haar kinderen hebben veranderd. Dit succes was niet mogelijk geweest zonder de steun van jullie, onze donateurs. Hartelijk dank voor jullie vrijgevigheid!",
      "project-journey": "De reis van het project",
      "timeline-1-title": "Start van het project",
      "timeline-1-text":
        "Na het ontmoeten van Neema en het horen van haar situatie als alleenstaande moeder, besloten we een project te starten om haar te helpen een eigen levensmiddelenwinkel op te zetten.",
      "timeline-2-title": "Fondsenwerving",
      "timeline-2-text":
        "We begonnen met het werven van fondsen om de benodigde middelen te verzamelen voor het opzetten van de winkel en de eerste voorraad.",
      "timeline-3-title": "Locatie gevonden",
      "timeline-3-text":
        "Een perfecte locatie voor de winkel werd gevonden in het dorp, goed bereikbaar voor de lokale gemeenschap en met voldoende ruimte voor voorraad.",
      "timeline-4-title": "Opening winkel",
      "timeline-4-text":
        "De winkel is officieel geopend! Neema kan nu beginnen met de verkoop van levensmiddelen aan de lokale gemeenschap.",
      "timeline-5-title": "Eerste successen",
      "timeline-5-text":
        "Neema in de winkel: ongeveer half jaar later en er komen dagelijks tientallen mensen langs. Neema heeft hierdoor niet alleen een stabiel inkomen, maar kan ook nog eens sparen. Zij is samen met haar kinderen uit de armoede gehaald.",
      "photo-gallery": "Foto's van de winkel",
      "gallery-img1-caption": "De nieuwe winkel",
      "gallery-img2-caption": "Neema met haar kinderen",
      "gallery-img3-caption": "De levensmiddelen in de winkel",
      "impact-title": "De impact van het project",
      "impact-1-title": "Mensen uit de armoede geholpen",
      "impact-1-text":
        "Neema kan nu haar gezin van vijf kinderen onderhouden en hen naar school sturen.",
      "impact-2-title": "Vrouw als zelfstandige ondernemer",
      "impact-2-text":
        "Neema is nu een zelfstandige ondernemer met haar eigen bedrijf in de gemeenschap.",
      "impact-3-title": "Mensen bereikt",
      "impact-3-text":
        "Lokale bewoners hebben nu toegang tot betaalbare levensmiddelen.",
      "what-next-title": "Hoe nu verder?",
      "what-next-text":
        "We blijven op deze pagina updates geven over de winkel. Ook blijft Neema begeleiding krijgen van Ashe Foundation om haar onderneming succesvol te houden. De begeleiding bestaat dan voornamelijk uit het adviseren over het inkopen van de voorraad en de langetermijnvisie voor de winkel.",
      "back-to-projects": "Terug naar projecten",
      "support-more-projects": "Steun meer projecten",
      "help-more-title": "Help Meer Mensen",
      "help-more-text":
        "Met jouw steun kunnen we meer vrouwen zoals Neema helpen. Samen maken we een blijvende impact op de levens van de Maasai gemeenschap.",
      "donate-here": "Doneer hier",
      "see-other-projects": "Bekijk andere projecten",
      "neema-quote":
        '"Ik ben Ashe foundation voor eeuwig dankbaar. Allemaal dankzij Gods glorie! Ashe Naleng!"',
      "neema-name": "Neema",
      "drought-title":
        "Extreme droogte in Tanzania treft Maasai gemeenschap zwaar",
      category: "Klimaatverandering",
      "blog-intro":
        "Terwijl de wereld zich richt op klimaatverandering, voltrekt zich in het binnenland van Tanzania een stille ramp. De aanhoudende droogte heeft verwoestende gevolgen voor de Maasai-gemeenschappen, die afhankelijk zijn van veeteelt voor hun levensonderhoud.",
      "climate-change-title":
        "Klimaatverandering en extreme weersomstandigheden",
      "climate-change-text":
        "Tanzania heeft in 2024 het heetste jaar ooit geregistreerd, met ongekend hoge nachttemperaturen (bron: Down to Earth). Hoewel sommige gebieden te maken kregen met overstromingen, blijven andere regio's, zoals het binnenland, kampen met ernstige droogte.",
      "drought-landscape-caption":
        "Verdroogd landschap in het binnenland van Tanzania, 2025",
      "impact-maasai-title": "Impact op de Maasai-gemeenschappen",
      "impact-maasai-text1":
        "De Maasai, bekend om hun nomadische veeteelt, worden zwaar getroffen. Veel vee is gestorven door gebrek aan water en voedsel, wat leidt tot voedselonzekerheid en armoede. Volgens de UNDP proberen Maasai-gemeenschappen hun graslanden te herstellen door inheemse planten te gebruiken.",
      "impact-maasai-text2":
        "In het dorp Loolera, waar ASHE Foundation actief is, heeft de watervoorziening het bijzonder moeilijk om aan de groeiende vraag te voldoen. Vele families moeten nu urenlange tochten maken om aan schoon drinkwater te komen. De situatie verslechtert met de dag, vooral voor kwetsbare groepen zoals kinderen, ouderen en zwangere vrouwen.",
      "maasai-quote": `"We hebben nog nooit zo'n droogte meegemaakt. Onze dieren sterven en onze kinderen hebben niet genoeg water. We moeten elke dag verder lopen om water te vinden."`,
      "maasai-quote-attribution": "— Naserian, lokale Maasai-vrouw uit Loolera",
      "sustainable-solutions-title": "Duurzame oplossingen en veerkracht",
      "sustainable-solutions-text1":
        "Ondanks de enorme uitdagingen tonen de Maasai veerkracht. Door herstel van graslanden met inheemse planten en kleinschalige irrigatie-initiatieven wordt geprobeerd de effecten van de droogte tegen te gaan. Dit soort projecten bewijst dat lokale kennis essentieel is voor klimaataanpassing.",
      "sustainable-solutions-text2":
        "ASHE Foundation werkt nauw samen met lokale partners en gemeenschapsleiders om duurzame oplossingen te implementeren die zowel onmiddellijke hulp bieden als langetermijnveerkracht opbouwen.",
      "water-project-title": "Project Water: Een levensreddend initiatief",
      "water-project-text1":
        'Als antwoord op deze crisis heeft ASHE Foundation het "Project Water" gelanceerd. Dit project is gericht op het verbeteren van de waterinfrastructuur in Loolera en omgeving, waardoor ongeveer 10.000 Maasai toegang krijgen tot schoon drinkwater.',
      "water-project-text2":
        "Het project omvat het aanleggen van waterpunten, het boren van waterputten en het installeren van duurzame pompsystemen. Daarnaast worden lokale gemeenschapsleden opgeleid in waterbeheer en -onderhoud, zodat het project op lange termijn zelfvoorzienend kan zijn.",
      "how-help-title": "Hoe u kunt helpen",
      "how-help-intro":
        "ASHE Foundation zet zich actief in om de Maasai-gemeenschappen te ondersteunen door:",
      "how-help-point1": "Het aanleggen van waterinfrastructuur",
      "how-help-point2": "Het aanleggen van watervoorzieningen",
      "how-help-point3": "Het bieden van noodhulp in tijden van crisis",
      "how-help-text1":
        "Uw donatie kan een direct verschil maken. Samen kunnen we werken aan een duurzamere en veerkrachtigere toekomst voor de Maasai in Tanzania.",
      "how-help-text2":
        "Met slechts 5 euro kunt u al 3 mensen voorzien van schoon drinkwater! Uw hulp is hard nodig!",
      "be-part-solution": "Word deel van de oplossing",
      "be-part-solution-text":
        "Samen kunnen we de Maasai-gemeenschap in Tanzania helpen door deze moeilijke periode heen te komen.",
      "donate-water-project": "Doneer nu voor Project Water",
      "share-article": "Deel dit artikel",
      "share-linkedin": "Delen op LinkedIn",
      "share-instagram": "Delen op Instagram",
      "share-facebook": "Delen op Facebook",
      "share-twitter": "Delen op Twitter/X",
      "related-articles": "Gerelateerde artikelen",
      "naserian-shop-title": "Naserian's Winkel: Een succesverhaal",
      "naserian-shop-desc":
        "Hoe het openen van een winkel het leven van Naserian en haar gemeenschap heeft verbeterd.",
      "neema-dream-title": "Neema's Droom: Van visie naar werkelijkheid",
      "neema-dream-desc":
        "Het inspirerende verhaal van Neema en hoe ze haar droom van een eigen winkel realiseerde.",
      "back-to-projects": "Terug naar Projecten",
      "donate-hero-title": "Help de Maasai gemeenschap",
      "donate-hero-subtitle":
        "Jouw donatie maakt direct verschil voor duizenden mensen in Tanzania",
      "donation-form-title": "Doneer online",
      "donation-form-subtitle":
        "Kies het bedrag dat bij je past. Elke bijdrage, groot of klein, maakt verschil.",
      "bank-transfer-title": "Of doneer via bankoverschrijving",
      "bank-transfer-subtitle":
        "Liever direct overmaken? Gebruik onderstaande gegevens voor uw donatie.",
      "bank-details-title": "Bankgegevens ASHE Foundation",
      "bank-name-label": "Banknaam:",
      "account-number-label": "Rekeningnummer:",
      "account-holder-label": "Rekeninghouder:",
      "bic-label": "BIC/SWIFT:",
      "bank-transfer-note":
        "Vergeet niet: Vermeld bij uw overschrijving uw naam en e-mailadres zodat wij u een donatiebewijs kunnen toesturen voor de belastingdienst.",
      "anbi-info-title": "Fiscaal aftrekbaar doneren",
      "anbi-status-title": "Erkende ANBI Status",
      "anbi-status-text":
        "Als erkende ANBI stichting voldoen wij aan strenge eisen voor transparantie en effectiviteit. Dit betekent dat uw donaties fiscaal aftrekbaar zijn.",
      "anbi-benefit-1": "Donaties zijn fiscaal aftrekbaar van uw belasting",
      "anbi-benefit-2": "100% van uw donatie gaat naar onze projecten",
      "anbi-benefit-3": "Volledige transparantie in onze financiële rapportage",
      "payment-methods-title": "Betaalmogelijkheden",
      "payment-ideal": "iDEAL",
      "payment-bank": "Bankoverschrijving",
      "payment-recurring": "Periodieke Gift",
      "payment-paypal": "PayPal",
      "secure-payment": "Alle betalingen worden veilig verwerkt via Donorbox",
      "financial-title": "Jaarverslag en Jaarrekeningen",
      "financial-subtitle":
        "Transparantie en verantwoording staan centraal bij de Ashe Foundation. Hier vindt u onze jaarverslagen en financiële documenten.",
      "latest-report": "Jaarverslag 2024",
      "report-2024-description":
        "Een jaar is voorbij en we zijn dankbaar voor alles wat we met de Ashe Foundation hebben kunnen realiseren voor de Maasai-gemeenschap. Dankzij de steun van onze donateurs hebben we dit jaar twee succesvolle projecten kunnen opzetten.",
      "report-more-info":
        "Meer informatie hierover vind je in ons jaarverslag.",
      "view-report-2024": "Jaarverslag 2024",
      "financial-accountability": "Financiële Verantwoording",
      "accountability-description":
        "Als ANBI-erkende stichting hechten wij grote waarde aan financiële transparantie. Ons bestuur werkt volledig onbezoldigd, waardoor we kunnen garanderen dat donaties maximaal ten goede komen aan onze projecten.",
      "transparency-point-1":
        "100% van uw donatie gaat direct naar onze projecten",
      "transparency-point-2": "Alle bestuursleden werken onbezoldigd",
      "transparency-point-3":
        "Jaarlijkse financiële verslaglegging en verantwoording",
      "anbi-certified": "ANBI Gecertificeerd",
      "previous-reports": "Eerdere Jaarverslagen",
      "coming-soon": "Binnenkort Beschikbaar",
      "first-year-note":
        "2024 is het eerste volledige jaar van onze stichting. Eerdere jaarverslagen zullen hier in de toekomst worden toegevoegd.",
      "future-report": "Toekomstig Jaarverslag",
      "questions-title": "Vragen over onze financiën?",
      "questions-description":
        "Wij staan altijd open voor vragen over onze financiële verantwoording. Neem gerust contact op met ons bestuur voor meer informatie of verduidelijking.",
      "contact-us": "Neem contact op",
      "complaints-title": "Een opmerking of klacht?",
      "complaints-intro":
        "Heeft u opmerkingen of feedback voor ons, dan horen we dat graag. We staan open voor input van onze leden, donateurs en andere betrokkenen, ongeacht de reden van uw ontevredenheid over onze werkwijze, activiteiten en/of standpunten. Het is ons doel om eventuele fouten te corrigeren, onze procedures aan te passen indien nodig, en onze dienstverlening te verbeteren.",
      "complaints-what-title": "Wat beschouwen we als een opmerking of klacht?",
      "complaints-what-content":
        'Wij beschouwen elke (mondelinge of schriftelijke) uiting van ontevredenheid van een persoon of instantie over (i) ons beleid en/of standpunten of (ii) over specifieke uitingen, acties of gedragingen van ons personeel, vrijwilligers, bestuursleden of groepen binnen Ashe Foundation als een "opmerking" of "klacht".',
      "complaints-how-title": "Hoe kunt u een opmerking of klacht indienen?",
      "complaints-how-content": "Stuur een email naar klacht@ashefoundation.nl",
      "complaints-process-title":
        "Hoe worden opmerkingen en klachten afgehandeld?",
      "complaints-process-content":
        "We streven ernaar om zo snel mogelijk, maar in ieder geval binnen twee weken na ontvangst, te reageren op uw opmerking of klacht. Alle opmerkingen en klachten worden geregistreerd en vertrouwelijk behandeld.",
      "contact-us": "Neem contact op",
      "privacy-title": "Privacyverklaring",
      "privacy-intro":
        "Stichting Ashe Foundation, gevestigd aan Rietgras 3, 8043 KJ Zwolle, is verantwoordelijk voor de verwerking van persoonsgegevens zoals weergegeven in deze privacyverklaring.",
      "privacy-contact-title": "Contactgegevens",
      "privacy-contact-content":
        "Website: https://ashefoundation.nl<br>Adres: Rietgras 3, 8043 KJ Zwolle<br>Telefoon: +31 6 29314363<br>E-mail: info@ashefoundation.nl",
      "privacy-data-title": "Persoonsgegevens die wij verwerken",
      "privacy-data-intro":
        "Wij verwerken jouw persoonsgegevens omdat je gebruik maakt van onze diensten of omdat je deze zelf aan ons verstrekt. Het gaat om de volgende gegevens:",
      "privacy-sensitive-title": "Bijzondere en/of gevoelige persoonsgegevens",
      "privacy-sensitive-content":
        "Onze website of diensten hebben niet de intentie gegevens te verzamelen over bezoekers jonger dan 16 jaar, tenzij ze toestemming hebben van ouders of voogd. Kun je aantonen dat wij onbedoeld gegevens van een minderjarige hebben verwerkt, neem dan contact met ons op via info@ashefoundation.nl, dan verwijderen wij die gegevens.",
      "privacy-purpose-title":
        "Met welk doel en op basis van welke grondslag verwerken wij persoonsgegevens?",
      "privacy-purpose-intro":
        "Wij verwerken persoonsgegevens voor de volgende doelen:",
      "privacy-newsletters-title": "Nieuwsbrieven",
      "privacy-newsletters-content":
        "Als je je inschrijft voor onze nieuwsbrief, gebruiken we jouw naam en e-mailadres om je via een emailmarketingsoftware op de hoogte te houden van onze activiteiten. Die voldoet aan de Europese privacywetgeving (GDPR). Je kunt je altijd afmelden via de afmeldlink onderaan elke mail.",
      "privacy-retention-title": "Bewaartermijn persoonsgegevens",
      "privacy-retention-content":
        "Wij bewaren je persoonsgegevens niet langer dan nodig is voor het doel waarvoor ze zijn verzameld. Voor donateurs gelden fiscale bewaartermijnen van 7 jaar.",
      "privacy-sharing-title": "Delen van persoonsgegevens met derden",
      "privacy-sharing-content":
        "Wij delen persoonsgegevens alleen met derden als dit nodig is voor de uitvoering van onze dienstverlening (zoals voor e-mailmarketing) of om te voldoen aan wettelijke verplichtingen. Met verwerkers sluiten wij verwerkersovereenkomsten.",
      "privacy-cookies-title": "Cookies",
      "privacy-cookies-content":
        "Onze website gebruikt alleen functionele en analytische cookies die geen inbreuk maken op je privacy. Deze cookies zorgen dat de website goed werkt en helpen ons om de website te verbeteren. Je kunt je afmelden voor cookies via de instellingen van je browser.",
      "privacy-rights-title": "Jouw rechten",
      "privacy-rights-intro": "Je hebt recht op:",
      "privacy-rights-request":
        "Stuur je verzoek naar info@ashefoundation.nl. Om misbruik te voorkomen vragen wij je een kopie van je ID mee te sturen, waarbij je BSN, pasfoto en MRZ onleesbaar maakt.",
      "privacy-rights-complaint":
        "Je kunt ook een klacht indienen bij de Autoriteit Persoonsgegevens.",
      "privacy-security-title": "Beveiliging",
      "privacy-security-content":
        "Wij nemen passende technische en organisatorische maatregelen om je gegevens te beschermen tegen verlies, misbruik of onbevoegde toegang.",
      "privacy-disclaimer-title": "Disclaimer",
      "privacy-disclaimer-content":
        "Stichting Ashe Foundation besteedt grote zorg aan de inhoud van deze website. Toch kunnen er fouten voorkomen of kunnen pagina's tijdelijk niet beschikbaar zijn. Wij aanvaarden geen aansprakelijkheid voor directe of indirecte schade als gevolg van het gebruik van de website of de daarop gepubliceerde informatie. Inhoud kan op elk moment zonder aankondiging worden aangepast.",
      "privacy-data-point1": "Voor- en achternaam",
      "privacy-data-point2": "Geboortedatum",
      "privacy-data-point3": "Geboorteplaats",
      "privacy-data-point4": "Adresgegevens",
      "privacy-data-point5": "Telefoonnummer",
      "privacy-data-point6": "E-mailadres",
      "privacy-data-point7": "Gegevens over jouw activiteiten op onze website",
      "privacy-data-point8": "Bankrekeningnummer (bij donaties of betalingen)",
      "privacy-purpose-point1": "Het verwerken van donaties en betalingen",
      "privacy-purpose-point2":
        "Het verzenden van onze nieuwsbrieven via een mailmarketingsoftware bedrijf",
      "privacy-purpose-point3":
        "Je te kunnen bellen of e-mailen indien nodig voor onze dienstverlening",
      "privacy-purpose-point4":
        "Je te informeren over (wijzigingen in) onze activiteiten en projecten",
      "privacy-purpose-point5":
        "Analyse van websitegedrag ter verbetering van onze website",
      "privacy-purpose-point6":
        "Voldoen aan wettelijke verplichtingen, zoals de fiscale bewaarplicht",
      "privacy-rights-point1": "Inzage in je gegevens",
      "privacy-rights-point2": "Correctie of verwijdering/gegevenswissing",
      "privacy-rights-point3": "Intrekking van toestemming",
      "privacy-rights-point4": "Bezwaar tegen verwerking",
      "privacy-rights-point5": "Gegevensoverdraagbaarheid",
      "terms-title": "Algemene Voorwaarden",
      "terms-intro": "U doneert aan onderstaande ontvangende partij:",
      "terms-recipient":
        "Stichting Ashe foundation Nederland, statutair gevestigd te Zwolle, kantoorhoudende te Zwolle aan het Rietgras 3, postcode 8043 KJ Zwolle, ingeschreven in het handelsregister van de Kamer van Koophandel onder nummer 92102123, hierna verder te noemen: Ashe Foundation.",
      "terms-definitions-title": "Artikel 1. Definities (alfabetisch)",
      "terms-def-1":
        "1.1. Donatie: Een door de gevende partij aan Ashe Foundation geschonken geldbedrag",
      "terms-def-2":
        "1.2. Donatieformulier: Middel om online een donatie te doen aan Ashe Foundation",
      "terms-def-3":
        "1.3. Gevende partij: De natuurlijke- of rechtspersoon die middels een elektronische machtiging, via de website van Ashe Foundation, een donatie doet aan Ashe Foundation, of zich aanmeldt als regelmatige sponsor/donateur",
      "terms-def-4":
        "1.4. Statuten: Ashe Foundation heeft als doel de sociaal economische positie van de Masai in Tanzania versterken",
      "terms-def-5":
        "1.5. Online doneren: Het geven van geld middels een elektronisch betaalsysteem of via een elektronische machtiging via de website van Ashe Foundation aan Ashe Foundation",
      "terms-def-6":
        "1.6. Ontvangende partij: De rechtspersoon Ashe Foundation die op basis van de overeenkomst een donatie ontvangt welke gebruikt wordt ten behoeve van de uitvoering van de statuten",
      "terms-def-7":
        "1.7. Overeenkomst: De overeenkomst op afstand tussen ontvangende partij en gevende partij",
      "terms-def-8":
        "1.8. Overeenkomst op afstand: Een overeenkomst waarbij in het kader van een door de ontvangende partij georganiseerd systeem voor doneren tot het sluiten van de overeenkomst uitsluitend gebruik gemaakt wordt van één of meer technieken voor communicatie op afstand",
      "terms-applicability-title": "Artikel 2. Toepasselijkheid",
      "terms-app-1":
        "2.1. Deze algemene voorwaarden zijn van toepassing op elke online donatie aan Ashe Foundation",
      "terms-app-2":
        "2.2. De gevende partij stemt, door online te doneren, in met deze algemene voorwaarden",
      "terms-app-3":
        "2.3. Ashe Foundation behoudt zich het recht voor om de algemene voorwaarden tussentijds te kunnen wijzigen",
      "terms-rights-receiving-title":
        "Artikel 3. Rechten ontvangende partij, Ashe Foundation",
      "terms-rights-rec-1":
        "3.1. Online donaties komen volledig ten goede aan Ashe Foundation",
      "terms-rights-rec-2":
        "3.2. Ashe Foundation is binnen haar statuten volledig vrij in het bestemmen van deze online donaties, rekening houdend met de eventuele wensen van de donateur met betrekking tot specifieke projecten",
      "terms-rights-rec-3":
        "3.3. Het eigendom van het gedoneerde bedrag gaat over op Ashe Foundation nadat het gedoneerde bedrag op de bankrekening van Ashe Foundation is bijgeschreven",
      "terms-rights-rec-4":
        "3.4. Aansprakelijkheid: Ashe Foundation aanvaardt geen aansprakelijkheid voor schade aan de zijde van de gevende partij als gevolg van de door de gevende partij gedane donatie. De gevende partij vrijwaart Ashe Foundation voor alle aanspraken van derden voor schade geleden door die derden als gevolg van de donatie van de gevende partij aan Ashe Foundation",
      "terms-rights-giving-title": "Artikel 4. Rechten gevende partij",
      "terms-rights-giving-1":
        "4.1. De gevende partij heeft het recht informatie te verkrijgen over de voortgang van de projecten van Ashe Foundation",
      "terms-obligations-ashe-title": "Artikel 5. Plichten Ashe Foundation",
      "terms-obligations-ashe-1":
        "5.1. Ashe Foundation verplicht zich de ontvangen bedragen te besteden overeenkomstig de statuten",
      "terms-obligations-ashe-2":
        "5.2. Ashe Foundation neemt passende technische en organisatorische maatregelen ter beveiliging van de communicatie, de persoonsgegevens, de elektronische overdracht van data en online donaties en zorgt voor een veilige web- omgeving. Het betreft hier een inspanningsverplichting. Ashe Foundation aanvaardt geen aansprakelijkheid uit hoofde van deze verplichting",
      "terms-obligations-ashe-3":
        "5.3. Alle personen die namens Ashe Foundation bevoegd zijn van de persoonsgegevens kennis te kunnen nemen, zijn gehouden aan geheimhouding van deze gegevens",
      "terms-obligations-giving-title": "Artikel 6. Plichten gevende partij",
      "terms-obligations-giving-1":
        "6.1. Om een overeenkomst te sluiten met ontvangende partij moet gevende partij tenminste 18 jaren oud zijn. Door het aangaan van een overeenkomst verklaart de gevende partij dat hij aan deze leeftijdsgrens voldoet",
      "terms-obligations-giving-2":
        "6.2. Gevende partij die onder de 18 jaren oud is kan een online donatie of een online aanmelding als vaste sponsor/donateur alleen doen in bijzijn van en met goedkeuring van een ouder of voogd",
      "terms-obligations-giving-3":
        "6.3. De gevende partij geeft zijn correcte identiteitsgegevens op",
      "terms-obligations-giving-4":
        "6.4. De gevende partij verricht uitsluitend donaties met middelen waarover hij/zij mag beschikken en waarover hij/zij zeggenschap heeft",
      "terms-personal-data-title": "Artikel 7. Verwerking persoonsgegevens",
      "terms-personal-data-1":
        "7.1. Ashe Foundation verwerkt de door de gevende partij aan Ashe Foundation verstrekte persoonsgegevens in overeenstemming met alle (wettelijke) voorschriften betreffende de te verwerken gegevens, daaronder in het bijzonder begrepen de voorschriften bij of krachtens de Wet Bescherming Persoonsgegevens gesteld",
      "terms-personal-data-2":
        "7.2. Deze persoonsgegevens worden door Ashe Foundation verwerkt ten behoeve van het aangaan van donateurschappen, voor de aanvaarding en afwikkeling van overige begunstigingen, voor het informeren over de voortgang van de projecten, alsmede om te kunnen voldoen aan wettelijke verplichtingen",
      "terms-personal-data-3":
        "7.3. De gevende partij heeft het recht te controleren of de door Ashe Foundation geregistreerde gegevens juist zijn, het recht op correctie, indien de gegevens niet juist blijken te zijn, en het recht op verwijdering van de geregistreerde gegevens",
      "terms-final-provisions-title": "Artikel 8. Slotbepalingen",
      "terms-final-provisions-1":
        "8.1. De disclaimer en de privacy verklaring die Ashe Foundation hanteert zijn onverkort van toepassing",
      "terms-final-provisions-2":
        "8.2. Partijen verklaren dat Nederlands recht van toepassing is",
      "privacy-cookie-management-title": "Cookie instellingen beheren",
      "privacy-cookie-management-intro":
        "Je kunt hieronder op elk moment je cookie-instellingen aanpassen of alle cookies verwijderen.",
      "privacy-cookie-preferences": "Cookie voorkeuren",
      "privacy-cookies-necessary": "Noodzakelijke cookies",
      "privacy-cookies-necessary-desc":
        "Deze cookies zijn nodig om de website te laten functioneren.",
      "privacy-cookies-analytics": "Analytische cookies",
      "privacy-cookies-analytics-desc":
        "Deze cookies helpen ons inzicht te krijgen in hoe bezoekers onze website gebruiken.",
      "privacy-cookies-marketing": "Marketing cookies",
      "privacy-cookies-marketing-desc":
        "Deze cookies helpen ons relevante advertenties te tonen.",
      "privacy-cookies-save": "Voorkeuren opslaan",
      "privacy-cookies-revoke": "Alle cookies verwijderen",
      "cookie-preferences": "Voorkeuren aanpassen",
      "cookie-modal-title": "Cookievoorkeuren",
      "cookie-modal-intro":
        "Bij het weigeren van cookies kan het voorkomen dat bepaalde functionaliteiten binnen de website niet werken zoals bedoeld. Mocht je van gedachten veranderen, dan kan je eenvoudig -op ieder moment, en per categorie- cookies toestaan of weigeren.",
      "cookie-necessary": "Noodzakelijke cookies",
      "cookie-necessary-desc":
        "Deze cookies zijn nodig om de website te laten functioneren.",
      "cookie-analytics": "Analytische cookies",
      "cookie-analytics-desc":
        "Deze cookies helpen ons inzicht te krijgen in hoe bezoekers onze website gebruiken.",
      "cookie-marketing": "Marketing cookies",
      "cookie-marketing-desc":
        "Deze cookies helpen ons relevante advertenties te tonen.",
      "cookie-save": "Opslaan",
      "cookie-cancel": "Annuleren",
    },
    en: {
      "nav-home": "Home",
      "nav-what-we-do": "What we do",
      "nav-who-we-are": "Who we are",
      "nav-projects": "Projects",
      "nav-contact": "Contact",
      "nav-donate": "Donate",
      "footer-about":
        "Ashe Foundation works towards a world where the Maasai community in Tanzania has opportunities to pursue a good life and their own happiness.",
      "footer-company": "Company",
      "footer-financial": "Annual report and financial statements",
      "footer-team": "Our team",
      "footer-contact-services": "Contact & Services",
      "footer-contact": "Contact",
      "footer-complaints": "A comment or complaint?",
      "footer-legal": "Legal",
      "footer-privacy": "Privacy statement & Disclaimer",
      "footer-terms": "Terms and Conditions",
      "cookie-title": "Cookies on this website",
      "cookie-text-part1":
        "We use cookies to give you the best experience on our website. In",
      "cookie-text-part2": "our privacy statement",
      "cookie-text-part3": "you can read more about the cookies we use.",
      "cookie-agree": "I agree",
      "cookie-disagree": "Disagree",
      "hero-title": `"A positive impact on someone's life creates a dynamic of mutual gratitude." - Ashe Foundation`,
      "hero-subtitle":
        "We work towards a world where the Maasai community has opportunities to pursue a good life and their own happiness.",
      "hero-btn-projects": "Discover our projects",
      "hero-btn-help": "Help us now",
      "hero-cta": "Discover our projects",
      "ashe-meaning": `"Ashe means: 'thank you' in Maa(sai) language"`,
      "gallery-title": "In pictures",
      "gallery-subtitle":
        "A glimpse into the life of the Maasai community in Tanzania",
      "gallery-img1": "Local agriculture",
      "gallery-img2": "Traditional clothing",
      "gallery-img3": "Local children",
      "gallery-img4": "Daily life",
      "impact-title": "Our impact",
      "impact-subtitle":
        "Together with our donors, we make a measurable difference for the Maasai community in Tanzania",
      "impact-stat1": "Children's schooling",
      "impact-stat2": "Family members lifted out of poverty",
      "impact-stat3": "Increase in self-sufficiency",
      "anbi-title": "ANBI Status",
      "anbi-subtitle":
        "Ashe Foundation is an officially recognized ANBI foundation. This means that donations are tax deductible.",
      "anbi-status-title": "Recognized ANBI Status",
      "anbi-status-text":
        "As a recognized ANBI foundation, we meet strict requirements for transparency and effectiveness. This gives you the assurance that your donation is well spent.",
      "payment-options-title": "Donation Options",
      "payment-option1": "iDeal",
      "payment-option2": "Bank Transfer",
      "payment-option3": "Periodic Gift",
      "donate-now-button": "Donate Now",
      "success-title": "Success Stories",
      "success-subtitle":
        "Discover how we change people's lives with your support.",
      "naserian-title": "Naserian's Shop",
      "naserian-text":
        "Thanks to your donations, Naserian has been able to open her own shop. This milestone gives her a stable income and fundamentally changes the lives of her family.",
      "neema-title": "Neema's Dream",
      "neema-text":
        "As a single mother of five children, Neema dreamed of having her own shop. With the help of the Ashe Foundation, that dream has come true, allowing her family to live independently.",
      "read-more": "Read more",
      "water-give": "Give water. Give life.",
      "water-imagine": "Imagine:",
      "water-situation":
        "waking up at 5 AM every morning to walk kilometers to a polluted water pool with barely enough water. No choice. Broken taps. No safe alternative.",
      "water-reality":
        "For the Maasai communities in Loolera and Lembapuli in Tanzania, this is daily reality. But together we're bringing change.",
      "water-lifelines": "Together we're building lifelines",
      "water-solution":
        "With €15,000 we will build a sustainable water pipe system that will give more than 900 people daily access to clean and safe drinking water.",
      "water-for5": "For €5",
      "water-people3": "3 people helped",
      "water-for50": "For €50",
      "water-people30": "30 people helped",
      "water-for500": "For €500",
      "water-people300": "300 people helped",
      "water-sustainable": "Sustainable system with water pipes",
      "water-local": "Local involvement from the community itself",
      "water-impact": "Direct impact on health, education, and livelihood",
      "view-graph": "View infographic",
      "water-project-graph": "Water Project Infographic",
      "graph-explanation":
        "This infographic shows the current status of the water project and the required funding to reach the goal.",
      "donate-title": "Support our work",
      "donate-text":
        "A world where everyone, regardless of background, gender, or beliefs, has the opportunity to pursue happiness and develop fully. That is what Ashe Foundation stands for. Become a donor and make a lasting impact for the Maasai in Tanzania.",
      "become-donor": "Become a donor",
      "hero-title-1":
        "Ashe Foundation strengthens the livelihood security of the Maasai in Tanzania",
      "discover-title": "Discover what we do",
      "mission-card-title": "Our mission",
      "mission-card-desc":
        "Learn more about our mission to strengthen the Maasai community",
      "strategies-card-title": "Our strategies",
      "strategies-card-desc":
        "Discover how we achieve sustainable change in the Maasai community",
      "toc-card-title": "Theory of Change",
      "toc-card-desc":
        "View our strategy for short, medium and long term results",
      "team-card-title": "Our team",
      "team-card-desc": "Meet our board, local partners and volunteers",
      "partner-card-title": "Become a partner",
      "partner-card-desc":
        "Discover how you can contribute as a partner, sponsor or volunteer",
      "projects-card-title": "Our projects",
      "projects-card-desc":
        "Check out the projects we are working on in Tanzania",
      "mission-title": "Our mission",
      "mission-p1":
        "Ashe Foundation works towards a world where the Maasai community in Tanzania has opportunities to pursue a good life and their own happiness. Regardless of cultural background, gender, life or religious beliefs. Everyone should have the opportunity to develop themselves. That is what Ashe Foundation stands for.",
      "mission-p2":
        "Security of livelihood is guaranteed. Also the guarantee of provisions in basic needs, such as access to food, clean drinking water, medical facilities, education, good housing and participation within their own community are part of this.",
      "mission-p3":
        "Ashe Foundation works together with the local Maasai community to create socio-economic opportunities. With local collaborations, Ashe Foundation supports sustainable local projects. The intended impact of Ashe Foundation is a world where the Maasai community has opportunities to pursue a good life and their own happiness.",
      "toc-title": "Theory of Change (ToC)",
      "toc-text":
        "In our theory of change, our short, medium and long-term results are made visible. We achieve these results through our strategies below.",
      "download-toc-en": "Download our ToC",
      "strategies-title": "Our strategies",
      "strategy1-title": "Strategy 1:",
      "strategy1-p1":
        "Ashe Foundation sustainably supports local projects that are carried by the local Maasai community. By providing support, opportunities can be created to strengthen the socio-economic position of the Maasai community.",
      "strategy1-p2":
        "This strategy is directly aimed at improving the living conditions of the Maasai community. The support of local projects by Ashe Foundation takes place within four domains:",
      "strategy1-domain1": "Income",
      "strategy1-domain2": "Agriculture",
      "strategy1-domain3": "Health and Welfare",
      "strategy1-domain4": "Education",
      "strategy2-title": "Strategy 2:",
      "strategy2-p1":
        "Ashe Foundation works closely with local partners from the Maasai community. The effect of our close collaboration is that the projects are therefore supported by the Maasai community.",
      "strategy2-p2":
        "This strategy is aimed at creating support and therefore also sustainability. The support from the Maasai community benefits the sustainability of the projects.",
      "partner-title": "Become a partner, sponsor or volunteer",
      "team-title": "Our team",
      "team-title": "Our team",
      "team-subtitle":
        "Together we work for a better future for the Maasai community",
      "board-title": "The board",
      "board-description":
        "The board of Ashe Foundation consists of three members who are jointly authorized.<br />No financial payments are made to the directors of Ashe Foundation.<br /><br />All donations to Ashe Foundation are only used for the mission of Ashe Foundation.",
      "member-amy-name": "Amory Berkenveld - Oropi",
      "member-amy-title": "Founder and Chairperson",
      "member-amy-bio":
        "In 2023, I founded Ashe Foundation with the goal of bringing sustainable change by working closely with local leaders and community members. By listening to their needs and ideas, we can develop projects that truly make an impact.",
      "member-amy-full-bio-3":
        "With my background in public administration and work experience in the public domain, I bring practical knowledge and vision to our foundation. I strongly believe in the principle of 'local ownership' - projects only have sustainable impact if the community fully supports them and is actively involved.",
      "member-amy-full-bio-4":
        "As chairperson, I work closely with our partners, board members, and volunteers to ensure that our mission is realized: creating a world where the Maasai community has opportunities to pursue a good life and their own happiness.",
      "member-roxane-name": "Roxane Root",
      "member-roxane-title": "Secretary",
      "member-roxane-bio":
        "With a background in secretarial work, Roxane Root will fulfill the role of secretary within Ashe Foundation. She will provide support during meetings where projects and board decisions are discussed.",
      "member-roxane-full-bio-2":
        "These meetings will be minuted and Roxane will take on this task as secretary. Roxane is very grateful to be able to support the maasai community.",
      "member-hannah-name": "Hannah de Dreu",
      "member-hannah-title": "Treasurer",
      "member-hannah-bio":
        "When I heard about the work of Ashe Foundation in Tanzania, I was immediately impressed by the impact they make within the Maasai community. The mission and approach of the foundation appealed to me, and I wanted to contribute.",
      "member-hannah-full-bio-2":
        "With my background in operations and digital projects, I support Ashe Foundation as treasurer and manage the website. In my current work at an insurtech company, I focus on process optimization and development, and I'm happy to use that knowledge for the foundation as well.",
      "member-hannah-full-bio-3":
        "Through my travels and years abroad, I've learned to look at other cultures with an open mind. The work of Ashe Foundation aligns well with this: engaged, people-oriented, and with an eye for cross-border collaboration.",
      "member-julia-name": "Julia Deijkers",
      "member-julia-title": "Social Media & Marketing",
      "member-julia-bio":
        "My first encounter with the Maasai people took place during a safari in Tanzania, where I also met Amy Berkenveld, founder of Ashe Foundation, for the first time. Her passion for improving the circumstances of the Maasai community made a lasting impression on me.",
      "member-julia-full-bio-1":
        "As a photographer and content creator, I specialize in capturing and telling authentic stories. After my trip to Tanzania, I decided to use my skills to share the story of the Maasai community and the work of Ashe Foundation with the world.",
      "member-julia-full-bio-2":
        "In my role as social media and marketing manager, I develop strategies to increase Ashe Foundation's reach. Through engaging content, photography, and stories, I bring the culture, challenges, and successes of the Maasai community to a wider audience.",
      "member-julia-full-bio-3":
        "I strongly believe in the power of visual storytelling to create awareness and connect people with our mission. By sharing authentic stories, we can not only raise funds but also foster understanding and appreciation for the rich culture and resilience of the Maasai.",
      "member-julia-full-bio-4":
        "Through my work for Ashe Foundation, I can combine my passion for photography and storytelling with a meaningful purpose: contributing to positive change for a community that is close to my heart.",
      "member-kangai-name": "Kangai Oropi",
      "member-kangai-title": "Local Partner",
      "member-kangai-bio":
        "As a local representative in Tanzania, I am the link between the foundation and the Maasai community. I help identify needs and implement projects that truly make an impact.",
      "member-kangai-full-bio-1":
        "Born and raised in the Maasai community in Tanzania, I have a deep understanding of our culture, traditions, and the challenges we face. My involvement with Ashe Foundation stems from my desire to help my community progress without losing our cultural identity.",
      "member-kangai-full-bio-2":
        "I work closely with village elders, community leaders, and local stakeholders to map the needs of our community and develop projects that address these needs.",
      "member-kangai-full-bio-3":
        "As the coordinator of our local projects, I ensure that all initiatives are culturally respectful, supported by the community, and have a sustainable impact. I am responsible for the daily supervision of projects, involving community members, and reporting on progress and results.",
      "member-kangai-full-bio-4":
        "I am proud of the way Ashe Foundation works with our community - as true partners with mutual respect. Through this approach, we can develop projects that not only address our immediate needs but also contribute to a stronger, self-sufficient future for the next generations of Maasai.",
      "volunteer-title": "Become a volunteer",
      "volunteer-description":
        "Want to help with our mission? We are always looking for passionate volunteers who want to use their talents for the Maasai community.",
      "volunteer-button": "Contact us",
      "read-more": "Read more",
      "projects-title": "Our Projects",
      "projects-subtitle":
        "Discover how we work together with the Maasai community for a better future",
      "our-projects": "Our Projects",
      "projects-discover":
        "Discover how we work together with the Maasai community for a better future",
      ongoing: "Ongoing",
      "project-water": "Project Water",
      "water-description":
        "This year is drier than ever in Tanzania. The residents of Loolera (approximately 10,000 Maasai) have insufficient clean (drinking) water. Ashe Foundation is going to change this.",
      "donate-here": "Donate here",
      "read-more": "Read more",
      "successfully-completed": "Successfully completed",
      "naserian-shop": "Naserian's Shop",
      "naserian-description":
        "Thanks to donations, we have helped Naserian open her shop. This project supports her family and the local community.",
      "neema-dream": "Neema's Dream",
      "neema-description":
        "Neema's dream of opening her own shop has been realized. This project strengthens her family and the Maasai community.",
      "help-decision": "Help & Decision Making",
      "help-decision-subtitle":
        "How we decide which projects to support and how you can help",
      "how-help": "How can you help?",
      "help-text":
        "Following the dire situation of Naserian and other Maasai women who have lost their husbands, Project Enkishon was established.",
      "help-more-text":
        "Although change is visible in the patriarchal culture of the Maasai, the change is still slow. Women are at the bottom of the social ladder within the community and are therefore vulnerable within the system in which they live. It is therefore important to offer support to these individual vulnerable women and to help them regain their strength. This not only influences their own lives, but also those of their children, and thus also future generations. With your financial support to Ashe Foundation, we can work together to help multiple Maasai women set up a business. And thereby strengthen the socio-economic position of Maasai women in Tanzania. Our goal is to help five women start a business in 2024.",
      "read-more-button": "Read more",
      "read-less-button": "Read less",
      "decision-process": "The decision process",
      "decision-text":
        "Through our local partner Kangai and the village council of Loolera, women with a business plan can apply for financial support from Ashe Foundation.",
      "decision-more-text":
        "It is important to process the applications through the local partner, so that we create support among the decision-makers within the Maasai community and can thereby help the women sustainably. The Board of Ashe Foundation jointly decides which applications will receive financial support.",
      "news-updates": "News & Updates",
      "news-subtitle":
        "The latest updates about our projects and the situation in Tanzania",
      "drought-title":
        "Extreme drought in Tanzania heavily impacts Maasai community",
      "drought-text":
        "The ongoing drought in Tanzania has serious consequences for the Maasai community in Loolera. The water supplies can no longer meet the growing demand.",
      "entrepreneurs-title":
        "Female entrepreneurs flourish despite difficult circumstances",
      "entrepreneurs-text":
        "Naserian and Neema, two entrepreneurs we have supported, continue to grow and inspire other women in the Maasai community.",
      "village-meeting-title": "Village meeting selects new priorities for aid",
      "village-meeting-text":
        "During a recent village meeting in Loolera, community leaders and residents established new priorities for local development projects.",
      "view-all-news": "View all news",
      "suggest-project": "Project idea?",
      "suggest-project-description":
        "We're open to new initiatives that contribute to our mission.",
      "share-your-idea": "Share your idea",
      "newsletter-title": "Stay informed",
      "newsletter-text":
        "Subscribe to our newsletter and receive regular updates about our projects and the impact we make together.",
      "subscribe-newsletter": "Sign up for newsletter",
      "coming-soon-title": "New updates coming soon",
      "coming-soon-text":
        "We're working hard on new projects and updates. Follow us on social media for the most current information and stories from Tanzania.",
      "follow-social-media": "Follow us on social media",
      "contact-title": "Contact us",
      "contact-subtitle":
        "Do you have questions, suggestions or a good idea? We'd love to hear from you!",
      "financial-info-title": "Financial information",
      "statutory-name": "Statutory name:",
      "chamber-of-commerce": "Chamber of Commerce:",
      "fiscal-number": "RSIN/Fiscal number:",
      "account-number": "Account number:",
      "view-annual-report": "View our annual report",
      "contact-us": "Contact us",
      "contact-tagline":
        '"Do you have questions, suggestions or a good idea? Please contact us."',
      "send-email": "Send an email",
      feedback: "A comment or complaint?",
      "follow-us": "Follow us",
      "social-media-text":
        "Follow us on social media for the latest updates about our projects and activities",
      "newsletter-title": "Stay updated",
      "newsletter-subtitle": "Subscribe to our newsletter",
      "newsletter-description":
        "Receive updates about our projects, campaigns and activities directly in your inbox. We'd like to keep you informed about our progress and impact.",
      "newsletter-email": "Email address",
      "newsletter-name": "Name",
      "newsletter-consent":
        "I give permission to ASHE Foundation to use my data for sending newsletters and information about campaigns and activities. For more information see our privacy statement.",
      "newsletter-submit": "Subscribe",
      "newsletter-privacy-notice":
        'You can unsubscribe at any time via the link at the bottom of each email. By signing up, you agree that we process your personal data as described in our <a href="/privacystatement.html" class="text-terracotta hover:underline" target="_blank" rel="noopener" aria-label="View our privacy statement (opens in a new tab)">privacy statement</a>.',
      "get-involved": "Become part of our mission",
      "get-involved-text":
        "Help us strengthen the livelihood of the Maasai community. Together we can make a lasting impact.",
      "donate-now": "Donate now",
      "see-projects": "View our projects",
      "project-water-title": "Water Project",
      "project-water-subtitle": "A sustainable water project in rural Tanzania",
      "gallery-img1": "Fetching water",
      "gallery-img2": "Water supply",
      "gallery-img3": "Maasai community",
      "gallery-img4": "Drought",
      "problem-title": "The problem",
      "problem-text":
        "The residents of Loolera and Lembapuli have insufficient clean (drinking) water. The Ashe Foundation is bringing change to this situation.",
      "goal-title": "Our goal",
      "goal-text":
        "This project aims to make sufficient clean and safe drinking water accessible to the community in Loolera and Lambapuli.",
      "help-now": "Help now",
      "cost-title": "What is needed?",
      "cost-text":
        "A total of 15,000 euros is needed to purchase and install the water pipes. And your help is urgently needed!",
      "cost-cta-1": "Donate €5 now and provide 3 people with clean water.",
      "cost-cta-2": "Donate €50 and provide 30 people with clean water.",
      "donate-button": "Donate now",
      "impact-title-donate": "Impact of your donation",
      "amount-reached": "€9,750 reached",
      "maasai-residents": "Maasai residents",
      "new-water-pipe": "New water pipeline",
      "how-title": "How will we do this?",
      "step1-title": "Current situation",
      "how-text":
        "Loolera and Lembapuli are adjacent villages in the interior of Tanzania where more than 10,000 Maasai families live with their livestock. In both villages, there is insufficient clean (drinking) water available.",
      "step2-title": "The problem",
      "how-text-2":
        "This means that the women in the Maasai community have to fill their water tanks at night, so they can collect enough water for their families. The women who are too late find the dog in the pot; there is no clean (drinking) water for the families. As a result, they resort to contaminated water. Additionally, the shortage also means that there is too little clean water available in the hospital of both villages, with all the consequences that entails.",
      "step3-title": "Our solution",
      "how-text-3":
        "Ashe Foundation will address the water infrastructure with this initiative. Specifically, new water pipes will be installed from a mountain that is 5km away from Loolera. This will allow sufficient clean water to flow from the mountain to the water collection point. This has a major impact on all 10,000+ Maasai families. Newly installed water pipes means clean drinking water for everyone! We do this with local experts, so that the maintenance can also be locally supported and this project is sustainable for the future.",
      "quote-text": `"Since I've been back in the Netherlands, I'm amazed at how I've taken for granted that I can simply turn on my tap and clean water comes out. It's something I've come to appreciate more through my life in Tanzania."`,
      "quote-author": "Amy, founder of Ashe Foundation",
      "donate-title": "Donate for clean drinking water",
      "donate-text":
        "Your contribution makes a direct difference for the Maasai community in Tanzania",
      "naserian-story-title": "Naserian's Story",
      "naserian-story-subtitle":
        "How a small shop gives a family new opportunities",
      "naserian-update-project-enkishon": "Update Project Enkishon",
      "naserian-fantastic-news": "Fantastic news!",
      "naserian-update-text-1":
        "Naserian's shop is up and running, and she has been managing it for almost 2 months now.",
      "naserian-update-text-2":
        "Thanks to your donations, we have achieved our goal! Naserian has been able to open her own shop. This milestone fundamentally changes her life and that of her children. She now has a stable source of income, which allows her to support her family and send her children to school. Additionally, the shop is an important facility for the local Maasai community, where residents can buy their clothes without having to travel long distances.",
      "naserian-update-text-3":
        "This success would not have been possible without the support of all the donors involved. Your contribution has a lasting impact on the life of Naserian and her family, and gives her the opportunity to build her independence and future. Thank you again for your generosity and involvement in this beautiful project!",
      "naserian-project-journey": "The journey of the project",
      "naserian-timeline-1-title": "Start of the project",
      "naserian-timeline-1-text":
        "After meeting Naserian and hearing about her situation, we decided to start a project to help her set up her own clothing shop.",
      "naserian-timeline-2-title": "Fundraising",
      "naserian-timeline-2-text":
        "We started raising funds to gather the resources needed to set up the shop.",
      "naserian-timeline-3-title": "Location found",
      "naserian-timeline-3-text":
        "A perfect location for the shop was found in the village, easily accessible to the local community.",
      "naserian-timeline-4-title": "Shop opening",
      "naserian-timeline-4-text":
        "The shop is officially open! Naserian can now start selling clothing to the local community.",
      "naserian-timeline-5-title": "First successes",
      "naserian-timeline-5-text":
        "After two months, the shop is running well. Naserian has a stable income and can send her children to school.",
      "naserian-photo-gallery": "Photos of the shop",
      "naserian-gallery-img1-caption": "The new shop",
      "naserian-gallery-img2-caption": "Naserian with some of her children",
      "naserian-gallery-img3-caption": "The clothing in the shop",
      "naserian-impact-title": "The impact of the project",
      "naserian-impact-1-title": "People helped out of poverty",
      "naserian-impact-1-text":
        "Naserian can now support her family, which now consists of 3 children, and send them to school.",
      "naserian-impact-2-title": "woman as a self-employed entrepreneur",
      "naserian-impact-2-text":
        "Naserian is now an independent entrepreneur with her own business in the community.",
      "naserian-impact-3-title": "People reached",
      "naserian-impact-3-text":
        "Local residents now have access to affordable clothing without having to travel far.",
      "naserian-what-next-title": "What's next?",
      "naserian-what-next-text":
        "We will continue to provide updates on this page about the clothing shop. Naserian will also continue to receive guidance from Ashe Foundation to keep her business successful. The guidance mainly consists of advising on the purchase of clothing and the long-term vision for the clothing shop.",
      "naserian-back-to-projects": "Back to projects",
      "naserian-support-more-projects": "Support more projects",
      "naserian-help-more-title": "Help More People",
      "naserian-help-more-text":
        "With your support, we can help more women like Naserian. Together we make a lasting impact on the lives of the Maasai community.",
      "naserian-donate-here": "Donate here",
      "naserian-see-other-projects": "See other projects",
      "naserian-quote":
        '"Thanks to this shop, I can now provide for myself and send my children to school. I am so grateful for the support I have received. Ashe!"',
      "naserian-name": "Naserian",
      "neema-story-title": "Neema's Story",
      "neema-story-subtitle": "A new shop, a new beginning for a single mother",
      "update-project-neema": "Neema's dream becomes reality",
      "fantastic-news": "Fantastic news!",
      "update-text-1":
        "Neema is a single Maasai woman who lost her husband a few years ago. Since then, she has been on her own with her five children, dependent on the income that her eldest son, Shilwa, earns.",
      "update-text-2":
        "Thanks to your donations, Neema's dream has come true: her own shop where she sells vegetables, fruits, rice, beans, and other staple foods. This shop not only provides her family with a stable income but also strengthens the entire Maasai community in Tanzania.",
      "update-text-3":
        "Neema beams with pride behind her counter, surrounded by the food items that have changed her life and that of her children. This success would not have been possible without the support of you, our donors. Thank you for your generosity!",
      "project-journey": "The journey of the project",
      "timeline-1-title": "Start of the project",
      "timeline-1-text":
        "After meeting Neema and hearing about her situation as a single mother, we decided to start a project to help her set up her own grocery store.",
      "timeline-2-title": "Fundraising",
      "timeline-2-text":
        "We started raising funds to gather the resources needed to set up the shop and the initial inventory.",
      "timeline-3-title": "Location found",
      "timeline-3-text":
        "A perfect location for the shop was found in the village, easily accessible to the local community and with enough space for inventory.",
      "timeline-4-title": "Shop opening",
      "timeline-4-text":
        "The shop is officially open! Neema can now start selling groceries to the local community.",
      "timeline-5-title": "First successes",
      "timeline-5-text":
        "Neema in the shop: about half a year later and dozens of people come by daily. Because of this, Neema not only has a stable income, but can also save money. She and her children have been lifted out of poverty.",
      "photo-gallery": "Photos of the shop",
      "gallery-img1-caption": "The new shop",
      "gallery-img2-caption": "Neema with her children",
      "gallery-img3-caption": "The groceries in the shop",
      "impact-title": "The impact of the project",
      "impact-1-title": "People helped out of poverty",
      "impact-1-text":
        "Neema can now support her family of five children and send them to school.",
      "impact-2-title": "woman as a self-employed entrepreneur",
      "impact-2-text":
        "Neema is now an independent entrepreneur with her own business in the community.",
      "impact-3-title": "People reached",
      "impact-3-text":
        "Local residents now have access to affordable groceries.",
      "what-next-title": "What's next?",
      "what-next-text":
        "We will continue to provide updates on this page about the shop. Neema will also continue to receive guidance from Ashe Foundation to keep her business successful. The guidance mainly consists of advising on the purchase of inventory and the long-term vision for the shop.",
      "back-to-projects": "Back to projects",
      "support-more-projects": "Support more projects",
      "help-more-title": "Help More People",
      "help-more-text":
        "With your support, we can help more women like Neema. Together we make a lasting impact on the lives of the Maasai community.",
      "donate-here": "Donate here",
      "see-other-projects": "See other projects",
      "neema-quote":
        '"I am eternally grateful to the Ashe foundation. All thanks to Gods glory!Ashe Naleng!"',
      "neema-name": "Neema",
      "drought-title":
        "Extreme drought in Tanzania severely affects Maasai community",
      category: "Climate Change",
      "blog-intro":
        "While the world focuses on climate change, a silent disaster is unfolding in the interior of Tanzania. The ongoing drought has devastating consequences for the Maasai communities, who depend on livestock for their livelihood.",
      "climate-change-title": "Climate change and extreme weather conditions",
      "climate-change-text":
        "Tanzania recorded its hottest year ever in 2024, with unprecedented high night temperatures (source: Down to Earth). While some areas have experienced flooding, other regions, like the interior, continue to struggle with severe drought.",
      "drought-landscape-caption":
        "Dried landscape in the interior of Tanzania, 2025",
      "impact-maasai-title": "Impact on Maasai communities",
      "impact-maasai-text1":
        "The Maasai, known for their nomadic cattle herding, are severely affected. Many livestock have died due to lack of water and food, leading to food insecurity and poverty. According to the UNDP, Maasai communities are trying to restore their grasslands using indigenous plants.",
      "impact-maasai-text2":
        "In the village of Loolera, where ASHE Foundation is active, the water supply is particularly struggling to meet the growing demand. Many families now have to make hours-long journeys to access clean drinking water. The situation worsens by the day, especially for vulnerable groups such as children, the elderly, and pregnant women.",
      "maasai-quote": `"We have never experienced such a drought. Our animals are dying and our children don't have enough water. We have to walk further every day to find water."`,
      "maasai-quote-attribution": "— Naserian, local Maasai woman from Loolera",
      "sustainable-solutions-title": "Sustainable solutions and resilience",
      "sustainable-solutions-text1":
        "Despite the enormous challenges, the Maasai show resilience. Through restoration of grasslands with indigenous plants and small-scale irrigation initiatives, attempts are being made to counteract the effects of the drought. These types of projects prove that local knowledge is essential for climate adaptation.",
      "sustainable-solutions-text2":
        "ASHE Foundation works closely with local partners and community leaders to implement sustainable solutions that provide both immediate help and build long-term resilience.",
      "water-project-title": "Project Water: A life-saving initiative",
      "water-project-text1":
        'In response to this crisis, ASHE Foundation has launched "Project Water". This project aims to improve the water infrastructure in Loolera and surroundings, providing approximately 10,000 Maasai with access to clean drinking water.',
      "water-project-text2":
        "The project includes establishing water points, drilling wells, and installing sustainable pump systems. Additionally, local community members are trained in water management and maintenance, ensuring the project can be self-sufficient in the long term.",
      "how-help-title": "How you can help",
      "how-help-intro":
        "ASHE Foundation is actively committed to supporting Maasai communities by:",
      "how-help-point1": "Developing water infrastructure",
      "how-help-point2": "Establishing water facilities",
      "how-help-point3": "Providing emergency aid in times of crisis",
      "how-help-text1":
        "Your donation can make a direct difference. Together we can work towards a more sustainable and resilient future for the Maasai in Tanzania.",
      "how-help-text2":
        "With just 5 euros, you can already provide 3 people with clean drinking water! Your help is urgently needed!",
      "be-part-solution": "Become part of the solution",
      "be-part-solution-text":
        "Together we can help the Maasai community in Tanzania through this difficult period.",
      "donate-water-project": "Donate now for Project Water",
      "share-article": "Share this article",
      "share-linkedin": "Share on LinkedIn",
      "share-instagram": "Share on Instagram",
      "share-facebook": "Share on Facebook",
      "share-twitter": "Share on Twitter/X",
      "related-articles": "Related articles",
      "naserian-shop-title": "Naserian's Shop: A success story",
      "naserian-shop-desc":
        "How opening a shop improved the life of Naserian and her community.",
      "neema-dream-title": "Neema's Dream: From vision to reality",
      "neema-dream-desc":
        "The inspiring story of Neema and how she realized her dream of owning a shop.",
      "back-to-projects": "Back to Projects",
      "donate-hero-title": "Help the Maasai community",
      "donate-hero-subtitle":
        "Your donation makes a direct difference for thousands of people in Tanzania",
      "donation-form-title": "Donate online",
      "donation-form-subtitle":
        "Choose the amount that suits you. Every contribution, big or small, makes a difference.",
      "bank-transfer-title": "Or donate via bank transfer",
      "bank-transfer-subtitle":
        "Prefer to transfer directly? Use the details below for your donation.",
      "bank-details-title": "ASHE Foundation Bank Details",
      "bank-name-label": "Bank name:",
      "account-number-label": "Account number:",
      "account-holder-label": "Account holder:",
      "bic-label": "BIC/SWIFT:",
      "bank-transfer-note":
        "Don't forget: Include your name and email address with your transfer so we can send you a donation receipt for tax purposes.",
      "anbi-info-title": "Tax-deductible donations",
      "anbi-status-title": "Recognized ANBI Status",
      "anbi-status-text":
        "As a recognized ANBI foundation, we meet strict requirements for transparency and effectiveness. This means your donations are tax-deductible.",
      "anbi-benefit-1": "Donations are tax-deductible from your taxes",
      "anbi-benefit-2": "100% of your donation goes to our projects",
      "anbi-benefit-3": "Full transparency in our financial reporting",
      "payment-methods-title": "Payment options",
      "payment-ideal": "iDEAL",
      "payment-bank": "Bank transfer",
      "payment-recurring": "Recurring gift",
      "payment-paypal": "PayPal",
      "secure-payment": "All payments are securely processed via Donorbox",
      "financial-title": "Annual Report and Financial Statements",
      "financial-subtitle":
        "Transparency and accountability are central to the Ashe Foundation.",
      "latest-report": "Annual Report Information",
      "report-2024-description":
        "Our annual financial report is available exclusively on our Dutch website. To access the report and stay informed about our financial transparency, please visit www.ashefoundation.nl or switch to the Dutch language version of this page.",
      "report-more-info": "The annual report is available in Dutch only.",
      "view-report-2024": "Switch to Dutch",
      "financial-accountability": "Financial Accountability",
      "accountability-description":
        "As an ANBI-certified foundation, we place great importance on financial transparency. Our board works completely uncompensated, ensuring that donations maximally benefit our projects.",
      "transparency-point-1":
        "100% of your donation goes directly to our projects",
      "transparency-point-2": "All board members work uncompensated",
      "transparency-point-3": "Annual financial reporting and accountability",
      "anbi-certified": "ANBI Certified",
      "previous-reports": "Previous Annual Reports",
      "coming-soon": "Coming Soon",
      "first-year-note":
        "2024 is the first full year of our foundation. Previous annual reports will be added here in the future.",
      "future-report": "Future Annual Report",
      "questions-title": "Questions about our finances?",
      "questions-description":
        "We are always open to questions about our financial accountability. Feel free to contact our board for more information or clarification.",
      "contact-us": "Contact us",
      "complaints-title": "A comment or complaint?",
      "complaints-intro":
        "If you have comments or feedback for us, we would be happy to hear from you. We are open to input from our members, donors, and other stakeholders, regardless of the reason for your dissatisfaction with our methods, activities, and/or positions. Our goal is to correct any errors, adjust our procedures if necessary, and improve our services.",
      "complaints-what-title": "What do we consider a comment or complaint?",
      "complaints-what-content":
        'We consider any (verbal or written) expression of dissatisfaction from a person or organization about (i) our policies and/or positions or (ii) about specific expressions, actions, or behaviors of our staff, volunteers, board members, or groups within Ashe Foundation as a "comment" or "complaint".',
      "complaints-how-title": "How can you submit a comment or complaint?",
      "complaints-how-content": "Send an email to klacht@ashefoundation.nl",
      "complaints-process-title": "How are comments and complaints handled?",
      "complaints-process-content":
        "We strive to respond to your comment or complaint as quickly as possible, but in any case within two weeks of receipt. All comments and complaints are registered and treated confidentially.",
      "contact-us": "Contact us",
      "privacy-title": "Privacy Statement",
      "privacy-intro":
        "Stichting Ashe Foundation, located at Rietgras 3, 8043 KJ Zwolle, is responsible for the processing of personal data as described in this privacy statement.",
      "privacy-contact-title": "Contact Details",
      "privacy-contact-content":
        "Website: https://ashefoundation.nl<br>Address: Rietgras 3, 8043 KJ Zwolle<br>Phone: +31 6 29314363<br>Email: info@ashefoundation.nl",
      "privacy-data-title": "Personal Data We Process",
      "privacy-data-intro":
        "We process your personal data because you use our services or because you provide them to us yourself. This concerns the following data:",
      "privacy-sensitive-title": "Special and/or Sensitive Personal Data",
      "privacy-sensitive-content":
        "Our website and services do not intend to collect data about visitors under 16 years of age, unless they have permission from parents or guardians. If you can demonstrate that we have collected personal data about a minor without consent, please contact us at info@ashefoundation.nl, and we will delete that information.",
      "privacy-purpose-title":
        "For What Purpose and on What Basis Do We Process Personal Data?",
      "privacy-purpose-intro":
        "We process personal data for the following purposes:",
      "privacy-purpose-point1": "Processing donations and payments",
      "privacy-purpose-point2":
        "Sending our newsletters via an email marketing software company",
      "privacy-purpose-point3":
        "Being able to call or email you if necessary for our services",
      "privacy-purpose-point4":
        "Informing you about (changes in) our activities and projects",
      "privacy-purpose-point5":
        "Analysis of website behavior to improve our website",
      "privacy-purpose-point6":
        "Complying with legal obligations, such as fiscal retention requirements",
      "privacy-newsletters-title": "Newsletters",
      "privacy-newsletters-content":
        "If you subscribe to our newsletter, we use your name and email address to keep you informed about our activities via an email marketing software. This software complies with European privacy legislation (GDPR). You can always unsubscribe via the unsubscribe link at the bottom of each email.",
      "privacy-retention-title": "Retention Period of Personal Data",
      "privacy-retention-content":
        "We do not store your personal data longer than necessary for the purpose for which it was collected. For donors, fiscal retention periods of 7 years apply.",
      "privacy-sharing-title": "Sharing Personal Data with Third Parties",
      "privacy-sharing-content":
        "We only share personal data with third parties if this is necessary for the execution of our services (such as for email marketing) or to comply with legal obligations. We enter into processor agreements with processors.",
      "privacy-cookies-title": "Cookies",
      "privacy-cookies-content":
        "Our website only uses functional and analytical cookies that do not infringe on your privacy. These cookies ensure that the website works properly and help us improve the website. You can opt out of cookies through your browser settings.",
      "privacy-rights-title": "Your Rights",
      "privacy-rights-intro": "You have the right to:",
      "privacy-rights-request":
        "Send your request to info@ashefoundation.nl. To prevent misuse, we ask you to provide a copy of your ID with your request, where you've made your BSN (Social Security Number), photo, and MRZ (Machine Readable Zone) unreadable.",
      "privacy-rights-complaint":
        "You can also file a complaint with the Dutch Data Protection Authority.",
      "privacy-security-title": "Security",
      "privacy-security-content":
        "We take appropriate technical and organizational measures to protect your data against loss, misuse, or unauthorized access.",
      "privacy-disclaimer-title": "Disclaimer",
      "privacy-disclaimer-content":
        "Stichting Ashe Foundation takes great care with the content of this website. However, errors may occur or pages may be temporarily unavailable. We accept no liability for direct or indirect damage resulting from the use of the website or the information published on it. Content may be changed at any time without notice.",
      "privacy-data-point1": "First and last name",
      "privacy-data-point2": "Date of birth",
      "privacy-data-point3": "Place of birth",
      "privacy-data-point4": "Address details",
      "privacy-data-point5": "Phone number",
      "privacy-data-point6": "Email address",
      "privacy-data-point7": "Information about your activities on our website",
      "privacy-data-point8": "Bank account number (for donations or payments)",
      "privacy-rights-point1": "Access to your data",
      "privacy-rights-point2": "Correction or deletion/erasure of data",
      "privacy-rights-point3": "Withdrawal of consent",
      "privacy-rights-point4": "Objection to processing",
      "privacy-rights-point5": "Data portability",
      "terms-title": "Terms and Conditions",
      "terms-intro": "You donate to the receiving party below:",
      "terms-recipient":
        "Stichting Ashe Foundation Nederland, statutorily established in Zwolle, office located at Rietgras 3, postal code 8043 KJ Zwolle, registered in the trade register of the Chamber of Commerce under number 92102123, hereinafter referred to as: Ashe Foundation.",
      "terms-definitions-title": "Article 1. Definitions (alphabetical)",
      "terms-def-1":
        "1.1. Donation: An amount of money donated by the giving party to Ashe Foundation",
      "terms-def-2":
        "1.2. Donation form: Means to make an online donation to Ashe Foundation",
      "terms-def-3":
        "1.3. Giving party: The natural or legal person who, by means of an electronic authorization, via the website of Ashe Foundation, makes a donation to Ashe Foundation, or registers as a regular sponsor/donor",
      "terms-def-4":
        "1.4. Statutes: Ashe Foundation aims to strengthen the socio-economic position of the Maasai in Tanzania",
      "terms-def-5":
        "1.5. Online donating: Giving money by means of an electronic payment system or via an electronic authorization via the website of Ashe Foundation to Ashe Foundation",
      "terms-def-6":
        "1.6. Receiving party: The legal entity Ashe Foundation that receives a donation based on the agreement, which is used for the implementation of the statutes",
      "terms-def-7":
        "1.7. Agreement: The distance agreement between receiving party and giving party",
      "terms-def-8":
        "1.8. Distance agreement: An agreement whereby, within the framework of a system for distance donation organized by the receiving party, exclusively one or more techniques for distance communication are used to conclude the agreement",
      "terms-applicability-title": "Article 2. Applicability",
      "terms-app-1":
        "2.1. These general terms and conditions apply to every online donation to Ashe Foundation",
      "terms-app-2":
        "2.2. The giving party agrees to these general terms and conditions by donating online",
      "terms-app-3":
        "2.3. Ashe Foundation reserves the right to change the general terms and conditions in the interim",
      "terms-rights-receiving-title":
        "Article 3. Rights of receiving party, Ashe Foundation",
      "terms-rights-rec-1":
        "3.1. Online donations fully benefit Ashe Foundation",
      "terms-rights-rec-2":
        "3.2. Ashe Foundation is completely free within its statutes to allocate these online donations, taking into account the possible wishes of the donor with regard to specific projects",
      "terms-rights-rec-3":
        "3.3. Ownership of the donated amount transfers to Ashe Foundation after the donated amount has been credited to Ashe Foundation's bank account",
      "terms-rights-rec-4":
        "3.4. Liability: Ashe Foundation accepts no liability for damage on the part of the giving party as a result of the donation made by the giving party. The giving party indemnifies Ashe Foundation against all claims from third parties for damage suffered by those third parties as a result of the donation from the giving party to Ashe Foundation",
      "terms-rights-giving-title": "Article 4. Rights of giving party",
      "terms-rights-giving-1":
        "4.1. The giving party has the right to obtain information about the progress of Ashe Foundation's projects",
      "terms-obligations-ashe-title":
        "Article 5. Obligations of Ashe Foundation",
      "terms-obligations-ashe-1":
        "5.1. Ashe Foundation undertakes to spend the received amounts in accordance with the statutes",
      "terms-obligations-ashe-2":
        "5.2. Ashe Foundation takes appropriate technical and organizational measures to secure communication, personal data, electronic data transfer and online donations, and ensures a secure web environment. This concerns a best efforts obligation. Ashe Foundation accepts no liability under this obligation",
      "terms-obligations-ashe-3":
        "5.3. All persons who are authorized on behalf of Ashe Foundation to access personal data are bound to confidentiality of this data",
      "terms-obligations-giving-title":
        "Article 6. Obligations of giving party",
      "terms-obligations-giving-1":
        "6.1. To enter into an agreement with the receiving party, the giving party must be at least 18 years old. By entering into an agreement, the giving party declares that they meet this age limit",
      "terms-obligations-giving-2":
        "6.2. A giving party under 18 years of age can only make an online donation or register as a regular sponsor/donor in the presence of and with the approval of a parent or guardian",
      "terms-obligations-giving-3":
        "6.3. The giving party provides their correct identity data",
      "terms-obligations-giving-4":
        "6.4. The giving party only makes donations with means over which they have control and authority",
      "terms-personal-data-title": "Article 7. Processing of personal data",
      "terms-personal-data-1":
        "7.1. Ashe Foundation processes the personal data provided by the giving party to Ashe Foundation in accordance with all (legal) regulations concerning the data to be processed, including in particular the regulations under or pursuant to the Personal Data Protection Act",
      "terms-personal-data-2":
        "7.2. These personal data are processed by Ashe Foundation for the purpose of entering into donorships, for the acceptance and settlement of other benefactions, for informing about the progress of the projects, as well as to be able to comply with legal obligations",
      "terms-personal-data-3":
        "7.3. The giving party has the right to check whether the data registered by Ashe Foundation are correct, the right to correction if the data appear to be incorrect, and the right to deletion of the registered data",
      "terms-final-provisions-title": "Article 8. Final provisions",
      "terms-final-provisions-1":
        "8.1. The disclaimer and privacy statement used by Ashe Foundation apply in full",
      "terms-final-provisions-2": "8.2. Parties declare that Dutch law applies",
      "privacy-cookie-management-title": "Manage Cookie Settings",
      "privacy-cookie-management-intro":
        "You can adjust your cookie settings or remove all cookies at any time below.",
      "privacy-cookie-preferences": "Cookie preferences",
      "privacy-cookies-necessary": "Necessary cookies",
      "privacy-cookies-necessary-desc":
        "These cookies are needed for the website to function properly.",
      "privacy-cookies-analytics": "Analytics cookies",
      "privacy-cookies-analytics-desc":
        "These cookies help us gain insight into how visitors use our website.",
      "privacy-cookies-marketing": "Marketing cookies",
      "privacy-cookies-marketing-desc":
        "These cookies help us display relevant advertisements.",
      "privacy-cookies-save": "Save preferences",
      "privacy-cookies-revoke": "Remove all cookies",
      "cookie-modal-title": "Cookie preferences",
      "cookie-modal-intro":
        "When rejecting cookies, certain functionalities within the website may not work as intended. If you change your mind, you can easily allow or reject cookies - at any time, and per category.",
      "cookie-necessary": "Necessary cookies",
      "cookie-necessary-desc":
        "These cookies are needed for the website to function properly.",
      "cookie-analytics": "Analytics cookies",
      "cookie-analytics-desc":
        "These cookies help us gain insight into how visitors use our website.",
      "cookie-marketing": "Marketing cookies",
      "cookie-marketing-desc":
        "These cookies help us display relevant advertisements.",
      "cookie-save": "Save",
      "cookie-cancel": "Cancel",
      "cookie-preferences": "Adjust preferences",
    },
  },
  A = (function () {
    let e = "nl";
    function t() {
      const i = window.location.hostname,
        v = new URLSearchParams(window.location.search).get("lang");
      return v === "en" || v === "nl"
        ? v
        : i.endsWith(".net")
          ? "en"
          : (i.endsWith(".nl"), "nl");
    }
    function n(i, c = !1) {
      (e = i), (document.documentElement.lang = i);
      const v = new CustomEvent("languageChanged", { detail: { language: i } });
      document.dispatchEvent(v);
      try {
        localStorage.setItem("asheLanguage", i);
      } catch {
        console.warn("LocalStorage not available.");
      }
    }
    function s() {
      const i = e;
      T("a").forEach((c) => {
        if (
          !(!c.href || c.target === "_blank") &&
          (!c.href.startsWith("http") ||
            c.href.includes(window.location.hostname))
        )
          try {
            const v = new URL(c.href);
            v.searchParams.has("lang") ||
              (v.searchParams.set("lang", i), (c.href = v.href));
          } catch {
            c.href.includes("?")
              ? c.href.includes("lang=") || (c.href += `&lang=${i}`)
              : (c.href += `?lang=${i}`);
          }
      });
    }
    function r() {
      const i = (c, v) => {
        const y = L(c);
        y &&
          y.addEventListener("click", (k) => {
            k.preventDefault(), n(v, !0);
          });
      };
      i("#lang-nl", "nl"),
        i("#lang-en", "en"),
        i("#lang-nl-desktop", "nl"),
        i("#lang-en-desktop", "en");
    }
    function d() {
      return e;
    }
    function m() {
      const i = t();
      let c = null;
      try {
        c = localStorage.getItem("asheLanguage");
      } catch {}
      n(i || c || "nl", !1);
    }
    return {
      initLanguage: m,
      initLanguageToggleListeners: r,
      switchLanguage: n,
      getCurrentLanguage: d,
      updateInternalLinksWithLangParam: s,
    };
  })(),
  te = (function () {
    function e() {
      const n = document.querySelector(".cookie-banner");
      if (!n) return;
      const s = A.getCurrentLanguage();
      window.translations &&
        window.translations[s] &&
        n.querySelectorAll("[data-lang-key]").forEach((d) => {
          const m = d.getAttribute("data-lang-key");
          window.translations[s][m] &&
            (d.innerHTML = window.translations[s][m]);
        });
    }
    function t() {
      const n = L(".cookie-banner");
      if (n)
        try {
          localStorage.getItem("cookieConsent") === null
            ? (e(), (n.style.display = "block"))
            : (n.style.display = "none");
        } catch (s) {
          console.error("Error initializing cookie banner:", s);
        }
    }
    return { initCookieBanner: t, updateCookieBannerTexts: e };
  })();
function ae() {
  const e = L('[data-collapse-toggle="mobile-menu"]'),
    t = document.getElementById("mobile-menu");
  e &&
    t &&
    e.addEventListener("click", () => {
      t.classList.toggle("hidden");
    });
}
function oe() {
  const e = document.getElementById("team-carousel");
  if (!e) return;
  const t = L(".carousel-inner", e),
    n = document.getElementById("carousel-prev"),
    s = document.getElementById("carousel-next"),
    r = T(".carousel-indicator", e);
  let d = 0;
  const i = T(".carousel-item", e).length;
  let c;
  function v() {
    t && (t.style.transform = `translateX(-${d * 100}%)`),
      r.forEach((k, j) => {
        k.classList.toggle("active", j === d);
      });
  }
  function y() {
    c = setInterval(() => {
      (d = (d + 1) % i), v();
    }, 7e3);
  }
  t &&
    (v(),
    n &&
      n.addEventListener("click", () => {
        (d = (d - 1 + i) % i), v();
      }),
    s &&
      s.addEventListener("click", () => {
        (d = (d + 1) % i), v();
      }),
    r.forEach((k, j) => {
      k.addEventListener("click", () => {
        (d = j), v();
      });
    }),
    e.addEventListener("mouseenter", () => clearInterval(c)),
    e.addEventListener("mouseleave", y),
    y());
}
function ie() {
  const e = document.querySelectorAll("[data-src]"),
    t = new IntersectionObserver(
      (r, d) => {
        r.forEach((m) => {
          if (m.isIntersecting) {
            const i = m.target;
            (i.src = i.getAttribute("data-src")),
              i.removeAttribute("data-src"),
              d.unobserve(i);
          }
        });
      },
      { rootMargin: "50px", threshold: 0.01 },
    );
  e.forEach((r) => t.observe(r));
  const n = document.querySelectorAll("[data-bg-src]"),
    s = new IntersectionObserver(
      (r, d) => {
        r.forEach((m) => {
          if (m.isIntersecting) {
            const i = m.target;
            (i.style.backgroundImage = `url('${i.getAttribute("data-bg-src")}')`),
              i.removeAttribute("data-bg-src"),
              d.unobserve(i);
          }
        });
      },
      { rootMargin: "100px", threshold: 0.01 },
    );
  n.forEach((r) => s.observe(r));
}
function re() {
  const e = document.getElementById("video-trigger"),
    t = document.getElementById("video-container"),
    n = document.getElementById("video-iframe");
  e &&
    t &&
    n &&
    e.addEventListener("click", () => {
      t.classList.remove("hidden"), (n.src += "?autoplay=1");
    });
}
function se() {
  const e = document.getElementById("donation-form");
  e &&
    e.addEventListener("submit", function (t) {
      t.preventDefault();
      const n = new FormData(e),
        s = new URLSearchParams(n).toString(),
        r = e.getAttribute("action");
      window.location.href = `${r}?${s}`;
    });
}
function le() {
  const e = document.getElementById("naserian-project");
  if (!e) return;
  const t = e.querySelector("[data-copy]"),
    n = e.querySelector("input");
  t &&
    n &&
    t.addEventListener("click", () => {
      n.select(), document.execCommand("copy");
    });
}
function de() {
  const e = document.getElementById("financieel-card");
  if (!e) return;
  const t = e.querySelector("[data-toggle]"),
    n = e.querySelector("[data-details]");
  t &&
    n &&
    t.addEventListener("click", () => {
      n.classList.toggle("hidden");
    });
}
function ce() {
  const e = document.getElementById("newsletter-form");
  e &&
    e.addEventListener("submit", function (t) {
      t.preventDefault(), ne("Bedankt voor je inschrijving!"), e.reset();
    });
}
function ue() {
  document.querySelectorAll("[data-share-url]").forEach((t) => {
    t.addEventListener("click", () => {
      const n = t.getAttribute("data-share-url");
      navigator.share
        ? navigator.share({ url: n }).catch(console.error)
        : window.open(n, "_blank");
    });
  });
}
function he() {
  document.querySelectorAll("[data-defer-script]").forEach((t) => {
    const n = document.createElement("script");
    (n.src = t.getAttribute("data-defer-script")),
      (n.defer = !0),
      document.body.appendChild(n);
  });
}
function me() {
  document.addEventListener("DOMContentLoaded", function () {
    const e = document.getElementById("graph-modal"),
      t = T(".view-graph-btn"),
      n = document.getElementById("close-modal"),
      s = document.getElementById("nl-graph"),
      r = document.getElementById("en-graph");
    e &&
      t.length &&
      n &&
      s &&
      r &&
      (t.forEach((i) => {
        i.addEventListener("click", function () {
          try {
            e.classList.remove("hidden"),
              (document.body.style.overflow = "hidden"),
              e.setAttribute("aria-hidden", "false");
            const c = A.getCurrentLanguage();
            pe(c), q(e);
          } catch (c) {
            console.error("Error opening graph modal:", c);
          }
        });
      }),
      n.addEventListener("click", () => S(e)),
      e.addEventListener("click", (i) => {
        i.target === e && S(e);
      }),
      document.addEventListener("keydown", (i) => {
        i.key === "Escape" && !e.classList.contains("hidden") && S(e);
      })),
      ["mission", "strategies", "toc", "team", "partner"].forEach((i) => {
        const c = document.getElementById(`${i}-card`);
        c && c.addEventListener("click", () => ge(`${i}-modal`));
      }),
      T(".close-modal").forEach((i) => {
        i.addEventListener("click", () => D());
      }),
      window.addEventListener("click", (i) => {
        i.target.classList.contains("modal") && D();
      }),
      document.addEventListener("keydown", (i) => {
        i.key === "Escape" && D();
      });
    const m = L('a[href="#cards-section"]');
    m &&
      m.addEventListener("click", function (i) {
        i.preventDefault();
        const c = document.getElementById("cards-section");
        c && c.scrollIntoView({ behavior: "smooth" });
      });
  }),
    document.addEventListener("languageChanged", function () {
      const e = document.getElementById("cookie-preferences-modal");
      e && e.style.display !== "none" && W();
    }),
    typeof window.updateToggleUI != "function" && (window.updateToggleUI = H),
    typeof window.initializeToggleElements != "function" &&
      (window.initializeToggles = O),
    (window.translateCookieModal = W);
}
function ge(e) {
  const t = document.getElementById(e);
  if (!t) return;
  (t.style.display = "block"),
    setTimeout(() => {
      t.classList.add("show"), t.setAttribute("aria-hidden", "false");
    }, 10),
    (document.body.style.overflow = "hidden");
  const n = t.querySelector(".close-modal");
  n &&
    setTimeout(() => {
      n.focus(), q(t);
    }, 100);
}
function S(e) {
  e.classList.add("hidden"),
    (document.body.style.overflow = ""),
    e.setAttribute("aria-hidden", "true");
}
function D() {
  const e = document.querySelector(".modal.show");
  if (!e) return;
  e.classList.remove("show"),
    e.setAttribute("aria-hidden", "true"),
    setTimeout(() => {
      e.style.display = "none";
    }, 300),
    (document.body.style.overflow = "");
  const t = e.id,
    n = document.querySelector(`[aria-controls="${t}"]`);
  n && n.focus();
}
function pe(e) {
  const t = document.getElementById("nl-graph"),
    n = document.getElementById("en-graph"),
    s = document.getElementById("modal-title"),
    r = document.querySelector(
      "#graph-modal p[data-lang-key='graph-explanation']",
    );
  !t ||
    !n ||
    !s ||
    !r ||
    (e === "nl"
      ? (t.classList.remove("hidden"),
        n.classList.add("hidden"),
        (s.textContent = z.nl["water-project-graph"]),
        (r.textContent = z.nl["graph-explanation"]))
      : (t.classList.add("hidden"),
        n.classList.remove("hidden"),
        (s.textContent = z.en["water-project-graph"]),
        (r.textContent = z.en["graph-explanation"])),
    (t.style.maxWidth = n.style.maxWidth = "100%"),
    (t.style.height = n.style.height = "auto"));
}
function W() {
  const e = document.getElementById("cookie-preferences-modal");
  if (!e) return;
  const t = A.getCurrentLanguage();
  z[t] &&
    e.querySelectorAll("[data-lang-key]").forEach((n) => {
      const s = n.getAttribute("data-lang-key");
      z[t][s] && (n.innerHTML = z[t][s]);
    }),
    O(e);
}
function O(e) {
  if (!e) return;
  let t = { necessary: !0, analytics: !1, marketing: !1 };
  try {
    const n = localStorage.getItem("cookiePreferences");
    n && (t = JSON.parse(n));
  } catch (n) {
    console.warn("Error getting saved cookie preferences:", n);
  }
  e.querySelectorAll('input[type="checkbox"]').forEach((n) => {
    n.id.includes("necessary") && (n.checked = !0),
      n.id.includes("analytics") && (n.checked = t.analytics),
      n.id.includes("marketing") && (n.checked = t.marketing),
      typeof window.updateToggleUI == "function"
        ? window.updateToggleUI(n)
        : H(n);
  });
}
function H(e) {
  if (!e) return;
  const t = e.closest(".relative.inline-block");
  if (!t) return;
  const n = t.querySelector("span.absolute.inset-0"),
    s = t.querySelector("span.absolute.h-5.w-5");
  !n ||
    !s ||
    (e.checked
      ? ((n.style.backgroundColor = "#E07A5F"),
        n.classList.add("bg-terracotta"),
        n.classList.remove("bg-gray-200"),
        (s.style.transform = "translateX(1.5rem)"))
      : ((n.style.backgroundColor = "#E2E8F0"),
        n.classList.remove("bg-terracotta"),
        n.classList.add("bg-gray-200"),
        (s.style.transform = "translateX(0)")));
}
function q(e) {
  const t = e.querySelectorAll(
    'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
  );
  if (!t.length) return;
  const n = t[0],
    s = t[t.length - 1];
  e.addEventListener("keydown", function (r) {
    r.key === "Tab" &&
      (r.shiftKey && document.activeElement === n
        ? (r.preventDefault(), s.focus())
        : !r.shiftKey &&
          document.activeElement === s &&
          (r.preventDefault(), n.focus()));
  }),
    n.focus();
}
A.initLanguage();
A.initLanguageToggleListeners();
A.updateInternalLinksWithLangParam();
te.initCookieBanner();
ae();
oe();
ie();
re();
me();
document.addEventListener("DOMContentLoaded", () => {
  se(), le(), de(), ce(), ue(), he();
});
