<template>
  <div class="app-container">
    <!-- Top Nav Header -->
    <HeaderNav 
      :current-view="currentView"
      :total-jobs="jobs.length"
      :tracked-count="trackedCount"
      :is-scraping="isScraping"
      @change-view="switchView"
      @quick-scrape="triggerQuickScrape"
      @export="handleExport"
      @edit-resume="openResumeEditor"
      @open-auth="showAuthModal = true"
      @user-logout="handleUserLogout"
    />

    <!-- Active View Router / Switcher -->
    <main class="main-content">
      <WhatItBrokeErrorBoundary :inline-fallback="true">
        <!-- 1. Job Explorer -->
      <JobFinder 
        v-if="currentView === 'explorer'"
        :jobs="jobs"
        @select-job="openJobDetail"
        @toggle-save="toggleJobSave"
        @request-scrape="handleRequestScrapeFromFinder"
        @easy-apply="openEasyApply"
        @edit-resume="openResumeEditor"
        @resume-updated="handleResumeUpdated"
      />

      <!-- 2. Scraper Dashboard -->
      <ScraperDashboard 
        v-else-if="currentView === 'scraper'"
        :is-scraping="isScraping"
        :is-paused="isPaused"
        :progress="crawlProgress"
        :stats="crawlStats"
        :logs="logs"
        @start-scrape="startScrapingPipeline"
        @pause-scrape="pauseScraper"
        @resume-scrape="resumeScraper"
        @abort-scrape="abortScraper"
        @clear-logs="logs = []"
        @reset-defaults="resetSeedData"
        @clear-jobs="clearAllJobs"
      />

      <!-- 3. Job Tracker Pipeline -->
      <JobTracker 
        v-else-if="currentView === 'tracker'"
        :jobs="jobs"
        @select-job="openJobDetail"
        @change-status="updateJobStatus"
        @easy-apply="openEasyApply"
      />

      <!-- 4. ATS Resume Optimizer & Parser Hub -->
      <AtsChecker 
        v-else-if="currentView === 'ats'"
        :jobs="jobs"
        @resume-updated="handleResumeUpdated"
        @show-toast="showToast"
      />

      <!-- 5. Market Insights & Analytics -->
      <MarketInsights 
        v-else-if="currentView === 'insights'"
        :jobs="jobs"
      />
      </WhatItBrokeErrorBoundary>
    </main>

    <!-- Job Detail Modal -->
    <JobDetailModal 
      v-if="selectedJob"
      :job="selectedJob"
      @close="selectedJob = null"
      @change-status="updateJobStatus"
      @easy-apply="openEasyApply"
    />

    <!-- Easy Apply & AI Resume Tailor Modal -->
    <EasyApplyModal 
      v-if="easyApplyJob"
      :job="easyApplyJob"
      @close="easyApplyJob = null"
      @applied="handleApplicationSubmitted"
    />

    <!-- User Authentication Modal -->
    <AuthModal 
      v-if="showAuthModal" 
      @close="showAuthModal = false" 
      @auth-success="handleAuthSuccess" 
    />

    <!-- Toast / Notification Bar -->
    <transition name="fade">
      <div v-if="toastMessage" class="toast-notification">
        <span class="toast-icon">⚡</span>
        <span class="toast-text">{{ toastMessage }}</span>
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import HeaderNav from './components/HeaderNav.vue';
import JobFinder from './components/JobFinder.vue';
import JobCard from './components/JobCard.vue';
import JobDetailModal from './components/JobDetailModal.vue';
import ScraperDashboard from './components/ScraperDashboard.vue';
import JobTracker from './components/JobTracker.vue';
import MarketInsights from './components/MarketInsights.vue';
import EasyApplyModal from './components/EasyApplyModal.vue';
import AuthModal from './components/AuthModal.vue';
import AtsChecker from './components/AtsChecker.vue';
import { WhatItBrokeErrorBoundary } from '@whatitbroke/vue';
import { storageService } from './services/storageService.js';
import { ScraperRunner } from './services/scraperService.js';
import { authService } from './services/authService.js';

// App State
const currentView = ref('explorer'); // 'explorer' | 'scraper' | 'tracker' | 'ats' | 'insights'
const jobs = ref([]);
const selectedJob = ref(null);
const easyApplyJob = ref(null);
const showAuthModal = ref(false);
const toastMessage = ref('');

// Scraper Engine State
const isScraping = ref(false);
const isPaused = ref(false);
const crawlProgress = ref({ percent: 0, currentPlatform: '', currentPage: 1, totalPages: 2, totalJobs: 0 });
const crawlStats = ref({ requestsSent: 0, nodesEvaluated: 0, jobsExtracted: 0, errorsCount: 0 });
const logs = ref([]);
let currentRunner = null;

const trackedCount = computed(() => {
  return jobs.value.filter(j => !!j.status).length;
});

const switchView = (view) => {
  currentView.value = view;
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const showToast = (msg) => {
  toastMessage.value = msg;
  setTimeout(() => {
    if (toastMessage.value === msg) {
      toastMessage.value = '';
    }
  }, 3500);
};

onMounted(async () => {
  jobs.value = storageService.getJobs();
  await authService.checkAuth();
});

const handleAuthSuccess = (user) => {
  showToast(`Welcome back, ${user.name}!`);
  showAuthModal.value = false;
};

const handleUserLogout = () => {
  showToast('You have been signed out.');
};

const handleResumeUpdated = (updatedResume) => {
  showToast(`Resume profile updated for ${updatedResume.name}!`);
};

// Job Actions
const openJobDetail = (job) => {
  selectedJob.value = job;
};

const openEasyApply = (job) => {
  easyApplyJob.value = job;
};

const openResumeEditor = () => {
  const targetJob = jobs.value[0] || {
    id: 'master_profile_review',
    title: 'Master Profile Review',
    company: 'JobPulse Career Hub',
    platform: 'Profile',
    tags: ['Vue 3', 'TypeScript', 'Vite']
  };
  openEasyApply(targetJob);
};

const handleApplicationSubmitted = ({ job, application }) => {
  // Sync refreshed jobs list
  jobs.value = storageService.getJobs();
  showToast(`⚡ Easy Apply successfully submitted for ${job.title} @ ${job.company}! (${application.matchScore}% Match)`);
  easyApplyJob.value = null;
};

const toggleJobSave = (job) => {
  const newStatus = job.status ? null : 'saved';
  updateJobStatus({ jobId: job.id, status: newStatus });
  showToast(newStatus ? `Saved "${job.title}" to tracker!` : `Removed from tracker.`);
};

const updateJobStatus = ({ jobId, status }) => {
  const updated = storageService.updateJobStatus(jobId, status);
  if (updated) {
    const idx = jobs.value.findIndex(j => j.id === jobId);
    if (idx !== -1) {
      jobs.value[idx].status = status;
      if (selectedJob.value && selectedJob.value.id === jobId) {
        selectedJob.value.status = status;
      }
    }
  }
};

const handleExport = (format) => {
  if (format === 'csv') {
    storageService.exportToCsv(jobs.value);
    showToast(`Exported ${jobs.value.length} jobs to CSV.`);
  } else {
    storageService.exportToJson(jobs.value);
    showToast(`Exported ${jobs.value.length} jobs to JSON.`);
  }
};

const resetSeedData = () => {
  jobs.value = storageService.resetDefaultJobs();
  showToast('Reset jobs database to initial seed listings.');
};

const clearAllJobs = () => {
  jobs.value = storageService.clearAllJobs();
  showToast('Cleared all scraped jobs from local database.');
};

// Scraper Controls
const triggerQuickScrape = () => {
  switchView('scraper');
  startScrapingPipeline({
    query: 'Vue developer',
    location: 'Remote',
    platforms: ['LinkedIn', 'RemoteOK', 'Indeed'],
    pagesPerPlatform: 1,
    scrapeMode: 'hybrid'
  });
};

const handleRequestScrapeFromFinder = ({ query, location }) => {
  switchView('scraper');
  startScrapingPipeline({
    query: query || 'Vue developer',
    location: location || 'Remote',
    platforms: ['LinkedIn', 'RemoteOK', 'Indeed', 'WeWorkRemotely'],
    pagesPerPlatform: 2,
    scrapeMode: 'hybrid'
  });
};

const startScrapingPipeline = (options) => {
  if (isScraping.value) return;

  isScraping.value = true;
  isPaused.value = false;
  crawlProgress.value = { percent: 0, currentPlatform: 'Starting', currentPage: 1, totalPages: options.pagesPerPlatform || 2, totalJobs: 0 };
  crawlStats.value = { requestsSent: 0, nodesEvaluated: 0, jobsExtracted: 0, errorsCount: 0 };

  currentRunner = new ScraperRunner(options);

  currentRunner
    .onLog((entry) => {
      logs.value.push(entry);
    })
    .onProgress((p) => {
      crawlProgress.value = p;
      crawlStats.value.requestsSent = currentRunner.stats.requestsSent;
      crawlStats.value.nodesEvaluated = currentRunner.stats.nodesEvaluated;
      crawlStats.value.jobsExtracted = currentRunner.stats.jobsExtracted;
    })
    .onJobFound((newJob) => {
      // Add dynamically to active state and localStorage
      const result = storageService.addJobs([newJob]);
      jobs.value = storageService.getJobs();
    })
    .onComplete(({ stats, jobs: newlyScraped }) => {
      isScraping.value = false;
      isPaused.value = false;
      showToast(`Scrape complete! Successfully extracted ${stats.jobsExtracted} jobs.`);
    });

  currentRunner.start();
};

const pauseScraper = () => {
  if (currentRunner) {
    currentRunner.pause();
    isPaused.value = true;
  }
};

const resumeScraper = () => {
  if (currentRunner) {
    currentRunner.resume();
    isPaused.value = false;
  }
};

const abortScraper = () => {
  if (currentRunner) {
    currentRunner.abort();
    isScraping.value = false;
    isPaused.value = false;
    showToast('Crawler sequence aborted.');
  }
};
</script>

<style scoped>
.main-content {
  display: flex;
  flex-direction: column;
  flex: 1;
}

/* Debugger Banner Strip */
.debugger-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.25rem;
  background: rgba(244, 63, 94, 0.08);
  border: 1px dashed rgba(244, 63, 94, 0.35);
  border-radius: var(--radius-md);
  margin-bottom: 1.5rem;
  gap: 1rem;
  flex-wrap: wrap;
}

.strip-left {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.strip-badge {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 800;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  background: rgba(244, 63, 94, 0.2);
  color: #fda4af;
  border: 1px solid rgba(244, 63, 94, 0.4);
}

.strip-text {
  font-size: 0.82rem;
  color: var(--text-secondary);
}

.lab-pill {
  font-size: 1rem;
}

/* Toast */
.toast-notification {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  background: #0f172a;
  border: 1px solid var(--accent-emerald);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.8), 0 0 15px var(--accent-emerald-glow);
  padding: 0.8rem 1.4rem;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  gap: 0.65rem;
  z-index: 200;
  color: #ffffff;
  font-size: 0.88rem;
  font-weight: 600;
}

.toast-icon {
  color: var(--accent-emerald);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s, transform 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
