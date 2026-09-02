<template>
  <div class="job-card glass-panel" :class="{ 'is-saved': isSaved }">
    <div class="card-header">
      <div class="company-logo" :style="{ background: job.logoBg || 'var(--accent-indigo)' }">
        {{ job.companyLogo || (job.company || 'CO').slice(0, 2).toUpperCase() }}
      </div>

      <div class="card-title-group">
        <div class="platform-meta">
          <span class="platform-pill" :class="getPlatformClass(job.platform)">
            <span class="platform-dot"></span>
            {{ job.platform }}
          </span>
          <span class="card-match-pill" :class="matchScore >= 75 ? 'match-high' : 'match-mid'">
            ⚡ {{ matchScore }}% Match
          </span>
          <span class="scrape-time" :title="job.scrapedAt">
            <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <polyline points="12 6 12 12 16 14"/>
            </svg>
            {{ timeAgo(job.scrapedAt) }}
          </span>
        </div>

        <h3 class="job-title" @click="$emit('select', job)" :title="job.title">
          {{ job.title }}
        </h3>
        
        <div class="company-sub">
          <span class="company-name">{{ job.company }}</span>
          <span class="meta-separator">•</span>
          <span class="job-location">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            {{ job.location }}
          </span>
        </div>
      </div>

      <!-- Quick Bookmark button -->
      <button 
        class="action-bookmark" 
        :class="{ active: isSaved }" 
        @click.stop="$emit('toggle-save', job)"
        :title="isSaved ? 'Remove from saved' : 'Save to tracker'"
      >
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" :fill="isSaved ? 'currentColor' : 'none'" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="m19 21-7-4-7 4V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16z"/>
        </svg>
      </button>
    </div>

    <!-- Middle badges: Salary & Type -->
    <div class="card-mid">
      <div class="salary-chip">
        <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="12" y1="2" x2="12" y2="22"/>
          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
        </svg>
        <span>{{ job.salary?.formatted || 'Competitive Salary' }}</span>
      </div>

      <div class="badges-row">
        <span v-if="job.isRemote" class="chip chip-remote">Remote</span>
        <span class="chip chip-type" :class="{ 'chip-part-time': (job.type || '').toLowerCase().includes('part') }">{{ job.type || 'Full-time' }}</span>
        <span v-if="job.experienceLevel" class="chip chip-level">{{ job.experienceLevel }}</span>
      </div>
    </div>

    <!-- Tags Row -->
    <div class="card-tags">
      <span 
        v-for="tag in (job.tags || []).slice(0, 5)" 
        :key="tag" 
        class="tech-tag"
        :class="{ 'tag-matched': isSkillMatched(tag) }"
      >
        <span v-if="isSkillMatched(tag)" class="tag-match-icon">✓</span>
        {{ tag }}
      </span>
      <span v-if="(job.tags || []).length > 5" class="tech-tag more-tag">
        +{{ job.tags.length - 5 }}
      </span>
    </div>

    <!-- Footer actions -->
    <div class="card-footer">
      <div class="tracker-status-pill" v-if="job.status">
        <span class="status-indicator-dot" :class="job.status"></span>
        <span class="status-text">{{ formatStatus(job.status) }}</span>
      </div>
      <div v-else class="status-placeholder"></div>

      <div class="footer-btn-group">
        <button class="btn btn-secondary btn-sm" @click="$emit('select', job)">
          Details
        </button>
        <button 
          class="btn btn-sm btn-easy-apply" 
          :class="{ 'is-applied': job.status === 'applied' }"
          @click.stop="$emit('easy-apply', job)"
          :title="job.status === 'applied' ? 'View submitted tailored application' : 'Easy Apply with resume & auto gap-filling'"
        >
          <span v-if="job.status === 'applied'">✓ Applied</span>
          <span v-else>⚡ Tailor & Apply</span>
        </button>
        <a 
          :href="job.platformUrl || '#'" 
          target="_blank" 
          rel="noopener noreferrer" 
          class="btn btn-outline-sm external-link"
          @click.stop
        >
          <span>Source</span>
          <svg xmlns="http://www.w3.org/2000/svg" width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
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
import { computed } from 'vue';
import { resumeService } from '../services/resumeService.js';

const props = defineProps({
  job: { type: Object, required: true },
  candidateResume: { type: Object, default: null }
});

defineEmits(['select', 'toggle-save', 'easy-apply']);

const isSaved = computed(() => !!props.job.status);

const matchScore = computed(() => {
  const comp = resumeService.computeCompatibility(props.job, props.candidateResume);
  return comp.overallScore;
});

const isSkillMatched = (tag) => {
  if (!props.candidateResume || !Array.isArray(props.candidateResume.skills)) return false;
  const tagLower = tag.toLowerCase();
  return props.candidateResume.skills.some(s => {
    const sl = (s || '').toLowerCase();
    return sl === tagLower || sl.includes(tagLower) || tagLower.includes(sl);
  });
};

const getPlatformClass = (platform) => {
  const map = {
    LinkedIn: 'platform-linkedin',
    Indeed: 'platform-indeed',
    RemoteOK: 'platform-remoteok',
    WeWorkRemotely: 'platform-wwr',
    Wellfound: 'platform-wellfound',
    'Y Combinator': 'platform-yc',
    Naukri: 'platform-naukri',
    Remotive: 'platform-remotive',
    Dice: 'platform-dice',
    'HN Hiring': 'platform-hn',
    Instahyre: 'platform-instahyre',
    Glassdoor: 'platform-glassdoor'
  };
  return map[platform] || 'platform-default';
};

const formatStatus = (st) => {
  const map = {
    saved: 'Saved',
    applied: 'Applied',
    interviewing: 'Interviewing',
    offered: 'Offer Received',
    rejected: 'Archived'
  };
  return map[st] || st;
};

const timeAgo = (dateStr) => {
  if (!dateStr) return 'Recently';
  const diff = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diff / (1000 * 60));
  if (mins < 1) return 'Just now';
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.floor(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  return `${days}d ago`;
};
</script>

<style scoped>
.job-card {
  display: flex;
  flex-direction: column;
  padding: 1.25rem;
  background: var(--bg-card);
  border: 1px solid var(--border-card);
  border-radius: var(--radius-lg);
  transition: transform var(--transition-normal), border-color var(--transition-normal), box-shadow var(--transition-normal);
  position: relative;
  overflow: hidden;
}

.job-card:hover {
  transform: translateY(-3px);
  border-color: rgba(16, 185, 129, 0.35);
  box-shadow: 0 12px 28px -6px rgba(0, 0, 0, 0.7), 0 0 18px rgba(16, 185, 129, 0.12);
}

.job-card.is-saved {
  border-left: 3px solid var(--accent-emerald);
}

.card-header {
  display: flex;
  align-items: flex-start;
  gap: 0.9rem;
  margin-bottom: 0.9rem;
}

.company-logo {
  width: 44px;
  height: 44px;
  min-width: 44px;
  border-radius: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  font-size: 1rem;
  color: #ffffff;
  box-shadow: var(--shadow-sm);
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.card-title-group {
  flex: 1;
  min-width: 0;
}

.platform-meta {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  margin-bottom: 0.3rem;
}

.platform-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-full);
  font-family: var(--font-mono);
}

.platform-dot {
  width: 5px;
  height: 5px;
  border-radius: 50%;
  background: currentColor;
}

.platform-linkedin {
  background: rgba(10, 102, 194, 0.18);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.3);
}

.platform-indeed {
  background: rgba(33, 100, 245, 0.18);
  color: #818cf8;
  border: 1px solid rgba(129, 140, 248, 0.3);
}

.platform-remoteok {
  background: rgba(239, 68, 68, 0.15);
  color: #f87171;
  border: 1px solid rgba(248, 113, 113, 0.3);
}

.platform-wwr {
  background: rgba(245, 158, 11, 0.18);
  color: #fbbf24;
  border: 1px solid rgba(251, 191, 36, 0.3);
}

.platform-wellfound {
  background: rgba(168, 85, 247, 0.18);
  color: #c084fc;
  border: 1px solid rgba(192, 132, 252, 0.3);
}

.platform-yc {
  background: rgba(255, 102, 0, 0.18);
  color: #ff9933;
  border: 1px solid rgba(255, 102, 0, 0.35);
}

.platform-naukri {
  background: rgba(0, 112, 186, 0.2);
  color: #38bdf8;
  border: 1px solid rgba(0, 112, 186, 0.4);
}

.platform-remotive {
  background: rgba(16, 185, 129, 0.18);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.35);
}

.platform-dice {
  background: rgba(225, 29, 72, 0.18);
  color: #fb7185;
  border: 1px solid rgba(225, 29, 72, 0.35);
}

.platform-hn {
  background: rgba(249, 115, 22, 0.2);
  color: #fdba74;
  border: 1px solid rgba(249, 115, 22, 0.4);
}

.platform-instahyre {
  background: rgba(245, 158, 11, 0.18);
  color: #fbbf24;
  border: 1px solid rgba(245, 158, 11, 0.35);
}

.platform-glassdoor {
  background: rgba(12, 170, 65, 0.18);
  color: #4ade80;
  border: 1px solid rgba(12, 170, 65, 0.35);
}

.platform-default {
  background: rgba(255, 255, 255, 0.08);
  color: var(--text-secondary);
  border: 1px solid var(--border-card);
}

.scrape-time {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  font-size: 0.7rem;
  color: var(--text-muted);
}

.job-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.3;
  margin-bottom: 0.3rem;
  cursor: pointer;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  transition: color var(--transition-fast);
}

.job-title:hover {
  color: var(--accent-emerald);
}

.company-sub {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.company-name {
  font-weight: 600;
  color: var(--text-primary);
}

.meta-separator {
  color: var(--text-muted);
}

.job-location {
  display: flex;
  align-items: center;
  gap: 0.25rem;
  color: var(--text-secondary);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.action-bookmark {
  background: transparent;
  border: none;
  color: var(--text-muted);
  cursor: pointer;
  padding: 0.35rem;
  border-radius: var(--radius-sm);
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.action-bookmark:hover {
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.08);
}

.action-bookmark.active {
  color: var(--accent-emerald);
}

/* Mid section */
.card-mid {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
  margin-bottom: 0.85rem;
  flex-wrap: wrap;
}

.salary-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  font-size: 0.82rem;
  font-weight: 700;
  color: #34d399;
  font-family: var(--font-mono);
  background: rgba(16, 185, 129, 0.1);
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-sm);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.badges-row {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.chip {
  font-size: 0.72rem;
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-sm);
  font-weight: 600;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
}

.chip-remote {
  background: rgba(6, 182, 212, 0.12);
  color: #67e8f9;
  border-color: rgba(6, 182, 212, 0.25);
}

/* Tags */
.card-tags {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  flex-wrap: wrap;
  margin-bottom: 1.1rem;
}

.tech-tag {
  font-size: 0.7rem;
  font-weight: 500;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--text-muted);
  transition: all var(--transition-fast);
}

.tech-tag.tag-matched {
  background: rgba(16, 185, 129, 0.18);
  border-color: rgba(16, 185, 129, 0.45);
  color: #34d399;
  font-weight: 700;
}

.tag-match-icon {
  color: #34d399;
  font-weight: 800;
  font-size: 0.65rem;
  margin-right: 2px;
}

.more-tag {
  background: transparent;
  border: none;
  color: var(--text-muted);
}

/* Footer */
.card-footer {
  margin-top: auto;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-top: 0.85rem;
  border-top: 1px solid var(--border-subtle);
}

.tracker-status-pill {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  font-weight: 600;
  color: var(--text-primary);
  background: rgba(255, 255, 255, 0.06);
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full);
}

.status-indicator-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
  background: var(--text-muted);
}
.status-indicator-dot.saved { background: var(--accent-cyan); }
.status-indicator-dot.applied { background: var(--accent-amber); }
.status-indicator-dot.interviewing { background: var(--accent-violet); }
.status-indicator-dot.offered { background: var(--accent-emerald); }
.status-indicator-dot.rejected { background: var(--accent-rose); }

.status-placeholder {
  min-height: 1px;
}

.footer-btn-group {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.external-link {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
}

.btn-easy-apply {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  font-weight: 700;
  border: none;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.3);
  transition: all var(--transition-fast);
}

.btn-easy-apply:hover {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(16, 185, 129, 0.45);
}

.btn-easy-apply.is-applied {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.35);
  box-shadow: none;
}

.btn-outline-sm {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
  font-size: 0.72rem;
  padding: 0.35rem 0.55rem;
  border-radius: var(--radius-sm);
}

.btn-outline-sm:hover {
  background: rgba(255, 255, 255, 0.06);
  color: #f8fafc;
}

.card-match-pill {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.12rem 0.45rem;
  border-radius: var(--radius-full);
  display: inline-flex;
  align-items: center;
}

.card-match-pill.match-high {
  background: rgba(16, 185, 129, 0.16);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.35);
}

.card-match-pill.match-mid {
  background: rgba(56, 189, 248, 0.14);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.3);
}

.chip-part-time {
  background: rgba(139, 92, 246, 0.18) !important;
  color: #c4b5fd !important;
  border: 1px solid rgba(139, 92, 246, 0.4) !important;
}
</style>
