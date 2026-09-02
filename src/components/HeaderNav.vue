<template>
  <header class="header-root glass-panel">
    <div class="header-brand" @click="$emit('change-view', 'explorer')">
      <div class="brand-logo-wrap">
        <div class="brand-icon pulse-active">
          <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="12" cy="12" r="10"/>
            <path d="m4.93 4.93 4.24 4.24"/>
            <path d="m14.83 9.17 4.24-4.24"/>
            <path d="m14.83 14.83 4.24 4.24"/>
            <path d="m9.17 14.83-4.24 4.24"/>
            <circle cx="12" cy="12" r="4"/>
          </svg>
        </div>
        <div class="brand-info">
          <div class="brand-title">Job<span class="brand-accent">Pulse</span></div>
          <div class="brand-subtitle">Web Scraper & Career Engine</div>
        </div>
      </div>
      <div class="engine-badge" :class="isScraping ? 'scraping' : 'ready'">
        <span class="status-dot"></span>
        <span class="status-text">{{ isScraping ? 'SCRAPING LIVE' : 'ENGINE READY' }}</span>
      </div>
    </div>

    <!-- Navigation Tabs -->
    <nav class="header-nav">
      <button 
        class="nav-tab" 
        :class="{ active: currentView === 'explorer' }"
        @click="$emit('change-view', 'explorer')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
        </svg>
        <span>Job Explorer</span>
        <span class="tab-badge">{{ totalJobs }}</span>
      </button>

      <button 
        class="nav-tab" 
        :class="{ active: currentView === 'scraper' }"
        @click="$emit('change-view', 'scraper')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2v20"/>
          <path d="m17 5-5-3-5 3"/>
          <path d="m17 19-5 3-5-3"/>
          <path d="M2 12h20"/>
          <path d="m5 7-3 5 3 5"/>
          <path d="m19 7 3 5-3 5"/>
        </svg>
        <span>Scraper Engine</span>
        <span v-if="isScraping" class="scraping-indicator">●</span>
      </button>

      <button 
        class="nav-tab" 
        :class="{ active: currentView === 'tracker' }"
        @click="$emit('change-view', 'tracker')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
          <path d="M15 2H9a1 1 0 0 0-1 1v2a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1V3a1 1 0 0 0-1-1Z"/>
          <path d="m9 14 2 2 4-4"/>
        </svg>
        <span>Tracker</span>
        <span class="tab-badge" v-if="trackedCount > 0">{{ trackedCount }}</span>
      </button>

      <button 
        class="nav-tab" 
        :class="{ active: currentView === 'insights' }"
        @click="$emit('change-view', 'insights')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="20" x2="18" y2="10"/>
          <line x1="12" y1="20" x2="12" y2="4"/>
          <line x1="6" y1="20" x2="6" y2="14"/>
        </svg>
        <span>Market Insights</span>
      </button>
    </nav>

    <!-- Quick Action Bar -->
    <div class="header-actions">
      <!-- Candidate Resume Pill -->
      <button class="candidate-nav-pill" @click="$emit('edit-resume')" title="View / Edit Active Resume Profile">
        <span class="avatar-dot"></span>
        <span class="candidate-nav-name">Resume: Alex Morgan</span>
      </button>

      <div class="export-dropdown-wrapper">
        <button class="btn btn-secondary btn-sm" @click="toggleExportMenu">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="7 10 12 15 17 10"/>
            <line x1="12" y1="15" x2="12" y2="3"/>
          </svg>
          <span>Export</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </button>

        <div v-if="showExportMenu" class="export-menu glass-panel">
          <button @click="handleExport('csv')" class="export-item">
            <span class="file-tag">CSV</span> Export for Excel / Sheets
          </button>
          <button @click="handleExport('json')" class="export-item">
            <span class="file-tag">JSON</span> Raw Scraped Records
          </button>
        </div>
      </div>

      <button 
        class="btn btn-primary btn-sm"
        @click="$emit('quick-scrape')"
        :disabled="isScraping"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round" :class="{ 'spin-icon': isScraping }">
          <path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/>
        </svg>
        <span>{{ isScraping ? 'Scraping...' : 'Launch Scraper' }}</span>
      </button>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';

const props = defineProps({
  currentView: { type: String, default: 'explorer' },
  totalJobs: { type: Number, default: 0 },
  trackedCount: { type: Number, default: 0 },
  isScraping: { type: Boolean, default: false }
});

const emit = defineEmits(['change-view', 'quick-scrape', 'export', 'edit-resume']);

const showExportMenu = ref(false);

const toggleExportMenu = () => {
  showExportMenu.value = !showExportMenu.value;
};

const handleExport = (format) => {
  showExportMenu.value = false;
  emit('export', format);
};

const closeMenuOnClickOutside = (e) => {
  if (!e.target.closest('.export-dropdown-wrapper')) {
    showExportMenu.value = false;
  }
};

onMounted(() => {
  window.addEventListener('click', closeMenuOnClickOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', closeMenuOnClickOutside);
});
</script>

<style scoped>
.header-root {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.5rem;
  margin: 1.25rem 0 2rem 0;
  gap: 1.5rem;
}

.header-brand {
  display: flex;
  align-items: center;
  gap: 1.2rem;
  cursor: pointer;
  user-select: none;
}

.brand-logo-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-icon {
  width: 40px;
  height: 40px;
  border-radius: 10px;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.2), rgba(6, 182, 212, 0.2));
  border: 1px solid var(--accent-emerald);
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--accent-emerald);
}

.brand-title {
  font-size: 1.35rem;
  font-weight: 800;
  letter-spacing: -0.03em;
  color: #ffffff;
  line-height: 1.1;
}

.brand-accent {
  color: var(--accent-emerald);
  background: linear-gradient(90deg, #10b981, #06b6d4);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.brand-subtitle {
  font-size: 0.7rem;
  font-weight: 500;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.engine-badge {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-full);
  font-size: 0.68rem;
  font-weight: 700;
  font-family: var(--font-mono);
  letter-spacing: 0.03em;
}

.engine-badge.ready {
  background: rgba(16, 185, 129, 0.1);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.25);
}

.engine-badge.ready .status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #10b981;
}

.engine-badge.scraping {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.35);
}

.engine-badge.scraping .status-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: #f59e0b;
  animation: pulseGlow 1s infinite alternate;
}

/* Nav tabs */
.header-nav {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(0, 0, 0, 0.35);
  padding: 0.3rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--border-subtle);
}

.nav-tab {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.55rem 1rem;
  border-radius: var(--radius-md);
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-family: var(--font-main);
  font-size: 0.85rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.nav-tab:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.04);
}

.nav-tab.active {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.09);
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.3);
}

.tab-badge {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.1rem 0.45rem;
  border-radius: var(--radius-full);
}

.scraping-indicator {
  color: #f59e0b;
  animation: pulseGlow 1s infinite;
}

/* Actions */
.header-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  position: relative;
}

.export-dropdown-wrapper {
  position: relative;
}

.export-menu {
  position: absolute;
  top: calc(100% + 8px);
  right: 0;
  width: 210px;
  padding: 0.4rem;
  background: #0d1320;
  border: 1px solid var(--border-card);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.export-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  padding: 0.55rem 0.75rem;
  border: none;
  background: transparent;
  color: var(--text-secondary);
  font-family: var(--font-main);
  font-size: 0.82rem;
  font-weight: 500;
  text-align: left;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.export-item:hover {
  background: rgba(255, 255, 255, 0.07);
  color: #ffffff;
}

.file-tag {
  background: rgba(99, 102, 241, 0.2);
  color: #a5b4fc;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.15rem 0.4rem;
  border-radius: 4px;
}

.spin-icon {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}

@media (max-width: 1024px) {
  .header-root {
    flex-direction: column;
    align-items: stretch;
    gap: 1rem;
  }
  .header-brand {
    justify-content: space-between;
  }
  .header-nav {
    overflow-x: auto;
  }
}

.candidate-nav-pill {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
  padding: 0.35rem 0.65rem;
  border-radius: var(--radius-full);
  font-size: 0.76rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.candidate-nav-pill:hover {
  background: rgba(56, 189, 248, 0.12);
  border-color: rgba(56, 189, 248, 0.35);
  color: #38bdf8;
}

.avatar-dot {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 6px #10b981;
}

.candidate-nav-name {
  font-family: var(--font-mono);
  font-size: 0.72rem;
}
</style>
