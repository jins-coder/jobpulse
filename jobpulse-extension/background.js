// JobPulse Background Service Worker
chrome.runtime.onInstalled.addListener(() => {
  console.log('[JobPulse Extension] Installed successfully.');
});

// Forward messages between popup and active tab
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'trigger_autofill_active_tab') {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      if (tabs[0]?.id) {
        chrome.tabs.sendMessage(tabs[0].id, {
          action: 'autofill',
          candidate: request.candidate
        }, sendResponse);
      }
    });
    return true; // Keep message channel open for async response
  }
});
