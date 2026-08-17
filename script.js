// Il Minollo B&B

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
  // Ordered list of gallery images. Add/remove a line here whenever
  // adding/removing pictures from img/.
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

  const frame = gallery.querySelector(".gallery__frame");
  const mainImage = gallery.querySelector(".gallery__main-image");
  const mainTrigger = gallery.querySelector(".gallery__main-trigger");
  const prevBtn = gallery.querySelector(".gallery__nav--prev");
  const nextBtn = gallery.querySelector(".gallery__nav--next");
  const thumbs = gallery.querySelector(".gallery__thumbs");

  let currentIndex = 0;
  let glightbox = null;

  const t = (key, fallback) =>
    (typeof window.minolloT === "function" && window.minolloT(key)) || fallback;

  const clampIndex = (index) => {
    const length = galleryImages.length;
    return ((index % length) + length) % length;
  };

  const setThumbLabel = (thumbEl, index) => {
    thumbEl.setAttribute(
      "aria-label",
      `${t("casa.gallery.thumbLabel", "Mostra la foto")} ${index + 1}`,
    );
  };

  const renderThumbs = () => {
    if (!thumbs) return;

    thumbs.innerHTML = "";

    galleryImages.forEach((src, index) => {
      // Each thumbnail is a GLightbox trigger in its own right: clicking
      // it opens the full-size lightbox gallery directly at this index.
      const thumbLink = document.createElement("a");
      thumbLink.href = src;
      thumbLink.className = "gallery__thumb glightbox";
      thumbLink.dataset.gallery = "casa-gallery";
      setThumbLabel(thumbLink, index);
      if (index === currentIndex) thumbLink.classList.add("is-active");

      const thumbImage = document.createElement("img");
      thumbImage.src = src;
      thumbImage.alt = "";
      thumbImage.loading = "lazy";

      thumbLink.appendChild(thumbImage);
      thumbLink.addEventListener("click", () => {
        currentIndex = index;
        updateMainImage();
      });

      thumbs.appendChild(thumbLink);
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

  const changeImage = (direction) => {
    currentIndex = clampIndex(currentIndex + direction);
    updateMainImage();
  };

  if (mainTrigger) {
    mainTrigger.addEventListener("click", () => {
      if (glightbox) glightbox.openAt(currentIndex);
    });
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

  // Touch swipe on the inline preview (the lightbox handles its own
  // swipe internally via GLightbox's touchNavigation option).
  if (frame) {
    const SWIPE_THRESHOLD = 40;
    let touchStartX = 0;
    let touchStartY = 0;

    frame.addEventListener(
      "touchstart",
      (event) => {
        const touch = event.changedTouches[0];
        touchStartX = touch.clientX;
        touchStartY = touch.clientY;
      },
      { passive: true },
    );

    frame.addEventListener(
      "touchend",
      (event) => {
        const touch = event.changedTouches[0];
        const deltaX = touch.clientX - touchStartX;
        const deltaY = touch.clientY - touchStartY;

        if (Math.abs(deltaX) > SWIPE_THRESHOLD && Math.abs(deltaX) > Math.abs(deltaY)) {
          changeImage(deltaX < 0 ? 1 : -1);
        }
      },
      { passive: true },
    );
  }

  // Thumbnails are created once; keep their aria-labels correct if the
  // user switches language later (i18n.js dispatches this event).
  window.addEventListener("minollo:langchange", () => {
    if (!thumbs) return;
    thumbs.querySelectorAll(".gallery__thumb").forEach((thumb, index) => {
      setThumbLabel(thumb, index);
    });
  });

  renderThumbs();
  updateMainImage();

  if (typeof GLightbox === "function") {
    glightbox = GLightbox({
      selector: ".glightbox",
      touchNavigation: true,
      keyboardNavigation: true,
      closeOnOutsideClick: true,
      loop: true,
      zoomable: true,
      draggable: true,
      openEffect: "zoom",
      closeEffect: "zoom",
    });

    glightbox.on("slide_changed", ({ current }) => {
      if (current && typeof current.slideIndex === "number") {
        currentIndex = current.slideIndex;
        updateMainImage();
      }
    });
  }
}
