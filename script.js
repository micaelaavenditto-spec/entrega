const title = document.querySelector("[data-kinetic]");
const header = document.querySelector(".site-header");

if (title) {
  const text = title.textContent;
  title.textContent = "";

  const words = text.split(" ");
  words.forEach((word, wordIndex) => {
    const wordSpan = document.createElement("span");
    wordSpan.className = "word";

    for (const char of word) {
      const span = document.createElement("span");
      span.className = "char";
      span.textContent = char;
      wordSpan.appendChild(span);
    }

    title.appendChild(wordSpan);

    if (wordIndex < words.length - 1) {
      const spaceSpan = document.createElement("span");
      spaceSpan.className = "char space";
      spaceSpan.textContent = "\u00a0";
      title.appendChild(spaceSpan);
    }
  });

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
