const header = document.getElementById("siteHeader");
const hero = document.getElementById("hero");
const navToggle = document.querySelector(".nav-toggle");
const navLinks = document.querySelector(".nav-links");
const faqPanel = document.querySelector("[data-accordion]");

const carousel = document.querySelector(".carousel");
const carouselMain = document.getElementById("carouselMain");
const mainImage = document.getElementById("mainImage");
const zoomLens = document.getElementById("zoomLens");
const zoomPreview = document.getElementById("zoomPreview");
const thumbs = Array.from(document.querySelectorAll(".thumb"));
const prevBtn = document.querySelector(".carousel-btn.prev");
const nextBtn = document.querySelector(".carousel-btn.next");

const images = thumbs.map((thumb) => thumb.querySelector("img").src);
let activeIndex = 0;

// Toggle sticky header after the hero section is out of view.
const onScroll = () => {
  const heroBottom = hero.getBoundingClientRect().bottom;
  if (heroBottom <= 120) {
    header.classList.add("header-stuck");
  } else {
    header.classList.remove("header-stuck");
  }
};

// Sync main image and thumb state for the gallery.
const setActiveImage = (index) => {
  activeIndex = (index + images.length) % images.length;
  mainImage.src = images[activeIndex];
  thumbs.forEach((thumb, idx) => {
    thumb.classList.toggle("is-active", idx === activeIndex);
  });
};

// Move the zoom lens and update the magnified preview position.
const moveLens = (event) => {
  const rect = mainImage.getBoundingClientRect();
  const lensSize = zoomLens.offsetWidth / 2;
  const x = Math.max(
    rect.left,
    Math.min(event.clientX - lensSize, rect.right - lensSize * 2)
  );
  const y = Math.max(
    rect.top,
    Math.min(event.clientY - lensSize, rect.bottom - lensSize * 2)
  );
  const lensX = x - rect.left;
  const lensY = y - rect.top;

  zoomLens.style.transform = `translate(${lensX}px, ${lensY}px)`;

  const zoomX = (lensX / rect.width) * 100;
  const zoomY = (lensY / rect.height) * 100;

  zoomPreview.style.backgroundImage = `url('${mainImage.src}')`;
  zoomPreview.style.backgroundSize = "220% 220%";
  zoomPreview.style.backgroundPosition = `${zoomX}% ${zoomY}%`;
};

const onZoomEnter = () => {
  carousel.classList.add("is-zooming");
};

const onZoomLeave = () => {
  carousel.classList.remove("is-zooming");
};

const onToggleNav = () => {
  navLinks.classList.toggle("is-open");
};

// Accordion behavior: keep only one FAQ item open at a time.
const onAccordionClick = (event) => {
  const button = event.target.closest(".faq-question");
  if (!button) {
    return;
  }

  const item = button.parentElement;
  const isOpen = item.classList.contains("is-open");

  faqPanel.querySelectorAll(".faq-item").forEach((entry) => {
    entry.classList.remove("is-open");
    const entryButton = entry.querySelector(".faq-question");
    if (entryButton) {
      entryButton.setAttribute("aria-expanded", "false");
    }
  });

  if (!isOpen) {
    item.classList.add("is-open");
    button.setAttribute("aria-expanded", "true");
  }
};

// Scroll the applications rail when the arrow buttons are clicked.
const onCarouselClick = (event) => {
  const button = event.target.closest("[data-carousel]");
  if (!button) {
    return;
  }

  const name = button.dataset.carousel;
  const dir = button.dataset.dir;
  const track = document.querySelector(`[data-carousel-track="${name}"]`);
  if (!track) {
    return;
  }

  const step = track.clientWidth * 0.8;
  const amount = dir === "next" ? step : -step;
  track.scrollBy({ left: amount, behavior: "smooth" });
};

window.addEventListener("scroll", onScroll);
window.addEventListener("load", onScroll);

thumbs.forEach((thumb) => {
  thumb.addEventListener("click", () => {
    setActiveImage(Number(thumb.dataset.index));
  });
});

prevBtn.addEventListener("click", () => setActiveImage(activeIndex - 1));
nextBtn.addEventListener("click", () => setActiveImage(activeIndex + 1));

carouselMain.addEventListener("mousemove", moveLens);
carouselMain.addEventListener("mouseenter", onZoomEnter);
carouselMain.addEventListener("mouseleave", onZoomLeave);

navToggle.addEventListener("click", onToggleNav);

if (faqPanel) {
  faqPanel.addEventListener("click", onAccordionClick);
}

document.addEventListener("click", onCarouselClick);
