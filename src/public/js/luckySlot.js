import { performLucky } from "./search.js";

export function initLuckySlot() {
  const btn = document.getElementById("btn-lucky");
  const inner = document.getElementById("lucky-slot-inner");
  const items = inner.children;
  const totalItems = items.length;
  let interval = null;
  let stopTimeout = null;
  let currentIdx = 0;

  const ITEM_HEIGHT = 36;

  function setSlotIndex(idx) {
    currentIdx = idx;
    const slot = inner.parentElement;
    const slotHeight = slot ? slot.clientHeight : ITEM_HEIGHT * totalItems;
    const centerOffset = (slotHeight / 2) - (idx + 0.5) * ITEM_HEIGHT;
    inner.style.transform = `translateY(${centerOffset}px)`;
  }

  function clearSpin() {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    if (stopTimeout) {
      clearTimeout(stopTimeout);
      stopTimeout = null;
    }
  }

  function spinThenStop() {
    if (totalItems === 0) return;
    clearSpin();
    btn.classList.add("hovering");
    currentIdx = 0;
    setSlotIndex(0);
    inner.style.transition = "transform 0.12s linear";
    const intervalId = setInterval(() => {
      currentIdx = (currentIdx + 1) % totalItems;
      setSlotIndex(currentIdx);
    }, 80);
    interval = intervalId;
    stopTimeout = setTimeout(() => {
      clearInterval(intervalId);
      interval = null;
      stopTimeout = null;
      const finalIdx = Math.floor(Math.random() * totalItems);
      inner.style.transition = "transform 0.2s ease-out";
      setSlotIndex(finalIdx);
    }, 500);
  }

  btn.addEventListener("mouseenter", () => {
    if (interval || stopTimeout) return;
    spinThenStop();
  });

  btn.addEventListener("mouseleave", () => {
    if (interval) {
      clearInterval(interval);
      interval = null;
    }
    if (!stopTimeout) {
      btn.classList.remove("hovering");
      inner.style.transition = "";
      setSlotIndex(0);
    }
  });

  btn.addEventListener("click", (e) => {
    e.preventDefault();
    clearSpin();
    btn.classList.remove("hovering");
    inner.style.transition = "";
    inner.style.transform = "translateY(0)";
    performLucky(document.getElementById("search-input").value);
  });
}
