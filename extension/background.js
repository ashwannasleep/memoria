const MENU_ID = "memoria-save-selection";
const MAX_SELECTION_LENGTH = 5000;
const BRIDGE_CLOSE_TIMEOUT_MS = 15000;

const DEFAULT_SETTINGS = Object.freeze({
  memoriaBaseUrl: "https://ashwannasleep.github.io/memoria/",
  defaultBookTitle: "Web Highlights",
  defaultBookAuthor: "Saved from the Web",
  defaultBookCategory: "Web",
});

const pendingBridgeTabs = new Set();

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.removeAll(() => {
    chrome.contextMenus.create({
      id: MENU_ID,
      title: "Save selection to Memoria",
      contexts: ["selection"],
    });
  });
});

chrome.contextMenus.onClicked.addListener((info) => {
  if (info.menuItemId !== MENU_ID) {
    return;
  }

  const selectedText = typeof info.selectionText === "string" ? info.selectionText.trim() : "";
  if (!selectedText) {
    return;
  }

  loadSettings((settings) => {
    const payload = {
      version: 1,
      text: selectedText.slice(0, MAX_SELECTION_LENGTH),
      note: null,
      sourceUrl: typeof info.pageUrl === "string" ? info.pageUrl : null,
      capturedAt: new Date().toISOString(),
      defaultBook: {
        title: settings.defaultBookTitle,
        author: settings.defaultBookAuthor,
        category: settings.defaultBookCategory,
      },
    };

    const bridgeUrl = createBridgeUrl(settings.memoriaBaseUrl, payload);
    if (!bridgeUrl) {
      return;
    }

    chrome.tabs.create({ url: bridgeUrl, active: false }, (tab) => {
      if (chrome.runtime.lastError || !tab || typeof tab.id !== "number") {
        return;
      }

      pendingBridgeTabs.add(tab.id);
      setTimeout(() => {
        if (!pendingBridgeTabs.has(tab.id)) {
          return;
        }
        pendingBridgeTabs.delete(tab.id);
        chrome.tabs.remove(tab.id, () => {
          void chrome.runtime.lastError;
        });
      }, BRIDGE_CLOSE_TIMEOUT_MS);
    });
  });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo) => {
  if (!pendingBridgeTabs.has(tabId) || typeof changeInfo.url !== "string") {
    return;
  }

  if (!changeInfo.url.includes("extension-bridge.html#status=")) {
    return;
  }

  pendingBridgeTabs.delete(tabId);
  chrome.tabs.remove(tabId, () => {
    void chrome.runtime.lastError;
  });
});

chrome.tabs.onRemoved.addListener((tabId) => {
  pendingBridgeTabs.delete(tabId);
});

function loadSettings(callback) {
  chrome.storage.sync.get(DEFAULT_SETTINGS, (stored) => {
    if (chrome.runtime.lastError) {
      callback(DEFAULT_SETTINGS);
      return;
    }

    const merged = {
      ...DEFAULT_SETTINGS,
      ...stored,
    };
    merged.memoriaBaseUrl = normalizeBaseUrl(merged.memoriaBaseUrl);
    callback(merged);
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

function createBridgeUrl(memoriaBaseUrl, payload) {
  try {
    const bridgeUrl = new URL("extension-bridge.html", normalizeBaseUrl(memoriaBaseUrl));
    const serialized = encodeURIComponent(JSON.stringify(payload));
    return `${bridgeUrl.toString()}#payload=${serialized}`;
  } catch {
    return null;
  }
}
