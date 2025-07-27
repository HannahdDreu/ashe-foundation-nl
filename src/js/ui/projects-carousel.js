export function initProjectsCarousel() {
  // Only run on projects page
  if (!window.location.pathname.includes("projecten")) {
    return;
  }

  console.log("*** initProjectsCarousel function started ***");

  const carousel = document.getElementById("carousel");
  const prevButton = document.getElementById("prev");
  const nextButton = document.getElementById("next");
  const indicatorsContainer = document.querySelector(".carousel-indicators");

  if (!carousel || !prevButton || !nextButton || !indicatorsContainer) {
    console.log("Carousel elements not found");
    return;
  }

  const cards = carousel.querySelectorAll(".project-card");
  const totalCards = cards.length;
  let currentIndex = 0;

  console.log("Found", totalCards, "project cards");

  // Create proper carousel indicators matching your CSS
  function createIndicators() {
    indicatorsContainer.innerHTML = "";
    for (let i = 0; i < totalCards; i++) {
      const indicator = document.createElement("button");
      indicator.className = `carousel-indicator ${i === 0 ? "active" : ""}`;
      indicator.setAttribute("aria-label", `Ga naar project ${i + 1}`);
      indicator.addEventListener("click", () => goToSlide(i));
      indicatorsContainer.appendChild(indicator);
    }
    console.log("Created", totalCards, "proper carousel indicators");
  }

  // Update indicators to match your CSS classes
  function updateIndicators() {
    const indicators = indicatorsContainer.querySelectorAll("button");
    indicators.forEach((indicator, index) => {
      if (index === currentIndex) {
        indicator.className = "carousel-indicator active";
      } else {
        indicator.className = "carousel-indicator";
      }
    });
  }

  // Go to specific slide
  function goToSlide(index) {
    currentIndex = index;
    updateCarousel();
  }

  // Update carousel position with smooth scrolling
  function updateCarousel() {
    const card = cards[currentIndex];
    if (card) {
      card.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
        inline: "start",
      });
    }
    updateIndicators();
  }

  // Go to next slide
  function nextSlide() {
    currentIndex = (currentIndex + 1) % totalCards;
    updateCarousel();
    console.log("Next slide:", currentIndex);
  }

  // Go to previous slide
  function prevSlide() {
    currentIndex = (currentIndex - 1 + totalCards) % totalCards;
    updateCarousel();
    console.log("Previous slide:", currentIndex);
  }

  // Event listeners for the orange arrow buttons
  nextButton.addEventListener("click", (e) => {
    e.preventDefault();
    nextSlide();
  });

  prevButton.addEventListener("click", (e) => {
    e.preventDefault();
    prevSlide();
  });

  // Initialize
  createIndicators();
  updateCarousel();

  // Handle window resize
  window.addEventListener("resize", () => {
    updateCarousel();
  });

  // Touch/swipe support for mobile
  let startX = 0;
  let currentX = 0;
  let isDragging = false;

  carousel.addEventListener("touchstart", (e) => {
    startX = e.touches[0].clientX;
    isDragging = true;
  });

  carousel.addEventListener("touchmove", (e) => {
    if (!isDragging) return;
    currentX = e.touches[0].clientX;
  });

  carousel.addEventListener("touchend", () => {
    if (!isDragging) return;

    const diffX = startX - currentX;
    const threshold = 50; // minimum swipe distance

    if (Math.abs(diffX) > threshold) {
      if (diffX > 0) {
        nextSlide(); // swipe left = next
      } else {
        prevSlide(); // swipe right = previous
      }
    }

    isDragging = false;
  });

  console.log("Projects carousel initialized with", totalCards, "cards");
}
