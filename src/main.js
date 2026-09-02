import { createApp } from 'vue';
import './style.css';
import App from './App.vue';
import { WhatItBrokeVue, VueAdapter, VueErrorOverlay } from '@whatitbroke/vue';

const app = createApp(App);
// Universal Debugging Engine Integration (@whatitbroke/vue)
app.use(WhatItBrokeVue, {
  captureReactivityLoss: true,
  captureComponentStack: true,
  autoOpenOnCrash: true,
  autoCapturePerformance: false
});

const adapter = new VueAdapter();

// Capture Unhandled Async Promise Rejections in WhatItBroke Overlay
window.addEventListener('unhandledrejection', async (event) => {
  console.warn('%c[Unhandled Promise Rejection Detected]', 'color: #fbbf24; font-weight: bold;', event.reason);
  try {
    const err = event.reason instanceof Error ? event.reason : new Error(String(event.reason || 'Unhandled Promise Rejection'));
    const report = await adapter.analyzeVueError(err, { info: 'unhandledrejection (async thread)' });
    VueErrorOverlay.addReport(report, err);
  } catch (internalErr) {
    console.error('Failed to report unhandled rejection to WhatItBroke:', internalErr);
  }
});

// Capture Global Browser Errors (e.g. setTimeout / asynchronous exceptions)
window.addEventListener('error', async (event) => {
  if (!event.error) return;
  try {
    const report = await adapter.analyzeVueError(event.error, { info: 'global (window.onerror)' });
    VueErrorOverlay.addReport(report, event.error);
  } catch (internalErr) {
    console.error('Failed to report window error to WhatItBroke:', internalErr);
  }
});

app.mount('#app');
