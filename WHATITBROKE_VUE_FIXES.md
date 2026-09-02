# WhatItBroke: Latest Fixes & Improvements

This document lists the **latest pending fixes and optimizations** to apply to `@whatitbroke/core` and `@whatitbroke/vue`. (All previous issues from v1.0.1 and v1.0.2 have been resolved and removed).

---

## 1. Eliminate Vite / Bundler Externalization Warnings (@whatitbroke/core)

### **The Issue**
When developers build their apps with Vite, Rollup, or Rolldown (`npm run build`), the bundler logs externalization warnings:
```
[plugin rolldown:vite-resolve] Module "node:fs" has been externalized for browser compatibility, imported by "@whatitbroke/core/dist/engine/engine.js"
[plugin rolldown:vite-resolve] Module "node:path" has been externalized for browser compatibility, imported by "@whatitbroke/core/dist/engine/engine.js"
[plugin rolldown:vite-resolve] Module "node:fs" has been externalized for browser compatibility, imported by "@whatitbroke/core/dist/sourcemap/resolver.js"
[plugin rolldown:vite-resolve] Module "node:path" has been externalized for browser compatibility, imported by "@whatitbroke/core/dist/sourcemap/resolver.js"
```

### **Root Cause**
`engine.ts` and `sourcemap/resolver.ts` use static top-level imports:
```ts
import * as fs from 'node:fs';
import * as path from 'node:path';
```
When bundled for client-side applications, bundlers cannot eliminate Node built-ins if imported at the module root.

### **The Fix**

#### **A. In `packages/core/src/engine/engine.ts`**
Remove top-level `node:fs` and `node:path` imports. Use dynamic imports inside Node-only methods:

```diff
- import * as fs from 'node:fs';
- import * as path from 'node:path';

  public async saveReportToFile(report: RootCauseReport, outputPath: string): Promise<void> {
+   if (typeof window !== 'undefined') {
+     console.warn('[WhatItBroke] saveReportToFile is not available in browser environments.');
+     return;
+   }
+   const fs = await import('node:fs');
+   const path = await import('node:path');
    const resolved = path.resolve(outputPath);
    await fs.promises.mkdir(path.dirname(resolved), { recursive: true });
    await fs.promises.writeFile(resolved, JSON.stringify(report, null, 2), 'utf-8');
  }
```

#### **B. In `packages/core/src/sourcemap/resolver.ts`**
Remove top-level imports and guard file-system resolution:

```diff
- import * as fs from 'node:fs';
- import * as path from 'node:path';

  private static getFileContent(filePath: string): string | null {
+   // Browser runtimes do not have direct filesystem access
+   if (typeof window !== 'undefined' || typeof process === 'undefined' || !process.versions?.node) {
+     return null;
+   }
+   try {
+     const fs = require('node:fs');
+     if (fs.existsSync(filePath)) {
+       return fs.readFileSync(filePath, 'utf-8');
+     }
+   } catch {
+     return null;
+   }
+   return null;
  }
```

---

## 2. Dev-Mode Noise Reduction for Long Tasks (@whatitbroke/core)

### **The Issue**
Under development mode (`npm run dev`), Vite's Hot Module Replacement (HMR) and initial on-the-fly module compilation regularly block the browser thread for $50 - 1500\text{ms}$.
WhatItBroke's `PerformanceObserver` logs these as "Main Thread Long Task" in the **⚡ Performance** tab, which can flood the list with normal Vite HMR events.

### **The Fix in `packages/core/src/overlay/overlay.ts`**
1. Add `minLongTaskDurationMs` to options (default: `100ms` instead of hardcoded `50ms`).
2. Add an automated HMR cooldown window so Vite reloads don't spam the performance log:

```diff
  // packages/core/src/overlay/overlay.ts
  export interface OverlayOptions {
    // ...
+   /** Minimum blocking duration (in ms) to register as a Long Task (default: 100) */
+   minLongTaskDurationMs?: number;
  }

  // Inside mount() / observer init:
  if (this.options.autoCapturePerformance && typeof PerformanceObserver !== 'undefined') {
    try {
+     const threshold = this.options.minLongTaskDurationMs ?? 100;
      this.perfObserver = new PerformanceObserver((list) => {
        for (const entry of list.getEntries()) {
          const duration = Math.round(entry.duration);
-         if (duration >= 50) {
+         if (duration >= threshold) {
            this.pushPerformance({
              type: 'long_task',
              title: 'Main Thread Long Task',
              detail: `Browser execution blocked for ${duration}ms (frame budget: 16ms)`,
              durationMs: duration,
            });
          }
        }
      });
      this.perfObserver.observe({ entryTypes: ['longtask'] });
    } catch {}
  }
```

---

## 3. Circular-Safe JSON Stringify for Component State (@whatitbroke/core)

### **The Issue**
In `renderReport()` within `overlay.ts`, serializing `comp.state` or `comp.props` using `JSON.stringify(comp.state, null, 2)` can throw:
`TypeError: Converting circular structure to JSON`
if the Vue component state contains circular reactive proxy references or DOM node handles.

### **The Fix in `packages/core/src/overlay/overlay.ts`**
Add a safe circular stringifier utility:

```ts
function safeStringify(obj: unknown, indent = 2): string {
  const seen = new WeakSet();
  try {
    return JSON.stringify(obj, (key, value) => {
      if (typeof value === 'object' && value !== null) {
        if (seen.has(value)) {
          return '[Circular Reference]';
        }
        seen.add(value);
      }
      return value;
    }, indent);
  } catch {
    return String(obj);
  }
}
```

Replace:
```diff
- const stateStr = comp.state ? JSON.stringify(comp.state, null, 2) : null;
+ const stateStr = comp.state ? safeStringify(comp.state, 2) : null;
```

---

## Action Items Summary

- [ ] **`packages/core/src/engine/engine.ts`**: Replace static `node:fs` and `node:path` with dynamic imports.
- [ ] **`packages/core/src/sourcemap/resolver.ts`**: Remove static Node imports; guard filesystem reads for Node-only environments.
- [ ] **`packages/core/src/overlay/overlay.ts`**: Update `minLongTaskDurationMs` (default to $100\text{ms}$ or user-configured threshold) to avoid dev-mode HMR clutter.
- [ ] **`packages/core/src/overlay/overlay.ts`**: Add `safeStringify` to prevent circular structure errors during state inspection.
