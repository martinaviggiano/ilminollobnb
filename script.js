// Il Minollo B&B — small vanilla JS, no dependencies

document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Nav: shrink + solidify on scroll
  const nav = document.getElementById("nav");
  const onScroll = () => {
    nav.classList.toggle("is-scrolled", window.scrollY > 40);
  };
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  // Nav: mobile menu toggle
  const toggle = document.getElementById("navToggle");
  const menu = document.getElementById("navMenu");
  if (toggle && menu) {
    toggle.addEventListener("click", () => {
      const isOpen = menu.classList.toggle("is-open");
      toggle.classList.toggle("is-open", isOpen);
      toggle.setAttribute("aria-expanded", String(isOpen));
    });
    // close menu after tapping a link
    menu.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        menu.classList.remove("is-open");
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
      });
    });
  }

  initGallery();

  // Scroll-triggered reveal animations
  const revealEls = document.querySelectorAll(".reveal");
  if ("IntersectionObserver" in window && revealEls.length) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: "0px 0px -40px 0px" },
    );

    revealEls.forEach((el) => observer.observe(el));
  } else {
    // Fallback: show everything immediately
    revealEls.forEach((el) => el.classList.add("is-visible"));
  }
});

function initGallery() {
  const galleryImages = [
    "img/01_kitchen.jpg",
    "img/02_bathroom.jpg",
    "img/03_bedroom1.jpg",
    "img/04_front_door.jpg",
    "img/05_front.jpg",
    "img/06_aerial.jpg",
  ];

  const gallery = document.querySelector("[data-gallery]");
  if (!gallery) return;

  const mainImage = gallery.querySelector(".gallery__main-image");
  const mainTrigger = gallery.querySelector(".gallery__main-trigger");
  const prevBtn = gallery.querySelector(".gallery__nav--prev");
  const nextBtn = gallery.querySelector(".gallery__nav--next");
  const thumbs = gallery.querySelector(".gallery__thumbs");
  const lightbox = document.getElementById("photoLightbox");
  const lightboxImage = lightbox ? lightbox.querySelector(".lightbox__image") : null;
  const lightboxPrev = lightbox ? lightbox.querySelector(".lightbox__nav--prev") : null;
  const lightboxNext = lightbox ? lightbox.querySelector(".lightbox__nav--next") : null;
  const lightboxClose = lightbox ? lightbox.querySelector(".lightbox__close") : null;
  const lightboxCounter = lightbox ? lightbox.querySelector(".lightbox__count") : null;

  let currentIndex = 0;

  const clampIndex = (index) => {
    const length = galleryImages.length;
    return ((index % length) + length) % length;
  };

  const renderThumbs = () => {
    if (!thumbs) return;

    thumbs.innerHTML = "";

    galleryImages.forEach((src, index) => {
      const thumbButton = document.createElement("button");
      thumbButton.type = "button";
      thumbButton.className = "gallery__thumb";
      thumbButton.setAttribute("aria-label", `Mostra la foto ${index + 1}`);
      if (index === currentIndex) thumbButton.classList.add("is-active");

      const thumbImage = document.createElement("img");
      thumbImage.src = src;
      thumbImage.alt = "";
      thumbImage.loading = "lazy";

      thumbButton.appendChild(thumbImage);
      thumbButton.addEventListener("click", () => {
        currentIndex = index;
        updateMainImage();
        openLightbox();
      });

      thumbs.appendChild(thumbButton);
    });
  };

  const updateMainImage = () => {
    if (!mainImage) return;
    mainImage.src = galleryImages[currentIndex];
    mainImage.alt = "";

    if (thumbs) {
      thumbs.querySelectorAll(".gallery__thumb").forEach((thumb, index) => {
        thumb.classList.toggle("is-active", index === currentIndex);
      });
    }
  };

  const updateLightbox = () => {
    if (!lightbox || !lightboxImage || !lightboxCounter) return;

    lightboxImage.src = galleryImages[currentIndex];
    lightboxImage.alt = "";
    lightboxCounter.textContent = `${currentIndex + 1} / ${galleryImages.length}`;
  };

  const openLightbox = () => {
    if (!lightbox) return;
    currentIndex = clampIndex(currentIndex);
    updateLightbox();
    lightbox.classList.add("is-open");
    lightbox.setAttribute("aria-hidden", "false");
    document.body.classList.add("lightbox-open");
  };

  const closeLightbox = () => {
    if (!lightbox) return;
    lightbox.classList.remove("is-open");
    lightbox.setAttribute("aria-hidden", "true");
    document.body.classList.remove("lightbox-open");
  };

  const changeImage = (direction) => {
    currentIndex = clampIndex(currentIndex + direction);
    updateMainImage();
    if (lightbox && lightbox.classList.contains("is-open")) {
      updateLightbox();
    }
  };

  if (mainTrigger) {
    mainTrigger.addEventListener("click", () => openLightbox());
  }

  if (prevBtn) {
    prevBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      changeImage(-1);
    });
  }

  if (nextBtn) {
    nextBtn.addEventListener("click", (event) => {
      event.stopPropagation();
      changeImage(1);
    });
  }

  if (lightboxPrev) {
    lightboxPrev.addEventListener("click", () => changeImage(-1));
  }

  if (lightboxNext) {
    lightboxNext.addEventListener("click", () => changeImage(1));
  }

  if (lightboxClose) {
    lightboxClose.addEventListener("click", closeLightbox);
  }

  if (lightbox) {
    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });
  }

  window.addEventListener("keydown", (event) => {
    if (!lightbox || !lightbox.classList.contains("is-open")) return;

    if (event.key === "Escape") {
      closeLightbox();
    }

    if (event.key === "ArrowLeft") {
      changeImage(-1);
    }

    if (event.key === "ArrowRight") {
      changeImage(1);
    }
  });

  renderThumbs();
  updateMainImage();
}
