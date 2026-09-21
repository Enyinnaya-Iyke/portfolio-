(() => {
  const root = document.documentElement;
  const body = document.body;
  const header = document.querySelector(".site-header");
  const themeToggle = document.querySelector(".theme-toggle");
  const menuToggle = document.querySelector(".menu-toggle");
  const mobileMenu = document.querySelector(".mobile-menu");
  const mobileLinks = document.querySelectorAll(".mobile-menu a");
  const navLinks = document.querySelectorAll(".desktop-nav .nav-link");
  const sections = document.querySelectorAll("main section[id]");
  const revealElements = document.querySelectorAll(".reveal");
  const placeholderLinks = document.querySelectorAll('[data-placeholder="true"]');
  const year = document.querySelector("#year");

  const savedTheme = localStorage.getItem("portfolio-theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  function setTheme(theme) {
    root.dataset.theme = theme;
    localStorage.setItem("portfolio-theme", theme);

    const isDark = theme === "dark";
    themeToggle.setAttribute("aria-pressed", String(isDark));
    themeToggle.setAttribute(
      "aria-label",
      isDark ? "Switch to light mode" : "Switch to dark mode"
    );
  }

  setTheme(savedTheme || (prefersDark ? "dark" : "light"));

  themeToggle.addEventListener("click", () => {
    setTheme(root.dataset.theme === "dark" ? "light" : "dark");
  });

  function updateHeader() {
    header.classList.toggle("scrolled", window.scrollY > 20);
  }

  updateHeader();
  window.addEventListener("scroll", updateHeader, { passive: true });

  function setMenu(open) {
    body.classList.toggle("menu-open", open);
    menuToggle.classList.toggle("open", open);
    mobileMenu.classList.toggle("open", open);
    menuToggle.setAttribute("aria-expanded", String(open));
    mobileMenu.setAttribute("aria-hidden", String(!open));
    menuToggle.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  }

  menuToggle.addEventListener("click", () => {
    setMenu(!mobileMenu.classList.contains("open"));
  });

  mobileLinks.forEach((link) => {
    link.addEventListener("click", () => setMenu(false));
  });

  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape") setMenu(false);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12 }
  );

  revealElements.forEach((element) => observer.observe(element));

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinks.forEach((link) => {
          link.classList.toggle(
            "active",
            link.getAttribute("href") === `#${entry.target.id}`
          );
        });
      });
    },
    {
      rootMargin: "-35% 0px -55% 0px",
      threshold: 0
    }
  );

  sections.forEach((section) => sectionObserver.observe(section));

  placeholderLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      link.animate(
        [
          { transform: "translateX(0)" },
          { transform: "translateX(4px)" },
          { transform: "translateX(0)" }
        ],
        { duration: 220, easing: "ease-out" }
      );
    });
  });

  if (year) year.textContent = new Date().getFullYear();

  // Small cursor response for pointer devices.
  const finePointer = window.matchMedia("(pointer: fine)").matches;

  if (finePointer) {
    document.addEventListener("pointermove", (event) => {
      document.documentElement.style.setProperty(
        "--pointer-x",
        `${event.clientX}px`
      );
      document.documentElement.style.setProperty(
        "--pointer-y",
        `${event.clientY}px`
      );
    });
  }
})();
