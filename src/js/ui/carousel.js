import { safeQuerySelector, safeQuerySelectorAll, debounce } from "../utils.js";

export function initTeamCarousel() {
  const carousel = document.getElementById("team-carousel");
  if (!carousel) return;

  const carouselInner = safeQuerySelector(".carousel-inner", carousel);
  const prevButton = document.getElementById("carousel-prev");
  const nextButton = document.getElementById("carousel-next");
  const indicators = safeQuerySelectorAll(".carousel-indicator", carousel);

  let currentSlide = 0;
  const slides = safeQuerySelectorAll(".carousel-item", carousel);
  const totalSlides = slides.length;
  let autoSlideInterval;

  function updateCarousel() {
    if (carouselInner) {
      carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
    }

    indicators.forEach((indicator, index) => {
      indicator.classList.toggle("active", index === currentSlide);
    });
  }

  function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
      currentSlide = (currentSlide + 1) % totalSlides;
      updateCarousel();
    }, 7000);
  }

  if (carouselInner) {
    updateCarousel();
    if (prevButton) {
      prevButton.addEventListener("click", () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
      });
    }
    if (nextButton) {
      nextButton.addEventListener("click", () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
      });
    }
    indicators.forEach((indicator, index) => {
      indicator.addEventListener("click", () => {
        currentSlide = index;
        updateCarousel();
      });
    });
    carousel.addEventListener("mouseenter", () =>
      clearInterval(autoSlideInterval),
    );
    carousel.addEventListener("mouseleave", startAutoSlide);
    startAutoSlide();
  }
}
