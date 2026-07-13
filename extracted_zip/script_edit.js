const title = document.querySelector("[data-kinetic]");
const header = document.querySelector(".site-header");

if (title) {
  const text = title.textContent;
  title.textContent = "";

  for (const char of text) {
    const span = document.createElement("span");
    span.className = char === " " ? "char space" : "char";
    span.textContent = char === " " ? "\u00a0" : char;
    title.appendChild(span);
  }

  const chars = [...title.querySelectorAll(".char")];

  window.addEventListener("pointermove", (event) => {
    const influence = Math.min(window.innerWidth, 620) * 0.34;

    chars.forEach((char) => {
      const rect = char.getBoundingClientRect();
      const x = rect.left + rect.width / 2;
      const y = rect.top + rect.height / 2;
      const distance = Math.hypot(event.clientX - x, event.clientY - y);
      const force = Math.max(0, 1 - distance / influence);

      char.style.setProperty("--lift", `${-28 * force}px`);
      char.style.setProperty("--scale", `${1 + 0.18 * force}`);
      char.style.setProperty("--fade", `${0.62 + 0.38 * (1 - force)}`);
    });
  });

  window.addEventListener("pointerleave", () => {
    chars.forEach((char) => {
      char.style.removeProperty("--lift");
      char.style.removeProperty("--scale");
      char.style.removeProperty("--fade");
    });
  });
}

document.querySelector(".ride-form")?.addEventListener("submit", (event) => {
  event.preventDefault();
  const button = event.currentTarget.querySelector("button");
  button.textContent = "Solicitud recibida";
  button.disabled = true;
});

if (header) {
  let lastScrollY = window.scrollY;
  let lastPointerY = 0;

  const showHeader = () => header.classList.remove("is-hidden");
  const hideHeader = () => header.classList.add("is-hidden");
  const darkSections = [".hero", ".detail-band"];

  const updateHeaderContrast = () => {
    const headerLine = header.getBoundingClientRect().bottom + 8;
    const isOnDark = darkSections.some((selector) => {
      const section = document.querySelector(selector);
      if (!section) return false;

      const rect = section.getBoundingClientRect();
      return rect.top <= headerLine && rect.bottom >= headerLine;
    });

    header.classList.toggle("on-light", !isOnDark);
  };

  window.addEventListener("scroll", () => {
    const currentScrollY = window.scrollY;
    const scrollingDown = currentScrollY > lastScrollY;

    if (currentScrollY < 80 || !scrollingDown) {
      showHeader();
    } else {
      hideHeader();
    }

    lastScrollY = currentScrollY;
    updateHeaderContrast();
  });

  window.addEventListener("pointermove", (event) => {
    const movingUp = event.clientY < lastPointerY;

    if (event.clientY < 92 || movingUp) {
      showHeader();
    } else if (window.scrollY > 80 && event.clientY > 150) {
      hideHeader();
    }

    lastPointerY = event.clientY;
    updateHeaderContrast();
  });

  header.addEventListener("focusin", showHeader);
  updateHeaderContrast();
}

// Carrusel de colores
const slides    = [...document.querySelectorAll(".bike-slide")];
const dots      = [...document.querySelectorAll(".color-dot")];
const prevBtn   = document.querySelector(".bike-arrow-prev");
const nextBtn   = document.querySelector(".bike-arrow-next");

if (slides.length) {
  let current = 0;

  const goTo = (index) => {
    slides[current].classList.remove("active");
    dots[current].classList.remove("active");
    current = (index + slides.length) % slides.length;
    slides[current].classList.add("active");
    dots[current].classList.add("active");
  };

  prevBtn?.addEventListener("click", () => goTo(current - 1));
  nextBtn?.addEventListener("click", () => goTo(current + 1));
  dots.forEach(dot => dot.addEventListener("click", () => goTo(+dot.dataset.index)));
}

// Carrusel Team Venzo
const teamSlides = [...document.querySelectorAll(".team-slide")];
const teamPrev   = document.querySelector(".team-arrow-prev");
const teamNext   = document.querySelector(".team-arrow-next");

if (teamSlides.length) {
  let teamCurrent = 0;
  teamSlides[0].classList.add("active");

  const teamGoTo = (index) => {
    teamSlides[teamCurrent].classList.remove("active");
    teamCurrent = (index + teamSlides.length) % teamSlides.length;
    teamSlides[teamCurrent].classList.add("active");
  };

  teamPrev?.addEventListener("click", () => teamGoTo(teamCurrent - 1));
  teamNext?.addEventListener("click", () => teamGoTo(teamCurrent + 1));
}
