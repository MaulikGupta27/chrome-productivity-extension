let currentTabId = null;
let currentDomain = null;
let startTime = Date.now();
let timer = null;
let blockList = [];

function getDomain(url) {
  try {
    return new URL(url).hostname;
  } catch {
    return null;
  }
}

async function fetchBlockList() {
  try {
    const res = await fetch("http://localhost:5000/api/user/blocklist");
    const data = await res.json();
    blockList = data.blocklist || [];
    console.log("Fetched blocklist:", blockList);
  } catch (err) {
    console.error("Error fetching blocklist:", err);
    blockList = [];
  }
}

function startTracking() {
  if (timer) clearInterval(timer);

  timer = setInterval(() => {
    if (!currentDomain || blockList.includes(currentDomain)) {
      console.log("Skipping blocked or null domain:", currentDomain);
      return;
    }

    const now = Date.now();
    const duration = Math.floor((now - startTime) / 1000);

    if (duration >= 10) {
      console.log("Tracking:", currentDomain, "for 10 seconds");

      fetch("http://localhost:5000/api/logs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          // Uncomment below after auth setup
          // "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify({
          url: currentDomain,
          timeSpent: 10,
        }),
      }).then(() => {
        console.log("Posted log for", currentDomain);
      }).catch((e) => {
        console.error("POST failed:", e);
      });

      startTime = now; // reset timer
    }
  }, 10000); // every 10 seconds
}

function stopTracking() {
  if (timer) clearInterval(timer);
  timer = null;
  currentTabId = null;
  currentDomain = null;
}

// Update current tab
function updateActiveTab(tabId) {
  chrome.tabs.get(tabId, (tab) => {
    if (!tab || !tab.url) return;

    const domain = getDomain(tab.url);
    currentTabId = tab.id;
    currentDomain = domain;
    startTime = Date.now();

    console.log("Active tab domain:", currentDomain);
    startTracking();
  });
}

// Event: Tab switched
chrome.tabs.onActivated.addListener(({ tabId }) => {
  stopTracking();
  updateActiveTab(tabId);
});

// Event: Tab updated (reloaded/navigation)
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.active && changeInfo.status === "complete") {
    stopTracking();
    updateActiveTab(tabId);
  }
});

// Event: Chrome window focus
chrome.windows.onFocusChanged.addListener((windowId) => {
  if (windowId === chrome.windows.WINDOW_ID_NONE) {
    stopTracking(); // Chrome unfocused
  } else {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs.length > 0) updateActiveTab(tabs[0].id);
    });
  }
});

// Event: Chrome startup
chrome.runtime.onStartup.addListener(() => {
  chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
    if (tabs.length > 0) updateActiveTab(tabs[0].id);
  });
});

// 🟡 Initial fetch of blocklist on extension start
fetchBlockList();
