const title = document.querySelector("[data-kinetic]");
const header = document.querySelector(".site-header");

const scenariosGallery = document.querySelector(".amphion-scenarios");

if (scenariosGallery) {
  const scenarioImages = [...scenariosGallery.querySelectorAll(".amphion-scenarios__image")];
  const scenarioButtons = [...scenariosGallery.querySelectorAll(".amphion-scenarios__card")];
  let activeScenario = 0;
  let scenarioTimer;

  const setScenario = (index) => {
    activeScenario = (index + scenarioImages.length) % scenarioImages.length;

    scenarioImages.forEach((image, imageIndex) => {
      image.classList.toggle("is-active", imageIndex === activeScenario);
    });

    scenarioButtons.forEach((button, buttonIndex) => {
      const isActive = buttonIndex === activeScenario;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-selected", String(isActive));
    });
  };

  const stopScenarioAutoplay = () => {
    window.clearInterval(scenarioTimer);
    scenarioTimer = undefined;
  };

  const startScenarioAutoplay = () => {
    stopScenarioAutoplay();
    scenarioTimer = window.setInterval(() => setScenario(activeScenario + 1), 6000);
  };

  scenarioButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setScenario(Number(button.dataset.scenario));
      startScenarioAutoplay();
    });
  });

  scenariosGallery.addEventListener("mouseenter", stopScenarioAutoplay);
  scenariosGallery.addEventListener("mouseleave", startScenarioAutoplay);
  setScenario(0);
  startScenarioAutoplay();
}

if (title) {
  const sourceLines = [...title.querySelectorAll(".kinetic-line")].map((line) => line.textContent.trim());
  const lines = sourceLines.length ? sourceLines : [title.textContent.trim()];
  title.textContent = "";

  lines.forEach((line) => {
    const lineSpan = document.createElement("span");
    lineSpan.className = "kinetic-line";
    const words = line.split(" ");

    words.forEach((word, wordIndex) => {
      const wordSpan = document.createElement("span");
      wordSpan.className = "word";

      for (const char of word) {
        const span = document.createElement("span");
        span.className = "char";
        span.textContent = char;
        wordSpan.appendChild(span);
      }

      lineSpan.appendChild(wordSpan);

      if (wordIndex < words.length - 1) {
        const spaceSpan = document.createElement("span");
        spaceSpan.className = "char space";
        spaceSpan.textContent = "\u00a0";
        lineSpan.appendChild(spaceSpan);
      }
    });

    title.appendChild(lineSpan);
  });

  const words = [...title.querySelectorAll(".word")];
  const section = title.closest(".kinetic-section");
  let titleTicking = false;

  const updateKineticTitle = () => {
    const rect = section.getBoundingClientRect();
    const start = window.innerHeight * 0.86;
    const distance = window.innerHeight * 0.62;
    const progress = Math.min(1, Math.max(0, (start - rect.top) / distance));
    const overlap = 1.65;
    const range = words.length + overlap - 1;
    const colorStart = 184;
    const colorEnd = 17;

    words.forEach((word, index) => {
      const wordProgress = Math.min(1, Math.max(0, (progress * range - index) / overlap));
      const easedProgress = 1 - Math.pow(1 - wordProgress, 3);
      const channel = Math.round(colorStart + (colorEnd - colorStart) * easedProgress);
      word.style.color = `rgb(${channel}, ${channel}, ${channel})`;
    });

    titleTicking = false;
  };

  const requestKineticTitleUpdate = () => {
    if (titleTicking) return;
    titleTicking = true;
    requestAnimationFrame(updateKineticTitle);
  };

  const titleObserver = new IntersectionObserver((entries) => {
    const [entry] = entries;

    if (entry.isIntersecting) {
      window.addEventListener("scroll", requestKineticTitleUpdate, { passive: true });
      requestKineticTitleUpdate();
    } else {
      window.removeEventListener("scroll", requestKineticTitleUpdate);
      updateKineticTitle();
    }
  });

  titleObserver.observe(section);
}

const bikeDetailSection = document.querySelector(".kinetic-section");

if (bikeDetailSection) {
  const bikeDetails = [
    {
      number: "01",
      title: "Rodado 29",
      description:
        "Mayor estabilidad y mejor capacidad para superar pozos, piedras y desniveles. Conserva mejor la velocidad en recorridos largos.",
    },
    {
      number: "02",
      title: "Geometría",
      description:
        "Distribuye mejor el peso y brinda una posición equilibrada para ganar control, comodidad y confianza.",
    },
    {
      number: "03",
      title: "Cubiertas",
      description: "Su dibujo mejora el agarre y la tracción en tierra, curvas y superficies irregulares.",
    },
    {
      number: "04",
      title: "Postura de conducción",
      description:
        "La relación entre manubrio, stem, asiento y geometría favorece una posición cómoda y estable durante recorridos prolongados.",
    },
  ];

  const bikePoints = [...bikeDetailSection.querySelectorAll(".bike-point")];
  const bikeNavItems = [...bikeDetailSection.querySelectorAll(".bike-info-panel__item")];
  const bikePanel = bikeDetailSection.querySelector(".bike-info-panel");
  const bikePanelNumber = bikeDetailSection.querySelector(".bike-info-panel__number");
  const bikePanelTitle = bikeDetailSection.querySelector(".bike-info-panel__title");
  const bikePanelDescription = bikeDetailSection.querySelector(".bike-info-panel__description");
  let activeBikeDetail = 0;
  let bikeDetailTimer;

  const updateBikeDetail = (index) => {
    const nextIndex = Math.min(bikeDetails.length - 1, Math.max(0, Number(index)));
    const detail = bikeDetails[nextIndex];

    if (!detail || nextIndex === activeBikeDetail) return;

    activeBikeDetail = nextIndex;
    window.clearTimeout(bikeDetailTimer);
    bikePanel.classList.add("is-changing");

    bikeDetailTimer = window.setTimeout(() => {
      bikePanelNumber.textContent = detail.number;
      bikePanelTitle.textContent = detail.title;
      bikePanelDescription.textContent = detail.description;
      bikePanel.classList.remove("is-changing");
    }, 160);

    bikePoints.forEach((point) => {
      const isActive = Number(point.dataset.bikeDetail) === nextIndex;
      point.classList.toggle("is-active", isActive);
      point.setAttribute("aria-pressed", String(isActive));
    });

    bikeNavItems.forEach((item) => {
      const isActive = Number(item.dataset.bikeDetail) === nextIndex;
      item.classList.toggle("is-active", isActive);
      item.setAttribute("aria-pressed", String(isActive));
    });
  };

  [...bikePoints, ...bikeNavItems].forEach((control) => {
    control.addEventListener("mouseenter", () => updateBikeDetail(control.dataset.bikeDetail));
    control.addEventListener("focus", () => updateBikeDetail(control.dataset.bikeDetail));
    control.addEventListener("click", () => updateBikeDetail(control.dataset.bikeDetail));
  });

  bikePoints.forEach((point, index) => point.setAttribute("aria-pressed", String(index === activeBikeDetail)));
  bikeNavItems.forEach((item, index) => item.setAttribute("aria-pressed", String(index === activeBikeDetail)));
}

if (header) {
  let lastScrollY = window.scrollY;
  let lastPointerY = 0;

  const showHeader = () => header.classList.remove("is-hidden");
  const hideHeader = () => {
    if (!header.classList.contains("menu-open")) header.classList.add("is-hidden");
  };
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

const navToggle = document.querySelector(".nav-toggle");
const mainNav = document.querySelector("#main-nav");

if (header && navToggle && mainNav) {
  const closeMobileMenu = () => {
    header.classList.remove("menu-open");
    navToggle.setAttribute("aria-expanded", "false");
    navToggle.setAttribute("aria-label", "Abrir menú");
  };

  navToggle.addEventListener("click", () => {
    const isOpen = header.classList.toggle("menu-open");
    header.classList.remove("is-hidden");
    navToggle.setAttribute("aria-expanded", String(isOpen));
    navToggle.setAttribute("aria-label", isOpen ? "Cerrar menú" : "Abrir menú");
  });

  mainNav.querySelectorAll("a").forEach((link) => link.addEventListener("click", closeMobileMenu));

  window.addEventListener("resize", () => {
    if (window.innerWidth > 767) closeMobileMenu();
  });
}

// Amphion color selector
const amphionColors = [
  { name: "Negro", image: "venzo negra.png", swatch: "#171717" },
  { name: "Verde", image: "venzo verde.png", swatch: "#aadd00" },
  { name: "Rosa", image: "venzo_rosa.png", swatch: "#d84b9b" }
];

const colorSelector = document.querySelector(".amphion-colors");

if (colorSelector) {
  const slidesContainer = colorSelector.querySelector(".amphion-colors__slides");
  const swatchesContainer = colorSelector.querySelector(".amphion-colors__swatches");
  const previousButton = colorSelector.querySelector(".amphion-colors__arrow--prev");
  const nextButton = colorSelector.querySelector(".amphion-colors__arrow--next");
  const slides = [];
  const swatches = [];
  let currentColor = 0;

  amphionColors.forEach((color, index) => {
    const slide = document.createElement("figure");
    slide.className = "amphion-colors__slide";

    const image = document.createElement("img");
    image.src = color.image;
    image.alt = `Venzo Amphion color ${color.name}`;
    slide.appendChild(image);
    slidesContainer.appendChild(slide);
    slides.push(slide);

    const swatch = document.createElement("button");
    swatch.className = "amphion-colors__swatch";
    swatch.type = "button";
    swatch.style.backgroundColor = color.swatch;
    swatch.setAttribute("aria-label", color.name);
    swatch.addEventListener("click", () => updateColor(index));
    swatchesContainer.appendChild(swatch);
    swatches.push(swatch);
  });

  const updateColor = (index) => {
    currentColor = (index + amphionColors.length) % amphionColors.length;
    const previous = (currentColor - 1 + amphionColors.length) % amphionColors.length;
    const next = (currentColor + 1) % amphionColors.length;

    slides.forEach((slide, slideIndex) => {
      slide.classList.toggle("is-current", slideIndex === currentColor);
      slide.classList.toggle("is-previous", slideIndex === previous);
      slide.classList.toggle("is-next", slideIndex === next);
      slide.setAttribute("aria-hidden", slideIndex === currentColor ? "false" : "true");
    });

    swatches.forEach((swatch, swatchIndex) => {
      const isActive = swatchIndex === currentColor;
      swatch.classList.toggle("is-active", isActive);
      swatch.setAttribute("aria-pressed", String(isActive));
    });
  };

  previousButton.addEventListener("click", () => updateColor(currentColor - 1));
  nextButton.addEventListener("click", () => updateColor(currentColor + 1));
  updateColor(0);
}

// Capabilities title scroll reading
const capabilitiesTitle = document.querySelector("[data-capabilities-read]");

if (capabilitiesTitle) {
  const capabilityWords = [...capabilitiesTitle.querySelectorAll(".amphion-capabilities__word")];
  const capabilitiesSection = capabilitiesTitle.closest(".amphion-capabilities");
  let capabilitiesTicking = false;

  const updateCapabilitiesTitle = () => {
    const rect = capabilitiesSection.getBoundingClientRect();
    const start = window.innerHeight * 0.86;
    const distance = window.innerHeight * 0.62;
    const progress = Math.min(1, Math.max(0, (start - rect.top) / distance));
    const overlap = 1.65;
    const range = capabilityWords.length + overlap - 1;
    const colorStart = 184;
    const colorEnd = 17;

    capabilityWords.forEach((word, index) => {
      const wordProgress = Math.min(1, Math.max(0, (progress * range - index) / overlap));
      const easedProgress = 1 - Math.pow(1 - wordProgress, 3);
      const channel = Math.round(colorStart + (colorEnd - colorStart) * easedProgress);
      word.style.color = `rgb(${channel}, ${channel}, ${channel})`;
    });

    capabilitiesTicking = false;
  };

  const requestCapabilitiesUpdate = () => {
    if (capabilitiesTicking) return;
    capabilitiesTicking = true;
    requestAnimationFrame(updateCapabilitiesTitle);
  };

  const capabilitiesObserver = new IntersectionObserver((entries) => {
    const [entry] = entries;

    if (entry.isIntersecting) {
      window.addEventListener("scroll", requestCapabilitiesUpdate, { passive: true });
      requestCapabilitiesUpdate();
    } else {
      window.removeEventListener("scroll", requestCapabilitiesUpdate);
      updateCapabilitiesTitle();
    }
  });

  capabilitiesObserver.observe(capabilitiesSection);
}

const capabilitiesCarousel = document.querySelector(".amphion-capabilities__gallery");

if (capabilitiesCarousel) {
  const capabilitySlides = [...capabilitiesCarousel.querySelectorAll(".amphion-capabilities__media")];
  const capabilityCaptions = [...document.querySelectorAll(".amphion-capabilities__caption")];
  const capabilityNext = capabilitiesCarousel.querySelector(".amphion-capabilities__arrow");
  let capabilitySlideIndex = 0;

  const showCapabilitySlide = (index) => {
    capabilitySlideIndex = (index + capabilitySlides.length) % capabilitySlides.length;

    capabilitySlides.forEach((slide, slideIndex) => {
      const isActive = slideIndex === capabilitySlideIndex;
      slide.classList.toggle("is-active", isActive);
      slide.setAttribute("aria-hidden", String(!isActive));
    });

    capabilityCaptions.forEach((caption, captionIndex) => {
      const isActive = captionIndex === capabilitySlideIndex;
      caption.classList.toggle("is-active", isActive);
      caption.setAttribute("aria-hidden", String(!isActive));
    });
  };

  capabilityNext.addEventListener("click", () => showCapabilitySlide(capabilitySlideIndex + 1));
  showCapabilitySlide(0);
}

// Team Venzo interactive stories
const teamVenzo = document.querySelector(".team-venzo");

if (teamVenzo) {
  const teamStories = [
    { name: "Sebastián, 34", location: "Mendoza", quote: "Terminé mi primera competencia con la Amphion y el apoyo del team.", image: "team_1.png" },
    { name: "Pedro Martínez, 38", location: "Buenos Aires", quote: "Volví a salir los fines de semana y encontré un grupo con el mismo entusiasmo.", image: "team_2.png" },
    { name: "Adrián Ortega, 41", location: "Córdoba", quote: "La Amphion me dio confianza para probar recorridos que antes evitaba.", image: "team_3.png" },
    { name: "Lucía Fernández, 32", location: "Bariloche", quote: "Cada salida se convirtió en una forma de desconectarme y superarme.", image: "team_4.png" },
  ];

  const storyPanel = teamVenzo.querySelector(".team-venzo__story");
  const storyCard = teamVenzo.querySelector(".team-venzo__card");
  const storyImages = [...teamVenzo.querySelectorAll(".team-venzo__image")];
  const riderName = teamVenzo.querySelector(".team-venzo__name");
  const riderLocation = teamVenzo.querySelector(".team-venzo__location");
  const riderQuote = teamVenzo.querySelector(".team-venzo__quote");
  const storyProgress = teamVenzo.querySelector(".team-venzo__progress");
  const storyBars = [...teamVenzo.querySelectorAll(".team-venzo__bars button")];
  let activeTeamStory = 0;
  let teamStoryTimer;
  let teamAutoplayTimer;
  let teamScrollTimer;
  let teamScrollTicking = false;


  const joinLink = teamVenzo.querySelector(".team-venzo__cta");

  const createJoinSection = () => {
    const section = document.createElement("section");
    section.className = "team-join";
    section.id = "unirme";
    section.setAttribute("aria-labelledby", "team-join-title");
    section.innerHTML = `
      <div class="team-join__inner">
        <div class="team-join__heading">
          <p class="section-eyebrow team-join__eyebrow">TEAM VENZO</p>
          <h2 class="team-join__title" id="team-join-title">Sumate a la comunidad.</h2>
          <p class="team-join__subtitle">Completá tus datos y empezá a formar parte del Team Venzo.</p>
        </div>
        <form class="team-join__form">
          <label class="team-join__field">
            <span>Nombre</span>
            <input type="text" name="name" autocomplete="name" required>
          </label>
          <label class="team-join__field">
            <span>Edad</span>
            <input type="number" name="age" min="16" inputmode="numeric" required>
          </label>
          <label class="team-join__field">
            <span>Mail</span>
            <input type="email" name="email" autocomplete="email" required>
          </label>
          <button class="team-join__submit" type="submit">UNIRME</button>
          <p class="team-join__note" aria-live="polite">Te va a llegar al mail la confirmación para unirte al Team Venzo.</p>
        </form>
      </div>
    `;

    teamVenzo.insertAdjacentElement("afterend", section);
    const form = section.querySelector(".team-join__form");
    const submitButton = form.querySelector(".team-join__submit");
    const confirmation = form.querySelector(".team-join__note");

    form.addEventListener("submit", (event) => {
      event.preventDefault();
      if (submitButton.disabled) return;

      submitButton.disabled = true;
      confirmation.classList.add("is-visible");
    });
    return section;
  };

  joinLink.addEventListener("click", (event) => {
    event.preventDefault();
    const joinSection = document.querySelector("#unirme") || createJoinSection();
    requestAnimationFrame(() => joinSection.scrollIntoView({ behavior: "smooth", block: "start" }));
  });

  const triggerTeamPulse = () => {
    if (!storyCard) return;
    storyCard.classList.remove("is-pulsing");
    void storyCard.offsetWidth;
    storyCard.classList.add("is-pulsing");
  };

  if (storyCard) {
    storyCard.addEventListener("animationend", () => storyCard.classList.remove("is-pulsing"));
  }

  const stopTeamAutoplay = () => {
    window.clearInterval(teamAutoplayTimer);
    teamAutoplayTimer = undefined;
  };

  const startTeamAutoplay = () => {
    stopTeamAutoplay();
    teamAutoplayTimer = window.setInterval(() => showTeamSlide(activeTeamStory + 1), 5000);
  };

  const restartTeamAutoplay = () => {
    startTeamAutoplay();
  };

  const showTeamSlide = (index, shouldRestartAutoplay = false) => {
    const nextIndex = (index + teamStories.length) % teamStories.length;
    const story = teamStories[nextIndex];

    if (!story) return;

    if (nextIndex === activeTeamStory) {
      if (shouldRestartAutoplay) restartTeamAutoplay();
      return;
    }

    activeTeamStory = nextIndex;
    window.clearTimeout(teamStoryTimer);
    storyPanel.classList.add("is-changing");
    triggerTeamPulse();

    storyImages.forEach((image, imageIndex) => {
      image.classList.toggle("is-active", imageIndex === nextIndex);
    });

    storyBars.forEach((bar, barIndex) => {
      bar.classList.toggle("is-active", barIndex === nextIndex);
    });

    teamStoryTimer = window.setTimeout(() => {
      riderName.textContent = story.name;
      riderLocation.textContent = story.location;
      riderQuote.textContent = `“${story.quote}”`;
      storyProgress.textContent = `${String(nextIndex + 1).padStart(2, "0")} / ${String(teamStories.length).padStart(2, "0")}`;
      storyPanel.classList.remove("is-changing");
    }, 160);

    if (shouldRestartAutoplay) {
      restartTeamAutoplay();
    }
  };

  const isTeamStickyDisabled = () => window.matchMedia("(max-height: 620px)").matches;

  const updateTeamFromScroll = () => {
    teamScrollTicking = false;

    if (isTeamStickyDisabled()) return;

    const rect = teamVenzo.getBoundingClientRect();
    const headerHeight = Number.parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-height")) || 0;
    const scrollableDistance = Math.max(1, teamVenzo.offsetHeight - window.innerHeight);
    const progress = Math.min(1, Math.max(0, (headerHeight - rect.top) / scrollableDistance));
    const index = Math.min(teamStories.length - 1, Math.floor(progress * teamStories.length));

    if (rect.top <= headerHeight && rect.bottom >= window.innerHeight) {
      showTeamSlide(index);
    }
  };

  const requestTeamScrollUpdate = () => {
    if (isTeamStickyDisabled()) return;

    stopTeamAutoplay();
    window.clearTimeout(teamScrollTimer);
    teamScrollTimer = window.setTimeout(startTeamAutoplay, 1200);

    if (teamScrollTicking) return;
    teamScrollTicking = true;
    requestAnimationFrame(updateTeamFromScroll);
  };

  storyBars.forEach((bar, index) => {
    bar.addEventListener("click", () => showTeamSlide(index, true));
  });
  window.addEventListener("scroll", requestTeamScrollUpdate, { passive: true });
  window.addEventListener("resize", () => {
    requestTeamScrollUpdate();
    restartTeamAutoplay();
  });
  showTeamSlide(0);
  startTeamAutoplay();
}
