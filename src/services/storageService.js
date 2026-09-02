// Storage & Export service for JobPulse
import { DEFAULT_JOBS } from '../data/defaultJobs.js';

const STORAGE_KEY_JOBS = 'jobpulse_scraped_jobs_v2';
const STORAGE_KEY_RUNS = 'jobpulse_scraper_history_v1';
const STORAGE_KEY_APPLICATIONS = 'jobpulse_applications_v1';

export const storageService = {
  // --- Jobs Storage Methods ---
  getJobs() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_JOBS);
      if (!data) {
        this.saveJobs(DEFAULT_JOBS);
        return [...DEFAULT_JOBS];
      }
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed)) {
        const existingIds = new Set(parsed.map(j => j.id));
        const missingSeeds = DEFAULT_JOBS.filter(d => !existingIds.has(d.id));
        if (missingSeeds.length > 0) {
          const merged = [...parsed, ...missingSeeds];
          this.saveJobs(merged);
          return merged;
        }
        return parsed;
      }
      return [...DEFAULT_JOBS];
    } catch (e) {
      console.error("Failed to load jobs from localStorage", e);
      return [...DEFAULT_JOBS];
    }
  },

  saveJobs(jobs) {
    try {
      localStorage.setItem(STORAGE_KEY_JOBS, JSON.stringify(jobs));
    } catch (e) {
      console.error("Failed to save jobs to localStorage", e);
    }
  },

  addJobs(newJobs) {
    const current = this.getJobs();
    const existingIds = new Set(current.map(j => `${j.company.toLowerCase()}-${j.title.toLowerCase()}`));
    
    let addedCount = 0;
    const combined = [...current];

    for (const job of newJobs) {
      const key = `${job.company.toLowerCase()}-${job.title.toLowerCase()}`;
      if (!existingIds.has(key)) {
        combined.unshift(job);
        existingIds.add(key);
        addedCount++;
      }
    }

    this.saveJobs(combined);
    return { addedCount, totalCount: combined.length };
  },

  updateJobStatus(jobId, status, extraMeta = {}) {
    const jobs = this.getJobs();
    const idx = jobs.findIndex(j => j.id === jobId);
    if (idx !== -1) {
      jobs[idx].status = status;
      if (extraMeta && typeof extraMeta === 'object') {
        Object.assign(jobs[idx], extraMeta);
      }
      this.saveJobs(jobs);
      return jobs[idx];
    }
    return null;
  },

  deleteJob(jobId) {
    const jobs = this.getJobs().filter(j => j.id !== jobId);
    this.saveJobs(jobs);
    return jobs;
  },

  clearAllJobs() {
    localStorage.removeItem(STORAGE_KEY_JOBS);
    return [];
  },

  resetDefaultJobs() {
    this.saveJobs(DEFAULT_JOBS);
    return [...DEFAULT_JOBS];
  },

  // --- Applications DB Methods (Easy Apply) ---
  getApplications() {
    try {
      const data = localStorage.getItem(STORAGE_KEY_APPLICATIONS);
      return data ? JSON.parse(data) : [];
    } catch (e) {
      console.error("Failed to load applications from storage", e);
      return [];
    }
  },

  saveApplication(application) {
    try {
      const apps = this.getApplications();
      const existingIdx = apps.findIndex(a => a.jobId === application.jobId);
      if (existingIdx !== -1) {
        apps[existingIdx] = { ...apps[existingIdx], ...application, updatedAt: new Date().toISOString() };
      } else {
        apps.unshift({
          ...application,
          id: `app_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
          appliedAt: new Date().toISOString()
        });
      }
      localStorage.setItem(STORAGE_KEY_APPLICATIONS, JSON.stringify(apps));

      // Automatically mark job as 'applied' in jobs table
      this.updateJobStatus(application.jobId, 'applied', {
        matchScore: application.matchScore,
        appliedAt: new Date().toISOString()
      });

      return application;
    } catch (e) {
      console.error("Failed to save application", e);
      return null;
    }
  },

  getApplicationByJobId(jobId) {
    const apps = this.getApplications();
    return apps.find(a => a.jobId === jobId) || null;
  },

  // --- Export features ---
  exportToJson(jobs) {
    const cleanJobs = jobs.map(({ ...rest }) => rest);
    const jsonStr = JSON.stringify(cleanJobs, null, 2);
    const blob = new Blob([jsonStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jobpulse_scraped_jobs_${new Date().toISOString().slice(0, 10)}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  exportToCsv(jobs) {
    if (!jobs || jobs.length === 0) return;
    const headers = [
      "ID",
      "Title",
      "Company",
      "Platform",
      "Location",
      "IsRemote",
      "SalaryFormatted",
      "SalaryMin",
      "SalaryMax",
      "Type",
      "ExperienceLevel",
      "Tags",
      "ScrapedAt",
      "Status",
      "URL"
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const rows = jobs.map(j => [
      escapeCsv(j.id),
      escapeCsv(j.title),
      escapeCsv(j.company),
      escapeCsv(j.platform),
      escapeCsv(j.location),
      escapeCsv(j.isRemote ? "Yes" : "No"),
      escapeCsv(j.salary?.formatted || "Not specified"),
      escapeCsv(j.salary?.min || ""),
      escapeCsv(j.salary?.max || ""),
      escapeCsv(j.type || ""),
      escapeCsv(j.experienceLevel || ""),
      escapeCsv((j.tags || []).join(", ")),
      escapeCsv(j.scrapedAt || ""),
      escapeCsv(j.status || "Unsaved"),
      escapeCsv(j.platformUrl || "")
    ]);

    const csvContent = [headers.join(','), ...rows.map(r => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `jobpulse_scraped_jobs_${new Date().toISOString().slice(0, 10)}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }
};
