<template>
  <div class="job-finder-root">
    <!-- Top AI Resume Confidence Radar & Match Spotlight -->
    <AiMatchSpotlight 
      :jobs="jobs"
      :resume="activeResume"
      @select-job="$emit('select-job', $event)"
      @easy-apply="$emit('easy-apply', $event)"
      @edit-resume="$emit('edit-resume')"
      @upload-resume="showUploadModal = true"
      @filter-suggestion="handleSuggestionFilter"
    />

    <!-- Hero / Search Control Bar -->
    <div class="search-hero glass-panel">
      <div class="search-primary-row">
        <div class="search-input-wrapper">
          <svg class="search-icon" xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <circle cx="11" cy="11" r="8"/>
            <path d="m21 21-4.3-4.3"/>
          </svg>
          <input 
            type="text" 
            v-model="searchQuery" 
            class="search-main-input" 
            placeholder="Search by role, company, or tech stack (e.g., Vue 3, Vite, Python, Senior)..."
          />
          <button v-if="searchQuery" class="clear-search-btn" @click="searchQuery = ''">✕</button>
        </div>

        <div class="location-input-wrapper">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
            <circle cx="12" cy="10" r="3"/>
          </svg>
          <input 
            type="text" 
            v-model="locationQuery" 
            class="search-location-input" 
            placeholder="Location or 'Remote'..."
          />
        </div>

        <button class="btn btn-secondary btn-upload-radar" @click="showUploadModal = true" title="Upload custom resume to re-rank all jobs">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
            <polyline points="17 8 12 3 7 8"/>
            <line x1="12" y1="3" x2="12" y2="15"/>
          </svg>
          <span>Upload & Match</span>
        </button>
      </div>

      <!-- Advanced Filters Bar -->
      <div class="filters-bar">
        <!-- Platform Filters -->
        <div class="filter-group">
          <span class="filter-label">Platform:</span>
          <div class="pill-options">
            <button 
              class="filter-pill" 
              :class="{ active: selectedPlatform === 'All' }"
              @click="selectedPlatform = 'All'"
            >
              All
            </button>
            <button 
              v-for="plat in platforms" 
              :key="plat" 
              class="filter-pill"
              :class="{ active: selectedPlatform === plat }"
              @click="selectedPlatform = plat"
            >
              {{ plat }}
            </button>
          </div>
        </div>

        <!-- Experience Level -->
        <div class="filter-group">
          <span class="filter-label">Level:</span>
          <div class="pill-options">
            <button 
              class="filter-pill" 
              :class="{ active: selectedLevel === 'All' }"
              @click="selectedLevel = 'All'"
            >
              All
            </button>
            <button 
              v-for="lvl in levels" 
              :key="lvl" 
              class="filter-pill"
              :class="{ active: selectedLevel === lvl }"
              @click="selectedLevel = lvl"
            >
              {{ lvl }}
            </button>
          </div>
        </div>

        <!-- Job Type Filters (Full-time / Part-time) -->
        <div class="filter-group">
          <span class="filter-label">Type:</span>
          <div class="pill-options">
            <button 
              class="filter-pill" 
              :class="{ active: selectedJobType === 'All' }"
              @click="selectedJobType = 'All'"
            >
              All
            </button>
            <button 
              v-for="jtype in jobTypes" 
              :key="jtype" 
              class="filter-pill"
              :class="{ active: selectedJobType === jtype }"
              @click="selectedJobType = jtype"
            >
              {{ jtype }}
            </button>
          </div>
        </div>

        <!-- Remote Toggle -->
        <div class="toggle-group" @click="remoteOnly = !remoteOnly">
          <div class="toggle-switch" :class="{ active: remoteOnly }">
            <span class="toggle-thumb"></span>
          </div>
          <span class="toggle-label">Remote Only</span>
        </div>
      </div>

      <!-- Secondary Controls: Min Salary & Sort -->
      <div class="sub-controls-row">
        <div class="salary-slider-group">
          <span class="slider-label">Min Salary: <strong class="emerald-text">${{ minSalary / 1000 }}k/yr</strong></span>
          <input 
            type="range" 
            min="0" 
            max="200000" 
            step="10000" 
            v-model.number="minSalary" 
            class="range-slider"
          />
        </div>

        <div class="sort-and-view-group">
          <div class="sort-dropdown">
            <span class="sort-label">Sort:</span>
            <select v-model="sortBy" class="select-field">
              <option value="match-desc">🎯 Highest Resume Match</option>
              <option value="newest">Newest Scraped</option>
              <option value="salary-desc">Highest Salary</option>
              <option value="title-asc">Title (A - Z)</option>
              <option value="company-asc">Company (A - Z)</option>
            </select>
          </div>

          <div class="view-toggle-btns">
            <button 
              class="view-btn" 
              :class="{ active: viewMode === 'grid' }"
              @click="viewMode = 'grid'"
              title="Grid Layout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect width="7" height="7" x="3" y="3" rx="1"/>
                <rect width="7" height="7" x="14" y="3" rx="1"/>
                <rect width="7" height="7" x="14" y="14" rx="1"/>
                <rect width="7" height="7" x="3" y="14" rx="1"/>
              </svg>
            </button>
            <button 
              class="view-btn" 
              :class="{ active: viewMode === 'list' }"
              @click="viewMode = 'list'"
              title="List Layout"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"/>
                <line x1="8" y1="12" x2="21" y2="12"/>
                <line x1="8" y1="18" x2="21" y2="18"/>
                <line x1="3" y1="6" x2="3.01" y2="6"/>
                <line x1="3" y1="12" x2="3.01" y2="12"/>
                <line x1="3" y1="18" x2="3.01" y2="18"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Active Resume Matching Banner -->
    <div v-if="hasResume" class="resume-match-banner glass-panel">
      <div class="banner-left">
        <div class="banner-icon-badge">🎯</div>
        <div class="banner-text">
          <div class="banner-title-row">
            <span class="banner-title">Personalized feed for <strong>{{ activeResume.name }}</strong></span>
            <span class="banner-status-badge">⚡ {{ sortBy === 'match-desc' ? 'Ranked by Resume Skills' : 'Resume Filter Active' }}</span>
          </div>
          <div class="banner-skills-chips">
            <span v-for="skill in (activeResume.skills || []).slice(0, 8)" :key="skill" class="banner-skill-chip">
              {{ skill }}
            </span>
            <span v-if="(activeResume.skills || []).length > 8" class="banner-skill-more">
              +{{ (activeResume.skills || []).length - 8 }} more
            </span>
          </div>
        </div>
      </div>

      <div class="banner-actions">
        <button 
          class="btn-banner-filter" 
          :class="{ active: highMatchOnly }"
          @click="highMatchOnly = !highMatchOnly"
        >
          <span v-if="highMatchOnly">✓ Showing 60%+ High Match</span>
          <span v-else>⭐ Show 60%+ Match Only</span>
        </button>
        <button 
          class="btn-banner-filter"
          :class="{ active: sortBy === 'match-desc' }"
          @click="sortBy = 'match-desc'"
        >
          🎯 Top Skills Match
        </button>
        <button class="btn-banner-edit" @click="showUploadModal = true">
          Edit Resume
        </button>
      </div>
    </div>

    <!-- Active Filter Summary & Result Count -->
    <div class="results-header">
      <div class="results-count-box">
        Showing <strong class="text-white">{{ filteredJobs.length }}</strong> of {{ jobs.length }} live opportunities
        <span class="live-pill">● LIVE FEEDS</span>
      </div>

      <div class="results-actions">
        <button 
          class="btn-refresh-live" 
          @click="$emit('refresh-jobs')"
          title="Scrape and ingest latest live jobs from Remotive, Arbeitnow, and public feeds"
        >
          <span class="refresh-icon">⚡</span>
          <span>Refresh Live Jobs</span>
        </button>

        <button 
          v-if="hasActiveFilters" 
          class="btn-reset-filters" 
          @click="resetFilters"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/>
            <path d="M3 3v5h5"/>
          </svg>
          Reset Filters
        </button>
      </div>
    </div>

    <!-- Job Cards Grid / List -->
    <div 
      v-if="filteredJobs.length > 0" 
      class="jobs-container" 
      :class="{ 'grid-mode': viewMode === 'grid', 'list-mode': viewMode === 'list' }"
    >
      <JobCard 
        v-for="job in filteredJobs" 
        :key="job.id" 
        :job="job"
        :candidate-resume="activeResume"
        @select="$emit('select-job', job)"
        @toggle-save="$emit('toggle-save', job)"
        @easy-apply="$emit('easy-apply', job)"
      />
    </div>

    <!-- Empty State -->
    <div v-else class="empty-state glass-panel">
      <div class="empty-icon">
        <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="11" cy="11" r="8"/>
          <path d="m21 21-4.3-4.3"/>
          <path d="M8 11h6"/>
        </svg>
      </div>
      <h3 class="empty-title">No matching jobs found</h3>
      <p class="empty-desc">
        No active listings match your current keywords and filters. Try adjusting your query or resetting filters.
      </p>
      <div class="empty-actions">
        <button class="btn btn-primary" @click="resetFilters">Reset Filters</button>
      </div>
    </div>

    <!-- Resume Upload & Parsing Modal -->
    <ResumeUploadModal 
      v-if="showUploadModal" 
      @close="showUploadModal = false" 
      @resume-applied="handleResumeApplied" 
    />
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import JobCard from './JobCard.vue';
import AiMatchSpotlight from './AiMatchSpotlight.vue';
import ResumeUploadModal from './ResumeUploadModal.vue';
import { resumeService } from '../services/resumeService.js';

const props = defineProps({
  jobs: { type: Array, default: () => [] }
});

const emit = defineEmits(['select-job', 'toggle-save', 'easy-apply', 'edit-resume', 'resume-updated', 'refresh-jobs']);

const defaultPlatformOrder = [
  'LinkedIn', 'Wellfound', 'Y Combinator', 'Naukri', 'Indeed', 
  'RemoteOK', 'Remotive', 'WeWorkRemotely', 'Dice', 'HN Hiring', 'Instahyre', 'Glassdoor'
];

const platforms = computed(() => {
  const extracted = new Set(props.jobs.map(j => j.platform).filter(Boolean));
  const ordered = defaultPlatformOrder.filter(p => extracted.has(p));
  for (const p of extracted) {
    if (!ordered.includes(p)) ordered.push(p);
  }
  return ordered.length > 0 ? ordered : defaultPlatformOrder;
});

const levels = ['Entry', 'Mid', 'Senior', 'Lead'];
const jobTypes = ['Full-time', 'Part-time'];

// Candidate Resume & Upload Modal
const activeResume = ref(resumeService.getMasterResume());
const hasResume = computed(() => resumeService.hasUploadedResume(activeResume.value));
const showUploadModal = ref(false);
const highMatchOnly = ref(false);

const handleResumeApplied = (newResume) => {
  activeResume.value = newResume;
  sortBy.value = 'match-desc';
  emit('resume-updated', newResume);
};

// Filter states
const searchQuery = ref('');
const locationQuery = ref('');
const selectedPlatform = ref('All');
const selectedLevel = ref('All');
const selectedJobType = ref('All');
const remoteOnly = ref(false);
const minSalary = ref(0);
const sortBy = ref(resumeService.hasUploadedResume(activeResume.value) ? 'match-desc' : 'newest');
const viewMode = ref('grid');
const suggestionPrompt = ref('');

const handleSuggestionFilter = (prompt) => {
  suggestionPrompt.value = prompt;
  if (prompt) {
    sortBy.value = 'match-desc';
  }
};

const hasActiveFilters = computed(() => {
  return searchQuery.value !== '' || 
         locationQuery.value !== '' || 
         selectedPlatform.value !== 'All' || 
         selectedLevel.value !== 'All' || 
         selectedJobType.value !== 'All' || 
         remoteOnly.value || 
         highMatchOnly.value ||
         minSalary.value > 0;
});

const resetFilters = () => {
  searchQuery.value = '';
  locationQuery.value = '';
  selectedPlatform.value = 'All';
  selectedLevel.value = 'All';
  selectedJobType.value = 'All';
  remoteOnly.value = false;
  minSalary.value = 0;
  highMatchOnly.value = false;
  sortBy.value = hasResume.value ? 'match-desc' : 'newest';
};

const filteredJobs = computed(() => {
  let list = [...props.jobs];

  // 1. Text Search (title, company, tags)
  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase().trim();
    list = list.filter(j => {
      const matchTitle = j.title?.toLowerCase().includes(q);
      const matchCompany = j.company?.toLowerCase().includes(q);
      const matchTags = (j.tags || []).some(t => t.toLowerCase().includes(q));
      const matchDesc = j.description?.toLowerCase().includes(q);
      return matchTitle || matchCompany || matchTags || matchDesc;
    });
  }

  // 2. Location query
  if (locationQuery.value.trim()) {
    const lq = locationQuery.value.toLowerCase().trim();
    list = list.filter(j => j.location?.toLowerCase().includes(lq));
  }

  // 3. Platform
  if (selectedPlatform.value !== 'All') {
    list = list.filter(j => j.platform === selectedPlatform.value);
  }

  // 4. Experience Level
  if (selectedLevel.value !== 'All') {
    list = list.filter(j => j.experienceLevel === selectedLevel.value);
  }

  // 4b. Job Type (Full-time vs Part-time)
  if (selectedJobType.value !== 'All') {
    list = list.filter(j => (j.type || '').toLowerCase().includes(selectedJobType.value.toLowerCase()));
  }

  // 5. Remote Only
  if (remoteOnly.value) {
    list = list.filter(j => j.isRemote);
  }

  // 6. Min Salary
  if (minSalary.value > 0) {
    list = list.filter(j => (j.salary?.min || 0) >= minSalary.value);
  }

  // 7. Apply AI User Suggestion Filter if active
  if (suggestionPrompt.value.trim()) {
    list = resumeService.getJobsBySuggestion(list, activeResume.value, suggestionPrompt.value.trim());
  }

  // 7b. High Match (60%+ Only) Filter
  if (highMatchOnly.value && hasResume.value) {
    list = list.filter(j => {
      const comp = resumeService.computeCompatibility(j, activeResume.value);
      return (comp.overallScore || 0) >= 60;
    });
  }

  // 8. Sort
  list.sort((a, b) => {
    if (sortBy.value === 'match-desc') {
      const scoreA = resumeService.computeCompatibility(a, activeResume.value).overallScore;
      const scoreB = resumeService.computeCompatibility(b, activeResume.value).overallScore;
      return scoreB - scoreA;
    }
    if (sortBy.value === 'newest') {
      return new Date(b.scrapedAt || 0) - new Date(a.scrapedAt || 0);
    }
    if (sortBy.value === 'salary-desc') {
      return (b.salary?.max || 0) - (a.salary?.max || 0);
    }
    if (sortBy.value === 'title-asc') {
      return (a.title || '').localeCompare(b.title || '');
    }
    if (sortBy.value === 'company-asc') {
      return (a.company || '').localeCompare(b.company || '');
    }
    return 0;
  });

  return list;
});
</script>

<style scoped>
.job-finder-root {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Hero Search Panel */
.search-hero {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.search-primary-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.search-input-wrapper {
  flex: 2;
  min-width: 280px;
  position: relative;
  display: flex;
  align-items: center;
}

.search-icon {
  position: absolute;
  left: 1rem;
  color: var(--text-muted);
  pointer-events: none;
}

.search-main-input {
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-md);
  padding: 0.8rem 2.5rem 0.8rem 2.75rem;
  color: #ffffff;
  font-family: var(--font-main);
  font-size: 0.95rem;
  outline: none;
  transition: all var(--transition-fast);
}

.search-main-input:focus {
  border-color: var(--accent-emerald);
  box-shadow: 0 0 0 3px var(--accent-emerald-glow);
}

.clear-search-btn {
  position: absolute;
  right: 0.75rem;
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.25rem;
}

.location-input-wrapper {
  flex: 1;
  min-width: 180px;
  position: relative;
  display: flex;
  align-items: center;
}

.location-input-wrapper svg {
  position: absolute;
  left: 0.9rem;
  color: var(--text-muted);
  pointer-events: none;
}

.search-location-input {
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-md);
  padding: 0.8rem 1rem 0.8rem 2.5rem;
  color: #ffffff;
  font-family: var(--font-main);
  font-size: 0.92rem;
  outline: none;
  transition: all var(--transition-fast);
}

.search-location-input:focus {
  border-color: var(--accent-emerald);
}

.search-action-btn {
  padding: 0.8rem 1.4rem;
  font-size: 0.92rem;
}

.btn-upload-radar {
  background: rgba(16, 185, 129, 0.14);
  border-color: rgba(16, 185, 129, 0.35);
  color: #34d399;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.8rem 1.15rem;
  font-size: 0.88rem;
  white-space: nowrap;
}

.btn-upload-radar:hover {
  background: rgba(16, 185, 129, 0.25);
  border-color: #10b981;
  color: #ffffff;
}

/* Filters Bar */
.filters-bar {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding-top: 0.5rem;
  border-top: 1px solid var(--border-subtle);
}

.filter-group {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.filter-label {
  font-size: 0.78rem;
  font-weight: 600;
  text-transform: uppercase;
  color: var(--text-muted);
}

.pill-options {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.filter-pill {
  font-family: var(--font-main);
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-subtle);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-secondary);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.filter-pill:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

.filter-pill.active {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border-color: rgba(16, 185, 129, 0.4);
}

/* Remote Toggle */
.toggle-group {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  cursor: pointer;
  user-select: none;
}

.toggle-switch {
  width: 36px;
  height: 20px;
  background: rgba(255, 255, 255, 0.15);
  border-radius: var(--radius-full);
  position: relative;
  transition: background var(--transition-fast);
}

.toggle-switch.active {
  background: var(--accent-emerald);
}

.toggle-thumb {
  width: 14px;
  height: 14px;
  background: #ffffff;
  border-radius: 50%;
  position: absolute;
  top: 3px;
  left: 3px;
  transition: transform var(--transition-fast);
}

.toggle-switch.active .toggle-thumb {
  transform: translateX(16px);
}

.toggle-label {
  font-size: 0.82rem;
  font-weight: 600;
  color: var(--text-secondary);
}

/* Sub-controls row */
.sub-controls-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
  padding-top: 0.5rem;
}

.salary-slider-group {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.slider-label {
  font-size: 0.8rem;
  color: var(--text-secondary);
  white-space: nowrap;
}

.emerald-text {
  color: #34d399;
}

.range-slider {
  accent-color: var(--accent-emerald);
  cursor: pointer;
  width: 130px;
}

.sort-and-view-group {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.sort-dropdown {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.sort-label {
  font-size: 0.8rem;
  color: var(--text-muted);
}

.select-field {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-sm);
  padding: 0.35rem 0.7rem;
  color: var(--text-primary);
  font-family: var(--font-main);
  font-size: 0.82rem;
  outline: none;
  cursor: pointer;
}

.view-toggle-btns {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.2rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-subtle);
}

.view-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  padding: 0.3rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.view-btn.active {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

/* Resume Match Banner */
.resume-match-banner {
  padding: 1rem 1.25rem;
  border-radius: var(--radius-lg);
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(56, 189, 248, 0.05));
  border: 1px solid rgba(16, 185, 129, 0.25);
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.25);
}

.banner-left {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  flex: 1;
  min-width: 280px;
}

.banner-icon-badge {
  font-size: 1.5rem;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
}

.banner-text {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.banner-title-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.banner-title {
  font-size: 0.92rem;
  color: #ffffff;
}

.banner-title strong {
  color: #34d399;
}

.banner-status-badge {
  font-size: 0.68rem;
  font-weight: 700;
  font-family: var(--font-mono);
  background: rgba(56, 189, 248, 0.15);
  border: 1px solid rgba(56, 189, 248, 0.35);
  color: #38bdf8;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-full);
}

.banner-skills-chips {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.banner-skill-chip {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #e2e8f0;
  font-size: 0.7rem;
  padding: 0.1rem 0.45rem;
  border-radius: 4px;
  font-weight: 600;
}

.banner-skill-more {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.banner-actions {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.btn-banner-filter {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.15);
  color: #ffffff;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.4rem 0.8rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-banner-filter:hover {
  background: rgba(255, 255, 255, 0.12);
}

.btn-banner-filter.active {
  background: rgba(16, 185, 129, 0.2);
  border-color: #34d399;
  color: #34d399;
}

.btn-banner-edit {
  background: transparent;
  border: 1px solid rgba(56, 189, 248, 0.3);
  color: #38bdf8;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.4rem 0.8rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-banner-edit:hover {
  background: rgba(56, 189, 248, 0.15);
}

/* Results header */
.results-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 0.5rem;
}

.results-count-box {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  font-size: 0.88rem;
  color: var(--text-secondary);
}

.live-pill {
  font-size: 0.65rem;
  font-weight: 800;
  font-family: var(--font-mono);
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.35);
  color: #34d399;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-full);
}

.results-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.btn-refresh-live {
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.3);
  color: #38bdf8;
  font-size: 0.78rem;
  font-weight: 700;
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  gap: 0.4rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.btn-refresh-live:hover {
  background: rgba(56, 189, 248, 0.22);
  border-color: #38bdf8;
}

.text-white {
  color: #ffffff;
}

.btn-reset-filters {
  background: transparent;
  border: none;
  color: var(--accent-emerald);
  font-size: 0.8rem;
  font-weight: 600;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  cursor: pointer;
  transition: opacity var(--transition-fast);
}

.btn-reset-filters:hover {
  opacity: 0.8;
}

/* Grid & List Layouts */
.jobs-container.grid-mode {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(min(100%, 330px), 1fr));
  gap: 1.25rem;
}

.jobs-container.list-mode {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

/* Empty State */
.empty-state {
  padding: 4rem 2rem;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
}

.empty-icon {
  color: var(--text-muted);
}

.empty-title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #ffffff;
}

.empty-desc {
  max-width: 480px;
  font-size: 0.92rem;
  color: var(--text-secondary);
  line-height: 1.5;
}

.empty-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

@media (max-width: 768px) {
  .search-hero {
    padding: 1rem;
    border-radius: var(--radius-lg);
  }
  .search-primary-row {
    flex-direction: column;
    align-items: stretch;
    gap: 0.65rem;
  }
  .search-input-wrapper,
  .location-input-wrapper {
    width: 100%;
    min-width: 100%;
  }
  .btn-upload-radar,
  .search-action-btn {
    width: 100%;
    justify-content: center;
  }
  .filters-bar {
    gap: 0.75rem;
  }
  .sub-controls-row {
    flex-direction: column;
    align-items: stretch;
    gap: 0.75rem;
  }
  .salary-slider-group {
    width: 100%;
  }
  .sort-select-wrapper {
    width: 100%;
    justify-content: space-between;
  }
  .sort-select {
    flex: 1;
  }
}
</style>
