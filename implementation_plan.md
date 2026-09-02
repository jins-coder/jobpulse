# Implementation Plan: Easy Apply AI Resume Parser, Gap-Filling & Application Engine

Build an intelligent **Easy Apply** system for JobPulse that parses candidate resumes, computes multidimensional job compatibility scoring, automatically tailors and bridges skill gaps if compatibility is **>= 75%**, and submits the application while persisting application history to local storage.

---

## User Review Required

> [!IMPORTANT]
> - **Compatibility Threshold**: As requested, applications scoring **>= 75%** will automatically trigger the **Gap-Filling & Resume Tailoring Engine**, enhancing bullet points and addressing missing keywords before submission.
> - **If < 75%**: The system will display an actionable Gap Analysis report (highlighting missing core skills) and allow the user to either review/edit their resume or proceed with manual tailoring.
> - **Persistent Storage**: All master resumes and tailored job applications will be saved in `storageService` (`localStorage`), tracking the customized resume version, match score, and applied status in the **Job Tracker Pipeline**.

---

## Architecture & Data Flow

```mermaid
flowchart TD
    A[Job Card / Detail Modal] -->|Click 'Easy Apply'| B[EasyApplyModal.vue]
    B --> C{Has Master Resume?}
    C -->|No| D[Upload / Paste Resume File]
    C -->|Yes| E[Resume Parser Service]
    D --> E
    E --> F[Extract Skills, Experience, Projects]
    F --> G[Compatibility Matcher Engine]
    G --> H{Score >= 75%?}
    H -->|Yes| I[AI Resume Gap-Filling & Tailor Engine]
    H -->|No (< 75%)| J[Show Gap Breakdown & Allow Resume Edit]
    I --> K[Preview Tailored Resume & Diff]
    K --> L[Click 'Submit Application']
    L --> M[Save to Database (storageService)]
    M --> N[Update Job Status to 'applied']
    N --> O[Sync Pipeline Tracker & Show Confetti Confirmation]
```

---

## Proposed Changes

### Core Services

#### [NEW] [resumeService.js](file:///e:/projects/vuetest/src/services/resumeService.js)
- **Resume Parser**:
  - Parses uploaded text, JSON, or mock PDF/Word files.
  - Extracts structured candidate profile: `name`, `email`, `phone`, `headline`, `summary`, `skills[]`, `experience[]`, `education[]`, `projects[]`.
  - Provides a realistic default candidate profile (Senior Full-Stack / Vue Developer) out-of-the-box so users can test immediately without uploading a file.
- **Compatibility Matcher Engine**:
  - Calculates skill match ratio (matching job tags/keywords against candidate skills).
  - Evaluates seniority/experience alignment against job requirements.
  - Generates detailed score breakdown: `overallScore`, `matchedSkills[]`, `missingSkills[]`, `seniorityScore`.
- **Gap-Filling & Auto-Tailor Engine**:
  - If score >= 75%:
    - Bridges missing skills by synthesizing relevant project achievements and contextualizing transferable experience.
    - Generates tailored role summary and optimized bullet points emphasizing the target company's stack.
    - Generates a custom 1-paragraph cover letter pitch tailored for the company.
- **Storage Integration**:
  - Saves/retrieves master resume in `localStorage` (`jobpulse_master_resume_v1`).

#### [MODIFY] [storageService.js](file:///e:/projects/vuetest/src/services/storageService.js)
- Add application persistence methods:
  - `saveApplication({ jobId, jobTitle, company, matchScore, tailoredResume, appliedAt, status: 'applied' })`
  - `getApplications()`
  - `getApplicationByJobId(jobId)`
- Automatically transition job status to `'applied'` when an Easy Apply completes.

---

### UI Components

#### [NEW] [EasyApplyModal.vue](file:///e:/projects/vuetest/src/components/EasyApplyModal.vue)
- Multi-step interactive application modal:
  1. **Step 1: Resume Verification & Score Check**:
     - Shows candidate resume preview (with upload/edit options).
     - Live Compatibility Gauge (Animated radial score or progress bar with color coding: Green for >= 75%, Amber for < 75%).
     - Breakdown of matched skills vs missing gaps.
  2. **Step 2: Auto-Tailoring & Gap-Filling Preview (When >= 75%)**:
     - Highlights tailored additions (new keywords bridged, tailored summary, cover note).
     - Toggle between "Tailored Resume" and "Original Resume" diff.
  3. **Step 3: Instant 1-Click Submission**:
     - Submits the application, plays a progress/success animation, and persists to local DB.

#### [MODIFY] [JobCard.vue](file:///e:/projects/vuetest/src/components/JobCard.vue)
- Add an **"⚡ Easy Apply"** button alongside the existing "Details" button.
- Shows a small badge if the job is already applied.

#### [MODIFY] [JobDetailModal.vue](file:///e:/projects/vuetest/src/components/JobDetailModal.vue)
- Add an **"⚡ Easy Apply with Resume"** primary button in the modal footer.
- Shows application status and match score if previously applied.

#### [MODIFY] [JobTracker.vue](file:///e:/projects/vuetest/src/components/JobTracker.vue)
- Enhance the "Applied" column to show the Easy Apply badge and allow viewing the specific tailored resume submitted for that job.

#### [MODIFY] [App.vue](file:///e:/projects/vuetest/src/App.vue)
- Mount `EasyApplyModal` and coordinate opening/closing when Easy Apply is triggered from `JobCard`, `JobFinder`, or `JobDetailModal`.
- Show success toast notifications when an application is saved.

---

## Verification Plan

### Automated Tests
- Run `node ./node_modules/vite/bin/vite.js build` to ensure all components and services compile without errors or warnings.

### Manual Verification
1. **Default & Custom Resume**:
   - Open Job Explorer, click "⚡ Easy Apply" on any job.
   - Verify master resume loads with realistic default data, or test uploading a custom resume text file.
2. **Compatibility Scoring**:
   - Test a high-compatibility job (Vue/Frontend stack) -> verify score exceeds 75%.
   - Test a low-compatibility job (e.g. unrelated stack) -> verify score is < 75% and displays the gap breakdown warning.
3. **Gap-Filling & Auto-Tailor**:
   - For jobs >= 75%, verify the Gap-Filling Engine highlights missing tags and generates customized resume bullet points.
4. **Application Submission & Persistence**:
   - Click "Submit Easy Apply" -> verify application is saved to `storageService`.
   - Verify job status updates to `'applied'` and appears in Job Tracker pipeline.
   - Refresh the browser and verify the applied status and tailored resume persist.
