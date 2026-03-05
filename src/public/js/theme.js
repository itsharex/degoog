import { idbGet } from "./db.js";
import { THEME_KEY } from "./constants.js";

export function applyTheme(preference) {
  const root = document.documentElement;
  if (preference === "light") {
    root.setAttribute("data-theme", "light");
  } else if (preference === "dark") {
    root.setAttribute("data-theme", "dark");
  } else {
    root.removeAttribute("data-theme");
  }
}

export async function initTheme() {
  const saved = await idbGet(THEME_KEY);
  if (saved) {
    applyTheme(saved);
  }
}
