export const cleanUrl = (url) => {
  try {
    const parsed = new URL(url);
    return parsed.hostname + parsed.pathname;
  } catch {
    return url;
  }
};

export const cleanHostname = (url) => {
  try {
    return new URL(url).hostname;
  } catch {
    return url;
  }
};

export const escapeHtml = (str) => {
  if (!str) return "";
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
};
