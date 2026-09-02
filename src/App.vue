<template>
  <div class="app-container">
    <!-- Top Nav Header -->
    <HeaderNav 
      :current-view="currentView"
      :total-jobs="jobs.length"
      :tracked-count="trackedCount"
      @change-view="switchView"
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
          @easy-apply="openEasyApply"
          @edit-resume="openResumeEditor"
          @resume-updated="handleResumeUpdated"
          @refresh-jobs="refreshLiveJobs"
        />

        <!-- 2. ATS Resume Optimizer & Parser Hub -->
        <AtsChecker 
          v-else-if="currentView === 'ats'"
          :jobs="jobs"
          @resume-updated="handleResumeUpdated"
          @show-toast="showToast"
        />

        <!-- 3. Market Insights & Analytics -->
        <MarketInsights 
          v-else-if="currentView === 'insights'"
          :jobs="jobs"
          @change-view="switchView"
        />

        <!-- 4. What Current Job Market Lacks & Solutions -->
        <MarketGaps 
          v-else-if="currentView === 'market-gaps'"
          :jobs="jobs"
          @change-view="switchView"
          @open-easy-apply="openEasyApply"
          @upload-resume="openResumeEditor"
        />

        <!-- 5. Job Tracker Pipeline -->
        <JobTracker 
          v-else-if="currentView === 'tracker'"
          :jobs="jobs"
          @select-job="openJobDetail"
          @change-status="updateJobStatus"
          @easy-apply="openEasyApply"
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
      @view-tracker="switchView('tracker')"
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
import JobTracker from './components/JobTracker.vue';
import MarketInsights from './components/MarketInsights.vue';
import MarketGaps from './components/MarketGaps.vue';
import EasyApplyModal from './components/EasyApplyModal.vue';
import AuthModal from './components/AuthModal.vue';
import AtsChecker from './components/AtsChecker.vue';
import { WhatItBrokeErrorBoundary } from '@whatitbroke/vue';
import { storageService } from './services/storageService.js';
import { authService } from './services/authService.js';
import { dbService } from './services/dbService.js';

// App State
const currentView = ref('explorer'); // 'explorer' | 'ats' | 'insights' | 'market-gaps' | 'tracker'
const jobs = ref([]);
const selectedJob = ref(null);
const easyApplyJob = ref(null);
const showAuthModal = ref(false);
const toastMessage = ref('');

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
  const cached = storageService.getJobs();
  if (cached.length > 0) {
    jobs.value = cached;
  }
  try {
    const live = await storageService.fetchLiveJobs();
    if (live && live.length > 0) {
      jobs.value = live;
    }
  } catch (err) {
    console.warn('[App] Live jobs fetch fallback:', err);
  }
  await authService.checkAuth();
});

const refreshLiveJobs = async () => {
  showToast('Scraping latest live job feeds...');
  try {
    const fresh = await storageService.fetchLiveJobs(true);
    if (fresh && fresh.length > 0) {
      jobs.value = fresh;
      showToast(`⚡ Ingested ${fresh.length} live opportunities!`);
    }
  } catch (e) {
    showToast('Could not reach live scraper endpoint.');
  }
};

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
  showToast(`⚡ Application successfully submitted & dispatched for ${job.title} @ ${job.company}!`);

  // Background Cloud Indexing
  dbService.saveApplication(application).catch(e => {
    console.warn('[App] Background cloud save warning:', e.message);
  });
};

const toggleJobSave = (job) => {
  const newStatus = job.status === 'saved' ? null : 'saved';
  updateJobStatus({ job, status: newStatus });
};

const updateJobStatus = async ({ job, status }) => {
  const updatedList = storageService.updateJobStatus(job.id, status);
  jobs.value = updatedList;

  if (selectedJob.value && selectedJob.value.id === job.id) {
    selectedJob.value = { ...selectedJob.value, status };
  }

  showToast(status ? `Job status updated: ${status.toUpperCase()}` : 'Removed from tracker');

  if (status) {
    try {
      await dbService.saveApplication({
        id: `app-${job.id}`,
        jobId: job.id,
        jobTitle: job.title,
        company: job.company,
        platform: job.platform,
        status: status,
        appliedAt: new Date().toISOString()
      });
    } catch (e) {
      console.warn('[App] Status sync warning:', e.message);
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
</script>

<style scoped>
.main-content {
  display: flex;
  flex-direction: column;
  flex: 1;
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
