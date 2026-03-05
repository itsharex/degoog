import { state } from "./state.js";
import { performSearch } from "./search.js";

export function initTabs() {
  document.querySelectorAll(".results-tab").forEach((tab) => {
    tab.addEventListener("click", () => {
      const type = tab.dataset.type;
      if (state.currentQuery) {
        performSearch(state.currentQuery, type);
      }
    });
  });
}
