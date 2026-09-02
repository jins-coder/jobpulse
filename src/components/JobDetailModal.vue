<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="modal-content glass-panel" role="dialog" aria-modal="true">
      <!-- Close button -->
      <button class="modal-close-btn" @click="$emit('close')" title="Close">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <!-- Modal Header -->
      <div class="modal-header">
        <div class="header-company-badge" :style="{ background: job.logoBg || 'var(--accent-indigo)' }">
          {{ job.companyLogo || (job.company || 'CO').slice(0, 2).toUpperCase() }}
        </div>

        <div class="header-meta">
          <div class="header-pill-row">
            <span class="platform-chip">{{ job.platform }}</span>
            <span v-if="job.isRemote" class="remote-chip">Remote</span>
            <span class="level-chip">{{ job.experienceLevel || 'Mid-Senior' }}</span>
          </div>

          <h2 class="modal-title">{{ job.title }}</h2>
          <div class="modal-company-line">
            <span class="modal-company-name">{{ job.company }}</span>
            <span class="separator">•</span>
            <span class="modal-location">
              <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
                <circle cx="12" cy="10" r="3"/>
              </svg>
              {{ job.location }}
            </span>
          </div>
        </div>
      </div>

      <!-- Tracker Status Bar -->
      <div class="tracker-action-bar">
        <div class="tracker-label">
          <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
          </svg>
          <span>Pipeline Stage:</span>
        </div>
        <div class="tracker-buttons">
          <button 
            v-for="st in statusOptions" 
            :key="st.key"
            class="status-tab-btn"
            :class="{ active: (job.status || 'none') === st.key, [st.key]: true }"
            @click="$emit('change-status', { jobId: job.id, status: st.key === 'none' ? null : st.key })"
          >
            {{ st.label }}
          </button>
        </div>
      </div>

      <!-- Quick Highlights Grid -->
      <div class="highlights-grid">
        <div class="highlight-box">
          <span class="highlight-sub">Compensation</span>
          <span class="highlight-val emerald-val">{{ job.salary?.formatted || 'Competitive' }}</span>
        </div>
        <div class="highlight-box">
          <span class="highlight-sub">Employment Type</span>
          <span class="highlight-val">{{ job.type || 'Full-time' }}</span>
        </div>
        <div class="highlight-box">
          <span class="highlight-sub">Scraped Source</span>
          <span class="highlight-val cyan-val">{{ job.platform }}</span>
        </div>
        <div class="highlight-box">
          <span class="highlight-sub">Date Scraped</span>
          <span class="highlight-val">{{ formatDate(job.scrapedAt) }}</span>
        </div>
      </div>

      <!-- Scrollable Details Body -->
      <div class="modal-body-scroll">
        <!-- Tech Stack -->
        <section class="section-block">
          <h4 class="section-heading">Tech Stack & Keywords</h4>
          <div class="tech-pill-list">
            <span v-for="tag in job.tags" :key="tag" class="modal-tag">
              {{ tag }}
            </span>
          </div>
        </section>

        <!-- Role Overview -->
        <section class="section-block">
          <h4 class="section-heading">About The Position</h4>
          <p class="section-text">{{ job.description }}</p>
        </section>

        <!-- Responsibilities -->
        <section v-if="job.responsibilities && job.responsibilities.length" class="section-block">
          <h4 class="section-heading">Key Responsibilities</h4>
          <ul class="bullet-list">
            <li v-for="(item, idx) in job.responsibilities" :key="idx">
              <span class="bullet-icon">✓</span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </section>

        <!-- Requirements -->
        <section v-if="job.requirements && job.requirements.length" class="section-block">
          <h4 class="section-heading">Qualifications & Requirements</h4>
          <ul class="bullet-list">
            <li v-for="(item, idx) in job.requirements" :key="idx">
              <span class="bullet-icon accent-bullet">•</span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </section>

        <!-- Benefits -->
        <section v-if="job.benefits && job.benefits.length" class="section-block">
          <h4 class="section-heading">Benefits & Perks</h4>
          <ul class="bullet-list">
            <li v-for="(item, idx) in job.benefits" :key="idx">
              <span class="bullet-icon star-bullet">★</span>
              <span>{{ item }}</span>
            </li>
          </ul>
        </section>
      </div>

      <!-- Modal Footer -->
      <div class="modal-footer">
        <button class="btn btn-secondary" @click="copyJobLink">
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
          </svg>
          <span>{{ copied ? 'Link Copied!' : 'Copy Info' }}</span>
        </button>

        <!-- ⚡ Easy Apply with Resume & Gap-Filling -->
        <button 
          class="btn btn-primary easy-apply-modal-btn"
          :class="{ 'is-applied': job.status === 'applied' }"
          @click="$emit('easy-apply', job)"
        >
          <span v-if="job.status === 'applied'">✓ Applied (View Tailored Package)</span>
          <span v-else>⚡ Easy Apply (Match & Auto-Tailor)</span>
        </button>

        <a 
          :href="job.platformUrl || '#'" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="btn btn-secondary apply-now-btn"
        >
          <span>Source Listing</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
            <polyline points="15 3 21 3 21 9"/>
            <line x1="10" y1="14" x2="21" y2="3"/>
          </svg>
        </a>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';

const props = defineProps({
  job: { type: Object, required: true }
});

defineEmits(['close', 'change-status', 'easy-apply']);

const copied = ref(false);

const statusOptions = [
  { key: 'none', label: 'Unsaved' },
  { key: 'saved', label: 'Saved' },
  { key: 'applied', label: 'Applied' },
  { key: 'interviewing', label: 'Interviewing' },
  { key: 'offered', label: 'Offered' },
  { key: 'rejected', label: 'Archived' }
];

const formatDate = (dateStr) => {
  if (!dateStr) return 'Recently';
  return new Date(dateStr).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const copyJobLink = () => {
  const text = `${props.job.title} at ${props.job.company} (${props.job.salary?.formatted || ''})\nLocation: ${props.job.location}\nURL: ${props.job.platformUrl || window.location.href}`;
  navigator.clipboard.writeText(text).then(() => {
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  });
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(3, 7, 18, 0.75);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
  animation: fadeIn 0.2s ease-out;
}

.modal-content {
  width: 100%;
  max-width: 780px;
  max-height: 90vh;
  background: #0c121e;
  border: 1px solid var(--border-card);
  border-radius: var(--radius-lg);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.85);
  display: flex;
  flex-direction: column;
  position: relative;
  overflow: hidden;
  animation: scaleUp 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-close-btn {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  border-radius: var(--radius-sm);
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all var(--transition-fast);
  z-index: 10;
}

.modal-close-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

/* Header */
.modal-header {
  display: flex;
  align-items: flex-start;
  gap: 1.25rem;
  padding: 1.75rem 1.75rem 1.25rem 1.75rem;
  border-bottom: 1px solid var(--border-subtle);
}

.header-company-badge {
  width: 58px;
  height: 58px;
  min-width: 58px;
  border-radius: 14px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.35rem;
  font-weight: 800;
  color: #ffffff;
  border: 1px solid rgba(255, 255, 255, 0.2);
  box-shadow: var(--shadow-sm);
}

.header-meta {
  flex: 1;
  min-width: 0;
}

.header-pill-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.4rem;
}

.platform-chip {
  font-size: 0.7rem;
  font-weight: 700;
  font-family: var(--font-mono);
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-full);
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.3);
}

.remote-chip {
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-full);
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.level-chip {
  font-size: 0.7rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-full);
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-secondary);
}

.modal-title {
  font-size: 1.45rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.25;
  margin-bottom: 0.4rem;
  padding-right: 2rem;
}

.modal-company-line {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.modal-company-name {
  font-weight: 600;
  color: var(--text-primary);
}

.modal-location {
  display: flex;
  align-items: center;
  gap: 0.3rem;
}

/* Tracker Action Bar */
.tracker-action-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.75rem;
  background: rgba(0, 0, 0, 0.35);
  border-bottom: 1px solid var(--border-subtle);
  flex-wrap: wrap;
  gap: 0.75rem;
}

.tracker-label {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.8rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.tracker-buttons {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
}

.status-tab-btn {
  padding: 0.35rem 0.7rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-subtle);
  background: rgba(255, 255, 255, 0.04);
  color: var(--text-muted);
  font-size: 0.75rem;
  font-weight: 600;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.status-tab-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: var(--text-primary);
}

.status-tab-btn.active.none {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
  border-color: rgba(255, 255, 255, 0.3);
}

.status-tab-btn.active.saved {
  background: rgba(6, 182, 212, 0.2);
  color: #67e8f9;
  border-color: #06b6d4;
}

.status-tab-btn.active.applied {
  background: rgba(245, 158, 11, 0.2);
  color: #fcd34d;
  border-color: #f59e0b;
}

.status-tab-btn.active.interviewing {
  background: rgba(139, 92, 246, 0.2);
  color: #c4b5fd;
  border-color: #8b5cf6;
}

.status-tab-btn.active.offered {
  background: rgba(16, 185, 129, 0.2);
  color: #6ee7b7;
  border-color: #10b981;
}

.status-tab-btn.active.rejected {
  background: rgba(244, 63, 94, 0.2);
  color: #fda4af;
  border-color: #f43f5e;
}

/* Highlights */
.highlights-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding: 1.25rem 1.75rem;
  background: rgba(255, 255, 255, 0.02);
  border-bottom: 1px solid var(--border-subtle);
}

.highlight-box {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.highlight-sub {
  font-size: 0.72rem;
  color: var(--text-muted);
  text-transform: uppercase;
  font-weight: 600;
  letter-spacing: 0.03em;
}

.highlight-val {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--text-primary);
}

.emerald-val {
  color: #34d399;
  font-family: var(--font-mono);
}

.cyan-val {
  color: #38bdf8;
}

/* Body Scroll */
.modal-body-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.section-block {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.section-heading {
  font-size: 0.88rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--text-secondary);
}

.section-text {
  font-size: 0.95rem;
  line-height: 1.65;
  color: var(--text-primary);
}

.tech-pill-list {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.modal-tag {
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-sm);
  background: rgba(99, 102, 241, 0.12);
  color: #c7d2fe;
  border: 1px solid rgba(99, 102, 241, 0.25);
}

.bullet-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.bullet-list li {
  display: flex;
  align-items: flex-start;
  gap: 0.6rem;
  font-size: 0.92rem;
  line-height: 1.55;
  color: var(--text-secondary);
}

.bullet-icon {
  font-weight: 800;
  color: var(--accent-emerald);
}
.accent-bullet { color: var(--accent-cyan); }
.star-bullet { color: var(--accent-amber); font-size: 0.8rem; }

/* Footer */
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.75rem;
  border-top: 1px solid var(--border-subtle);
  background: rgba(0, 0, 0, 0.3);
}

.apply-now-btn {
  padding: 0.65rem 1.5rem;
  font-size: 0.92rem;
}

@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes scaleUp {
  from { opacity: 0; transform: scale(0.96) translateY(8px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

@media (max-width: 640px) {
  .highlights-grid {
    grid-template-columns: repeat(2, 1fr);
  }
  .modal-title {
    font-size: 1.2rem;
  }
}
</style>
