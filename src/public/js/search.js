import { state } from "./state.js";
import { MAX_PAGE } from "./constants.js";
import { showResults, setActiveTab } from "./navigation.js";
import { getEngines } from "./engines.js";
import { buildSearchUrl } from "./url.js";
import { destroyMediaObserver, closeMediaPreview } from "./media.js";
import {
  renderAtAGlance,
  renderResults,
  renderSidebar,
} from "./render.js";
import { hideAcDropdown } from "./autocomplete.js";

export async function performSearch(query, type) {
  if (!query.trim()) return;

  type = type || state.currentType || "all";
  state.currentQuery = query;
  state.currentType = type;
  state.currentPage = 1;
  state.lastPage = MAX_PAGE;
  state.imagePage = 1;
  state.imageLastPage = MAX_PAGE;
  state.videoPage = 1;
  state.videoLastPage = MAX_PAGE;
  destroyMediaObserver();

  const engines = await getEngines();
  const url = buildSearchUrl(query, engines, type, 1);

  showResults();
  setActiveTab(type);
  closeMediaPreview();
  hideAcDropdown(document.getElementById("ac-dropdown-home"));
  hideAcDropdown(document.getElementById("ac-dropdown-results"));
  document.getElementById("results-search-input").value = query;
  document.getElementById("results-meta").textContent = "Searching...";
  document.getElementById("at-a-glance").innerHTML = "";
  document.getElementById("results-list").innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div>';
  document.getElementById("pagination").innerHTML = "";
  document.getElementById("results-sidebar").innerHTML = "";
  document.title = `${query} - degoog`;

  const urlParams = new URLSearchParams({ q: query });
  if (type !== "all") urlParams.set("type", type);
  history.pushState(null, "", `/search?${urlParams.toString()}`);

  try {
    const res = await fetch(url);
    const data = await res.json();

    state.currentResults = data.results;
    state.currentData = data;

    document.getElementById("results-meta").textContent = `About ${data.results.length} results (${(data.totalTime / 1000).toFixed(2)} seconds)`;

    if (type === "all") {
      renderAtAGlance(data.atAGlance);
      renderSidebar(data, (q) => performSearch(q));
    } else {
      document.getElementById("at-a-glance").innerHTML = "";
      document.getElementById("results-sidebar").innerHTML = "";
    }
    renderResults(data.results);
  } catch (err) {
    document.getElementById("results-meta").textContent = "";
    document.getElementById("results-list").innerHTML = '<div class="no-results">Search failed. Please try again.</div>';
  }
}

export async function goToPage(pageNum) {
  if (pageNum === state.currentPage) return;
  document.getElementById("results-list").innerHTML = '<div class="loading-dots"><span></span><span></span><span></span></div>';
  document.getElementById("pagination").innerHTML = "";
  const engines = await getEngines();
  const url = buildSearchUrl(state.currentQuery, engines, state.currentType, pageNum);
  try {
    const res = await fetch(url);
    const data = await res.json();
    state.currentResults = data.results;
    state.currentData = data;
    state.currentPage = pageNum;
    document.getElementById("results-meta").textContent = `About ${state.currentResults.length} results — Page ${state.currentPage}`;
    if (state.currentPage === 1 && data.atAGlance) {
      renderAtAGlance(data.atAGlance);
    }
    renderResults(state.currentResults);
    window.scrollTo(0, 0);
  } catch {
    document.getElementById("results-list").innerHTML = '<div class="no-results">Search failed. Please try again.</div>';
  }
}

export async function performLucky(query) {
  if (!query.trim()) return;
  const engines = await getEngines();
  const params = new URLSearchParams({ q: query });
  for (const [key, val] of Object.entries(engines)) {
    params.set(key, String(val));
  }
  window.location.href = `/api/lucky?${params.toString()}`;
}