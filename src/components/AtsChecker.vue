<template>
  <div class="ats-root">
    <!-- Top Header & Score Overview -->
    <div class="ats-hero glass-panel">
      <div class="hero-content-left">
        <div class="hero-badge-row">
          <span class="engine-badge-ats">⚡ FREE ATS ENGINE</span>
          <span class="api-status-badge">REST API Online</span>
        </div>
        <h2 class="ats-title">ATS Resume Optimizer & Parser</h2>
        <p class="ats-subtitle">
          Analyze your resume against enterprise Applicant Tracking Systems (Workday, Greenhouse, Lever). Detect missing keywords, metric impact, action verbs, and format compliance in real-time.
        </p>

        <div class="hero-quick-actions">
          <label class="btn btn-secondary btn-sm upload-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <span>Upload File (.txt, .md, .json)</span>
            <input type="file" accept=".txt,.md,.json,.text" class="hidden-file-input" @change="handleFileUpload" />
          </label>

          <button class="btn btn-secondary btn-sm" @click="loadSampleResume">
            📄 Load Benchmark Resume
          </button>

          <button class="btn btn-primary btn-sm btn-save-master" @click="saveAsMasterResume">
            💾 Save as Active Resume
          </button>
        </div>
      </div>

      <!-- Live ATS Radial Score Gauge -->
      <div class="ats-gauge-card">
        <div class="gauge-wrapper">
          <svg class="score-radial-svg" viewBox="0 0 120 120">
            <circle class="score-circle-bg" cx="60" cy="60" r="48" />
            <circle 
              class="score-circle-fill" 
              cx="60" 
              cy="60" 
              r="48"
              :stroke-dasharray="circumference"
              :stroke-dashoffset="gaugeOffset"
              :class="scoreColorClass"
            />
          </svg>
          <div class="gauge-text-center">
            <span class="gauge-number mono">{{ analysis.overallScore }}</span>
            <span class="gauge-label">ATS SCORE</span>
          </div>
        </div>
        <div class="gauge-meta">
          <span class="gauge-grade" :class="scoreColorClass">{{ analysis.grade }}</span>
          <span class="gauge-words mono">{{ analysis.wordCount }} words evaluated</span>
        </div>
      </div>
    </div>

    <!-- 4 Diagnostic Metric Progress Cards -->
    <div class="metric-cards-grid">
      <div class="metric-card glass-panel">
        <div class="metric-card-top">
          <span class="metric-name">Contact & Links</span>
          <span class="metric-score mono">{{ analysis.breakdown?.contactInfo?.score || 0 }}/15</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" :style="{ width: ((analysis.breakdown?.contactInfo?.score || 0) / 15 * 100) + '%' }"></div>
        </div>
        <span class="metric-detail">Email, Phone, Location & GitHub/LinkedIn</span>
      </div>

      <div class="metric-card glass-panel">
        <div class="metric-card-top">
          <span class="metric-name">Quantifiable Impact</span>
          <span class="metric-score mono">{{ analysis.breakdown?.quantifiableImpact?.score || 0 }}/25</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill emerald" :style="{ width: ((analysis.breakdown?.quantifiableImpact?.score || 0) / 25 * 100) + '%' }"></div>
        </div>
        <span class="metric-detail">{{ analysis.breakdown?.quantifiableImpact?.count || 0 }} numerical metrics detected (%, $, scale)</span>
      </div>

      <div class="metric-card glass-panel">
        <div class="metric-card-top">
          <span class="metric-name">Action Power Verbs</span>
          <span class="metric-score mono">{{ analysis.breakdown?.actionVerbs?.score || 0 }}/20</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill cyan" :style="{ width: ((analysis.breakdown?.actionVerbs?.score || 0) / 20 * 100) + '%' }"></div>
        </div>
        <span class="metric-detail">{{ analysis.breakdown?.actionVerbs?.count || 0 }} power verbs used (Architected, Built...)</span>
      </div>

      <div class="metric-card glass-panel">
        <div class="metric-card-top">
          <span class="metric-name">Standard Headings</span>
          <span class="metric-score mono">{{ analysis.breakdown?.sections?.score || 0 }}/15</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill purple" :style="{ width: ((analysis.breakdown?.sections?.score || 0) / 15 * 100) + '%' }"></div>
        </div>
        <span class="metric-detail">Summary, Experience, Skills & Education</span>
      </div>
    </div>

    <!-- Main Workspace: Split View -->
    <div class="ats-workspace-grid">
      <!-- Left: Resume Text & Structure Editor -->
      <div class="workspace-left glass-panel">
        <div class="pane-header">
          <div class="pane-tabs">
            <button 
              class="pane-tab" 
              :class="{ active: editorMode === 'raw' }"
              @click="editorMode = 'raw'"
            >
              Raw Resume Editor
            </button>
            <button 
              class="pane-tab" 
              :class="{ active: editorMode === 'preview' }"
              @click="editorMode = 'preview'"
            >
              Extracted Profile Preview
            </button>
          </div>
          <span class="live-scanning-indicator">
            <span class="dot-live"></span> Live Real-Time ATS Scanner
          </span>
        </div>

        <div v-if="editorMode === 'raw'" class="editor-wrap">
          <textarea 
            v-model="resumeText"
            class="resume-textarea mono"
            placeholder="Paste or type your resume here to test ATS readability in real time..."
            @input="handleTextInput"
          ></textarea>
        </div>

        <div v-else class="preview-wrap">
          <div class="parsed-field-group">
            <label class="field-label">Candidate Name</label>
            <div class="field-val">{{ parsedCandidate.name || 'Not detected' }}</div>
          </div>
          <div class="parsed-field-group">
            <label class="field-label">Detected Skills ({{ parsedCandidate.skills?.length || 0 }})</label>
            <div class="skills-cloud">
              <span v-for="skill in parsedCandidate.skills" :key="skill" class="skill-tag">
                {{ skill }}
              </span>
            </div>
          </div>
          <div class="parsed-field-group">
            <label class="field-label">Quantified Impact Metrics Detected</label>
            <div class="metrics-list">
              <span v-for="m in (analysis.breakdown?.quantifiableImpact?.metricsDetected || [])" :key="m" class="metric-chip">
                {{ m }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right: Diagnostics, Target Job Matcher, & Free API -->
      <div class="workspace-right glass-panel">
        <div class="pane-header">
          <div class="pane-tabs">
            <button 
              class="pane-tab" 
              :class="{ active: rightTab === 'feedback' }"
              @click="rightTab = 'feedback'"
            >
              Actionable Fixes ({{ analysis.recommendations?.length || 0 }})
            </button>
            <button 
              class="pane-tab" 
              :class="{ active: rightTab === 'job' }"
              @click="rightTab = 'job'"
            >
              Target Job Matcher
            </button>
            <button 
              class="pane-tab" 
              :class="{ active: rightTab === 'api' }"
              @click="rightTab = 'api'"
            >
              Free ATS API
            </button>
          </div>
        </div>

        <!-- Tab 1: Recommendations & Fixes -->
        <div v-if="rightTab === 'feedback'" class="tab-pane-body">
          <div v-if="analysis.recommendations && analysis.recommendations.length > 0" class="recommendations-list">
            <div 
              v-for="(rec, idx) in analysis.recommendations" 
              :key="idx" 
              class="rec-item"
              :class="'priority-' + rec.priority"
            >
              <div class="rec-top">
                <span class="rec-badge">{{ rec.priority.toUpperCase() }} PRIORITY</span>
                <span class="rec-cat">{{ rec.category }}</span>
              </div>
              <p class="rec-tip">{{ rec.tip }}</p>
            </div>
          </div>
          <div v-else class="empty-recs">
            <span class="checkmark-icon">✓</span>
            <h4>Exceptional ATS Compliance!</h4>
            <p>Your resume meets all top ATS parsing heuristics with strong metrics, power verbs, and clean section headers.</p>
          </div>
        </div>

        <!-- Tab 2: Target Job Comparator -->
        <div v-else-if="rightTab === 'job'" class="tab-pane-body">
          <div class="job-selector-wrap">
            <label class="field-label">Compare with a Scraped Job:</label>
            <select v-model="selectedJobId" class="select-field" @change="handleTargetJobChange">
              <option value="">-- Choose a target job to match keywords --</option>
              <option v-for="job in jobs" :key="job.id" :value="job.id">
                {{ job.title }} @ {{ job.company }} ({{ job.platform }})
              </option>
            </select>
          </div>

          <div v-if="analysis.jobMatchAnalysis" class="job-match-results">
            <div class="match-score-row">
              <span class="match-score-title">Target Job Keyword Match</span>
              <strong class="match-score-num mono" :class="analysis.jobMatchAnalysis.matchPercentage >= 75 ? 'emerald-text' : 'amber-text'">
                {{ analysis.jobMatchAnalysis.matchPercentage }}%
              </strong>
            </div>

            <!-- Matched Keywords -->
            <div class="kw-group">
              <span class="kw-title text-emerald">✓ Matched ATS Keywords ({{ analysis.jobMatchAnalysis.matchedJobKeywords.length }})</span>
              <div class="kw-tags-row">
                <span v-for="kw in analysis.jobMatchAnalysis.matchedJobKeywords" :key="kw" class="kw-tag matched">
                  {{ kw }}
                </span>
              </div>
            </div>

            <!-- Missing Keywords -->
            <div class="kw-group">
              <span class="kw-title text-rose">✕ Missing Critical Keywords ({{ analysis.jobMatchAnalysis.missingJobKeywords.length }})</span>
              <div class="kw-tags-row">
                <span v-for="kw in analysis.jobMatchAnalysis.missingJobKeywords" :key="kw" class="kw-tag missing">
                  + {{ kw }}
                </span>
              </div>
              <p class="missing-hint">Add these missing keywords to your skills or project bullets to pass initial ATS filtering.</p>
            </div>
          </div>
          <div v-else class="empty-job-select">
            <p>Select any active job posting above to see exact keyword match percentages and missing ATS keywords.</p>
          </div>
        </div>

        <!-- Tab 3: Free ATS API Documentation -->
        <div v-else class="tab-pane-body api-pane">
          <div class="api-info-banner">
            <span class="api-tag">FREE & OPEN</span>
            <p>Our Node.js ATS Scoring & Parsing API is completely free and requires zero API keys.</p>
          </div>

          <div class="api-code-block">
            <div class="code-hdr">
              <span>cURL Request Example</span>
              <button class="btn btn-outline-sm btn-copy" @click="copyCurlSnippet">
                {{ copied ? '✓ Copied!' : 'Copy cURL' }}
              </button>
            </div>
            <pre class="code-pre mono"><code>curl -X POST http://localhost:5173/api/ats/analyze \
  -H "Content-Type: application/json" \
  -d '{
    "resumeText": "Alex Morgan\nSenior Vue Engineer\nEmail: alex@jobpulse.io..."
  }'</code></pre>
          </div>

          <div class="api-endpoints-table">
            <div class="ep-row">
              <span class="http-badge post">POST</span>
              <span class="ep-path mono">/api/ats/analyze</span>
              <span class="ep-desc">Full ATS score, breakdown & fixes</span>
            </div>
            <div class="ep-row">
              <span class="http-badge post">POST</span>
              <span class="ep-path mono">/api/ats/parse</span>
              <span class="ep-desc">Extract name, email, skills from text</span>
            </div>
            <div class="ep-row">
              <span class="http-badge get">GET</span>
              <span class="ep-path mono">/api/ats/sample</span>
              <span class="ep-desc">Get benchmark 88/100 resume</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { atsService } from '../services/atsService.js';
import { resumeService } from '../services/resumeService.js';

const props = defineProps({
  jobs: { type: Array, default: () => [] }
});

const emit = defineEmits(['resume-updated', 'show-toast']);

const editorMode = ref('raw');
const rightTab = ref('feedback');
const resumeText = ref('');
const selectedJobId = ref('');
const copied = ref(false);

const analysis = ref({
  overallScore: 88,
  grade: 'Excellent (ATS Ready)',
  wordCount: 320,
  breakdown: {
    contactInfo: { score: 15, max: 15 },
    sections: { score: 15, max: 15 },
    actionVerbs: { score: 18, max: 20, count: 7 },
    quantifiableImpact: { score: 20, max: 25, count: 4, metricsDetected: ['48%', '100k+', '88%', '$2M+'] },
    formattingAndLength: { score: 20, max: 25 }
  },
  recommendations: []
});

const parsedCandidate = ref({
  name: 'Alex Morgan',
  skills: ['Vue 3', 'TypeScript', 'Vite', 'PHP', 'Laravel', 'Docker', 'Pinia']
});

// Radial Gauge Calculation
const radius = 48;
const circumference = 2 * Math.PI * radius;
const gaugeOffset = computed(() => {
  const score = analysis.value.overallScore || 0;
  return circumference - (score / 100) * circumference;
});

const scoreColorClass = computed(() => {
  const s = analysis.value.overallScore || 0;
  if (s >= 80) return 'score-high';
  if (s >= 65) return 'score-mid';
  return 'score-low';
});

let debounceTimer = null;
const handleTextInput = () => {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => {
    runAnalysis();
  }, 350);
};

const runAnalysis = async () => {
  if (!resumeText.value.trim()) return;

  const targetJob = props.jobs.find(j => j.id === selectedJobId.value) || null;
  const result = await atsService.analyze({
    resumeText: resumeText.value,
    targetJob
  });

  if (result) {
    analysis.value = result;
  }

  // Parse candidate fields
  const parsed = await atsService.parse(resumeText.value);
  if (parsed) {
    parsedCandidate.value = parsed;
  }
};

const handleTargetJobChange = () => {
  runAnalysis();
};

const handleFileUpload = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    resumeText.value = e.target.result;
    runAnalysis();
    emit('show-toast', `Loaded resume file: ${file.name}`);
  };
  reader.readAsText(file);
};

const loadSampleResume = async () => {
  const sample = await atsService.getSample();
  if (sample) {
    resumeText.value = sample;
    runAnalysis();
    emit('show-toast', 'Loaded benchmark 88/100 ATS resume.');
  }
};

const saveAsMasterResume = () => {
  const updatedResume = resumeService.parseResumeText(resumeText.value);
  resumeService.saveMasterResume(updatedResume);
  emit('resume-updated', updatedResume);
  emit('show-toast', 'Resume saved as Active Master Profile across JobPulse!');
};

const copyCurlSnippet = () => {
  const snippet = `curl -X POST http://localhost:5173/api/ats/analyze \\\n  -H "Content-Type: application/json" \\\n  -d '{"resumeText": "Alex Morgan\\nSenior Vue Engineer..."}'`;
  navigator.clipboard?.writeText(snippet);
  copied.value = true;
  setTimeout(() => copied.value = false, 2500);
};

onMounted(async () => {
  const master = resumeService.getMasterResume();
  const serialized = [
    master.name,
    master.headline,
    `Email: ${master.email} | Phone: ${master.phone} | Location: ${master.location}`,
    `LinkedIn: linkedin.com/in/alex-morgan | GitHub: github.com/alex-morgan`,
    '',
    'SUMMARY',
    master.summary,
    '',
    'TECHNICAL SKILLS',
    (master.skills || []).join(', '),
    '',
    'PROFESSIONAL EXPERIENCE',
    ...(master.experience || []).map(e => `${e.role} | ${e.company} (${e.period})\n` + (e.highlights || []).map(h => `- ${h}`).join('\n')),
    '',
    'EDUCATION',
    ...(master.education || []).map(ed => `${ed.degree} | ${ed.school || ''}`)
  ].join('\n');

  resumeText.value = serialized;
  await runAnalysis();
});
</script>

<style scoped>
.ats-root {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* ATS Hero */
.ats-hero {
  padding: 1.75rem;
  display: grid;
  grid-template-columns: 1fr 280px;
  gap: 1.5rem;
  align-items: center;
  background: linear-gradient(180deg, rgba(16, 23, 38, 0.85) 0%, rgba(10, 15, 26, 0.95) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

@media (max-width: 900px) {
  .ats-hero { grid-template-columns: 1fr; }
}

.hero-badge-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.5rem;
}

.engine-badge-ats {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 800;
  color: #34d399;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.35);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.api-status-badge {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.12);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.ats-title {
  font-size: 1.45rem;
  font-weight: 800;
  color: #f8fafc;
  margin-bottom: 0.35rem;
}

.ats-subtitle {
  font-size: 0.82rem;
  color: var(--text-secondary);
  line-height: 1.5;
  max-width: 750px;
  margin-bottom: 1.25rem;
}

.hero-quick-actions {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  flex-wrap: wrap;
}

.hidden-file-input { display: none; }
.upload-btn { cursor: pointer; }

.btn-save-master {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  font-weight: 700;
}

/* Gauge Card */
.ats-gauge-card {
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.75rem;
}

.gauge-wrapper {
  position: relative;
  width: 120px;
  height: 120px;
}

.score-radial-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.score-circle-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.08);
  stroke-width: 9;
}

.score-circle-fill {
  fill: none;
  stroke-width: 9;
  stroke-linecap: round;
  transition: stroke-dashoffset 0.8s ease-in-out;
}

.score-circle-fill.score-high { stroke: #10b981; filter: drop-shadow(0 0 8px rgba(16, 185, 129, 0.5)); }
.score-circle-fill.score-mid { stroke: #38bdf8; filter: drop-shadow(0 0 8px rgba(56, 189, 248, 0.5)); }
.score-circle-fill.score-low { stroke: #f43f5e; filter: drop-shadow(0 0 8px rgba(244, 63, 94, 0.5)); }

.gauge-text-center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.gauge-number {
  font-size: 1.85rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1;
}

.gauge-label {
  font-size: 0.58rem;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.05em;
  margin-top: 0.2rem;
}

.gauge-meta {
  text-align: center;
}

.gauge-grade {
  font-size: 0.82rem;
  font-weight: 800;
  display: block;
}
.gauge-grade.score-high { color: #34d399; }
.gauge-grade.score-mid { color: #38bdf8; }
.gauge-grade.score-low { color: #fda4af; }

.gauge-words {
  font-size: 0.68rem;
  color: var(--text-muted);
}

/* Metric Cards Grid */
.metric-cards-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
}

@media (max-width: 950px) {
  .metric-cards-grid { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 550px) {
  .metric-cards-grid { grid-template-columns: 1fr; }
}

.metric-card {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.metric-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-name { font-size: 0.82rem; font-weight: 700; color: #f8fafc; }
.metric-score { font-size: 0.8rem; font-weight: 800; color: #38bdf8; }

.progress-bar-track {
  height: 4px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: #38bdf8;
  border-radius: var(--radius-full);
  transition: width 0.5s ease;
}

.progress-bar-fill.emerald { background: #10b981; }
.progress-bar-fill.cyan { background: #06b6d4; }
.progress-bar-fill.purple { background: #a855f7; }

.metric-detail {
  font-size: 0.68rem;
  color: var(--text-muted);
  line-height: 1.35;
}

/* Workspace Grid */
.ats-workspace-grid {
  display: grid;
  grid-template-columns: 1.1fr 0.9fr;
  gap: 1.5rem;
}

@media (max-width: 1000px) {
  .ats-workspace-grid { grid-template-columns: 1fr; }
}

.workspace-left, .workspace-right {
  display: flex;
  flex-direction: column;
  min-height: 550px;
}

.pane-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  background: rgba(0, 0, 0, 0.25);
  flex-wrap: wrap;
  gap: 0.5rem;
}

.pane-tabs {
  display: flex;
  align-items: center;
  gap: 0.35rem;
}

.pane-tab {
  background: transparent;
  border: none;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-secondary);
  padding: 0.35rem 0.75rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.pane-tab:hover { color: #ffffff; }
.pane-tab.active {
  background: rgba(255, 255, 255, 0.09);
  color: #38bdf8;
}

.live-scanning-indicator {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  font-size: 0.72rem;
  color: var(--text-muted);
}

.dot-live {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 6px #10b981;
}

.editor-wrap {
  flex: 1;
  display: flex;
  padding: 1rem;
}

.resume-textarea {
  width: 100%;
  height: 100%;
  min-height: 480px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
  padding: 1rem;
  color: #f1f5f9;
  font-size: 0.84rem;
  line-height: 1.6;
  resize: vertical;
  outline: none;
}

.resume-textarea:focus {
  border-color: #38bdf8;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.2);
}

.preview-wrap {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.field-label {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  margin-bottom: 0.35rem;
  display: block;
}

.field-val {
  font-size: 1rem;
  font-weight: 800;
  color: #f8fafc;
}

.skills-cloud, .metrics-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.skill-tag {
  background: rgba(56, 189, 248, 0.12);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.25);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.metric-chip {
  background: rgba(16, 185, 129, 0.12);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.25);
  font-family: var(--font-mono);
  font-size: 0.72rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.tab-pane-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

/* Recommendations */
.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.rec-item {
  background: rgba(255, 255, 255, 0.02);
  border-radius: var(--radius-md);
  padding: 0.85rem;
  border-left: 3px solid #38bdf8;
  border-top: 1px solid rgba(255, 255, 255, 0.06);
  border-right: 1px solid rgba(255, 255, 255, 0.06);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
}

.rec-item.priority-critical { border-left-color: #f43f5e; }
.rec-item.priority-high { border-left-color: #f59e0b; }
.rec-item.priority-medium { border-left-color: #38bdf8; }

.rec-top {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
}

.rec-badge {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 800;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
}

.priority-critical .rec-badge { background: rgba(244, 63, 94, 0.2); color: #fda4af; }
.priority-high .rec-badge { background: rgba(245, 158, 11, 0.2); color: #fcd34d; }
.priority-medium .rec-badge { background: rgba(56, 189, 248, 0.2); color: #7dd3fc; }

.rec-cat { font-size: 0.72rem; color: var(--text-muted); font-weight: 600; }
.rec-tip { font-size: 0.8rem; color: #cbd5e1; line-height: 1.45; }

.empty-recs {
  text-align: center;
  padding: 3rem 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;
}

.checkmark-icon {
  font-size: 2rem;
  color: #10b981;
}

/* Job Comparator */
.match-score-row {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 0.75rem;
}

.match-score-title { font-size: 0.92rem; font-weight: 800; color: #f8fafc; }
.match-score-num { font-size: 1.4rem; font-weight: 800; }

.kw-group { display: flex; flex-direction: column; gap: 0.45rem; }
.kw-title { font-size: 0.75rem; font-weight: 700; }
.text-emerald { color: #34d399; }
.text-rose { color: #fda4af; }

.kw-tags-row { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.kw-tag {
  font-family: var(--font-mono);
  font-size: 0.7rem;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}
.kw-tag.matched { background: rgba(16, 185, 129, 0.15); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
.kw-tag.missing { background: rgba(244, 63, 94, 0.15); color: #fda4af; border: 1px solid rgba(244, 63, 94, 0.3); }

.missing-hint { font-size: 0.72rem; color: var(--text-muted); }

.empty-job-select {
  text-align: center;
  padding: 2.5rem 1rem;
  color: var(--text-muted);
  font-size: 0.82rem;
}

/* API Documentation Pane */
.api-pane {
  gap: 1.25rem;
}

.api-info-banner {
  background: rgba(16, 185, 129, 0.1);
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: var(--radius-md);
  padding: 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.api-tag {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  font-weight: 800;
  background: #10b981;
  color: #000000;
  padding: 0.12rem 0.45rem;
  border-radius: 4px;
}

.api-info-banner p { font-size: 0.75rem; color: #cbd5e1; }

.api-code-block {
  background: #000000;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.code-hdr {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.5rem 0.85rem;
  background: rgba(255, 255, 255, 0.05);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  font-size: 0.72rem;
  color: var(--text-muted);
}

.btn-copy { font-size: 0.7rem; padding: 0.2rem 0.5rem; }

.code-pre {
  padding: 0.85rem;
  font-size: 0.76rem;
  color: #38bdf8;
  overflow-x: auto;
  line-height: 1.5;
}

.api-endpoints-table {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ep-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
  padding: 0.5rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-sm);
}

.http-badge {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 800;
  padding: 0.12rem 0.4rem;
  border-radius: 3px;
}

.http-badge.post { background: rgba(56, 189, 248, 0.2); color: #38bdf8; }
.http-badge.get { background: rgba(16, 185, 129, 0.2); color: #34d399; }

.ep-path { font-size: 0.76rem; color: #f8fafc; font-weight: 700; }
.ep-desc { font-size: 0.72rem; color: var(--text-muted); margin-left: auto; }
</style>
