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
          <div class="brand-subtitle">Smart Career & ATS Engine</div>
        </div>
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
        <span>Job Feed</span>
        <span class="tab-badge">{{ totalJobs }}</span>
      </button>

      <button 
        class="nav-tab" 
        :class="{ active: currentView === 'ats' }"
        @click="$emit('change-view', 'ats')"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
          <polyline points="14 2 14 8 20 8"/>
          <path d="m9 15 2 2 4-4"/>
        </svg>
        <span>ATS Studio</span>
        <span class="tab-badge-emerald">OPTIMIZER</span>
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
        <span>Application Tracker</span>
        <span class="tab-badge" v-if="trackedCount > 0">{{ trackedCount }}</span>
      </button>
    </nav>

    <!-- Quick Action Bar -->
    <div class="header-actions">
      <!-- User Auth Section -->
      <div v-if="authService.isAuthenticated.value" class="user-auth-pill-group">
        <button class="candidate-nav-pill" @click="$emit('edit-resume')" title="View / Edit Active Resume Profile">
          <span class="avatar-dot"></span>
          <span class="candidate-nav-name">{{ authService.currentUser.value?.name }}</span>
        </button>
        <button class="btn btn-outline-sm btn-logout" @click="handleLogout" title="Sign Out">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
            <polyline points="16 17 21 12 16 7"/>
            <line x1="21" y1="12" x2="9" y2="12"/>
          </svg>
          <span>Sign Out</span>
        </button>
      </div>

      <button v-else class="btn btn-primary btn-sm btn-signin" @click="$emit('open-auth')">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
          <circle cx="12" cy="7" r="4"/>
        </svg>
        <span>Sign In</span>
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
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import { authService } from '../services/authService.js';

const props = defineProps({
  currentView: { type: String, default: 'explorer' },
  totalJobs: { type: Number, default: 0 },
  trackedCount: { type: Number, default: 0 }
});

const emit = defineEmits(['change-view', 'export', 'edit-resume', 'open-auth', 'user-logout']);

const handleLogout = async () => {
  await authService.logout();
  emit('user-logout');
};

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

.tab-badge-emerald {
  background: rgba(16, 185, 129, 0.18);
  color: #34d399;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.tab-badge-rose {
  background: rgba(244, 63, 94, 0.18);
  color: #fda4af;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  border: 1px solid rgba(244, 63, 94, 0.3);
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
    scrollbar-width: none;
    -ms-overflow-style: none;
  }
  .header-nav::-webkit-scrollbar {
    display: none;
  }
}

@media (max-width: 640px) {
  .header-root {
    padding: 0.85rem;
    border-radius: var(--radius-lg);
  }
  .header-actions {
    flex-wrap: wrap;
    justify-content: stretch;
    gap: 0.4rem;
  }
  .header-actions > * {
    flex: 1 1 auto;
  }
  .nav-tab {
    padding: 0.45rem 0.65rem;
    font-size: 0.78rem;
    white-space: nowrap;
  }
  .brand-title {
    font-size: 1.1rem;
  }
  .brand-subtitle {
    display: none;
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

.user-auth-pill-group {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.btn-logout {
  background: rgba(244, 63, 94, 0.1);
  border-color: rgba(244, 63, 94, 0.25);
  color: #fda4af;
  font-size: 0.72rem;
  padding: 0.35rem 0.6rem;
  gap: 0.3rem;
}

.btn-logout:hover {
  background: rgba(244, 63, 94, 0.22);
  border-color: rgba(244, 63, 94, 0.45);
  color: #ffffff;
}

.btn-signin {
  font-size: 0.75rem;
  padding: 0.38rem 0.8rem;
  gap: 0.4rem;
}
</style>
