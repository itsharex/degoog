import { idbGet, idbSet } from "./js/db.js";
import { getEngines, applyToggleStates, getToggleStates, getRegistry, renderEngineToggles } from "./js/engines.js";
import { SETTINGS_KEY, THEME_KEY } from "./js/constants.js";
import { applyTheme, initTheme } from "./js/theme.js";

async function init() {
  initTheme();
  const reg = await getRegistry();
  renderEngineToggles(reg.engines);
  const engines = await getEngines();
  applyToggleStates(engines);
  const themeSelect = document.getElementById("theme-select");
  if (themeSelect) {
    const saved = await idbGet(THEME_KEY);
    themeSelect.value = saved || "system";
  }

  document.getElementById("settings-save").addEventListener("click", async () => {
    const enginesState = getToggleStates();
    await idbSet(SETTINGS_KEY, enginesState);
    if (themeSelect) {
      await idbSet(THEME_KEY, themeSelect.value);
      applyTheme(themeSelect.value);
    }
    window.location.href = "/";
  });

  document.getElementById("settings-cache-clear").addEventListener("click", async () => {
    const btn = document.getElementById("settings-cache-clear");
    try {
      await fetch("/api/cache/clear", { method: "POST" });
      const prev = btn.textContent;
      btn.textContent = "Cleared";
      setTimeout(() => { btn.textContent = prev; }, 1500);
    } catch {
      btn.textContent = "Failed";
    }
  });
}

init();
