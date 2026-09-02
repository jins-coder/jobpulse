<template>
  <div class="ats-root">
    <!-- Top Hero Header & Live Radial Gauge -->
    <div class="ats-hero glass-panel">
      <div class="hero-content-left">
        <div class="hero-badge-row">
          <span class="engine-badge-ats">⚡ AI-POWERED ATS STUDIO</span>
          <span class="api-status-badge">Workday & Greenhouse Compliant</span>
          <span v-if="isPdfLoading" class="pdf-loading-badge">📄 Extracting PDF with PDF.js...</span>
        </div>
        <h2 class="ats-title">Enterprise ATS Resume Optimizer</h2>
        <p class="ats-subtitle">
          Real-time parser analysis simulating Fortune 500 Applicant Tracking Systems. Audit keyword density, quantifiable impact metrics, action verb strength, and structural parseability in sub-second cycles.
        </p>

        <div class="hero-quick-actions">
          <label class="btn btn-secondary btn-sm upload-btn">
            <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
            <span>Upload PDF / Text</span>
            <input type="file" accept=".pdf,.txt,.md,.json,.text" class="hidden-file-input" @change="handleFileUpload" />
          </label>

          <button 
            v-if="hasUploadedResume"
            class="btn btn-primary btn-sm btn-load-uploaded"
            @click="loadUploadedResume"
            title="Load your active uploaded resume into the scanner"
          >
            👤 Load My Resume ({{ uploadedResume?.name || 'Active' }})
          </button>

          <button class="btn btn-secondary btn-sm" @click="loadSampleResume">
            📄 Benchmark (88/100)
          </button>

          <button class="btn btn-secondary btn-sm btn-save-master" @click="saveAsMasterResume">
            💾 Save to Active Profile
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
            <span class="gauge-number mono">{{ analysis.overallScore || 0 }}</span>
            <span class="gauge-label">ATS SCORE</span>
          </div>
        </div>
        <div class="gauge-meta">
          <span class="gauge-grade" :class="scoreColorClass">{{ analysis.grade || 'Calculating...' }}</span>
          <span class="gauge-words mono">{{ analysis.wordCount || 0 }} words evaluated</span>
        </div>
      </div>
    </div>

    <!-- 4 Diagnostic Metric Progress Cards -->
    <div class="metric-cards-grid">
      <div class="metric-card glass-panel">
        <div class="metric-card-top">
          <div class="metric-title-group">
            <span class="metric-icon">📇</span>
            <span class="metric-name">Contact & Links</span>
          </div>
          <span class="metric-score mono">{{ analysis.breakdown?.contactInfo?.score || 0 }}/15</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill" :style="{ width: ((analysis.breakdown?.contactInfo?.score || 0) / 15 * 100) + '%' }"></div>
        </div>
        <span class="metric-detail">Email, Phone, Location & Online Profiles</span>
      </div>

      <div class="metric-card glass-panel">
        <div class="metric-card-top">
          <div class="metric-title-group">
            <span class="metric-icon">📈</span>
            <span class="metric-name">Quantifiable Impact</span>
          </div>
          <span class="metric-score mono">{{ analysis.breakdown?.quantifiableImpact?.score || 0 }}/25</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill emerald" :style="{ width: ((analysis.breakdown?.quantifiableImpact?.score || 0) / 25 * 100) + '%' }"></div>
        </div>
        <span class="metric-detail">{{ analysis.breakdown?.quantifiableImpact?.count || 0 }} metrics detected (%, $, volume, scale)</span>
      </div>

      <div class="metric-card glass-panel">
        <div class="metric-card-top">
          <div class="metric-title-group">
            <span class="metric-icon">⚡</span>
            <span class="metric-name">Action Power Verbs</span>
          </div>
          <span class="metric-score mono">{{ analysis.breakdown?.actionVerbs?.score || 0 }}/20</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill cyan" :style="{ width: ((analysis.breakdown?.actionVerbs?.score || 0) / 20 * 100) + '%' }"></div>
        </div>
        <span class="metric-detail">{{ analysis.breakdown?.actionVerbs?.count || 0 }} power verbs used (Architected, Engineered...)</span>
      </div>

      <div class="metric-card glass-panel">
        <div class="metric-card-top">
          <div class="metric-title-group">
            <span class="metric-icon">📋</span>
            <span class="metric-name">Standard Structure</span>
          </div>
          <span class="metric-score mono">{{ analysis.breakdown?.sections?.score || 0 }}/15</span>
        </div>
        <div class="progress-bar-track">
          <div class="progress-bar-fill purple" :style="{ width: ((analysis.breakdown?.sections?.score || 0) / 15 * 100) + '%' }"></div>
        </div>
        <span class="metric-detail">Summary, Experience, Skills & Education</span>
      </div>
    </div>

    <!-- Main Workspace: Balanced Two-Column Split View -->
    <div class="ats-workspace-grid">
      <!-- Left Column: Live Interactive Resume Editor & Structure Preview -->
      <div class="workspace-card workspace-left glass-panel">
        <div class="pane-header">
          <div class="pane-tabs">
            <button 
              class="pane-tab" 
              :class="{ active: editorMode === 'raw' }"
              @click="editorMode = 'raw'"
            >
              📝 Raw Resume Editor
            </button>
            <button 
              class="pane-tab" 
              :class="{ active: editorMode === 'preview' }"
              @click="editorMode = 'preview'"
            >
              👤 Parsed Profile Preview
            </button>
          </div>
          <div class="pane-status-pill">
            <span class="dot-live"></span>
            <span class="status-txt mono">Live Heuristics</span>
          </div>
        </div>

        <!-- Raw Text Editor View -->
        <div v-if="editorMode === 'raw'" class="editor-wrap">
          <div class="editor-top-meta">
            <span class="meta-item mono">{{ resumeText.split(/\s+/).filter(Boolean).length }} words</span>
            <span class="meta-item mono">{{ resumeText.length }} characters</span>
            <span class="meta-tip">Auto-reanalyzing as you type...</span>
          </div>
          <textarea 
            v-model="resumeText"
            class="resume-textarea mono"
            placeholder="Paste or type your resume markdown/text here to audit ATS readability in real time..."
            @input="handleTextInput"
          ></textarea>
        </div>

        <!-- Extracted Profile Visual View -->
        <div v-else class="preview-wrap">
          <div class="candidate-summary-banner">
            <div class="candidate-avatar">
              {{ (parsedCandidate?.name || 'CP').slice(0, 2).toUpperCase() }}
            </div>
            <div class="candidate-info">
              <h3 class="candidate-name">{{ parsedCandidate?.name || 'Candidate Profile' }}</h3>
              <p class="candidate-headline">{{ parsedCandidate?.headline || 'Senior Software Engineer' }}</p>
              <div class="candidate-meta-row">
                <span v-if="parsedCandidate?.email" class="meta-chip">✉️ {{ parsedCandidate.email }}</span>
                <span v-if="parsedCandidate?.phone" class="meta-chip">📞 {{ parsedCandidate.phone }}</span>
                <span v-if="parsedCandidate?.location" class="meta-chip">📍 {{ parsedCandidate.location }}</span>
              </div>
            </div>
          </div>

          <div class="parsed-section">
            <div class="section-title-row">
              <label class="field-label">Detected Skills Catalog</label>
              <span class="badge-count mono">{{ parsedCandidate?.skills?.length || 0 }} skills</span>
            </div>
            <div class="skills-cloud">
              <span v-for="skill in (parsedCandidate?.skills || [])" :key="skill" class="skill-tag">
                {{ skill }}
              </span>
            </div>
          </div>

          <div class="parsed-section">
            <div class="section-title-row">
              <label class="field-label">Quantified Impact Metrics Detected</label>
              <span class="badge-count mono text-emerald">{{ (analysis.breakdown?.quantifiableImpact?.metricsDetected || []).length }} detected</span>
            </div>
            <div class="metrics-list">
              <span v-for="m in (analysis.breakdown?.quantifiableImpact?.metricsDetected || [])" :key="m" class="metric-chip">
                {{ m }}
              </span>
              <span v-if="!(analysis.breakdown?.quantifiableImpact?.metricsDetected?.length)" class="no-metrics-msg">
                No percentages, dollar amounts, or numbers detected yet. Add metrics like "improved by 45%" to boost your ATS score.
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Right Column: Diagnostics, Target Job Matcher, & Open API -->
      <div class="workspace-card workspace-right glass-panel">
        <div class="pane-header">
          <div class="pane-tabs">
            <button 
              class="pane-tab" 
              :class="{ active: rightTab === 'feedback' }"
              @click="rightTab = 'feedback'"
            >
              💡 Actionable Fixes ({{ analysis.recommendations?.length || 0 }})
            </button>
            <button 
              class="pane-tab" 
              :class="{ active: rightTab === 'job' }"
              @click="rightTab = 'job'"
            >
              🎯 Target Job Matcher
            </button>
            <button 
              class="pane-tab" 
              :class="{ active: rightTab === 'api' }"
              @click="rightTab = 'api'"
            >
              ⚡ Free ATS API
            </button>
          </div>
        </div>

        <!-- TAB 1: Actionable Recommendations -->
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
            <div class="checkmark-circle">✓</div>
            <h4>Exceptional ATS Compliance!</h4>
            <p>Your resume satisfies all primary ATS parsing criteria with strong metrics, power verbs, and standard section demarcations.</p>
          </div>
        </div>

        <!-- TAB 2: Target Job Keyword Matcher (RE-ENGINEERED) -->
        <div v-else-if="rightTab === 'job'" class="tab-pane-body job-comparator-pane">
          <!-- Styled Selector Bar -->
          <div class="job-selector-group">
            <label class="comparator-label">
              <span>Compare against a live scraped job:</span>
              <span v-if="selectedTargetJob" class="selected-source-tag mono">{{ selectedTargetJob.platform }}</span>
            </label>
            <div class="custom-select-wrapper">
              <select v-model="selectedJobId" class="custom-select" @change="handleTargetJobChange">
                <option value="">-- Choose a live job posting to match keywords --</option>
                <option v-for="job in jobs" :key="job.id" :value="job.id">
                  {{ job.title }} @ {{ job.company }} ({{ job.platform }})
                </option>
              </select>
            </div>
          </div>

          <!-- Active Target Job Snapshot Card -->
          <div v-if="selectedTargetJob" class="target-job-snapshot glass-panel">
            <div class="snapshot-header">
              <div class="snapshot-title-group">
                <h4 class="snapshot-role">{{ selectedTargetJob.title }}</h4>
                <div class="snapshot-meta-row">
                  <span class="company-tag">{{ selectedTargetJob.company }}</span>
                  <span class="dot-sep">•</span>
                  <span class="location-tag">{{ selectedTargetJob.location }}</span>
                  <span class="dot-sep">•</span>
                  <span class="salary-tag mono">{{ selectedTargetJob.salary?.formatted || 'Competitive' }}</span>
                </div>
              </div>
              <span class="platform-badge mono">{{ selectedTargetJob.platform }}</span>
            </div>

            <!-- Match Score Progress Bar -->
            <div class="comparator-score-section">
              <div class="score-heading-row">
                <span class="score-title">Keyword & Role Overlap</span>
                <span class="score-percent mono" :class="(targetMatchScore >= 75) ? 'text-emerald' : 'text-amber'">
                  {{ targetMatchScore }}% Match
                </span>
              </div>
              <div class="match-progress-track">
                <div 
                  class="match-progress-fill" 
                  :class="(targetMatchScore >= 75) ? 'bg-emerald' : 'bg-amber'"
                  :style="{ width: `${targetMatchScore}%` }"
                ></div>
              </div>
            </div>

            <!-- Side-by-side Keywords Matrix -->
            <div class="keywords-matrix">
              <!-- Matched Keywords -->
              <div class="kw-col kw-matched-col">
                <div class="kw-col-header text-emerald">
                  <span class="col-icon">✓</span>
                  <span>Matched in Resume ({{ targetMatchedKeywords.length }})</span>
                </div>
                <div class="kw-chips-wrap">
                  <span v-for="kw in targetMatchedKeywords" :key="kw" class="kw-chip matched">
                    ✓ {{ kw }}
                  </span>
                  <span v-if="!targetMatchedKeywords.length" class="empty-kw-note">
                    No direct skill matches detected in this posting yet.
                  </span>
                </div>
              </div>

              <!-- Missing Critical Keywords -->
              <div class="kw-col kw-missing-col">
                <div class="kw-col-header text-rose">
                  <span class="col-icon">✕</span>
                  <span>Missing Critical Keywords ({{ targetMissingKeywords.length }})</span>
                </div>
                <div class="kw-chips-wrap">
                  <button 
                    v-for="kw in targetMissingKeywords" 
                    :key="kw" 
                    class="kw-chip missing add-kw-btn"
                    @click="addKeywordToResume(kw)"
                    title="Click to insert this skill into your resume"
                  >
                    <span class="plus-icon">+</span>
                    <span>{{ kw }}</span>
                  </button>
                  <span v-if="!targetMissingKeywords.length" class="empty-kw-note text-emerald">
                    ✓ Full keyword coverage! All required tags are present in your resume.
                  </span>
                </div>
                <p class="kw-help-hint">
                  💡 Click any missing keyword above to automatically insert it into your resume.
                </p>
              </div>
            </div>
          </div>

          <!-- Empty State when no job selected -->
          <div v-else class="empty-job-select glass-panel">
            <div class="empty-icon">🎯</div>
            <h4>Select a Job to Match Keywords</h4>
            <p>Pick any live scraped posting from the dropdown above to benchmark your resume keywords against its job description and required competencies.</p>
          </div>
        </div>

        <!-- TAB 3: Free Open API Playground -->
        <div v-else class="tab-pane-body api-pane">
          <div class="api-info-banner">
            <div class="api-tag">FREE & PUBLIC</div>
            <p>The JobPulse Node.js ATS Scoring & Parsing API requires zero authentication keys or subscriptions.</p>
          </div>

          <div class="api-code-block">
            <div class="code-hdr">
              <span class="mono">cURL Diagnostic Request</span>
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
              <span class="ep-desc">Full ATS score, breakdown & recommendations</span>
            </div>
            <div class="ep-row">
              <span class="http-badge post">POST</span>
              <span class="ep-path mono">/api/ats/parse</span>
              <span class="ep-desc">Extract name, email, skills from resume text</span>
            </div>
            <div class="ep-row">
              <span class="http-badge get">GET</span>
              <span class="ep-path mono">/api/ats/sample</span>
              <span class="ep-desc">Get benchmark 88/100 sample resume</span>
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
import { pdfParserService } from '../services/pdfParserService.js';

const props = defineProps({
  jobs: { type: Array, default: () => [] }
});

const emit = defineEmits(['resume-updated', 'show-toast']);

// UI State
const editorMode = ref('raw');
const rightTab = ref('job');
const resumeText = ref('');
const selectedJobId = ref('');
const copied = ref(false);
const isPdfLoading = ref(false);

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

const uploadedResume = computed(() => resumeService.getMasterResume());
const hasUploadedResume = computed(() => resumeService.hasUploadedResume(uploadedResume.value));

const parsedCandidate = ref(resumeService.getMasterResume() || {
  name: 'Alex Morgan',
  headline: 'Senior Full-Stack Engineer',
  skills: ['Vue 3', 'TypeScript', 'Vite', 'Node.js', 'Python', 'Docker', 'PostgreSQL']
});

// Selected Target Job Computed
const selectedTargetJob = computed(() => {
  if (!selectedJobId.value) return null;
  return props.jobs.find(j => j.id === selectedJobId.value) || null;
});

// Target Match Score & Keywords
const targetMatchScore = computed(() => {
  if (!selectedTargetJob.value) return 0;
  if (analysis.value?.jobMatchAnalysis?.matchPercentage) {
    return analysis.value.jobMatchAnalysis.matchPercentage;
  }
  const comp = resumeService.computeCompatibility(selectedTargetJob.value, {
    skills: parsedCandidate.value?.skills || [],
    yearsOfExperience: 4,
    headline: parsedCandidate.value?.headline || ''
  });
  return comp.overallScore || 0;
});

const targetMatchedKeywords = computed(() => {
  if (analysis.value?.jobMatchAnalysis?.matchedJobKeywords?.length) {
    return analysis.value.jobMatchAnalysis.matchedJobKeywords;
  }
  if (!selectedTargetJob.value) return [];
  const candidateSkills = (parsedCandidate.value?.skills || []).map(s => s.toLowerCase());
  return (selectedTargetJob.value.tags || []).filter(t => 
    candidateSkills.some(cs => cs === t.toLowerCase() || cs.includes(t.toLowerCase()) || t.toLowerCase().includes(cs))
  );
});

const targetMissingKeywords = computed(() => {
  if (analysis.value?.jobMatchAnalysis?.missingJobKeywords?.length) {
    return analysis.value.jobMatchAnalysis.missingJobKeywords;
  }
  if (!selectedTargetJob.value) return [];
  const matched = new Set(targetMatchedKeywords.value.map(k => k.toLowerCase()));
  return (selectedTargetJob.value.tags || []).filter(t => !matched.has(t.toLowerCase()));
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

  const targetJob = selectedTargetJob.value;
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

const addKeywordToResume = (keyword) => {
  if (!keyword) return;
  // Append to technical skills section or end of text
  if (resumeText.value.includes('TECHNICAL SKILLS')) {
    resumeText.value = resumeText.value.replace(
      /(TECHNICAL SKILLS\s*\n)([^\n]*)/i,
      `$1$2, ${keyword}`
    );
  } else {
    resumeText.value += `\n- Proficient in ${keyword}`;
  }

  emit('show-toast', `Added "${keyword}" to resume! Re-calculating ATS score...`);
  runAnalysis();
};

const handleFileUpload = async (event) => {
  const file = event.target.files?.[0];
  if (!file) return;

  // Real PDF parsing via Mozilla pdfjs-dist
  if (file.name.toLowerCase().endsWith('.pdf')) {
    isPdfLoading.value = true;
    try {
      const { text } = await pdfParserService.extractTextFromPdf(file);
      resumeText.value = text;
      await runAnalysis();
      emit('show-toast', `Parsed PDF: ${file.name}`);
    } catch (err) {
      emit('show-toast', `PDF error: ${err.message}`);
    } finally {
      isPdfLoading.value = false;
    }
    return;
  }

  // Text / Markdown file reading
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
  const updatedResume = resumeService.parseRawText(resumeText.value);
  resumeService.saveMasterResume(updatedResume);
  emit('resume-updated', updatedResume);
  emit('show-toast', 'Resume saved as Active Master Profile across JobPulse!');
};

const loadUploadedResume = async () => {
  const master = resumeService.getMasterResume();
  if (master && master.name) {
    parsedCandidate.value = master;
    if (master.rawText && master.rawText.trim().length > 30) {
      resumeText.value = master.rawText;
    } else {
      const parts = [
        master.name,
        master.headline || 'Senior Full Stack Developer',
        `Email: ${master.email || ''} | Phone: ${master.phone || ''} | Location: ${master.location || ''}`,
        ...(master.linkedin ? [`LinkedIn: ${master.linkedin}`] : []),
        ...(master.github ? [`GitHub: ${master.github}`] : []),
        '',
        'SUMMARY',
        master.summary || `${master.headline || 'Experienced software developer'} with proven track record architecting reactive web systems and scalable services.`,
        '',
        'TECHNICAL SKILLS',
        (master.skills || []).join(', ')
      ];

      if (master.experience && master.experience.length > 0) {
        parts.push('', 'PROFESSIONAL EXPERIENCE');
        for (const e of master.experience) {
          parts.push(`${e.role || 'Software Engineer'} | ${e.company || 'Tech Company'} (${e.period || 'Recent'})`);
          if (e.highlights && e.highlights.length) {
            for (const h of e.highlights) parts.push(`- ${h}`);
          }
        }
      }

      if (master.education && master.education.length > 0) {
        parts.push('', 'EDUCATION');
        for (const ed of master.education) {
          parts.push(`${ed.degree || 'Degree'} | ${ed.school || ''}`);
        }
      }

      resumeText.value = parts.join('\n');
    }

    await runAnalysis();
    emit('show-toast', `Loaded active profile: ${master.name}`);
  }
};

const copyCurlSnippet = () => {
  const snippet = `curl -X POST http://localhost:5173/api/ats/analyze \\\n  -H "Content-Type: application/json" \\\n  -d '{"resumeText": "Alex Morgan\\nSenior Vue Engineer..."}'`;
  navigator.clipboard?.writeText(snippet);
  copied.value = true;
  setTimeout(() => copied.value = false, 2500);
};

onMounted(async () => {
  // Pre-select first target job if available
  if (props.jobs && props.jobs.length > 0 && !selectedJobId.value) {
    selectedJobId.value = props.jobs[0].id;
  }

  const master = resumeService.getMasterResume();
  if (master && master.name) {
    await loadUploadedResume();
  } else {
    await loadSampleResume();
  }
});
</script>

<style scoped>
.ats-root {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  width: 100%;
}

/* Hero Section */
.ats-hero {
  padding: 1.75rem 2rem;
  border-radius: var(--radius-xl);
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 2rem;
  flex-wrap: wrap;
  background: linear-gradient(135deg, rgba(255, 255, 255, 0.04), rgba(56, 189, 248, 0.03));
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.3);
}

.hero-content-left {
  flex: 1;
  min-width: 320px;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.hero-badge-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.engine-badge-ats {
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.35);
  color: #34d399;
  font-size: 0.7rem;
  font-weight: 800;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full);
}

.api-status-badge {
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.25);
  color: #38bdf8;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full);
}

.pdf-loading-badge {
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.4);
  color: #fbbf24;
  font-size: 0.7rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full);
}

.ats-title {
  font-size: 1.65rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.02em;
}

.ats-subtitle {
  font-size: 0.88rem;
  color: var(--text-secondary);
  line-height: 1.5;
  max-width: 720px;
}

.hero-quick-actions {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  margin-top: 0.5rem;
}

.upload-btn {
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
}

.hidden-file-input {
  display: none;
}

.btn-save-master {
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.3);
}

/* Radial Gauge Card */
.ats-gauge-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.65rem;
  padding: 1.25rem 1.75rem;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
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

/* Metric Progress Cards */
.metric-cards-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(230px, 1fr));
  gap: 1rem;
}

.metric-card {
  padding: 1rem 1.15rem;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.07);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  background: rgba(255, 255, 255, 0.02);
}

.metric-card-top {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.metric-title-group {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.metric-name { font-size: 0.82rem; font-weight: 700; color: #f8fafc; }
.metric-score { font-size: 0.8rem; font-weight: 800; color: #38bdf8; }

.progress-bar-track {
  height: 5px;
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

/* Main Workspace Grid - Fully balanced & min-width safe */
.ats-workspace-grid {
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
  gap: 1.5rem;
  align-items: stretch;
}

@media (max-width: 1024px) {
  .ats-workspace-grid {
    grid-template-columns: 1fr;
  }
}

.workspace-card {
  display: flex;
  flex-direction: column;
  border-radius: var(--radius-xl);
  border: 1px solid rgba(255, 255, 255, 0.09);
  min-width: 0;
  width: 100%;
  overflow: hidden;
  background: rgba(15, 23, 42, 0.45);
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.35);
}

.pane-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.85rem 1.25rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
  background: rgba(0, 0, 0, 0.3);
  gap: 0.5rem;
  flex-wrap: wrap;
}

.pane-tabs {
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.pane-tab {
  background: transparent;
  border: none;
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-secondary);
  padding: 0.4rem 0.85rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.pane-tab:hover {
  color: #ffffff;
  background: rgba(255, 255, 255, 0.05);
}

.pane-tab.active {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.3);
}

.pane-status-pill {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.72rem;
  color: var(--text-muted);
  background: rgba(0, 0, 0, 0.35);
  padding: 0.2rem 0.55rem;
  border-radius: var(--radius-full);
}

.dot-live {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
}

/* Left Editor View */
.editor-wrap {
  display: flex;
  flex-direction: column;
  padding: 1rem;
  flex: 1;
  gap: 0.6rem;
}

.editor-top-meta {
  display: flex;
  align-items: center;
  gap: 1rem;
  font-size: 0.72rem;
  color: var(--text-muted);
}

.meta-tip {
  margin-left: auto;
  color: #34d399;
  font-size: 0.7rem;
}

.resume-textarea {
  width: 100%;
  min-height: 480px;
  flex: 1;
  background: rgba(0, 0, 0, 0.55);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  padding: 1.1rem;
  color: #f1f5f9;
  font-size: 0.86rem;
  line-height: 1.65;
  resize: vertical;
  outline: none;
  font-family: var(--font-mono);
  box-sizing: border-box;
}

.resume-textarea:focus {
  border-color: #38bdf8;
  box-shadow: 0 0 16px rgba(56, 189, 248, 0.25);
}

/* Left Preview Card */
.preview-wrap {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.4rem;
}

.candidate-summary-banner {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1.1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-lg);
}

.candidate-avatar {
  width: 52px;
  height: 52px;
  border-radius: 12px;
  background: linear-gradient(135deg, #0284c7, #0369a1);
  color: #ffffff;
  font-size: 1.25rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 4px 12px rgba(2, 132, 199, 0.35);
  flex-shrink: 0;
}

.candidate-name {
  font-size: 1.15rem;
  font-weight: 800;
  color: #ffffff;
}

.candidate-headline {
  font-size: 0.8rem;
  color: #38bdf8;
  font-weight: 600;
}

.candidate-meta-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  flex-wrap: wrap;
  margin-top: 0.3rem;
}

.meta-chip {
  font-size: 0.7rem;
  color: var(--text-secondary);
  background: rgba(255, 255, 255, 0.05);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.parsed-section {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.section-title-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.field-label {
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.badge-count {
  font-size: 0.72rem;
  color: var(--text-secondary);
}

.skills-cloud, .metrics-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.skill-tag {
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.25);
  color: #bae6fd;
  font-size: 0.75rem;
  font-weight: 600;
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
}

.metric-chip {
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #6ee7b7;
  font-size: 0.74rem;
  font-weight: 700;
  font-family: var(--font-mono);
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
}

.no-metrics-msg {
  font-size: 0.76rem;
  color: var(--text-muted);
  font-style: italic;
}

/* Right Pane: Recommendations */
.tab-pane-body {
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  flex: 1;
}

.recommendations-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.rec-item {
  padding: 1rem 1.15rem;
  border-radius: var(--radius-md);
  border-left: 4px solid;
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.rec-item.priority-high {
  border-color: #f43f5e;
  background: rgba(244, 63, 94, 0.06);
}

.rec-item.priority-medium {
  border-color: #f59e0b;
  background: rgba(245, 158, 11, 0.06);
}

.rec-item.priority-low {
  border-color: #38bdf8;
  background: rgba(56, 189, 248, 0.06);
}

.rec-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.rec-badge {
  font-size: 0.64rem;
  font-weight: 800;
  font-family: var(--font-mono);
}
.priority-high .rec-badge { color: #fda4af; }
.priority-medium .rec-badge { color: #fde68a; }
.priority-low .rec-badge { color: #bae6fd; }

.rec-cat {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.rec-tip {
  font-size: 0.8rem;
  color: #e2e8f0;
  line-height: 1.45;
}

.empty-recs {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 1.5rem;
  gap: 0.75rem;
}

.checkmark-circle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.35);
  color: #34d399;
  font-size: 1.5rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

/* Right Pane: Target Job Matcher (RE-ENGINEERED) */
.job-comparator-pane {
  gap: 1.2rem;
}

.job-selector-group {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.comparator-label {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.76rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.selected-source-tag {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  font-size: 0.7rem;
  padding: 0.1rem 0.45rem;
  border-radius: 4px;
}

.custom-select-wrapper {
  position: relative;
  width: 100%;
}

.custom-select {
  width: 100%;
  box-sizing: border-box;
  background: rgba(0, 0, 0, 0.5);
  border: 1px solid rgba(56, 189, 248, 0.35);
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  color: #ffffff;
  font-size: 0.84rem;
  font-weight: 600;
  outline: none;
  cursor: pointer;
  appearance: auto;
  transition: all var(--transition-fast);
}

.custom-select:focus {
  border-color: #38bdf8;
  box-shadow: 0 0 16px rgba(56, 189, 248, 0.25);
}

.target-job-snapshot {
  padding: 1.25rem;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.08);
  background: rgba(255, 255, 255, 0.02);
  display: flex;
  flex-direction: column;
  gap: 1.15rem;
}

.snapshot-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.snapshot-role {
  font-size: 1.05rem;
  font-weight: 800;
  color: #ffffff;
}

.snapshot-meta-row {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  font-size: 0.74rem;
  color: var(--text-secondary);
  flex-wrap: wrap;
  margin-top: 0.25rem;
}

.company-tag { color: #ffffff; font-weight: 700; }
.salary-tag { color: #34d399; font-weight: 700; }
.dot-sep { color: var(--text-muted); }

.platform-badge {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: var(--text-secondary);
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.comparator-score-section {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
  padding: 0.85rem 1rem;
  background: rgba(0, 0, 0, 0.3);
  border-radius: var(--radius-md);
}

.score-heading-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.score-title {
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-secondary);
}

.score-percent {
  font-size: 0.95rem;
  font-weight: 800;
}

.match-progress-track {
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.match-progress-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.6s ease;
}
.bg-emerald { background: #10b981; }
.bg-amber { background: #f59e0b; }

.keywords-matrix {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 600px) {
  .keywords-matrix {
    grid-template-columns: 1fr;
  }
}

.kw-col {
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
  background: rgba(0, 0, 0, 0.2);
  padding: 0.85rem;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.kw-col-header {
  display: flex;
  align-items: center;
  gap: 0.35rem;
  font-size: 0.74rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.kw-chips-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.kw-chip {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
}

.kw-chip.matched {
  background: rgba(16, 185, 129, 0.18);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #34d399;
}

.kw-chip.missing {
  background: rgba(244, 63, 94, 0.14);
  border: 1px solid rgba(244, 63, 94, 0.35);
  color: #fda4af;
}

.add-kw-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.add-kw-btn:hover {
  background: rgba(244, 63, 94, 0.28);
  border-color: #f43f5e;
  transform: translateY(-1px);
}

.plus-icon {
  font-weight: 800;
}

.empty-kw-note {
  font-size: 0.72rem;
  color: var(--text-muted);
  font-style: italic;
}

.kw-help-hint {
  font-size: 0.68rem;
  color: var(--text-muted);
  margin-top: 0.3rem;
  line-height: 1.35;
}

.empty-job-select {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
  padding: 3rem 1.5rem;
  gap: 0.75rem;
}

.empty-icon {
  font-size: 2.5rem;
}

/* API Pane */
.api-pane {
  gap: 1.25rem;
}

.api-info-banner {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  background: rgba(56, 189, 248, 0.1);
  border: 1px solid rgba(56, 189, 248, 0.25);
  padding: 0.85rem 1.15rem;
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  color: #e2e8f0;
}

.api-tag {
  background: #38bdf8;
  color: #0f172a;
  font-weight: 800;
  font-size: 0.68rem;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  flex-shrink: 0;
}

.api-code-block {
  background: rgba(0, 0, 0, 0.6);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
  overflow: hidden;
}

.code-hdr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 0.85rem;
  background: rgba(255, 255, 255, 0.04);
  border-bottom: 1px solid rgba(255, 255, 255, 0.06);
  font-size: 0.72rem;
  color: var(--text-muted);
}

.code-pre {
  padding: 0.85rem;
  font-size: 0.74rem;
  color: #38bdf8;
  line-height: 1.5;
  margin: 0;
  overflow-x: auto;
}

.api-endpoints-table {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.ep-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.65rem 0.85rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-sm);
  font-size: 0.76rem;
}

.http-badge {
  font-weight: 800;
  font-size: 0.65rem;
  padding: 0.15rem 0.45rem;
  border-radius: 3px;
}
.http-badge.post { background: rgba(16, 185, 129, 0.2); color: #34d399; }
.http-badge.get { background: rgba(56, 189, 248, 0.2); color: #38bdf8; }

.ep-path { color: #f8fafc; font-weight: 700; }
.ep-desc { color: var(--text-muted); margin-left: auto; }

.text-emerald { color: #34d399; }
.text-amber { color: #fbbf24; }
.text-rose { color: #fda4af; }
</style>
