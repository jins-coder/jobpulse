# JobPulse 🚀

> **Live Multi-Source Job Scraper, AI Resume Tailoring & Career Discovery Engine**  
> Integrated with **Aiven OpenSearch Cloud** for real-time application indexing and search.

![JobPulse](https://img.shields.io/badge/JobPulse-v1.0-emerald)
![Vue](https://img.shields.io/badge/Vue-3.5-emerald?logo=vue.js)
![Vite](https://img.shields.io/badge/Vite-8.2-purple?logo=vite)
![OpenSearch](https://img.shields.io/badge/OpenSearch-Aiven%20Cloud-blue?logo=opensearch)

---

## ✨ Features

- 🔍 **Multi-Platform Web Scraper Simulation**:
  - Live crawlers across **LinkedIn**, **Indeed**, **RemoteOK**, **WeWorkRemotely**, and **Wellfound**.
  - Interactive pagination, keyword filtering, salary range sliders, and platform toggles.
- 🎯 **AI Resume Parser & Confidence Matcher**:
  - Live **Market Readiness Index** and candidate profile radar.
  - Automatically identifies and showcases the **Top Confident Matches** for your background.
  - **Natural-Language AI Job Suggestions**: Ask AI custom search prompts (e.g. *"Suggest high-paying remote Vue 3 roles with Docker"*).
- ⚡ **1-Click Easy Apply & Auto Gap-Filling**:
  - Multi-dimensional compatibility scoring (Skills, Domain, Seniority).
  - **75%+ Automated Gap-Filling**: When compatibility is $\ge 75\%$, automatically bridges missing secondary skills, optimizes experience bullet points, and generates a personalized cover letter pitch.
- ☁️ **Aiven OpenSearch Cloud Integration**:
  - Direct indexing of applications and resumes to an OpenSearch cluster via secure local proxy (`/api/opensearch`).
  - Searchable indices (`jobpulse-applications`, `jobpulse-resumes`).
  - Resilient dual-layer persistence with instant offline local storage fallback.
- 📊 **Career Pipeline & Application Tracker**:
  - Kanban board (Wishlist, Applied, Interviewing, Offered, Archived).
  - Inspect tailored application packages and match scores directly from applied job cards.

---

## 🛠 Tech Stack

- **Core Engine**: JobPulse Scraper & Application Pipeline
- **Database & Search**: Aiven OpenSearch Cloud Cluster (`os-314a7181-managethedev-7614.c.aivencloud.com:25717`)
- **Frontend**: Vue 3 (Composition API, `<script setup>`)
- **Build Tool**: Vite
- **Styling**: Modern Vanilla CSS (Glassmorphism, Dark Mode, CSS Variables)

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

### 3. Configure OpenSearch Environment
Copy `.env.example` to `.env` and fill in your OpenSearch credentials:
```bash
cp .env.example .env
```

```env
AIVEN_OPENSEARCH_HOST=os-314a7181-managethedev-7614.c.aivencloud.com
AIVEN_OPENSEARCH_PORT=25717
AIVEN_OPENSEARCH_USER=avnadmin
AIVEN_OPENSEARCH_PASSWORD=your_aiven_password_here
```

### 4. Run development server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 5. Build for production
```bash
npm run build
```

---

## 📄 License
MIT © [jins-coder](https://github.com/jins-coder)
