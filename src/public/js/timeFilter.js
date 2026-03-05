import { state } from "./state.js";
import { performSearch } from "./search.js";

export function initTimeFilter() {
  const toggle = document.getElementById("tools-toggle");
  const dropdown = document.getElementById("tools-dropdown");
  const toolsBar = document.getElementById("tools-bar");
  if (!toggle || !dropdown || !toolsBar) return;

  const timeLabels = { any: "Any time", hour: "Hour", day: "24 hours", week: "Week", month: "Month", year: "Year" };

  function setToggleLabel() {
    toggle.textContent = timeLabels[state.currentTimeFilter] || timeLabels.any;
    toggle.classList.toggle("active", state.currentTimeFilter !== "any");
  }

  function closeToolsDropdown() {
    dropdown.style.display = "none";
    if (dropdown.parentElement === document.body) {
      dropdown.style.top = "";
      dropdown.style.left = "";
      dropdown.style.position = "";
      toolsBar.appendChild(dropdown);
    }
    toggle.classList.toggle("active", state.currentTimeFilter !== "any");
  }

  function openToolsDropdown() {
    const rect = toggle.getBoundingClientRect();
    document.body.appendChild(dropdown);
    dropdown.style.position = "absolute";
    dropdown.style.top = `${rect.bottom + window.scrollY}px`;
    dropdown.style.left = `${rect.left + window.scrollX}px`;
    dropdown.style.display = "block";
    toggle.classList.add("active");
  }

  setToggleLabel();

  toggle.addEventListener("click", () => {
    const open = dropdown.style.display !== "none";
    if (open) {
      closeToolsDropdown();
    } else {
      openToolsDropdown();
    }
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest("#tools-bar") && !dropdown.contains(e.target)) {
      closeToolsDropdown();
    }
  });

  window.addEventListener("scroll", () => {
    if (dropdown.style.display === "block") closeToolsDropdown();
  }, { capture: true });

  dropdown.addEventListener("click", (e) => {
    const opt = e.target.closest(".tools-option");
    if (!opt) return;
    const value = opt.dataset.time;
    if (value === state.currentTimeFilter) return;
    state.currentTimeFilter = value;
    dropdown.querySelectorAll(".tools-option").forEach((o) => {
      o.classList.toggle("active", o.dataset.time === value);
    });
    closeToolsDropdown();
    setToggleLabel();
    if (state.currentQuery) performSearch(state.currentQuery, state.currentType);
  });
}
