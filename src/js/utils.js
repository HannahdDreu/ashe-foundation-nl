export function safeQuerySelector(selector, context = document) {
  try {
    return context.querySelector(selector);
  } catch (e) {
    console.warn(`Error selecting ${selector}:`, e);
    return null;
  }
}

export function safeQuerySelectorAll(selector, context = document) {
  try {
    return context.querySelectorAll(selector);
  } catch (e) {
    console.warn(`Error selecting ${selector}:`, e);
    return [];
  }
}

export function debounce(func, wait = 100) {
  let timeout;
  return function (...args) {
    clearTimeout(timeout);
    timeout = setTimeout(() => func.apply(this, args), wait);
  };
}

export function showFeedbackMessage(message, duration = 3000) {
  const feedbackElement = document.createElement("div");
  feedbackElement.style.position = "fixed";
  feedbackElement.style.bottom = "20px";
  feedbackElement.style.left = "50%";
  feedbackElement.style.transform = "translateX(-50%)";
  feedbackElement.style.padding = "10px 20px";
  feedbackElement.style.backgroundColor = "#57CC99";
  feedbackElement.style.color = "white";
  feedbackElement.style.borderRadius = "4px";
  feedbackElement.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
  feedbackElement.style.zIndex = "9999";
  feedbackElement.textContent = message;

  document.body.appendChild(feedbackElement);

  setTimeout(() => {
    if (document.body.contains(feedbackElement)) {
      document.body.removeChild(feedbackElement);
    }
  }, duration);
}
