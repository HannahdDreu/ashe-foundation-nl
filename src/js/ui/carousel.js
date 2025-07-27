import { safeQuerySelector, safeQuerySelectorAll, debounce } from "../utils.js";

export function initTeamCarousel() {
  const carousel = document.getElementById("team-carousel");
  if (!carousel) return;

  const carouselInner = safeQuerySelector(".carousel-inner", carousel);
  const prevButton = document.getElementById("carousel-prev");
  const nextButton = document.getElementById("carousel-next");

  if (!carouselInner) return;

  // Store original content for desktop restoration
  if (!carousel.getAttribute("data-original-content")) {
    carousel.setAttribute("data-original-content", carouselInner.innerHTML);
  }

  // Check if we're on mobile/tablet
  const isMobile = window.innerWidth <= 1024;

  // Clean up any existing event listeners and intervals
  cleanupCarousel(carousel);

  if (isMobile) {
    initMobileTeamCarousel(carousel, carouselInner, prevButton, nextButton);
  } else {
    initDesktopTeamCarousel(carousel, carouselInner, prevButton, nextButton);
  }

  // Re-initialize on window resize with proper cleanup
  const handleResize = debounce(() => {
    const newIsMobile = window.innerWidth <= 1024;
    if (newIsMobile !== isMobile) {
      // Clean up before reinitializing
      cleanupCarousel(carousel);
      // Reinitialize with new layout
      setTimeout(() => initTeamCarousel(), 100);
    }
  }, 250);

  // Remove existing resize listener if it exists
  if (carousel._resizeHandler) {
    window.removeEventListener("resize", carousel._resizeHandler);
  }

  // Store the handler reference for cleanup
  carousel._resizeHandler = handleResize;
  window.addEventListener("resize", handleResize);
}

function cleanupCarousel(carousel) {
  // Clear any existing intervals
  if (carousel._autoSlideInterval) {
    clearInterval(carousel._autoSlideInterval);
    carousel._autoSlideInterval = null;
  }

  // Remove event listeners
  if (carousel._eventListeners) {
    carousel._eventListeners.forEach(({ element, event, handler }) => {
      element.removeEventListener(event, handler);
    });
    carousel._eventListeners = [];
  } else {
    carousel._eventListeners = [];
  }
}

function addEventListenerWithCleanup(carousel, element, event, handler) {
  element.addEventListener(event, handler);
  carousel._eventListeners.push({ element, event, handler });
}

function initMobileTeamCarousel(
  carousel,
  carouselInner,
  prevButton,
  nextButton,
) {
  // Get all team members from both slides
  const allTeamMembers = [];
  const slides = carousel.querySelectorAll(".carousel-item");

  slides.forEach((slide) => {
    const members = slide.querySelectorAll(".team-card");
    members.forEach((member) => {
      allTeamMembers.push(member.cloneNode(true));
    });
  });

  if (allTeamMembers.length === 0) return;

  // Clear existing content and rebuild for mobile
  carouselInner.innerHTML = "";
  carouselInner.className =
    "carousel-inner-mobile flex overflow-x-auto snap-x snap-mandatory scroll-smooth";

  // Add each team member as individual slide
  allTeamMembers.forEach((member, index) => {
    const slideWrapper = document.createElement("div");
    slideWrapper.className = "flex-shrink-0 w-full snap-center px-4";
    slideWrapper.appendChild(member);
    carouselInner.appendChild(slideWrapper);
  });

  // Remove any existing indicators
  const existingIndicators = carousel.querySelector(".side-indicators");
  if (existingIndicators) {
    existingIndicators.remove();
  }

  // Style the existing navigation buttons to be more prominent like projects carousel
  if (prevButton) {
    prevButton.className =
      "carousel-control carousel-control-prev absolute top-1/2 left-4 transform -translate-y-1/2 bg-terracotta hover:bg-terracotta-light rounded-full p-2 shadow-lg z-30 flex items-center justify-center w-10 h-10";
    prevButton.style.display = "flex";
  }

  if (nextButton) {
    nextButton.className =
      "carousel-control carousel-control-next absolute top-1/2 right-4 transform -translate-y-1/2 bg-terracotta hover:bg-terracotta-light rounded-full p-2 shadow-lg z-30 flex items-center justify-center w-10 h-10";
    nextButton.style.display = "flex";
  }

  let currentIndex = 0;

  // Navigation buttons functionality
  const handlePrevClick = () => {
    if (currentIndex > 0) {
      currentIndex--;
      const slideWidth = carouselInner.offsetWidth;
      carouselInner.scrollTo({
        left: currentIndex * slideWidth,
        behavior: "smooth",
      });
    }
  };

  const handleNextClick = () => {
    if (currentIndex < allTeamMembers.length - 1) {
      currentIndex++;
      const slideWidth = carouselInner.offsetWidth;
      carouselInner.scrollTo({
        left: currentIndex * slideWidth,
        behavior: "smooth",
      });
    }
  };

  if (prevButton) {
    addEventListenerWithCleanup(carousel, prevButton, "click", handlePrevClick);
  }

  if (nextButton) {
    addEventListenerWithCleanup(carousel, nextButton, "click", handleNextClick);
  }

  // Update current index based on scroll position
  const updateCurrentIndex = () => {
    const scrollLeft = carouselInner.scrollLeft;
    const slideWidth = carouselInner.offsetWidth;
    currentIndex = Math.round(scrollLeft / slideWidth);

    // Update button visibility based on position
    if (prevButton) {
      prevButton.style.opacity = currentIndex > 0 ? "1" : "0.5";
    }
    if (nextButton) {
      nextButton.style.opacity =
        currentIndex < allTeamMembers.length - 1 ? "1" : "0.5";
    }
  };

  // Scroll event listener
  const debouncedUpdate = debounce(updateCurrentIndex, 50);
  addEventListenerWithCleanup(
    carousel,
    carouselInner,
    "scroll",
    debouncedUpdate,
  );

  // Touch/swipe support
  let startX = 0;
  let scrollLeft = 0;
  let isScrolling = false;

  const handleTouchStart = (e) => {
    startX = e.touches[0].pageX - carouselInner.offsetLeft;
    scrollLeft = carouselInner.scrollLeft;
    isScrolling = true;
  };

  const handleTouchMove = (e) => {
    if (!startX || !isScrolling) return;
    e.preventDefault();
    const x = e.touches[0].pageX - carouselInner.offsetLeft;
    const walk = (x - startX) * 2;
    carouselInner.scrollLeft = scrollLeft - walk;
  };

  const handleTouchEnd = () => {
    if (!isScrolling) return;
    startX = 0;
    isScrolling = false;
    // Snap to nearest slide
    const slideWidth = carouselInner.offsetWidth;
    const newIndex = Math.round(carouselInner.scrollLeft / slideWidth);
    currentIndex = newIndex;
    carouselInner.scrollTo({
      left: newIndex * slideWidth,
      behavior: "smooth",
    });
  };

  addEventListenerWithCleanup(
    carousel,
    carouselInner,
    "touchstart",
    handleTouchStart,
  );
  addEventListenerWithCleanup(
    carousel,
    carouselInner,
    "touchmove",
    handleTouchMove,
  );
  addEventListenerWithCleanup(
    carousel,
    carouselInner,
    "touchend",
    handleTouchEnd,
  );

  // Initialize button states
  setTimeout(() => {
    updateCurrentIndex();
  }, 100);
}

function initDesktopTeamCarousel(
  carousel,
  carouselInner,
  prevButton,
  nextButton,
) {
  // Restore original desktop content and structure
  const originalContent = carousel.getAttribute("data-original-content");

  if (originalContent) {
    carouselInner.innerHTML = originalContent;
  }

  // Remove any mobile indicators
  const sideIndicators = carousel.querySelector(".side-indicators");
  if (sideIndicators) {
    sideIndicators.remove();
  }

  // Ensure proper desktop classes
  carouselInner.className =
    "carousel-inner flex transition-transform duration-500 ease-in-out";

  // Reset button styles for desktop
  if (prevButton) {
    prevButton.className =
      "carousel-control carousel-control-prev absolute top-1/2 left-4 transform -translate-y-1/2 bg-terracotta hover:bg-terracotta-light rounded-full p-2 shadow-lg z-10";
    prevButton.style.display = "flex";
    prevButton.style.opacity = "1";
  }

  if (nextButton) {
    nextButton.className =
      "carousel-control carousel-control-next absolute top-1/2 right-4 transform -translate-y-1/2 bg-terracotta hover:bg-terracotta-light rounded-full p-2 shadow-lg z-10";
    nextButton.style.display = "flex";
    nextButton.style.opacity = "1";
  }

  // Wait for DOM to be ready before querying elements
  setTimeout(() => {
    // Re-query elements after restoring content
    const indicators = safeQuerySelectorAll(".carousel-indicator", carousel);
    const slides = safeQuerySelectorAll(".carousel-item", carousel);
    const totalSlides = slides.length;

    if (totalSlides === 0) return;

    let currentSlide = 0;

    function updateCarousel() {
      if (carouselInner) {
        carouselInner.style.transform = `translateX(-${currentSlide * 100}%)`;
      }

      indicators.forEach((indicator, index) => {
        indicator.classList.toggle("active", index === currentSlide);
      });
    }

    function startAutoSlide() {
      // Clear any existing interval
      if (carousel._autoSlideInterval) {
        clearInterval(carousel._autoSlideInterval);
      }

      carousel._autoSlideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
      }, 7000);
    }

    if (carouselInner && totalSlides > 0) {
      updateCarousel();

      const handlePrevClick = () => {
        currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
        updateCarousel();
      };

      const handleNextClick = () => {
        currentSlide = (currentSlide + 1) % totalSlides;
        updateCarousel();
      };

      if (prevButton) {
        addEventListenerWithCleanup(
          carousel,
          prevButton,
          "click",
          handlePrevClick,
        );
      }

      if (nextButton) {
        addEventListenerWithCleanup(
          carousel,
          nextButton,
          "click",
          handleNextClick,
        );
      }

      indicators.forEach((indicator, index) => {
        const handleIndicatorClick = () => {
          currentSlide = index;
          updateCarousel();
        };
        addEventListenerWithCleanup(
          carousel,
          indicator,
          "click",
          handleIndicatorClick,
        );
      });

      const handleMouseEnter = () => {
        if (carousel._autoSlideInterval) {
          clearInterval(carousel._autoSlideInterval);
        }
      };

      const handleMouseLeave = () => {
        startAutoSlide();
      };

      addEventListenerWithCleanup(
        carousel,
        carousel,
        "mouseenter",
        handleMouseEnter,
      );
      addEventListenerWithCleanup(
        carousel,
        carousel,
        "mouseleave",
        handleMouseLeave,
      );

      startAutoSlide();
    }
  }, 50);
}
