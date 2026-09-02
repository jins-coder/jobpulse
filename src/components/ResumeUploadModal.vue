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
            <p class="modal-subtitle">Re-ranks all jobs and updates your AI match radar in real-time</p>
          </div>
        </div>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <!-- Quick Test Presets -->
      <div class="presets-section">
        <span class="presets-label">⚡ TEST DRIVE PRESET RESUMES:</span>
        <div class="presets-grid">
          <button 
            v-for="(p, key) in presets" 
            :key="key" 
            class="preset-btn"
            :class="{ active: selectedPreset === key }"
            @click="loadPreset(key)"
          >
            <span class="preset-icon">{{ p.icon }}</span>
            <div class="preset-text">
              <span class="preset-name">{{ p.data.name }}</span>
              <span class="preset-role">{{ p.role }}</span>
            </div>
          </button>
        </div>
      </div>

      <!-- Upload Dropzone & Text Tabs -->
      <div class="input-tabs">
        <button class="tab-btn" :class="{ active: inputTab === 'file' }" @click="inputTab = 'file'">
          📁 Upload File (.pdf, .txt, .md, .json)
        </button>
        <button class="tab-btn" :class="{ active: inputTab === 'paste' }" @click="inputTab = 'paste'">
          📝 Paste Raw Text
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
          <div class="upload-icon-circle">
            <svg xmlns="http://www.w3.org/2000/svg" width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
              <polyline points="17 8 12 3 7 8"/>
              <line x1="12" y1="3" x2="12" y2="15"/>
            </svg>
          </div>
          <h4 class="drop-title">Drop your resume file here, or <span class="text-accent">browse</span></h4>
          <p class="drop-hint">Supports PDF, Markdown, Text, or JSON resume formats</p>
          <span v-if="uploadedFileName" class="uploaded-badge">
            ✓ Selected: {{ uploadedFileName }}
          </span>
        </div>
      </div>

      <!-- Text Paste Area -->
      <div v-else class="paste-area">
        <textarea 
          v-model="rawResumeText" 
          class="raw-textarea mono"
          placeholder="Paste your resume markdown, bullet points, skills, or LinkedIn text here..."
          @input="parseCurrentText"
        ></textarea>
      </div>

      <!-- Extracted Candidate Live Preview -->
      <div class="extracted-preview-box">
        <div class="preview-header">
          <span class="preview-badge">PARSED CANDIDATE PROFILE</span>
          <span class="skills-count mono">{{ parsedCandidate.skills?.length || 0 }} skills identified</span>
        </div>

        <div class="preview-candidate-row">
          <div class="preview-avatar">
            {{ (parsedCandidate.name || 'CP').slice(0, 2).toUpperCase() }}
          </div>
          <div class="preview-meta">
            <div class="preview-name-row">
              <strong class="preview-name">{{ parsedCandidate.name }}</strong>
              <span class="preview-exp-badge mono">{{ parsedCandidate.yearsOfExperience }}+ Yrs Exp</span>
            </div>
            <span class="preview-headline">{{ parsedCandidate.headline }}</span>
            <span class="preview-loc">{{ parsedCandidate.location }}</span>
          </div>
        </div>

        <div class="preview-skills-row">
          <span v-for="skill in parsedCandidate.skills" :key="skill" class="detected-skill-chip">
            {{ skill }}
          </span>
          <span v-if="!parsedCandidate.skills || parsedCandidate.skills.length === 0" class="no-skills-hint">
            No technical skills detected yet. Type or paste skills above.
          </span>
        </div>
      </div>

      <!-- Modal Actions -->
      <div class="modal-actions">
        <button class="btn btn-secondary" @click="$emit('close')">Cancel</button>
        <button class="btn btn-primary btn-apply-rank" @click="applyParsedResume">
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/>
          </svg>
          <span>Apply & Re-Rank All Jobs</span>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { resumeService, PRESET_RESUMES } from '../services/resumeService.js';

const emit = defineEmits(['close', 'resume-applied']);

const inputTab = ref('file');
const rawResumeText = ref('');
const uploadedFileName = ref('');
const selectedPreset = ref(null);
const fileInputRef = ref(null);

const presets = {
  php: { role: 'PHP / Laravel Specialist', icon: '🐘', data: PRESET_RESUMES.php },
  vue: { role: 'Vue 3 & Frontend Architect', icon: '💎', data: PRESET_RESUMES.vue },
  python: { role: 'Python / Data Automation', icon: '🐍', data: PRESET_RESUMES.python },
  wordpress: { role: 'WordPress & Modern PHP', icon: '🌐', data: PRESET_RESUMES.wordpress }
};

const parsedCandidate = ref({ ...PRESET_RESUMES.vue });

const loadPreset = (key) => {
  selectedPreset.value = key;
  const preset = presets[key]?.data;
  if (!preset) return;

  parsedCandidate.value = JSON.parse(JSON.stringify(preset));

  // Serialize into text
  rawResumeText.value = [
    preset.name,
    preset.headline,
    `Location: ${preset.location} | Email: ${preset.email} | Phone: ${preset.phone}`,
    `${preset.yearsOfExperience}+ years of experience in modern software engineering`,
    '',
    'SUMMARY',
    preset.summary,
    '',
    'SKILLS',
    (preset.skills || []).join(', ')
  ].join('\n');

  uploadedFileName.value = `${preset.name.replace(/\s+/g, '_')}_Resume.md`;
};

const parseCurrentText = () => {
  selectedPreset.value = null;
  parsedCandidate.value = resumeService.parseRawText(rawResumeText.value);
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
  const reader = new FileReader();

  reader.onload = (e) => {
    let content = e.target.result || '';
    rawResumeText.value = content;
    parseCurrentText();
  };

  reader.readAsText(file);
};

const applyParsedResume = () => {
  resumeService.saveMasterResume(parsedCandidate.value);
  emit('resume-applied', parsedCandidate.value);
  emit('close');
};

onMounted(() => {
  const current = resumeService.getMasterResume();
  if (current) {
    parsedCandidate.value = current;
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
  max-width: 680px;
  background: linear-gradient(180deg, rgba(16, 23, 38, 0.96) 0%, rgba(10, 15, 26, 0.98) 100%);
  border: 1px solid rgba(255, 255, 255, 0.14);
  border-radius: var(--radius-xl);
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: 0 25px 65px rgba(0, 0, 0, 0.85), 0 0 50px rgba(16, 185, 129, 0.1);
  max-height: 90vh;
  overflow-y: auto;
}

.modal-header {
  display: flex;
  align-items: flex-start;
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
  background: linear-gradient(135deg, #10b981, #059669);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
  box-shadow: 0 0 15px rgba(16, 185, 129, 0.35);
}

.modal-title {
  font-size: 1.25rem;
  font-weight: 800;
  color: #f8fafc;
}

.modal-subtitle {
  font-size: 0.78rem;
  color: var(--text-muted);
}

.close-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
  border-radius: var(--radius-full);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all var(--transition-fast);
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.15);
  color: #ffffff;
}

/* Presets Section */
.presets-section {
  display: flex;
  flex-direction: column;
  gap: 0.45rem;
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
  grid-template-columns: repeat(2, 1fr);
  gap: 0.5rem;
}

@media (max-width: 600px) {
  .presets-grid { grid-template-columns: 1fr; }
}

.preset-btn {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
  padding: 0.5rem 0.75rem;
  display: flex;
  align-items: center;
  gap: 0.65rem;
  cursor: pointer;
  text-align: left;
  transition: all var(--transition-fast);
}

.preset-btn:hover {
  background: rgba(56, 189, 248, 0.08);
  border-color: rgba(56, 189, 248, 0.3);
}

.preset-btn.active {
  background: rgba(16, 185, 129, 0.14);
  border-color: #10b981;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.2);
}

.preset-icon { font-size: 1.25rem; }

.preset-text {
  display: flex;
  flex-direction: column;
  line-height: 1.2;
}

.preset-name { font-size: 0.8rem; font-weight: 700; color: #f8fafc; }
.preset-role { font-size: 0.68rem; color: var(--text-muted); }

/* Tabs */
.input-tabs {
  display: flex;
  gap: 0.5rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 0.4rem;
}

.tab-btn {
  background: transparent;
  border: none;
  font-size: 0.8rem;
  font-weight: 700;
  color: var(--text-secondary);
  padding: 0.35rem 0.65rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tab-btn.active {
  background: rgba(255, 255, 255, 0.09);
  color: #38bdf8;
}

/* Dropzone */
.dropzone-area {
  border: 2px dashed rgba(56, 189, 248, 0.35);
  border-radius: var(--radius-lg);
  padding: 1.75rem 1rem;
  text-align: center;
  background: rgba(0, 0, 0, 0.3);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.dropzone-area:hover {
  border-color: #38bdf8;
  background: rgba(56, 189, 248, 0.04);
}

.hidden-file-input { display: none; }

.upload-icon-circle {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: rgba(56, 189, 248, 0.12);
  color: #38bdf8;
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 0 auto 0.75rem;
}

.drop-title {
  font-size: 0.95rem;
  font-weight: 700;
  color: #f8fafc;
}

.text-accent { color: #38bdf8; text-decoration: underline; }
.drop-hint { font-size: 0.75rem; color: var(--text-muted); margin-top: 0.25rem; }

.uploaded-badge {
  display: inline-block;
  margin-top: 0.65rem;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 700;
  color: #34d399;
  background: rgba(16, 185, 129, 0.15);
  border: 1px solid rgba(16, 185, 129, 0.35);
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full);
}

/* Paste Area */
.raw-textarea {
  width: 100%;
  height: 140px;
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  padding: 0.75rem;
  color: #f1f5f9;
  font-size: 0.8rem;
  line-height: 1.5;
  resize: vertical;
  outline: none;
}

.raw-textarea:focus {
  border-color: #38bdf8;
  box-shadow: 0 0 10px rgba(56, 189, 248, 0.25);
}

/* Extracted Preview */
.extracted-preview-box {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
  padding: 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.preview-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.preview-badge {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 800;
  color: #34d399;
  letter-spacing: 0.05em;
}

.skills-count {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.preview-candidate-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.preview-avatar {
  width: 44px;
  height: 44px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, #10b981, #06b6d4);
  color: #ffffff;
  font-size: 1.1rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
}

.preview-meta {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}

.preview-name-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.preview-name {
  font-size: 1.05rem;
  color: #f8fafc;
}

.preview-exp-badge {
  font-size: 0.65rem;
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
  padding: 0.1rem 0.4rem;
  border-radius: 4px;
  font-weight: 700;
}

.preview-headline {
  font-size: 0.78rem;
  color: #cbd5e1;
}

.preview-loc {
  font-size: 0.7rem;
  color: var(--text-muted);
}

.preview-skills-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.35rem;
}

.detected-skill-chip {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  background: rgba(16, 185, 129, 0.12);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.25);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.no-skills-hint {
  font-size: 0.75rem;
  color: var(--text-muted);
  font-style: italic;
}

/* Actions */
.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 0.75rem;
  margin-top: 0.5rem;
}

.btn-apply-rank {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  font-weight: 700;
  padding: 0.6rem 1.25rem;
  gap: 0.5rem;
}
</style>
