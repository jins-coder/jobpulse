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

      <!-- Quick Test Presets -->
      <div class="presets-section">
        <span class="presets-label">⚡ 1-CLICK TEST DRIVE PRESETS:</span>
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
          📝 Paste Raw Text / Markdown
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
          <p class="drop-hint">Supports PDF, Markdown, Text, or JSON resume files</p>
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
          placeholder="Paste your resume markdown, bullet points, skills, or LinkedIn profile text here..."
          @input="parseCurrentText"
        ></textarea>
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
import { resumeService, PRESET_RESUMES } from '../services/resumeService.js';

const emit = defineEmits(['close', 'resume-applied']);

const inputTab = ref('file');
const rawResumeText = ref('');
const uploadedFileName = ref('');
const selectedPreset = ref(null);
const fileInputRef = ref(null);
const newSkillInput = ref('');

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
  parsedCandidate.value = resumeService.parseRawText(rawResumeText.value, uploadedFileName.value);
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
      parseCurrentText();
    };
    reader.readAsText(file);
    return;
  }

  // PDF file format (extract clean ASCII text strings from stream)
  if (file.name.endsWith('.pdf')) {
    const reader = new FileReader();
    reader.onload = (e) => {
      const buffer = e.target.result;
      const uint8 = new Uint8Array(buffer);
      let text = '';
      for (let i = 0; i < uint8.length; i++) {
        const c = uint8[i];
        if ((c >= 32 && c <= 126) || c === 10 || c === 13) {
          text += String.fromCharCode(c);
        } else if (text.length && text[text.length - 1] !== ' ') {
          text += ' ';
        }
      }
      rawResumeText.value = text;
      parseCurrentText();
    };
    reader.readAsArrayBuffer(file);
    return;
  }

  // Text / Markdown
  const reader = new FileReader();
  reader.onload = (e) => {
    rawResumeText.value = e.target.result || '';
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
</style>
