<template>
  <div class="spotlight-root glass-panel">
    <!-- Top Bento Section: Active Resume Radar & Market Readiness -->
    <div class="bento-row">
      <!-- Candidate Resume Card -->
      <div class="resume-radar-card">
        <div class="radar-top">
          <div class="candidate-avatar">
            <span>{{ (resume.name || 'AM').slice(0, 2).toUpperCase() }}</span>
            <span class="active-dot" title="Resume active for real-time scoring"></span>
          </div>
          <div class="candidate-info">
            <div class="badge-row">
              <span class="pill-active-resume">ACTIVE RESUME PARSER</span>
              <span class="exp-badge">{{ resume.yearsOfExperience }}+ Years Exp</span>
            </div>
            <h3 class="candidate-name">{{ resume.name }}</h3>
            <p class="candidate-headline">{{ resume.headline }}</p>
          </div>
        </div>

        <div class="skills-mini-cloud">
          <span v-for="skill in (resume.skills || []).slice(0, 6)" :key="skill" class="mini-skill-chip">
            {{ skill }}
          </span>
          <span v-if="(resume.skills || []).length > 6" class="more-skills-pill">
            +{{ resume.skills.length - 6 }} more
          </span>
        </div>

        <div class="radar-footer">
          <div class="readiness-meter">
            <div class="meter-lbl-row">
              <span class="meter-title">Market Confidence Index</span>
              <strong class="meter-percent mono">94%</strong>
            </div>
            <div class="meter-bar-track">
              <div class="meter-bar-glow" style="width: 94%;"></div>
            </div>
          </div>
          <button class="btn btn-outline-sm btn-edit-profile" @click="$emit('edit-resume')">
            <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/>
            </svg>
            <span>Edit Profile</span>
          </button>
        </div>
      </div>

      <!-- Quick AI Suggestion Bar & Smart Prompts -->
      <div class="ai-suggestion-box">
        <div class="ai-box-hdr">
          <div class="ai-hdr-left">
            <span class="ai-sparkle">✨</span>
            <div>
              <h4 class="ai-title">AI Match & Job Suggestions</h4>
              <p class="ai-subtitle">Ask AI to parse specific job types or match against custom criteria</p>
            </div>
          </div>
          <span v-if="activeSuggestion" class="active-filter-tag">
            Active Prompt
          </span>
        </div>

        <!-- Natural Input Field -->
        <div class="prompt-input-wrap">
          <svg class="prompt-icon" xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="m21 21-4.3-4.3"/>
            <circle cx="11" cy="11" r="8"/>
          </svg>
          <input 
            v-model="suggestionInput"
            type="text" 
            placeholder="Suggest high-paying Vue 3 remote roles with Docker..."
            class="prompt-input"
            @keyup.enter="handleCustomPrompt"
          />
          <button v-if="suggestionInput" class="btn btn-primary btn-sm prompt-btn" @click="handleCustomPrompt">
            Apply Prompt
          </button>
          <button v-if="activeSuggestion" class="btn btn-secondary btn-sm clear-btn" @click="clearSuggestion">
            Reset
          </button>
        </div>

        <!-- Smart Quick Suggestion Pills -->
        <div class="quick-pills-row">
          <span class="pills-label">Quick Suggestions:</span>
          <button 
            v-for="pill in suggestionPills" 
            :key="pill.id"
            class="smart-pill"
            :class="{ active: activeSuggestion === pill.prompt }"
            @click="applySuggestionPill(pill.prompt)"
          >
            <span>{{ pill.icon }}</span>
            <span>{{ pill.label }}</span>
          </button>
        </div>
      </div>
    </div>

    <!-- Bottom Showcase: Top Confident Job Matches -->
    <div class="confident-matches-section">
      <div class="section-hdr-row">
        <div class="hdr-left">
          <span class="fire-icon">🎯</span>
          <h3 class="matches-title">
            {{ activeSuggestion ? 'Top Suggested Matches for: "' + activeSuggestion + '"' : 'Most Confident Job Matches for Your Resume' }}
          </h3>
        </div>
        <span class="matches-subtitle mono">
          Ranked by Multidimensional Compatibility (Skills • Experience • Stack)
        </span>
      </div>

      <!-- Confident Matches Grid -->
      <div class="confident-cards-grid">
        <div 
          v-for="(job, index) in topConfidentJobs" 
          :key="job.id"
          class="confident-card glass-panel"
          :class="'rank-' + (index + 1)"
        >
          <div class="conf-card-top">
            <div class="rank-indicator">
              <span class="rank-badge">#{{ index + 1 }} Top Match</span>
              <span class="platform-mini-tag">{{ job.platform }}</span>
            </div>

            <!-- Score Pill -->
            <div class="score-pill-bold" :class="job.matchScore >= 90 ? 'score-high' : 'score-good'">
              <span class="bolt-icon">⚡</span>
              <span class="score-text mono">{{ job.matchScore }}% Match</span>
            </div>
          </div>

          <div class="conf-card-body">
            <div class="company-logo-row">
              <div class="conf-logo" :style="{ background: job.logoBg || 'var(--accent-indigo)' }">
                {{ job.companyLogo || (job.company || 'CO').slice(0, 2).toUpperCase() }}
              </div>
              <div>
                <h4 class="conf-title" :title="job.title">{{ job.title }}</h4>
                <div class="conf-company-sub">
                  <span>{{ job.company }}</span>
                  <span class="sep">•</span>
                  <span>{{ job.location }}</span>
                </div>
              </div>
            </div>

            <!-- Match Rationale -->
            <p class="confidence-rationale">
              {{ job.confidenceRationale || job.suggestionRationale }}
            </p>

            <!-- Matching Skills Tags -->
            <div class="conf-tags-row">
              <span 
                v-for="tag in (job.tags || []).slice(0, 4)" 
                :key="tag" 
                class="conf-tag"
                :class="{ 'matched-tag': (resume.skills || []).map(s => s.toLowerCase()).includes(tag.toLowerCase()) }"
              >
                {{ tag }}
              </span>
              <span v-if="(job.tags || []).length > 4" class="more-tags">
                +{{ job.tags.length - 4 }}
              </span>
            </div>
          </div>

          <div class="conf-card-footer">
            <div class="salary-box mono">
              {{ job.salary?.formatted || 'Competitive' }}
            </div>

            <div class="conf-actions">
              <button class="btn btn-secondary btn-sm" @click="$emit('select-job', job)">
                Details
              </button>
              <button 
                class="btn btn-primary btn-sm btn-conf-apply"
                :class="{ 'is-applied': job.status === 'applied' }"
                @click="$emit('easy-apply', job)"
              >
                <span v-if="job.status === 'applied'">✓ Applied</span>
                <span v-else>⚡ Easy Apply</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { resumeService } from '../services/resumeService.js';

const props = defineProps({
  jobs: {
    type: Array,
    default: () => []
  },
  resume: {
    type: Object,
    default: () => resumeService.getMasterResume()
  }
});

const emit = defineEmits(['select-job', 'easy-apply', 'edit-resume', 'filter-suggestion']);

// AI Suggestion State
const suggestionInput = ref('');
const activeSuggestion = ref('');

const suggestionPills = [
  { id: 'p1', label: 'Top Vue 3 Roles ($140k+)', prompt: 'vue 3 high salary', icon: '💎' },
  { id: 'p2', label: '100% Remote Senior', prompt: 'remote senior engineer', icon: '🌐' },
  { id: 'p3', label: 'Full-Stack & Cloud', prompt: 'docker node typescript', icon: '⚡' },
  { id: 'p4', label: 'High-Growth Startups', prompt: 'startup wellfound', icon: '🚀' }
];

// Top Confident Jobs calculation
const topConfidentJobs = computed(() => {
  if (activeSuggestion.value) {
    return resumeService.getJobsBySuggestion(props.jobs, props.resume, activeSuggestion.value).slice(0, 3);
  }
  return resumeService.findTopConfidentJobs(props.jobs, props.resume, 3);
});

const applySuggestionPill = (prompt) => {
  if (activeSuggestion.value === prompt) {
    clearSuggestion();
    return;
  }
  activeSuggestion.value = prompt;
  suggestionInput.value = prompt;
  emit('filter-suggestion', prompt);
};

const handleCustomPrompt = () => {
  if (!suggestionInput.value.trim()) return;
  activeSuggestion.value = suggestionInput.value.trim();
  emit('filter-suggestion', activeSuggestion.value);
};

const clearSuggestion = () => {
  activeSuggestion.value = '';
  suggestionInput.value = '';
  emit('filter-suggestion', '');
};
</script>

<style scoped>
.spotlight-root {
  padding: 1.5rem;
  border-radius: var(--radius-xl);
  background: linear-gradient(180deg, rgba(16, 23, 38, 0.85) 0%, rgba(11, 17, 28, 0.92) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 16px 40px -8px rgba(0, 0, 0, 0.6), 0 0 30px rgba(16, 185, 129, 0.05);
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
  margin-bottom: 2rem;
}

/* Bento Row */
.bento-row {
  display: grid;
  grid-template-columns: 380px 1fr;
  gap: 1.25rem;
}

@media (max-width: 950px) {
  .bento-row { grid-template-columns: 1fr; }
}

/* Candidate Resume Card */
.resume-radar-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.07);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
}

.radar-top {
  display: flex;
  align-items: flex-start;
  gap: 0.85rem;
}

.candidate-avatar {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, #38bdf8, #6366f1);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 800;
  color: #ffffff;
  position: relative;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(56, 189, 248, 0.3);
}

.active-dot {
  position: absolute;
  bottom: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #10b981;
  border: 2px solid #0f172a;
}

.badge-row {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  margin-bottom: 0.2rem;
}

.pill-active-resume {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  font-weight: 800;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.12);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  letter-spacing: 0.04em;
}

.exp-badge {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  font-weight: 700;
  color: #34d399;
  background: rgba(16, 185, 129, 0.12);
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}

.candidate-name {
  font-size: 1rem;
  font-weight: 800;
  color: #f8fafc;
}

.candidate-headline {
  font-size: 0.75rem;
  color: var(--text-secondary);
  line-height: 1.35;
}

.skills-mini-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.mini-skill-chip {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: #cbd5e1;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.more-skills-pill {
  font-size: 0.68rem;
  color: var(--text-muted);
  align-self: center;
}

.radar-footer {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 0.85rem;
}

.readiness-meter { flex: 1; }
.meter-lbl-row {
  display: flex;
  justify-content: space-between;
  font-size: 0.72rem;
  margin-bottom: 0.35rem;
}
.meter-title { color: var(--text-muted); font-weight: 600; }
.meter-percent { color: #34d399; font-weight: 800; }

.meter-bar-track {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  overflow: hidden;
}
.meter-bar-glow {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #38bdf8);
  border-radius: 9999px;
  box-shadow: 0 0 8px #10b981;
}

.btn-edit-profile {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.75rem;
  padding: 0.35rem 0.65rem;
}

/* AI Suggestion Box */
.ai-suggestion-box {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(99, 102, 241, 0.25);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  box-shadow: 0 8px 24px -6px rgba(99, 102, 241, 0.15);
}

.ai-box-hdr {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.ai-hdr-left {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.ai-sparkle { font-size: 1.25rem; }
.ai-title { font-size: 0.95rem; font-weight: 800; color: #c7d2fe; }
.ai-subtitle { font-size: 0.75rem; color: var(--text-muted); }

.active-filter-tag {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  background: rgba(99, 102, 241, 0.2);
  color: #c7d2fe;
  border: 1px solid rgba(99, 102, 241, 0.4);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.prompt-input-wrap {
  position: relative;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.prompt-icon {
  position: absolute;
  left: 0.85rem;
  color: var(--text-muted);
}

.prompt-input {
  width: 100%;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  padding: 0.6rem 0.85rem 0.6rem 2.5rem;
  color: #f8fafc;
  font-size: 0.85rem;
  transition: all var(--transition-fast);
}

.prompt-input:focus {
  outline: none;
  border-color: #818cf8;
  box-shadow: 0 0 12px rgba(129, 140, 248, 0.25);
}

.prompt-btn { white-space: nowrap; }
.clear-btn { white-space: nowrap; }

.quick-pills-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.pills-label {
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
}

.smart-pill {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.08);
  color: var(--text-secondary);
  font-size: 0.74rem;
  font-weight: 600;
  padding: 0.3rem 0.65rem;
  border-radius: var(--radius-full);
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.35rem;
  transition: all var(--transition-fast);
}

.smart-pill:hover {
  background: rgba(255, 255, 255, 0.08);
  color: #f8fafc;
  border-color: rgba(255, 255, 255, 0.15);
}

.smart-pill.active {
  background: linear-gradient(135deg, #4f46e5, #7c3aed);
  color: #ffffff;
  border-color: #6366f1;
  box-shadow: 0 2px 8px rgba(99, 102, 241, 0.4);
}

/* Confident Matches Section */
.confident-matches-section {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.section-hdr-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  padding-bottom: 0.65rem;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.hdr-left {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.fire-icon { font-size: 1.15rem; }
.matches-title { font-size: 1.05rem; font-weight: 800; color: #f8fafc; }
.matches-subtitle { font-size: 0.72rem; color: var(--text-muted); }

/* Confident Cards Grid */
.confident-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.25rem;
}

@media (max-width: 1050px) {
  .confident-cards-grid { grid-template-columns: 1fr; }
}

.confident-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
  position: relative;
  transition: all var(--transition-normal);
}

.confident-card:hover {
  transform: translateY(-3px);
  border-color: rgba(56, 189, 248, 0.4);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.5), 0 0 20px rgba(56, 189, 248, 0.1);
}

.confident-card.rank-1 {
  border-color: rgba(16, 185, 129, 0.35);
  background: linear-gradient(180deg, rgba(16, 185, 129, 0.06) 0%, rgba(255, 255, 255, 0.01) 100%);
}

.conf-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.rank-indicator {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.rank-badge {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 800;
  text-transform: uppercase;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.12);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.score-pill-bold {
  display: flex;
  align-items: center;
  gap: 0.3rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 800;
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-full);
}

.score-high {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.4);
}

.score-good {
  background: rgba(56, 189, 248, 0.2);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.4);
}

.company-logo-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  margin-bottom: 0.5rem;
}

.conf-logo {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  color: #ffffff;
  font-size: 0.95rem;
  flex-shrink: 0;
}

.conf-title {
  font-size: 0.95rem;
  font-weight: 800;
  color: #f8fafc;
  line-height: 1.3;
}

.conf-company-sub {
  font-size: 0.78rem;
  color: var(--text-secondary);
}

.sep { color: var(--text-muted); margin: 0 0.2rem; }

.confidence-rationale {
  font-size: 0.78rem;
  color: #cbd5e1;
  background: rgba(0, 0, 0, 0.3);
  padding: 0.5rem 0.65rem;
  border-radius: var(--radius-sm);
  border-left: 2px solid #34d399;
  line-height: 1.4;
  margin: 0.6rem 0;
}

.conf-tags-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.conf-tag {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-secondary);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.conf-tag.matched-tag {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.more-tags { font-size: 0.65rem; color: var(--text-muted); align-self: center; }

.conf-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  padding-top: 0.75rem;
  gap: 0.5rem;
}

.salary-box {
  font-size: 0.8rem;
  font-weight: 700;
  color: #34d399;
}

.conf-actions {
  display: flex;
  gap: 0.4rem;
}

.btn-conf-apply {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  font-weight: 700;
  border: none;
  box-shadow: 0 2px 8px rgba(16, 185, 129, 0.35);
}

.btn-conf-apply:hover {
  background: linear-gradient(135deg, #059669, #047857);
}

.btn-conf-apply.is-applied {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.4);
  box-shadow: none;
}
</style>
