import { closeMediaPreview } from "./media.js";

export function initMediaPreview() {
  document.getElementById("media-preview-close").addEventListener("click", closeMediaPreview);
}
