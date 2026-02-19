const DEFAULT_SETTINGS = Object.freeze({
  memoriaBaseUrl: "https://ashwannasleep.github.io/memoria/",
  defaultBookTitle: "Web Highlights",
  defaultBookAuthor: "Saved from the Web",
  defaultBookCategory: "Web",
});

const form = document.getElementById("settings-form");
const statusEl = document.getElementById("status");
const openMemoriaButton = document.getElementById("open-memoria");

const memoriaBaseUrlInput = document.getElementById("memoria-base-url");
const defaultBookTitleInput = document.getElementById("default-book-title");
const defaultBookAuthorInput = document.getElementById("default-book-author");
const defaultBookCategoryInput = document.getElementById("default-book-category");

initialize();

form.addEventListener("submit", (event) => {
  event.preventDefault();
  saveSettings();
});

openMemoriaButton.addEventListener("click", () => {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (stored) => {
    const merged = { ...DEFAULT_SETTINGS, ...stored };
    const memoriaUrl = normalizeBaseUrl(merged.memoriaBaseUrl);
    chrome.tabs.create({ url: memoriaUrl });
  });
});

function initialize() {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (stored) => {
    const settings = { ...DEFAULT_SETTINGS, ...stored };
    memoriaBaseUrlInput.value = normalizeBaseUrl(settings.memoriaBaseUrl);
    defaultBookTitleInput.value = normalizeText(settings.defaultBookTitle, DEFAULT_SETTINGS.defaultBookTitle);
    defaultBookAuthorInput.value = normalizeText(settings.defaultBookAuthor, DEFAULT_SETTINGS.defaultBookAuthor);
    defaultBookCategoryInput.value = normalizeText(settings.defaultBookCategory, DEFAULT_SETTINGS.defaultBookCategory);
  });
}

function saveSettings() {
  const settings = {
    memoriaBaseUrl: normalizeBaseUrl(memoriaBaseUrlInput.value),
    defaultBookTitle: normalizeText(defaultBookTitleInput.value, DEFAULT_SETTINGS.defaultBookTitle),
    defaultBookAuthor: normalizeText(defaultBookAuthorInput.value, DEFAULT_SETTINGS.defaultBookAuthor),
    defaultBookCategory: normalizeText(defaultBookCategoryInput.value, DEFAULT_SETTINGS.defaultBookCategory),
  };

  chrome.storage.sync.set(settings, () => {
    if (chrome.runtime.lastError) {
      setStatus("Failed to save settings.", false);
      return;
    }
    memoriaBaseUrlInput.value = settings.memoriaBaseUrl;
    setStatus("Settings saved.", true);
  });
}

function normalizeBaseUrl(input) {
  const raw = typeof input === "string" ? input.trim() : "";
  if (!raw) {
    return DEFAULT_SETTINGS.memoriaBaseUrl;
  }

  const withProtocol = /^https?:\/\//i.test(raw) ? raw : `https://${raw}`;
  try {
    const parsed = new URL(withProtocol);
    if (!parsed.pathname.endsWith("/")) {
      parsed.pathname = `${parsed.pathname}/`;
    }
    return parsed.toString();
  } catch {
    return DEFAULT_SETTINGS.memoriaBaseUrl;
  }
}

function normalizeText(value, fallbackValue) {
  return typeof value === "string" && value.trim() ? value.trim() : fallbackValue;
}

function setStatus(message, ok) {
  statusEl.textContent = message;
  statusEl.classList.remove("success", "error");
  statusEl.classList.add(ok ? "success" : "error");
}
