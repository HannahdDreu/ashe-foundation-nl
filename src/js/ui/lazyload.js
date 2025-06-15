export function initLazyLoading() {
  const images = document.querySelectorAll("[data-src]");
  const observer = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.getAttribute("data-src");
          img.removeAttribute("data-src");
          observer.unobserve(img);
        }
      });
    },
    {
      rootMargin: "50px",
      threshold: 0.01,
    },
  );

  images.forEach((img) => observer.observe(img));

  const bgElements = document.querySelectorAll("[data-bg-src]");
  const bgObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const el = entry.target;
          el.style.backgroundImage = `url('${el.getAttribute("data-bg-src")}')`;
          el.removeAttribute("data-bg-src");
          observer.unobserve(el);
        }
      });
    },
    {
      rootMargin: "100px",
      threshold: 0.01,
    },
  );

  bgElements.forEach((el) => bgObserver.observe(el));
}
