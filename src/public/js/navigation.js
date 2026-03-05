import { state } from "./state.js";
import { MAX_PAGE } from "./constants.js";
import { destroyMediaObserver } from "./media.js";

export function showHome() {
  document.getElementById("main-home").style.display = "";
  document.getElementById("results-page").style.display = "none";
  document.getElementById("header").style.display = "";
  document.body.classList.remove("has-results");
  document.title = "degoog";
  state.currentQuery = "";
  state.currentType = "all";
  state.currentPage = 1;
  state.lastPage = MAX_PAGE;
  state.imagePage = 1;
  state.imageLastPage = MAX_PAGE;
  state.videoPage = 1;
  state.videoLastPage = MAX_PAGE;
  state.currentTimeFilter = "any";
  state.currentResults = [];
  state.currentData = null;
  destroyMediaObserver();
  history.pushState(null, "", "/");
}

export function showResults() {
  document.getElementById("main-home").style.display = "none";
  document.getElementById("results-page").style.display = "";
  document.getElementById("header").style.display = "none";
  document.body.classList.add("has-results");
}

export function setActiveTab(type) {
  state.currentType = type;
  document.querySelectorAll(".results-tab").forEach((tab) => {
    tab.classList.toggle("active", tab.dataset.type === type);
  });
}
