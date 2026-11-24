const LAST_SEARCH_KEY = "pickier-last-search";

export function getLastSearch() {
  try {
    const saved = JSON.parse(window.sessionStorage.getItem(LAST_SEARCH_KEY));
    if (typeof saved?.postcode !== "string" || !saved.postcode.trim()) return null;
    return {
      item: typeof saved.item === "string" ? saved.item : "",
      postcode: saved.postcode,
    };
  } catch {
    return null;
  }
}

export function saveLastSearch({ item, postcode }) {
  if (typeof postcode !== "string" || !postcode.trim()) return;
  try {
    window.sessionStorage.setItem(LAST_SEARCH_KEY, JSON.stringify({
      item: typeof item === "string" ? item : "",
      postcode: postcode.trim(),
    }));
  } catch {
    // Searching still works if browser storage is unavailable.
  }
}

export function clearLastSearch() {
  try {
    window.sessionStorage.removeItem(LAST_SEARCH_KEY);
  } catch {
    // The explicit search reset must still work without browser storage.
  }
}
