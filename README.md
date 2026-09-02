# JobPulse 🚀

> **Live Multi-Source Job Scraper, AI Resume Tailoring & Career Discovery Engine**  
> Built with **Vue 3**, **Vite**, **@whatitbroke/vue**, and **Aiven OpenSearch Cloud**.

![JobPulse](https://img.shields.io/badge/Vue-3.5-emerald?logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-8.2-purple?logo=vite)
![WhatItBroke](https://img.shields.io/badge/@whatitbroke/vue-1.0.4-rose)
![OpenSearch](https://img.shields.io/badge/OpenSearch-Aiven%20Cloud-blue?logo=opensearch)

---

## ✨ Features

- 🔍 **Multi-Platform Scraper Simulation & Ingestion**:
  - Live crawlers across **LinkedIn**, **Indeed**, **RemoteOK**, **WeWorkRemotely**, and **Wellfound**.
  - Interactive pagination, keyword filtering, salary range sliders, and platform toggles.
- ⚡ **AI Resume Parser & Easy Apply**:
  - Upload or customize your candidate resume profile (TXT, JSON, Markdown).
  - **Multi-Dimensional Compatibility Scoring**: Computes skill match ratios, role relevance, and seniority fit.
  - **75%+ Automated Gap-Filling**: When compatibility is $\ge 75\%$, automatically bridges missing secondary skills, optimizes experience bullet points, and generates a personalized 1-paragraph cover letter pitch.
- ☁️ **Aiven OpenSearch Cloud Integration**:
  - Indexed application storage in OpenSearch cluster via secure local proxy (`/api/opensearch`).
  - Resilient dual-layer persistence with instant offline local storage fallback.
- 📊 **Career Pipeline & Application Tracker**:
  - Kanban board (Wishlist, Applied, Interviewing, Offered, Archived).
  - Inspect tailored application packages directly from applied job cards.
- 🧪 **Universal Debugger & Error Boundary (@whatitbroke/vue)**:
  - Runtime diagnostic overlay HUD with real-time root-cause analysis, component hierarchy tracing, and unified code diffs.
  - `<WhatItBrokeErrorBoundary>` prevents template crashes from unmounting the host application.

---

## 🛠 Tech Stack

- **Framework**: Vue 3 (Composition API, `<script setup>`)
- **Build Tool**: Vite
- **Styling**: Modern Vanilla CSS (Glassmorphism, Dark Mode, CSS Variables)
- **Diagnostics**: `@whatitbroke/vue` & `@whatitbroke/core`
- **Database**: Aiven OpenSearch Cloud Cluster + Local Storage

---

## 🚀 Getting Started

### 1. Clone the repository
```bash
git clone https://github.com/jins-coder/jobpulse.git
cd jobpulse
```

### 2. Install dependencies
```bash
npm install
```

### 3. Run development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 4. Build for production
```bash
npm run build
```

---

## 📄 License
MIT © [jins-coder](https://github.com/jins-coder)
