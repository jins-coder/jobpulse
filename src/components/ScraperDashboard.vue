<template>
  <div class="scraper-dashboard-root">
    <!-- Configuration & Control Card -->
    <div class="glass-panel config-panel">
      <div class="panel-header">
        <div class="header-left">
          <div class="panel-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M12 2v20"/>
              <path d="m17 5-5-3-5 3"/>
              <path d="m17 19-5 3-5-3"/>
              <path d="M2 12h20"/>
              <path d="m5 7-3 5 3 5"/>
              <path d="m19 7 3 5-3 5"/>
            </svg>
          </div>
          <div>
            <h2 class="panel-title">Multi-Platform Crawler & Scraper Engine</h2>
            <p class="panel-desc">Configure target platforms, query patterns, and DOM traversal depth.</p>
          </div>
        </div>

        <div class="status-indicator-wrap">
          <span class="status-badge" :class="isScraping ? (isPaused ? 'paused' : 'running') : 'idle'">
            <span class="status-dot"></span>
            {{ isScraping ? (isPaused ? 'PAUSED' : 'CRAWLER ACTIVE') : 'IDLE' }}
          </span>
        </div>
      </div>

      <!-- Config Form Grid -->
      <div class="config-grid">
        <!-- Target Keywords -->
        <div class="form-group">
          <label class="form-label">Job Keywords / Target Role</label>
          <div class="input-with-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="11" cy="11" r="8"/>
              <path d="m21 21-4.3-4.3"/>
            </svg>
            <input 
              type="text" 
              v-model="scrapeQuery" 
              class="input-field" 
              placeholder="e.g. Vue.js, Frontend, Python, DevOps..."
              :disabled="isScraping"
            />
          </div>
        </div>

        <!-- Location -->
        <div class="form-group">
          <label class="form-label">Target Location</label>
          <div class="input-with-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <input 
              type="text" 
              v-model="scrapeLocation" 
              class="input-field" 
              placeholder="e.g. Remote, San Francisco, New York..."
              :disabled="isScraping"
            />
          </div>
        </div>

        <!-- Crawl Depth -->
        <div class="form-group">
          <div class="label-with-val">
            <label class="form-label">Pagination Depth</label>
            <span class="val-pill">{{ pagesPerPlatform }} pages/source</span>
          </div>
          <input 
            type="range" 
            min="1" 
            max="4" 
            step="1" 
            v-model.number="pagesPerPlatform" 
            class="range-slider-full"
            :disabled="isScraping"
          />
        </div>
      </div>

      <!-- Platform Checkboxes -->
      <div class="platforms-selector">
        <label class="form-label">Target Channels & Spiders</label>
        <div class="platform-checkbox-list">
          <label 
            v-for="plat in availablePlatforms" 
            :key="plat.name" 
            class="platform-card-checkbox"
            :class="{ selected: selectedPlatforms.includes(plat.name), disabled: isScraping }"
          >
            <input 
              type="checkbox" 
              :value="plat.name" 
              v-model="selectedPlatforms"
              :disabled="isScraping"
              class="hidden-cb"
            />
            <span class="cb-checkmark">
              <svg v-if="selectedPlatforms.includes(plat.name)" xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            </span>
            <span class="platform-name">{{ plat.name }}</span>
            <span class="platform-sub">{{ plat.type }}</span>
          </label>
        </div>
      </div>

      <!-- Action Controls -->
      <div class="actions-strip">
        <div class="primary-controls">
          <button 
            v-if="!isScraping" 
            class="btn btn-primary start-btn" 
            @click="handleStart"
            :disabled="selectedPlatforms.length === 0"
          >
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="5 3 19 12 5 21 5 3"/>
            </svg>
            <span>Start Scraping Pipeline</span>
          </button>

          <template v-else>
            <button class="btn btn-secondary" @click="handleTogglePause">
              <svg v-if="isPaused" xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polygon points="5 3 19 12 5 21 5 3"/>
              </svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="4" height="16" x="6" y="4"/>
                <rect width="4" height="16" x="14" y="4"/>
              </svg>
              <span>{{ isPaused ? 'Resume' : 'Pause' }}</span>
            </button>

            <button class="btn btn-danger" @click="handleAbort">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="18" height="18" x="3" y="3" rx="2"/>
              </svg>
              <span>Abort Crawler</span>
            </button>
          </template>
        </div>

        <div class="secondary-controls">
          <button class="btn btn-secondary btn-sm" @click="$emit('reset-defaults')" :disabled="isScraping">
            Reset Seed Data
          </button>
          <button class="btn btn-danger btn-sm" @click="$emit('clear-jobs')" :disabled="isScraping">
            Clear Scraped DB
          </button>
        </div>
      </div>

      <!-- Live Crawler Progress Bar -->
      <div v-if="isScraping || progress.percent > 0" class="progress-section">
        <div class="progress-header">
          <span class="progress-title">
            Crawling: <strong>{{ progress.currentPlatform || 'Initializing' }}</strong> 
            (Page {{ progress.currentPage || 1 }}/{{ progress.totalPages || pagesPerPlatform }})
          </span>
          <span class="progress-percent mono">{{ progress.percent }}%</span>
        </div>
        <div class="progress-track">
          <div class="progress-fill" :style="{ width: `${progress.percent}%` }"></div>
        </div>
      </div>
    </div>

    <!-- Live Crawler Stats Cards -->
    <div class="stats-grid">
      <div class="stat-card glass-panel">
        <div class="stat-icon-wrap indigo-glow">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <polyline points="12 6 12 12 14 14"/>
          </svg>
        </div>
        <div class="stat-meta">
          <span class="stat-value mono">{{ stats.requestsSent }}</span>
          <span class="stat-label">HTTP Requests</span>
        </div>
      </div>

      <div class="stat-card glass-panel">
        <div class="stat-icon-wrap violet-glow">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m7 15 5 5 5-5"/>
            <path d="m7 9 5-5 5 5"/>
          </svg>
        </div>
        <div class="stat-meta">
          <span class="stat-value mono">{{ stats.nodesEvaluated }}</span>
          <span class="stat-label">DOM Nodes Parsed</span>
        </div>
      </div>

      <div class="stat-card glass-panel">
        <div class="stat-icon-wrap emerald-glow">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
            <polyline points="22 4 12 14.01 9 11.01"/>
          </svg>
        </div>
        <div class="stat-meta">
          <span class="stat-value mono emerald-val">{{ stats.jobsExtracted }}</span>
          <span class="stat-label">Jobs Validated</span>
        </div>
      </div>

      <div class="stat-card glass-panel">
        <div class="stat-icon-wrap cyan-glow">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="20" height="16" x="2" y="4" rx="2"/>
            <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/>
          </svg>
        </div>
        <div class="stat-meta">
          <span class="stat-value mono">{{ selectedPlatforms.length }} / 5</span>
          <span class="stat-label">Active Spiders</span>
        </div>
      </div>
    </div>

    <!-- Live Terminal Stream -->
    <ScraperLogs 
      :logs="logs" 
      :is-scraping="isScraping" 
      @clear="$emit('clear-logs')"
    />
  </div>
</template>

<script setup>
import { ref } from 'vue';
import ScraperLogs from './ScraperLogs.vue';

const props = defineProps({
  isScraping: { type: Boolean, default: false },
  isPaused: { type: Boolean, default: false },
  progress: { type: Object, default: () => ({ percent: 0 }) },
  stats: { type: Object, default: () => ({ requestsSent: 0, nodesEvaluated: 0, jobsExtracted: 0 }) },
  logs: { type: Array, default: () => [] }
});

const emit = defineEmits([
  'start-scrape', 
  'pause-scrape', 
  'resume-scrape', 
  'abort-scrape', 
  'clear-logs',
  'reset-defaults',
  'clear-jobs'
]);

const scrapeQuery = ref('Vue developer');
const scrapeLocation = ref('Remote');
const pagesPerPlatform = ref(2);

const availablePlatforms = [
  { name: 'LinkedIn', type: 'HTML Spider' },
  { name: 'RemoteOK', type: 'REST + DOM' },
  { name: 'Indeed', type: 'DOM Beacon' },
  { name: 'WeWorkRemotely', type: 'Static Scraper' },
  { name: 'Wellfound', type: 'Startup Crawl' }
];

const selectedPlatforms = ref(['LinkedIn', 'RemoteOK', 'Indeed', 'WeWorkRemotely']);

const handleStart = () => {
  emit('start-scrape', {
    query: scrapeQuery.value || 'Vue developer',
    location: scrapeLocation.value || 'Remote',
    platforms: selectedPlatforms.value,
    pagesPerPlatform: pagesPerPlatform.value,
    scrapeMode: 'hybrid'
  });
};

const handleTogglePause = () => {
  if (props.isPaused) {
    emit('resume-scrape');
  } else {
    emit('pause-scrape');
  }
};

const handleAbort = () => {
  emit('abort-scrape');
};
</script>

<style scoped>
.scraper-dashboard-root {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Config Panel */
.config-panel {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.panel-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  border-bottom: 1px solid var(--border-subtle);
  padding-bottom: 1rem;
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.panel-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: var(--accent-emerald);
  display: flex;
  align-items: center;
  justify-content: center;
}

.panel-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: #ffffff;
}

.panel-desc {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.status-badge {
  display: inline-flex;
  align-items: center;
  gap: 0.45rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.35rem 0.8rem;
  border-radius: var(--radius-full);
}

.status-badge.idle {
  background: rgba(255, 255, 255, 0.06);
  color: var(--text-secondary);
  border: 1px solid var(--border-card);
}

.status-badge.idle .status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-muted);
}

.status-badge.running {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.4);
}

.status-badge.running .status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
  animation: pulseGlow 1s infinite alternate;
}

.status-badge.paused {
  background: rgba(245, 158, 11, 0.2);
  color: #fcd34d;
  border: 1px solid rgba(245, 158, 11, 0.4);
}

.status-badge.paused .status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f59e0b;
}

/* Form Grid */
.config-grid {
  display: grid;
  grid-template-columns: 2fr 1.5fr 1.5fr;
  gap: 1.25rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.form-label {
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.label-with-val {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.val-pill {
  font-size: 0.72rem;
  font-family: var(--font-mono);
  font-weight: 700;
  color: var(--accent-emerald);
}

.input-with-icon {
  position: relative;
  display: flex;
  align-items: center;
}

.input-with-icon svg {
  position: absolute;
  left: 0.85rem;
  color: var(--text-muted);
  pointer-events: none;
}

.input-with-icon .input-field {
  padding-left: 2.35rem;
}

.range-slider-full {
  width: 100%;
  accent-color: var(--accent-emerald);
  cursor: pointer;
  margin-top: 0.4rem;
}

/* Platform Selectors */
.platforms-selector {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.platform-checkbox-list {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 0.75rem;
}

.platform-card-checkbox {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.65rem 0.85rem;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all var(--transition-fast);
  user-select: none;
}

.platform-card-checkbox:hover {
  border-color: rgba(255, 255, 255, 0.2);
  background: rgba(255, 255, 255, 0.03);
}

.platform-card-checkbox.selected {
  border-color: rgba(16, 185, 129, 0.4);
  background: rgba(16, 185, 129, 0.08);
}

.platform-card-checkbox.disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.hidden-cb {
  display: none;
}

.cb-checkmark {
  width: 18px;
  height: 18px;
  border-radius: 4px;
  border: 1px solid var(--border-card);
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.5);
  color: var(--accent-emerald);
}

.platform-card-checkbox.selected .cb-checkmark {
  background: rgba(16, 185, 129, 0.2);
  border-color: var(--accent-emerald);
}

.platform-name {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--text-primary);
}

.platform-sub {
  margin-left: auto;
  font-size: 0.68rem;
  color: var(--text-muted);
  font-family: var(--font-mono);
}

/* Actions Strip */
.actions-strip {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid var(--border-subtle);
  flex-wrap: wrap;
}

.primary-controls {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.start-btn {
  padding: 0.75rem 1.6rem;
  font-size: 0.95rem;
}

.secondary-controls {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

/* Progress bar */
.progress-section {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding-top: 0.5rem;
}

.progress-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.82rem;
  color: var(--text-secondary);
}

.progress-percent {
  color: #34d399;
  font-weight: 700;
}

.progress-track {
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #06b6d4);
  transition: width 0.3s ease;
}

/* Stats Grid */
.stats-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1.25rem;
}

.stat-card {
  padding: 1.25rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-icon-wrap {
  width: 44px;
  height: 44px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.indigo-glow {
  background: rgba(99, 102, 241, 0.15);
  color: #818cf8;
  border: 1px solid rgba(99, 102, 241, 0.3);
}

.violet-glow {
  background: rgba(139, 92, 246, 0.15);
  color: #c084fc;
  border: 1px solid rgba(139, 92, 246, 0.3);
}

.emerald-glow {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.cyan-glow {
  background: rgba(6, 182, 212, 0.15);
  color: #38bdf8;
  border: 1px solid rgba(6, 182, 212, 0.3);
}

.stat-meta {
  display: flex;
  flex-direction: column;
}

.stat-value {
  font-size: 1.35rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.2;
}

.stat-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.03em;
  font-weight: 600;
}

.emerald-val {
  color: #34d399;
}

@media (max-width: 900px) {
  .config-grid {
    grid-template-columns: 1fr;
  }
  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
