import { getState, setTheme } from "../core/store.js";

export function initTheme() {
  const theme = getState().theme;
  document.documentElement.setAttribute("data-theme", theme);
  updateIcon(theme);
}

export function bindThemeToggle(btn) {
  btn.addEventListener("click", () => {
    const current = getState().theme;
    const next = current === "light" ? "dark" : "light";

    setTheme(next);
    document.documentElement.setAttribute("data-theme", next);
    updateIcon(next);
  });
}

function updateIcon(theme) {
  const icon = document.querySelector("#themeToggle i");
  if (!icon) return;

  if (theme === "dark") {
    icon.classList.remove("fa-moon");
    icon.classList.add("fa-sun");
  } else {
    icon.classList.remove("fa-sun");
    icon.classList.add("fa-moon");
  }
}