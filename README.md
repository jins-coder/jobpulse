# JobPulse 🚀

> **Live Multi-Source Job Scraper, AI Resume Tailoring, ATS Score Optimizer & Career Discovery Engine**  
> Built with a **Node.js Express Backend**, **Vue 3 Frontend**, and **Aiven OpenSearch Cloud Integration**.

![JobPulse](https://img.shields.io/badge/JobPulse-v2.0-emerald)
![Vue](https://img.shields.io/badge/Vue-3.5-emerald?logo=vue.js)
![Node](https://img.shields.io/badge/Node.js-Express-green?logo=node.js)
![Vite](https://img.shields.io/badge/Vite-8.2-purple?logo=vite)
![OpenSearch](https://img.shields.io/badge/OpenSearch-Aiven%20Cloud-blue?logo=opensearch)

---

## 🚨 What the Modern Job Search Lacks (And How JobPulse Solves It)

The traditional hiring ecosystem is fundamentally broken for job seekers. Candidates face silent rejections, portal fatigue, and hours of repetitive manual effort. JobPulse was built to directly fix the **7 core pain points** of modern job hunting:

| # | What Legacy Job Search Lacks | How JobPulse Solves It |
|---|---|---|
| **1** | **The "ATS Black Hole"**: 75%+ of resumes are discarded by automated systems with zero feedback. | **Real-Time ATS Score Checker & Free API**: Live 0–100 radial gauge testing formatting, action verbs, quantifiable metrics, and target job keyword alignment. |
| **2** | **Fragmented Portals**: Candidates juggle 5–10 separate job boards daily, repeating searches. | **Unified Multi-Platform Ingestion**: Aggregates LinkedIn, Indeed, RemoteOK, WeWorkRemotely, and Wellfound in a single dashboard. |
| **3** | **Manual Tailoring Bottleneck**: Tailoring 50+ resumes manually takes 40–60 hours, causing severe burnout. | **75%+ Automated Gap-Filling & Tailoring**: Automatically bridges missing secondary skills, optimizes experience bullets, and writes tailored cover letters in 3 seconds. |
| **4** | **Ad-Spend Search Bias**: Legacy boards rank jobs by recruiter ad budget ("Sponsored Posts"), not fit. | **Candidate-First Confidence Radar**: Ranks all jobs by true mathematical compatibility (Skills 65%, Domain 20%, Seniority 15%). |
| **5** | **"Ghost Jobs" & Stale Listings**: 30–40% of postings on major boards are inactive or already filled. | **Live Telemetry & Timestamps**: Every listing displays exact crawler ingestion timestamps (`scrapedAt: 15m ago`) and active status indicators. |
| **6** | **Hidden Salaries & Currency Friction**: Postings hide compensation; international roles lack local currency parity. | **Transparent Compensation & Multi-Currency**: Upfront salary filtering across USD (`$`), INR (`₹`), and EUR (`€`), including Indian tech hub roles (Bengaluru, Hyderabad, Pune). |
| **7** | **Disorganized Tracking via Sheets**: Candidates lose track of versions, follow-ups, and interview stages. | **Integrated Kanban Pipeline & Cloud Sync**: Move applications through Wishlist, Applied, Interviewing, and Offered stages with Aiven OpenSearch persistence. |

> 📖 **Read the in-depth industry analysis**: [JOB_SEARCH_GAPS_AND_SOLUTIONS.md](JOB_SEARCH_GAPS_AND_SOLUTIONS.md)

---

## ✨ Core Features

- 🔍 **Multi-Platform Web Scraper Simulation**:
  - Live crawlers across **LinkedIn**, **Indeed**, **RemoteOK**, **WeWorkRemotely**, and **Wellfound**.
  - Interactive pagination, keyword filtering, salary range sliders, job type switcher (Full-time vs Part-time), and platform toggles.
- 🎯 **AI Resume Parser & Confidence Matcher**:
  - Live **Market Readiness Index** and candidate profile radar.
  - Automatically identifies and showcases the **Top Confident Matches** for your background.
  - **Natural-Language AI Job Suggestions**: Ask AI custom search prompts (e.g. *"Suggest high-paying remote Vue 3 roles with Docker"*).
- ⚡ **1-Click Easy Apply & Auto Gap-Filling**:
  - Multi-dimensional compatibility scoring (Skills, Domain, Seniority).
  - **75%+ Automated Gap-Filling**: When compatibility is $\ge 75\%$, automatically bridges missing secondary skills, optimizes experience bullet points, and generates a personalized cover letter pitch.
- 📄 **ATS Resume Optimizer & Free Open ATS API**:
  - Radial score gauge evaluating 5 critical ATS dimensions (Formatting, Standard Headings, Metrics, Action Verbs, and Keyword Density).
  - **Target Job Matcher**: Compare your resume against any scraped role to identify missing ATS keywords.
  - **Free Open REST API**: `POST /api/ats/analyze` and `POST /api/ats/parse` with zero API keys required.
- 🔐 **Full-Stack Node.js Backend & Authentication**:
  - Express backend server with JWT bearer tokens and Bcrypt password encryption.
  - Sign In, Sign Up, 1-Click Demo Login (`alex@jobpulse.io`), and Logout controls.
- ☁️ **Aiven OpenSearch Cloud Integration**:
  - Direct indexing of applications and resumes to an OpenSearch cluster via secure local proxy (`/api/opensearch`).
  - Searchable indices (`jobpulse-applications`, `jobpulse-resumes`).
  - Resilient dual-layer persistence with instant offline local storage fallback.
- 📊 **Career Pipeline & Application Tracker**:
  - Kanban board (Wishlist, Applied, Interviewing, Offered, Archived).
  - Inspect tailored application packages and match scores directly from applied job cards.

---

## 🛠 Tech Stack

- **Backend**: Node.js & Express (`server/`)
- **Authentication**: JWT & Bcryptjs
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

### 3. Configure Environment
Copy `.env.example` to `.env` and configure your credentials:
```bash
cp .env.example .env
```

```env
AIVEN_OPENSEARCH_HOST=os-314a7181-managethedev-7614.c.aivencloud.com
AIVEN_OPENSEARCH_PORT=25717
AIVEN_OPENSEARCH_USER=avnadmin
AIVEN_OPENSEARCH_PASSWORD=your_aiven_password_here
JWT_SECRET=jobpulse-super-secret-jwt-key-2026
```

### 4. Run Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

Running `npm run dev` serves **both** the Vue 3 frontend and the Node.js Express backend (`/api/*`) simultaneously through Vite middleware.

---

## 📡 Free ATS API Usage

You can test the built-in ATS scoring engine directly via cURL:

```bash
curl -X POST http://localhost:5173/api/ats/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "Alex Morgan\nSenior Vue Engineer\nEmail: alex@jobpulse.io\nPhone: +1 555-0192\nSkills: Vue 3, Vite, TypeScript\nExperience: Architected microservices improving speed by 48% for 100k+ users."
  }'
```

### API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/ats/analyze` | Full ATS evaluation, dimensional scores & missing keywords |
| `POST` | `/api/ats/parse` | Extracts candidate contact fields & technical skills from raw text |
| `GET` | `/api/ats/sample` | Returns a benchmark 88/100 ATS resume |
| `POST` | `/api/auth/register` | Register new user with hashed password & JWT token |
| `POST` | `/api/auth/login` | Login user & issue JWT bearer token |
| `GET` | `/api/auth/me` | Protected route returning authenticated user profile |
| `POST` | `/api/auth/logout` | Invalidate user session |
