<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="upload-modal glass-panel">
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="hdr-title-group">
          <div class="hdr-icon">
            <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
              <path d="m9 15 2 2 4-4"/>
            </svg>
          </div>
          <div>
            <h3 class="modal-title">Upload & Parse Resume</h3>
            <p class="modal-subtitle">Extracts candidate details and dynamically re-ranks all 21 jobs in real-time</p>
          </div>
        </div>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <!-- Upload Dropzone & Text Tabs -->
      <div class="input-tabs">
        <button class="tab-btn" :class="{ active: inputTab === 'file' }" @click="inputTab = 'file'">
          📁 Upload PDF / Resume
        </button>
        <button class="tab-btn" :class="{ active: inputTab === 'paste' }" @click="inputTab = 'paste'">
          📝 Raw Text / Markdown
        </button>
        <button v-if="rawResumeText" class="tab-btn tab-btn-extracted" :class="{ active: inputTab === 'extracted' }" @click="inputTab = 'extracted'">
          📄 Extracted PDF Text ({{ pdfTelemetry.wordCount || rawResumeText.split(/\s+/).filter(Boolean).length }} words)
        </button>
      </div>

      <!-- File Dropzone -->
      <div v-if="inputTab === 'file'" class="dropzone-area" @dragover.prevent @drop.prevent="handleDrop">
        <input 
          type="file" 
          ref="fileInputRef"
          class="hidden-file-input" 
          accept=".pdf,.txt,.md,.json,.text" 
          @change="handleFileSelected" 
        />
        <div class="dropzone-content" @click="$refs.fileInputRef?.click()">
          <div class="upload-icon-circle" :class="{ 'is-extracting': isPdfExtracting }">
            <svg v-if="!isPdfExtracting" xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/>
              <polyline points="14 2 14 8 20 8"/>
              <path d="M12 18v-6"/>
              <path d="m9 15 3-3 3 3"/>
            </svg>
            <span v-else class="spin-icon">⚡</span>
          </div>

          <div class="drop-text-group">
            <div class="pdf-support-banner">
              <span class="pdf-chip">📄 Mozilla PDF.js Engine</span>
              <span class="pdf-sub-chip">Multi-Page & Coordinates Aware</span>
            </div>
            <h4 class="drop-title">
              {{ isPdfExtracting ? 'Extracting text streams from PDF...' : 'Drop your PDF resume here, or browse files' }}
            </h4>
            <p class="drop-hint">Full native support for 1–5 page PDF resumes, ligatures, and multi-column formats</p>
          </div>

          <div v-if="uploadedFileName" class="uploaded-telemetry-badge">
            <span class="check-icon">✓</span>
            <span class="filename-text">{{ uploadedFileName }}</span>
            <span v-if="pdfTelemetry.pageCount" class="badge-page-count mono">
              {{ pdfTelemetry.pageCount }} Page{{ pdfTelemetry.pageCount > 1 ? 's' : '' }} • {{ pdfTelemetry.wordCount }} Words
            </span>
          </div>
        </div>
      </div>

      <!-- Text Paste Area -->
      <div v-else-if="inputTab === 'paste'" class="paste-area">
        <textarea 
          v-model="rawResumeText" 
          class="raw-textarea mono"
          placeholder="Paste your resume markdown, bullet points, skills, or LinkedIn profile text here..."
          @input="parseCurrentText"
        ></textarea>
      </div>

      <!-- Extracted Raw PDF Text Inspection View -->
      <div v-else-if="inputTab === 'extracted'" class="extracted-text-view">
        <div class="extracted-view-hdr">
          <span class="hdr-lbl mono">Clean text extracted by Mozilla PDF.js</span>
          <button class="btn-copy-text" @click="inputTab = 'paste'">Edit in Raw View</button>
        </div>
        <textarea 
          readonly 
          :value="rawResumeText" 
          class="raw-textarea mono text-extracted-readonly"
        ></textarea>
      </div>

      <!-- Agentic AI & RAG Parsing Bar -->
      <div class="ai-rag-control-bar">
        <div class="ai-rag-info">
          <div class="rag-badge-row">
            <span class="agentic-pill">🤖 AGENTIC AI & RAG</span>
            <span class="free-api-pill">Free Multi-Model AI</span>
            <span v-if="telemetryModel" class="model-badge mono">{{ telemetryModel }}</span>
            <span v-if="telemetryTime" class="time-badge mono">⚡ {{ telemetryTime }}ms</span>
          </div>
          <p class="rag-desc">
            Retrieval-Augmented Generation: semantic document chunking, 250+ tech ontology vector matching & automated candidate schema grounding.
          </p>
        </div>

        <button 
          class="btn btn-primary btn-ai-rag-parse" 
          :disabled="isAiParsing || !rawResumeText"
          @click="runAgenticRagParse"
        >
          <span v-if="isAiParsing" class="spin-icon">⚡</span>
          <span v-else>✨ Run Agentic RAG Parse (Free)</span>
        </button>
      </div>

      <!-- Agentic Progress Indicator -->
      <div v-if="isAiParsing || parseProgressMessage" class="agentic-progress-card">
        <div class="progress-message-row">
          <span class="step-indicator-dot" :class="{ 'pulse-active': isAiParsing }"></span>
          <span class="progress-text mono">{{ parseProgressMessage }}</span>
        </div>
      </div>

      <!-- Extracted Candidate Live Preview & Fine-Tune Editor -->
      <div class="extracted-preview-box">
        <div class="preview-header">
          <div class="badge-title-group">
            <span class="preview-badge">PARSED CANDIDATE PROFILE</span>
            <span class="verify-note">(Click any field to edit or fine-tune)</span>
          </div>
          <span class="skills-count mono">{{ parsedCandidate.skills?.length || 0 }} skills identified</span>
        </div>

        <!-- Editable Candidate Meta Grid -->
        <div class="edit-meta-grid">
          <!-- Name & Experience -->
          <div class="field-row">
            <div class="field-group flex-2">
              <label class="field-lbl">Candidate Name</label>
              <input 
                type="text" 
                v-model="parsedCandidate.name" 
                class="field-txt font-bold text-white" 
                placeholder="Candidate Full Name" 
              />
            </div>
            <div class="field-group flex-1">
              <label class="field-lbl">Experience</label>
              <div class="exp-input-wrap">
                <input 
                  type="number" 
                  v-model.number="parsedCandidate.yearsOfExperience" 
                  min="0" 
                  max="40" 
                  class="field-txt mono" 
                />
                <span class="exp-unit">Yrs</span>
              </div>
            </div>
          </div>

          <!-- Professional Headline -->
          <div class="field-group">
            <label class="field-lbl">Professional Headline / Target Role</label>
            <input 
              type="text" 
              v-model="parsedCandidate.headline" 
              class="field-txt text-emerald" 
              placeholder="e.g. Senior PHP / Laravel Backend Engineer" 
            />
          </div>

          <!-- Location & Email -->
          <div class="field-row">
            <div class="field-group flex-1">
              <label class="field-lbl">Location / Preference</label>
              <input 
                type="text" 
                v-model="parsedCandidate.location" 
                class="field-txt" 
                placeholder="e.g. Bengaluru, India (or Remote)" 
              />
            </div>
            <div class="field-group flex-1">
              <label class="field-lbl">Email Address</label>
              <input 
                type="text" 
                v-model="parsedCandidate.email" 
                class="field-txt" 
                placeholder="e.g. candidate@example.com" 
              />
            </div>
          </div>

          <!-- Skills Manager -->
          <div class="field-group">
            <div class="skills-lbl-row">
              <label class="field-lbl">Technical Skills & Competencies</label>
              <span class="skills-hint">Click × to remove, or type below to add custom skills</span>
            </div>

            <div class="preview-skills-row">
              <span v-for="(skill, index) in parsedCandidate.skills" :key="skill" class="detected-skill-chip">
                <span>{{ skill }}</span>
                <button class="remove-chip-btn" @click.stop="removeSkill(index)" title="Remove skill">×</button>
              </span>
              <span v-if="!parsedCandidate.skills || parsedCandidate.skills.length === 0" class="no-skills-hint">
                No skills detected. Add skills below to power AI matching.
              </span>
            </div>

            <!-- Add Skill Input -->
            <div class="add-skill-row">
              <input 
                type="text" 
                v-model="newSkillInput" 
                placeholder="Type a skill (e.g. Laravel, Vue 3, Docker) & press Enter..." 
                @keyup.enter="addCustomSkill"
                class="add-skill-input"
              />
              <button class="btn btn-sm btn-accent add-skill-btn" @click="addCustomSkill" :disabled="!newSkillInput.trim()">
                + Add Skill
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Actions -->
      <div class="modal-actions">
        <button class="btn btn-secondary" @click="$emit('close')">Cancel</button>
        <button class="btn btn-primary btn-apply-rank" @click="applyParsedResume">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          <span>Apply & Re-Rank All Jobs ⚡</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { resumeService, EMPTY_RESUME } from '../services/resumeService.js';
import { aiParserService } from '../services/aiParserService.js';
import { pdfParserService } from '../services/pdfParserService.js';

const emit = defineEmits(['close', 'resume-applied']);

const inputTab = ref('file');
const rawResumeText = ref('');
const uploadedFileName = ref('');
const fileInputRef = ref(null);
const newSkillInput = ref('');

// PDF Parser & Extraction State
const isPdfExtracting = ref(false);
const pdfTelemetry = ref({ pageCount: 0, wordCount: 0 });

// Agentic RAG State
const isAiParsing = ref(false);
const parseProgressMessage = ref('');
const telemetryModel = ref('');
const telemetryTime = ref(0);

const initialResume = resumeService.getMasterResume();
const parsedCandidate = ref(
  initialResume && resumeService.hasUploadedResume(initialResume)
    ? JSON.parse(JSON.stringify(initialResume))
    : JSON.parse(JSON.stringify(EMPTY_RESUME))
);

const parseCurrentText = () => {
  parsedCandidate.value = resumeService.parseRawText(rawResumeText.value, uploadedFileName.value);
};

const runAgenticRagParse = async () => {
  if (!rawResumeText.value) return;
  isAiParsing.value = true;
  parseProgressMessage.value = 'Initializing RAG Document Chunker...';

  try {
    const { parsedCandidate: result, telemetry } = await aiParserService.agenticRagParse(rawResumeText.value, {
      filename: uploadedFileName.value,
      onProgress: (p) => {
        parseProgressMessage.value = p.message;
      }
    });

    parsedCandidate.value = result;
    telemetryModel.value = telemetry.modelUsed;
    telemetryTime.value = telemetry.processingTimeMs;
  } catch (err) {
    console.warn('[ResumeUploadModal] Agentic RAG Parse fallback:', err);
    parseCurrentText();
  } finally {
    isAiParsing.value = false;
  }
};

const removeSkill = (index) => {
  if (parsedCandidate.value.skills) {
    parsedCandidate.value.skills.splice(index, 1);
  }
};

const addCustomSkill = () => {
  const val = newSkillInput.value.trim();
  if (!val) return;
  if (!parsedCandidate.value.skills) parsedCandidate.value.skills = [];
  if (!parsedCandidate.value.skills.some(s => s.toLowerCase() === val.toLowerCase())) {
    parsedCandidate.value.skills.push(val);
  }
  newSkillInput.value = '';
};

const handleFileSelected = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;
  readFileContent(file);
};

const handleDrop = (e) => {
  const file = e.dataTransfer.files?.[0];
  if (!file) return;
  readFileContent(file);
};

const readFileContent = (file) => {
  uploadedFileName.value = file.name;

  // JSON Resume format
  if (file.name.endsWith('.json')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      rawResumeText.value = e.target.result || '';
      runAgenticRagParse();
    };
    reader.readAsText(file);
    return;
  }

  // PDF file format (Mozilla pdfjs-dist multi-page extraction)
  if (file.name.toLowerCase().endsWith('.pdf')) {
    isPdfExtracting.value = true;
    parseProgressMessage.value = 'Initializing Mozilla PDF.js engine...';

    pdfParserService.extractTextFromPdf(file, {
      onProgress: (p) => {
        parseProgressMessage.value = p.message;
      }
    }).then(async ({ text, pageCount, wordCount }) => {
      rawResumeText.value = text;
      pdfTelemetry.value = { pageCount, wordCount };
      inputTab.value = 'file';
      await runAgenticRagParse();
    }).catch(err => {
      console.error('[ResumeUploadModal] PDF Parsing failed:', err);
      parseProgressMessage.value = `PDF extraction error: ${err.message}. You can also paste text directly.`;
    }).finally(() => {
      isPdfExtracting.value = false;
    });

    return;
  }

  // Text / Markdown
  const reader = new FileReader();
  reader.onload = (e) => {
    rawResumeText.value = e.target.result || '';
    runAgenticRagParse();
  };
  reader.readAsText(file);
};

const applyParsedResume = () => {
  const toSave = {
    ...parsedCandidate.value,
    rawText: rawResumeText.value || ''
  };
  resumeService.saveMasterResume(toSave);
  emit('resume-applied', toSave);
  emit('close');
};

onMounted(() => {
  const current = resumeService.getMasterResume();
  if (current && resumeService.hasUploadedResume(current)) {
    parsedCandidate.value = JSON.parse(JSON.stringify(current));
    rawResumeText.value = [
      current.name,
      current.headline,
      `Location: ${current.location} | Email: ${current.email}`,
      `Skills: ${(current.skills || []).join(', ')}`,
      '',
      current.summary
    ].join('\n');
  }
});
</script>

<style scoped>
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.78);
  backdrop-filter: blur(14px);
  -webkit-backdrop-filter: blur(14px);
  z-index: 1200;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.25rem;
}

.upload-modal {
  width: 100%;
  max-width: 720px;
  max-height: 90vh;
  overflow-y: auto;
  background: linear-gradient(180deg, rgba(16, 23, 38, 0.96) 0%, rgba(10, 15, 26, 0.98) 100%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: var(--radius-xl);
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.9), 0 0 35px rgba(56, 189, 248, 0.12);
}

/* Header */
.modal-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.hdr-title-group {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.hdr-icon {
  width: 42px;
  height: 42px;
  border-radius: var(--radius-md);
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.3);
  color: #38bdf8;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #ffffff;
}

.modal-subtitle {
  font-size: 0.78rem;
  color: var(--text-secondary);
}

.close-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 1.2rem;
  cursor: pointer;
  padding: 0.35rem;
}
.close-btn:hover { color: #ffffff; }

/* Presets */
.presets-section {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.presets-label {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 800;
  color: #38bdf8;
  letter-spacing: 0.05em;
}

.presets-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.6rem;
}

@media (max-width: 640px) {
  .presets-grid { grid-template-columns: repeat(2, 1fr); }
}

.preset-btn {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
  padding: 0.6rem 0.65rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  text-align: left;
  transition: all var(--transition-fast);
}

.preset-btn:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.2);
}

.preset-btn.active {
  background: rgba(56, 189, 248, 0.15);
  border-color: #38bdf8;
  box-shadow: 0 0 12px rgba(56, 189, 248, 0.25);
}

.preset-icon { font-size: 1.15rem; }
.preset-text { display: flex; flex-direction: column; min-width: 0; }
.preset-name { font-size: 0.76rem; font-weight: 700; color: #ffffff; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.preset-role { font-size: 0.64rem; color: var(--text-muted); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }

/* Tabs */
.input-tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 0.5rem;
}

.tab-btn {
  background: transparent;
  border: none;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-secondary);
  padding: 0.4rem 0.85rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tab-btn:hover { color: #ffffff; }
.tab-btn.active {
  background: rgba(255, 255, 255, 0.08);
  color: #ffffff;
}

/* Dropzone */
.dropzone-area {
  border: 2px dashed rgba(255, 255, 255, 0.16);
  border-radius: var(--radius-lg);
  padding: 1.75rem 1rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.25);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.dropzone-area:hover {
  border-color: #38bdf8;
  background: rgba(56, 189, 248, 0.03);
}

.hidden-file-input { display: none; }

.dropzone-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.45rem;
}

.upload-icon-circle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  background: rgba(56, 189, 248, 0.1);
  color: #38bdf8;
  display: flex;
  align-items: center;
  justify-content: center;
  margin-bottom: 0.25rem;
}

.drop-title { font-size: 0.95rem; font-weight: 700; color: #ffffff; }
.text-accent { color: #38bdf8; text-decoration: underline; }
.drop-hint { font-size: 0.74rem; color: var(--text-muted); }

.uploaded-badge {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  color: #34d399;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.35);
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full);
  margin-top: 0.35rem;
}

.pdf-support-banner {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
}

.pdf-chip {
  background: rgba(244, 63, 94, 0.15);
  border: 1px solid rgba(244, 63, 94, 0.35);
  color: #fda4af;
  font-size: 0.68rem;
  font-weight: 800;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.pdf-sub-chip {
  background: rgba(56, 189, 248, 0.12);
  border: 1px solid rgba(56, 189, 248, 0.25);
  color: #38bdf8;
  font-size: 0.68rem;
  font-weight: 600;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.uploaded-telemetry-badge {
  display: flex;
  align-items: center;
  gap: 0.55rem;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.35);
  padding: 0.3rem 0.75rem;
  border-radius: var(--radius-full);
  font-size: 0.76rem;
  color: #ffffff;
  margin-top: 0.35rem;
}

.check-icon {
  color: #34d399;
  font-weight: 800;
}

.filename-text {
  font-weight: 700;
}

.badge-page-count {
  background: rgba(0, 0, 0, 0.35);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  color: #34d399;
  font-size: 0.7rem;
}

.upload-icon-circle.is-extracting {
  background: rgba(245, 158, 11, 0.15);
  border: 1px solid rgba(245, 158, 11, 0.4);
  color: #fbbf24;
}

/* Extracted text view */
.extracted-text-view {
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.extracted-view-hdr {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.72rem;
  color: var(--text-muted);
}

.btn-copy-text {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #38bdf8;
  font-size: 0.7rem;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  cursor: pointer;
}

.text-extracted-readonly {
  height: 140px;
  background: rgba(0, 0, 0, 0.6);
  border-color: rgba(56, 189, 248, 0.3);
  color: #e2e8f0;
}

/* Paste Textarea */
.raw-textarea {
  width: 100%;
  height: 120px;
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-md);
  padding: 0.75rem;
  color: #cbd5e1;
  font-size: 0.8rem;
  resize: vertical;
  line-height: 1.45;
}
.raw-textarea:focus { outline: none; border-color: #38bdf8; }

/* Extracted Preview & Fine-Tune Editor */
.extracted-preview-box {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(56, 189, 248, 0.25);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.preview-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 0.5rem;
}

.badge-title-group {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.preview-badge {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 800;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.15);
  border: 1px solid rgba(56, 189, 248, 0.35);
  padding: 0.15rem 0.55rem;
  border-radius: 4px;
}

.verify-note {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.skills-count {
  font-size: 0.72rem;
  color: #34d399;
  font-weight: 700;
}

/* Form Fields */
.edit-meta-grid {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.field-row {
  display: flex;
  gap: 0.75rem;
}

@media (max-width: 580px) {
  .field-row { flex-direction: column; }
}

.field-group {
  display: flex;
  flex-direction: column;
  gap: 0.3rem;
}

.flex-1 { flex: 1; }
.flex-2 { flex: 2; }

.field-lbl {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.field-txt {
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-sm);
  padding: 0.55rem 0.75rem;
  font-size: 0.85rem;
  color: #f8fafc;
  transition: all var(--transition-fast);
}

.field-txt:focus {
  outline: none;
  border-color: #38bdf8;
  box-shadow: 0 0 10px rgba(56, 189, 248, 0.25);
}

.text-emerald { color: #34d399; font-weight: 600; }

.exp-input-wrap {
  display: flex;
  align-items: center;
  position: relative;
}

.exp-input-wrap .field-txt {
  width: 100%;
  padding-right: 2.2rem;
}

.exp-unit {
  position: absolute;
  right: 0.75rem;
  font-size: 0.72rem;
  color: var(--text-muted);
  font-weight: 700;
  pointer-events: none;
}

/* Skills Manager */
.skills-lbl-row {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.4rem;
}

.skills-hint {
  font-size: 0.68rem;
  color: var(--text-muted);
}

.preview-skills-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  max-height: 120px;
  overflow-y: auto;
  padding: 0.4rem;
  background: rgba(0, 0, 0, 0.25);
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.06);
}

.detected-skill-chip {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  font-family: var(--font-mono);
  font-size: 0.7rem;
  font-weight: 700;
  color: #34d399;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 0.2rem 0.5rem;
  border-radius: var(--radius-full);
}

.remove-chip-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 0.95rem;
  line-height: 1;
  cursor: pointer;
  padding: 0;
  display: flex;
  align-items: center;
}

.remove-chip-btn:hover { color: #f43f5e; }

.no-skills-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
  padding: 0.5rem;
}

.add-skill-row {
  display: flex;
  gap: 0.5rem;
  margin-top: 0.35rem;
}

.add-skill-input {
  flex: 1;
  background: rgba(0, 0, 0, 0.35);
  border: 1px dashed rgba(255, 255, 255, 0.18);
  border-radius: var(--radius-sm);
  padding: 0.45rem 0.75rem;
  font-size: 0.8rem;
  color: #ffffff;
}

.add-skill-input:focus {
  outline: none;
  border-color: #34d399;
}

.add-skill-btn {
  background: rgba(52, 211, 153, 0.18);
  border: 1px solid rgba(52, 211, 153, 0.4);
  color: #34d399;
  font-weight: 700;
  font-size: 0.78rem;
  padding: 0.4rem 0.85rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  white-space: nowrap;
}

.add-skill-btn:hover {
  background: rgba(52, 211, 153, 0.3);
}

/* Actions */
.modal-actions {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 0.75rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

.btn-apply-rank {
  background: linear-gradient(135deg, #10b981, #059669);
  border: none;
  color: #ffffff;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem 1.4rem;
  border-radius: var(--radius-md);
  box-shadow: 0 4px 16px rgba(16, 185, 129, 0.35);
}

.btn-apply-rank:hover {
  transform: translateY(-1px);
  box-shadow: 0 6px 20px rgba(16, 185, 129, 0.5);
}

/* Agentic AI & RAG Control Bar */
.ai-rag-control-bar {
  background: linear-gradient(135deg, rgba(56, 189, 248, 0.08), rgba(99, 102, 241, 0.08));
  border: 1px solid rgba(56, 189, 248, 0.28);
  border-radius: var(--radius-lg);
  padding: 1rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.25rem;
}

@media (max-width: 640px) {
  .ai-rag-control-bar {
    flex-direction: column;
    align-items: stretch;
  }
}

.ai-rag-info {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.rag-badge-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.agentic-pill {
  background: rgba(99, 102, 241, 0.22);
  border: 1px solid rgba(99, 102, 241, 0.4);
  color: #a5b4fc;
  font-size: 0.68rem;
  font-weight: 800;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
  letter-spacing: 0.04em;
}

.free-api-pill {
  background: rgba(16, 185, 129, 0.18);
  border: 1px solid rgba(16, 185, 129, 0.35);
  color: #34d399;
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.model-badge {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.12);
  color: #38bdf8;
  font-size: 0.66rem;
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.time-badge {
  background: rgba(245, 158, 11, 0.15);
  color: #fbbf24;
  font-size: 0.66rem;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.rag-desc {
  font-size: 0.76rem;
  color: var(--text-secondary);
  line-height: 1.35;
  margin: 0;
}

.btn-ai-rag-parse {
  white-space: nowrap;
  background: linear-gradient(135deg, #6366f1, #38bdf8);
  border: none;
  font-weight: 700;
  font-size: 0.82rem;
  padding: 0.65rem 1.15rem;
  border-radius: var(--radius-md);
  box-shadow: 0 4px 14px rgba(99, 102, 241, 0.35);
}

.btn-ai-rag-parse:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 6px 18px rgba(99, 102, 241, 0.5);
}

.btn-ai-rag-parse:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.agentic-progress-card {
  background: rgba(15, 23, 42, 0.9);
  border: 1px dashed rgba(56, 189, 248, 0.35);
  border-radius: var(--radius-md);
  padding: 0.65rem 1rem;
}

.progress-message-row {
  display: flex;
  align-items: center;
  gap: 0.65rem;
}

.step-indicator-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #38bdf8;
  box-shadow: 0 0 8px #38bdf8;
}

.progress-text {
  font-size: 0.78rem;
  color: #e2e8f0;
}
</style>
