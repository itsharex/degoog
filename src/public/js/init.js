import { performSearch } from "./search.js";
import { showHome } from "./navigation.js";
import { initAutocomplete } from "./autocomplete.js";
import { initLuckySlot } from "./luckySlot.js";
import { initTabs } from "./tabs.js";
import { initMediaPreview } from "./mediaPreview.js";
import { initTheme } from "./theme.js";
import { initTimeFilter } from "./timeFilter.js";

export function init() {
  const searchInput = document.getElementById("search-input");
  const resultsInput = document.getElementById("results-search-input");

  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") performSearch(searchInput.value);
  });

  document.getElementById("btn-search").addEventListener("click", () => {
    performSearch(searchInput.value);
  });

  resultsInput.addEventListener("keydown", (e) => {
    if (e.key === "Enter") performSearch(resultsInput.value);
  });

  document.getElementById("results-search-btn").addEventListener("click", () => {
    performSearch(resultsInput.value);
  });

  document.querySelector(".results-logo").addEventListener("click", (e) => {
    e.preventDefault();
    showHome();
    searchInput.value = "";
    searchInput.focus();
  });

  initAutocomplete(searchInput, document.getElementById("ac-dropdown-home"), performSearch);
  initAutocomplete(resultsInput, document.getElementById("ac-dropdown-results"), performSearch);
  initLuckySlot();
  initTabs();
  initMediaPreview();
  initTheme();
  initTimeFilter();

  const params = new URLSearchParams(window.location.search);
  const q = params.get("q");
  const type = params.get("type") || "all";
  if (q) {
    searchInput.value = q;
    performSearch(q, type);
  }
}
