import { LOCAL_STORAGE_KEY } from "../utils/constants";

export default class ThemeToggler {
  constructor() {
    if (ThemeToggler.instance) {
      throw new Error("Use ThemeToggler.getInstance() instead of new");
    }

    this.elements = {
      toggler: document.querySelector(".sh__toggler"),
      icons: document.querySelectorAll(".sh__toggler--icon"),
      moon: document.querySelector(".sh__toggler-btn--moon"),
      sun: document.querySelector(".sh__toggler-btn--sun"),
    };
  }

  static getInstance() {
    if (!ThemeToggler.instance) {
      ThemeToggler.instance = new ThemeToggler();
    }
    return ThemeToggler.instance;
  }

  activateDarkMode() {
    document.body.dataset.theme = "dark";
    this.elements.moon.classList.remove("active");
    this.elements.sun.classList.add("active");
    window.localStorage.setItem(LOCAL_STORAGE_KEY, "dark");
  }

  activateLightMode() {
    document.body.dataset.theme = "light";
    this.elements.sun.classList.remove("active");
    this.elements.moon.classList.add("active");
    window.localStorage.setItem(LOCAL_STORAGE_KEY, "light");
  }

  getPreferredTheme() {
    // get color scheme from localStorage
    const theme = window.localStorage.getItem(LOCAL_STORAGE_KEY);
    if (theme === "light") return this.activateLightMode();
    if (theme === "dark") return this.activateDarkMode();

    window.matchMedia("(prefers-color-scheme: dark)").matches
      ? this.activateDarkMode()
      : this.activateLightMode();
  }

  init() {
    this.getPreferredTheme();

    this.elements.toggler.addEventListener("click", () => {
      if (document.body.dataset.theme) {
        if (document.body.dataset.theme === "light") {
          this.activateDarkMode();
        } else this.activateLightMode();
      }
    });

    // Listen for OS theme changes
    window
      .matchMedia("(prefers-color-scheme: dark)")
      .addEventListener("change", (e) => {
        if (e.matches) {
          this.activateDarkMode();
        } else this.activateLightMode();
      });
  }
}
