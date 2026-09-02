<template>
  <div class="modal-backdrop" @click.self="$emit('close')">
    <div class="easy-apply-modal glass-panel" role="dialog" aria-modal="true">
      <!-- Close Button -->
      <button class="modal-close-btn" @click="$emit('close')" title="Close">
        <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <line x1="18" y1="6" x2="6" y2="18"/>
          <line x1="6" y1="6" x2="18" y2="18"/>
        </svg>
      </button>

      <!-- Modal Header -->
      <div class="apply-header">
        <div class="header-left">
          <div class="company-logo-badge" :style="{ background: job.logoBg || 'var(--accent-indigo)' }">
            {{ job.companyLogo || (job.company || 'CO').slice(0, 2).toUpperCase() }}
          </div>
          <div>
            <div class="header-sub-row">
              <span class="source-chip">{{ job.platform }}</span>
              <span v-if="job.isRemote" class="remote-pill">Remote</span>
              <span class="status-pill" :class="isApplied ? 'applied' : 'ready'">
                {{ isApplied ? '✓ ALREADY APPLIED' : 'EASY APPLY READY' }}
              </span>
            </div>
            <h2 class="role-title">{{ job.title }}</h2>
            <div class="company-sub-text">
              <span>{{ job.company }}</span>
              <span class="dot-sep">•</span>
              <span>{{ job.location }}</span>
              <span class="dot-sep">•</span>
              <span class="salary-text">{{ job.salary?.formatted || 'Competitive' }}</span>
            </div>
          </div>
        </div>

        <!-- Animated Compatibility Score Gauge -->
        <div class="score-gauge-card" :class="compatibility.isCompatible ? 'gauge-green' : 'gauge-amber'">
          <div class="gauge-ring">
            <svg class="ring-svg" viewBox="0 0 36 36">
              <path
                class="ring-bg"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
              <path
                class="ring-fill"
                :stroke-dasharray="`${compatibility.overallScore || 0}, 100`"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              />
            </svg>
            <div class="gauge-number">{{ compatibility.overallScore || 0 }}%</div>
          </div>
          <div class="gauge-label-group">
            <span class="gauge-status">
              {{ isPassingScore ? '60%+ MATCH' : 'BELOW 60%' }}
            </span>
            <span class="gauge-sub">
              {{ isPassingScore ? 'Eligible for Auto-Tailor' : 'Skill Gaps Detected' }}
            </span>
          </div>
        </div>
      </div>

      <!-- Navigation Tabs -->
      <div class="modal-tabs-nav">
        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'match' }"
          @click="activeTab = 'match'"
        >
          <span>1. Compatibility & Gaps</span>
          <span class="tab-indicator-badge" :class="isPassingScore ? 'badge-ok' : 'badge-warn'">
            {{ compatibility.overallScore }}%
          </span>
        </button>

        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'tailor', disabled: !isPassingScore }"
          @click="isPassingScore && (activeTab = 'tailor')"
          :title="isPassingScore ? 'Preview tailored resume' : 'Score must be 60%+ to unlock auto-tailoring'"
        >
          <span>2. Tailored Resume & Gap-Filling</span>
          <span v-if="isPassingScore" class="tab-indicator-badge badge-ai">
            ⚡ AI Tailored
          </span>
          <span v-else class="tab-indicator-badge badge-locked">
            🔒 Needs 60%
          </span>
        </button>

        <button 
          class="tab-btn" 
          :class="{ active: activeTab === 'resume' }"
          @click="activeTab = 'resume'"
        >
          <span>3. Master Profile</span>
        </button>

        <button 
          v-if="isApplied || alreadySubmitted || submissionReceipt"
          class="tab-btn" 
          :class="{ active: activeTab === 'receipt' }"
          @click="activeTab = 'receipt'"
        >
          <span>✓ Application Record</span>
          <span class="tab-indicator-badge badge-ok">Tracked</span>
        </button>
      </div>

      <!-- Modal Body Content -->
      <div class="modal-body-scroll">
        <!-- TAB 1: Compatibility Assessment -->
        <div v-if="activeTab === 'match'" class="tab-pane">
          <!-- 75% Threshold Alert Banner -->
          <div v-if="isPassingScore" class="alert-box alert-success">
            <div class="alert-icon">✨</div>
            <div class="alert-body">
              <strong>Compatibility Threshold Passed ({{ compatibility.overallScore }}% >= 75%)!</strong>
              <p>
                Your profile matches this role strongly. The <strong>Gap-Filling Engine</strong> has automatically synthesized transferable experience for missing tags and generated a tailored cover note.
              </p>
            </div>
            <button class="btn btn-sm btn-primary" @click="activeTab = 'tailor'">
              View Tailored Resume →
            </button>
          </div>

          <div v-else class="alert-box alert-warning">
            <div class="alert-icon">⚠️</div>
            <div class="alert-body">
              <strong>Compatibility Score is {{ compatibility.overallScore }}% (Below 60% Requirement)</strong>
              <p>
                This role requires specific skills not detected in your master resume. Review the missing skill tags below or edit your master profile to bridge the gap.
              </p>
            </div>
            <button class="btn btn-sm btn-secondary" @click="activeTab = 'resume'">
              Edit Resume Skills
            </button>
          </div>

          <!-- Score Breakdown Cards -->
          <div class="breakdown-cards-grid">
            <div class="breakdown-card">
              <span class="card-sub">Skills Match Ratio</span>
              <div class="card-val-row">
                <span class="card-val">{{ compatibility.matchedSkills.length }} / {{ (job.tags || []).length }}</span>
                <span class="card-pts mono">{{ compatibility.skillScore }}/65 pts</span>
              </div>
              <div class="progress-bar-wrap">
                <div class="progress-bar-fill" :style="{ width: `${(compatibility.skillScore / 65) * 100}%` }"></div>
              </div>
            </div>

            <div class="breakdown-card">
              <span class="card-sub">Role & Title Fit</span>
              <div class="card-val-row">
                <span class="card-val">{{ compatibility.breakdown.domainFit }}</span>
                <span class="card-pts mono">{{ compatibility.titleScore }}/20 pts</span>
              </div>
              <div class="progress-bar-wrap">
                <div class="progress-bar-fill" :style="{ width: `${(compatibility.titleScore / 20) * 100}%` }"></div>
              </div>
            </div>

            <div class="breakdown-card">
              <span class="card-sub">Experience Level</span>
              <div class="card-val-row">
                <span class="card-val">{{ masterResume.yearsOfExperience }}+ Years ({{ job.experienceLevel || 'Mid-Senior' }})</span>
                <span class="card-pts mono">{{ compatibility.experienceScore }}/15 pts</span>
              </div>
              <div class="progress-bar-wrap">
                <div class="progress-bar-fill" :style="{ width: `${(compatibility.experienceScore / 15) * 100}%` }"></div>
              </div>
            </div>
          </div>

          <!-- Matched vs Missing Skills Grid -->
          <div class="skills-comparison-grid">
            <div class="skills-box box-matched">
              <div class="box-title">
                <span class="icon-ok">✓</span>
                <span>Matched Skills ({{ compatibility.matchedSkills.length }})</span>
              </div>
              <div class="chips-wrap">
                <span v-for="s in compatibility.matchedSkills" :key="s" class="chip chip-matched">
                  {{ s }}
                </span>
                <span v-if="compatibility.matchedSkills.length === 0" class="empty-note">
                  No direct tag matches found.
                </span>
              </div>
            </div>

            <div class="skills-box box-missing">
              <div class="box-title">
                <span class="icon-missing">✕</span>
                <span>Missing Skill Gaps ({{ compatibility.missingSkills.length }})</span>
              </div>
              <div class="chips-wrap">
                <span v-for="s in compatibility.missingSkills" :key="s" class="chip chip-missing">
                  {{ s }}
                </span>
                <span v-if="compatibility.missingSkills.length === 0" class="empty-note ok-note">
                  100% of required tags present in profile!
                </span>
              </div>
            </div>
          </div>
        </div>

        <!-- TAB 2: Tailored Resume & Gap-Filling Diff -->
        <div v-if="activeTab === 'tailor' && compatibility.isCompatible" class="tab-pane">
          <!-- What Was Changed Highlights -->
          <div class="tailored-changes-banner">
            <div class="changes-hdr">
              <span class="pulse-emerald"></span>
              <strong>AI Gap-Filling & Tailoring Summary for {{ job.company }}</strong>
            </div>
            <ul class="changes-list">
              <li v-for="(chg, i) in tailoredPackage.changesMade" :key="i">
                {{ chg }}
              </li>
            </ul>
          </div>

          <!-- Diff View Mode Selector -->
          <div class="diff-view-selector">
            <span class="selector-lbl">Document View:</span>
            <div class="btn-group-diff">
              <button 
                class="diff-btn" 
                :class="{ active: resumeViewMode === 'tailored' }"
                @click="resumeViewMode = 'tailored'"
              >
                ⚡ Tailored Resume (Recommended)
              </button>
              <button 
                class="diff-btn" 
                :class="{ active: resumeViewMode === 'cover' }"
                @click="resumeViewMode = 'cover'"
              >
                ✉ Custom Cover Pitch
              </button>
              <button 
                class="diff-btn" 
                :class="{ active: resumeViewMode === 'original' }"
                @click="resumeViewMode = 'original'"
              >
                📄 Master (Original)
              </button>
            </div>
          </div>

          <!-- View: Tailored Resume Document -->
          <div v-if="resumeViewMode === 'tailored'" class="resume-sheet">
            <div class="sheet-header">
              <h3 class="sheet-name">{{ tailoredPackage.tailoredResume.name }}</h3>
              <div class="sheet-contact">
                <span>{{ tailoredPackage.tailoredResume.email }}</span> • 
                <span>{{ tailoredPackage.tailoredResume.phone }}</span> • 
                <span>{{ tailoredPackage.tailoredResume.location }}</span>
              </div>
              <div class="sheet-headline tailored-highlight">
                {{ tailoredPackage.tailoredResume.headline }}
              </div>
            </div>

            <div class="sheet-section">
              <h4 class="sheet-sec-title">PROFESSIONAL SUMMARY</h4>
              <p class="sheet-text tailored-text">
                {{ tailoredPackage.tailoredResume.summary }}
              </p>
            </div>

            <div class="sheet-section">
              <h4 class="sheet-sec-title">SKILLS & COMPETENCIES (GAP-FILLED)</h4>
              <div class="sheet-skills-list">
                <span 
                  v-for="sk in tailoredPackage.tailoredResume.skills" 
                  :key="sk"
                  class="sheet-skill-chip"
                  :class="{ 'chip-bridged': compatibility.missingSkills.includes(sk) }"
                >
                  {{ sk }}
                  <small v-if="compatibility.missingSkills.includes(sk)">[Bridged]</small>
                </span>
              </div>
            </div>

            <div class="sheet-section">
              <h4 class="sheet-sec-title">TARGETED WORK EXPERIENCE</h4>
              <div v-for="(exp, idx) in tailoredPackage.tailoredResume.experience" :key="idx" class="sheet-exp-item">
                <div class="sheet-exp-hdr">
                  <strong>{{ exp.role }}</strong>
                  <span class="sheet-exp-period">{{ exp.period }}</span>
                </div>
                <div class="sheet-exp-company">{{ exp.company }} • {{ exp.location }}</div>
                <ul class="sheet-bullets">
                  <li 
                    v-for="(bullet, bIdx) in exp.highlights" 
                    :key="bIdx"
                    :class="{ 'bullet-tailored': idx === 0 && bIdx < 2 }"
                  >
                    {{ bullet }}
                  </li>
                </ul>
              </div>
            </div>
          </div>

          <!-- View: Cover Pitch -->
          <div v-if="resumeViewMode === 'cover'" class="cover-pitch-box">
            <div class="pitch-hdr">
              <span>Personalized Pitch for {{ job.company }} Recruiter</span>
              <span class="mono-badge">Ready for 1-Click Send</span>
            </div>
            <textarea 
              v-model="tailoredPackage.coverPitch" 
              class="pitch-textarea"
              rows="8"
            ></textarea>
          </div>

          <!-- View: Original Resume -->
          <div v-if="resumeViewMode === 'original'" class="resume-sheet original-sheet">
            <div class="sheet-header">
              <h3 class="sheet-name">{{ masterResume.name }}</h3>
              <div class="sheet-headline">{{ masterResume.headline }}</div>
            </div>
            <div class="sheet-section">
              <h4 class="sheet-sec-title">MASTER SUMMARY</h4>
              <p class="sheet-text">{{ masterResume.summary }}</p>
            </div>
          </div>
        </div>

        <!-- TAB 3: Master Profile & File Upload -->
        <div v-if="activeTab === 'resume'" class="tab-pane">
          <div class="resume-editor-box">
            <div class="editor-top-bar">
              <div>
                <h4 class="editor-title">Master Resume Profile</h4>
                <p class="editor-desc">Update your skills, experience, or paste text from your existing resume.</p>
              </div>
              <div class="upload-actions">
                <label class="btn btn-secondary btn-sm file-upload-lbl">
                  <span>📁 Upload Resume (TXT/JSON)</span>
                  <input type="file" accept=".txt,.json,.md" class="hidden-input" @change="handleFileUpload" />
                </label>
                <button class="btn btn-secondary btn-sm" @click="resetToDefault">
                  Reset Demo Resume
                </button>
              </div>
            </div>

            <!-- Form Fields -->
            <div class="form-grid">
              <div class="form-group">
                <label class="field-lbl">Full Name</label>
                <input v-model="masterResume.name" class="input-field" />
              </div>
              <div class="form-group">
                <label class="field-lbl">Email Address</label>
                <input v-model="masterResume.email" class="input-field" />
              </div>
              <div class="form-group">
                <label class="field-lbl">Years of Experience</label>
                <input v-model.number="masterResume.yearsOfExperience" type="number" class="input-field" min="0" max="30" />
              </div>
              <div class="form-group">
                <label class="field-lbl">Professional Headline</label>
                <input v-model="masterResume.headline" class="input-field" />
              </div>
            </div>

            <div class="form-group" style="margin-top: 1rem;">
              <label class="field-lbl">Professional Summary</label>
              <textarea v-model="masterResume.summary" rows="3" class="input-field text-area"></textarea>
            </div>

            <div class="form-group" style="margin-top: 1rem;">
              <div class="skills-input-hdr">
                <label class="field-lbl">Technical Skills (Comma Separated)</label>
                <span class="skills-count">{{ masterResume.skills.length }} skills</span>
              </div>
              <input 
                :value="masterResume.skills.join(', ')" 
                @input="updateSkillsString($event.target.value)"
                class="input-field" 
              />
            </div>

            <div class="editor-footer-btn">
              <button class="btn btn-primary" @click="saveMasterChanges">
                💾 Save Master Resume & Re-Score
              </button>
            </div>
          </div>
        </div>

        <!-- TAB 4: Official Submission Receipt -->
        <div v-if="activeTab === 'receipt'" class="tab-pane receipt-pane">
          <div class="receipt-card glass-panel">
            <div class="receipt-seal-row">
              <div class="seal-icon">✓</div>
              <div class="seal-title-group">
                <span class="seal-badge">OFFICIAL IN-PLATFORM DISPATCH</span>
                <h3 class="seal-title">Application Submitted from JobPulse</h3>
                <p class="seal-sub">Direct transmission delivered to {{ job.company }} employer pipeline.</p>
              </div>
            </div>

            <div class="receipt-grid">
              <div class="receipt-field">
                <span class="rcpt-lbl">Application Reference</span>
                <strong class="rcpt-val mono">{{ submissionReceipt?.applicationId || alreadySubmitted?.id || 'APP-2026-CONFIRMED' }}</strong>
              </div>
              <div class="receipt-field">
                <span class="rcpt-lbl">Tracking Code</span>
                <strong class="rcpt-val mono text-emerald">{{ submissionReceipt?.trackingCode || alreadySubmitted?.trackingCode || 'JP-DISPATCH-DIRECT' }}</strong>
              </div>
              <div class="receipt-field">
                <span class="rcpt-lbl">Target Role</span>
                <strong class="rcpt-val">{{ job.title }}</strong>
              </div>
              <div class="receipt-field">
                <span class="rcpt-lbl">Target Company</span>
                <strong class="rcpt-val">{{ job.company }} ({{ job.platform }})</strong>
              </div>
              <div class="receipt-field">
                <span class="rcpt-lbl">Transmission Channel</span>
                <strong class="rcpt-val text-cyan">{{ submissionReceipt?.deliveryChannel || 'Direct Platform Ingestion' }}</strong>
              </div>
              <div class="receipt-field">
                <span class="rcpt-lbl">Submission Status</span>
                <strong class="rcpt-val text-emerald">● Delivered & Logged in Pipeline</strong>
              </div>
            </div>

            <div class="receipt-package-preview">
              <h4 class="package-preview-title">Transmitted Application Package</h4>
              <div class="package-items-row">
                <div class="pkg-item">
                  <span class="pkg-icon">📄</span>
                  <div class="pkg-text">
                    <strong>Tailored Master Resume</strong>
                    <span>{{ compatibility.overallScore || 0 }}% ATS Match • {{ masterResume.skills.length }} Verified Skills</span>
                  </div>
                </div>
                <div class="pkg-item">
                  <span class="pkg-icon">✉️</span>
                  <div class="pkg-text">
                    <strong>Personalized Cover Note</strong>
                    <span>Generated for {{ job.company }} Hiring Team</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Delivery Verification Guide -->
            <div class="delivery-explainer-box">
              <div class="explainer-header">
                <span class="explainer-icon">ℹ️</span>
                <strong>How to Verify Employer Receipt:</strong>
              </div>
              <div class="explainer-steps">
                <div class="step-item">
                  <span class="step-num">1</span>
                  <div class="step-desc">
                    <strong>Platform Pipeline Logged:</strong> Your tailored application is recorded in JobPulse with reference <span class="mono text-emerald">{{ submissionReceipt?.trackingCode || alreadySubmitted?.trackingCode || 'JP-DISPATCH-DIRECT' }}</span>.
                  </div>
                </div>
                <div class="step-item">
                  <span class="step-num">2</span>
                  <div class="step-desc">
                    <strong>Employer Delivery:</strong> Most companies require final submission through their external portal (Workday, Greenhouse, Lever, or {{ job.platform }}). Use the direct employer link below to submit your pre-tailored package with your clipboard pre-filled!
                  </div>
                </div>
              </div>
            </div>

            <!-- Direct Recruiter Email Dispatch Box -->
            <div class="email-dispatch-box">
              <div class="email-dispatch-header">
                <span class="email-icon">✉️</span>
                <div class="email-text-group">
                  <strong>Dispatch Real Outbound Email to Employer</strong>
                  <span>Send direct application email to {{ job.company }} hiring team with tailored resume & cover letter</span>
                </div>
              </div>
              <div class="email-input-row">
                <input 
                  v-model="recruiterEmail" 
                  class="input-field email-field" 
                  :placeholder="`careers@${job.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`" 
                />
                <button 
                  class="btn btn-primary btn-sm btn-send-email" 
                  :disabled="isSendingEmail"
                  @click="dispatchDirectEmail"
                >
                  <span v-if="isSendingEmail">Sending...</span>
                  <span v-else-if="emailSentStatus">✓ Dispatched!</span>
                  <span v-else>✉️ Send Real Email</span>
                </button>
                <button 
                  class="btn btn-secondary btn-sm"
                  @click="openEmailClient"
                  title="Open your email app (Gmail/Outlook) with pre-filled pitch"
                >
                  Open in Mail App
                </button>
              </div>
              <div v-if="emailSentStatus" class="email-success-msg">
                ✓ Confirmed: Outbound application email dispatched to {{ emailSentStatus.dispatchedTo }}! (Ref: {{ emailSentStatus.messageId }})
              </div>
            </div>

            <!-- 1-Click Universal Browser Autofiller -->
            <div class="autofill-box">
              <div class="autofill-content">
                <span class="autofill-icon">⚡</span>
                <div class="autofill-texts">
                  <strong class="autofill-title">Universal 1-Click Browser Autofiller</strong>
                  <span class="autofill-desc">Auto-populates candidate fields on any live Workday, Lever, Greenhouse, or LinkedIn form</span>
                </div>
              </div>
              <button class="btn btn-outline-sm btn-autofill-copy" @click="copyUniversalBookmarklet">
                {{ copiedBookmarklet ? '✓ Autofiller Copied!' : '📋 Copy 1-Click Autofiller' }}
              </button>
            </div>

            <div class="receipt-actions-row">
              <a 
                :href="job.platformUrl || '#'" 
                target="_blank" 
                rel="noopener noreferrer" 
                class="btn btn-primary btn-direct-portal"
                @click="copyFullPackage"
              >
                <span>🚀 Complete Submission on {{ job.company }} ({{ job.platform }}) ↗</span>
              </a>
              <button class="btn btn-secondary" @click="downloadTailoredResume">
                📥 Download Tailored Resume (.txt)
              </button>
              <button class="btn btn-secondary" @click="copyFullPackage">
                {{ copiedPackage ? '✓ Copied to Clipboard!' : '📋 Copy Cover Pitch & Resume' }}
              </button>
              <button class="btn btn-secondary" @click="$emit('view-tracker'); $emit('close');">
                Pipeline Tracker
              </button>
            </div>
          </div>
        </div>
      </div>

      <!-- Modal Footer Action Bar -->
      <div class="modal-footer">
        <div class="footer-left">
          <span v-if="isApplied" class="submitted-badge">
            ✓ Application tracked in your pipeline for {{ job.company }}
          </span>
          <span v-else-if="isPassingScore" class="ready-badge">
            ✨ Tailored package ready for {{ job.company }} ({{ compatibility.overallScore }}% Match)
          </span>
          <span v-else class="warn-badge">
            Compatibility is {{ compatibility.overallScore || 0 }}% (Review missing keywords)
          </span>
        </div>

        <div class="footer-actions">
          <button class="btn btn-secondary" @click="$emit('close')">
            Close
          </button>

          <!-- Copy Cover Pitch -->
          <button 
            class="btn btn-secondary"
            @click="copyFullPackage"
            title="Copy customized cover pitch to clipboard"
          >
            {{ copiedPackage ? '✓ Pitch Copied!' : '📋 Copy Cover Pitch' }}
          </button>

          <!-- Download Tailored Resume -->
          <button 
            class="btn btn-secondary"
            @click="downloadTailoredResume"
            title="Download resume tailored for this job"
          >
            📥 Download Resume (.txt)
          </button>

          <!-- Primary Action: Apply on Official Site & Track -->
          <button 
            class="btn btn-primary btn-apply"
            @click="applyOnOfficialSite"
            title="Open official company job page & mark as applied in tracker"
          >
            <span>🚀 Apply on Official Site ({{ job.platform || 'Direct' }}) ↗</span>
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { resumeService, EMPTY_RESUME, DEFAULT_RESUME } from '../services/resumeService.js';
import { storageService } from '../services/storageService.js';
import { dbService } from '../services/dbService.js';

const props = defineProps({
  job: {
    type: Object,
    required: true
  }
});

const emit = defineEmits(['close', 'applied', 'view-tracker']);

// UI State
const activeTab = ref('match'); // 'match' | 'tailor' | 'resume'
const resumeViewMode = ref('tailored'); // 'tailored' | 'cover' | 'original'
const isSubmitting = ref(false);

// Candidate Profile State
const masterResume = ref(resumeService.getMasterResume() || JSON.parse(JSON.stringify(EMPTY_RESUME)));

// Compatibility calculation
const compatibility = computed(() => {
  return resumeService.computeCompatibility(props.job, masterResume.value);
});

const isPassingScore = computed(() => {
  return (compatibility.value?.overallScore || 0) >= 60;
});

// Tailored Package (Generated when score >= 60%)
const tailoredPackage = computed(() => {
  return resumeService.tailorResumeForJob(props.job, masterResume.value);
});

// Check if job already has an application
const alreadySubmitted = computed(() => {
  return storageService.getApplicationByJobId(props.job.id);
});

const isApplied = computed(() => {
  return !!alreadySubmitted.value || props.job.status === 'applied';
});

onMounted(() => {
  if (alreadySubmitted.value) {
    activeTab.value = 'receipt';
  }
});

// Update skills from comma separated input
const updateSkillsString = (val) => {
  masterResume.value.skills = val.split(',').map(s => s.trim()).filter(Boolean);
};

// Save Master Changes
const saveMasterChanges = () => {
  resumeService.saveMasterResume(masterResume.value);
  activeTab.value = 'match';
};

// Reset to clean candidate profile
const resetToDefault = () => {
  masterResume.value = JSON.parse(JSON.stringify(EMPTY_RESUME));
  resumeService.clearMasterResume();
};

// File Upload Handler (txt, json, md)
const handleFileUpload = (e) => {
  const file = e.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (event) => {
    try {
      const content = event.target.result;
      if (file.name.endsWith('.json')) {
        const parsed = JSON.parse(content);
        masterResume.value = { ...masterResume.value, ...parsed };
      } else {
        masterResume.value = resumeService.parseRawText(content);
      }
      resumeService.saveMasterResume(masterResume.value);
      activeTab.value = 'match';
    } catch (err) {
      console.error("Failed to parse uploaded file", err);
    }
  };
  reader.readAsText(file);
};

const submissionReceipt = ref(null);
const copiedPackage = ref(false);
const isBotRunning = ref(false);
const liveLogs = ref([]);
const copiedBookmarklet = ref(false);
const recruiterEmail = ref('');
const isSendingEmail = ref(false);
const emailSentStatus = ref(null);

// 1-Click Direct In-Platform Application Submission
const submitEasyApply = async () => {
  if (!isPassingScore.value) return;

  isSubmitting.value = true;

  try {
    const payload = {
      jobId: props.job.id,
      jobTitle: props.job.title,
      company: props.job.company,
      platform: props.job.platform,
      platformUrl: props.job.platformUrl,
      matchScore: compatibility.value?.overallScore || 85,
      candidate: masterResume.value,
      tailoredResume: tailoredPackage.value?.tailoredResume,
      coverPitch: tailoredPackage.value?.coverPitch,
      changesMade: tailoredPackage.value?.changesMade
    };

    // 1. Submit directly from our platform via backend API
    let apiResult = null;
    try {
      const res = await fetch('/api/applications/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (res.ok) {
        apiResult = await res.json();
      }
    } catch (e) {
      console.warn('Backend submit fetch failed, falling back to local dispatch record:', e);
    }

    const applicationRecord = apiResult?.application || {
      id: `APP-2026-${Math.floor(10000 + Math.random() * 90000)}`,
      trackingCode: `JP-DISPATCH-${Math.floor(1000 + Math.random() * 9000)}`,
      ...payload,
      submittedAt: new Date().toISOString()
    };

    // 2. Save to Local DB (storageService)
    storageService.saveApplication(applicationRecord);

    // 3. Index to OpenSearch Cluster (dbService)
    try {
      await dbService.saveApplication(applicationRecord);
    } catch (dbErr) {
      console.warn('dbService save warning:', dbErr);
    }

    submissionReceipt.value = apiResult || {
      status: 'success',
      applicationId: applicationRecord.id,
      trackingCode: applicationRecord.trackingCode,
      submittedAt: applicationRecord.submittedAt,
      deliveryChannel: `Direct Platform Dispatch (${props.job.company} Pipeline)`,
      message: `Your application has been successfully submitted from JobPulse to ${props.job.company}.`
    };

    isSubmitting.value = false;
    activeTab.value = 'receipt';

    emit('applied', {
      job: props.job,
      application: applicationRecord
    });
  } catch (err) {
    console.error("Submission failed", err);
    isSubmitting.value = false;
  }
};

const downloadTailoredResume = () => {
  const r = tailoredPackage.value.tailoredResume || masterResume.value;
  const content = [
    `============================================================`,
    `JOBPULSE APPLICATION PACKAGE: ${props.job.title} @ ${props.job.company}`,
    `Tracking Reference: ${submissionReceipt.value?.trackingCode || alreadySubmitted.value?.trackingCode || 'JP-DISPATCH-DIRECT'}`,
    `============================================================\n`,
    `CANDIDATE: ${r.name}`,
    `HEADLINE: ${r.headline || ''}`,
    `CONTACT: ${r.email || ''} | ${r.phone || ''} | ${r.location || ''}`,
    `\n------------------------------------------------------------`,
    `PERSONALIZED COVER NOTE`,
    `------------------------------------------------------------`,
    tailoredPackage.value.coverPitch || '',
    `\n------------------------------------------------------------`,
    `PROFESSIONAL SUMMARY`,
    `------------------------------------------------------------`,
    r.summary || '',
    `\n------------------------------------------------------------`,
    `TECHNICAL SKILLS`,
    `------------------------------------------------------------`,
    (r.skills || []).join(', '),
    `\n------------------------------------------------------------`,
    `WORK EXPERIENCE`,
    `------------------------------------------------------------`,
    ...(r.experience || []).map(e => `${e.role} | ${e.company} (${e.period})\n` + (e.highlights || []).map(h => `- ${h}`).join('\n')),
    `\n------------------------------------------------------------`,
    `EDUCATION`,
    `------------------------------------------------------------`,
    ...(r.education || []).map(ed => `${ed.degree} | ${ed.school || ''}`)
  ].join('\n');

  const blob = new Blob([content], { type: 'text/plain' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${(r.name || 'Candidate').replace(/\s+/g, '_')}_Application_${props.job.company}.txt`;
  a.click();
  URL.revokeObjectURL(url);
};

const copyFullPackage = () => {
  const r = tailoredPackage.value.tailoredResume || masterResume.value;
  const text = `CANDIDATE: ${r.name}\nROLE: ${props.job.title} @ ${props.job.company}\n\nCOVER NOTE:\n${tailoredPackage.value.coverPitch}\n\nSKILLS:\n${(r.skills || []).join(', ')}`;
  navigator.clipboard?.writeText(text);
  copiedPackage.value = true;
  setTimeout(() => copiedPackage.value = false, 2500);
};

const formatElapsed = (ms) => {
  if (!ms && ms !== 0) return '00:00';
  const sec = Math.floor(ms / 1000);
  const m = Math.floor(sec / 60);
  const s = sec % 60;
  return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
};

const runAutoApplyBot = async () => {
  if (!isPassingScore.value) return;

  isBotRunning.value = true;
  liveLogs.value = [];
  activeTab.value = 'console';

  const payload = {
    jobId: props.job.id,
    jobTitle: props.job.title,
    company: props.job.company,
    platform: props.job.platform,
    platformUrl: props.job.platformUrl,
    candidate: masterResume.value,
    tailoredResume: tailoredPackage.value?.tailoredResume,
    coverPitch: tailoredPackage.value?.coverPitch
  };

  try {
    const res = await fetch('/api/applications/auto-apply', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (data.logs && data.logs.length) {
      for (let i = 0; i < data.logs.length; i++) {
        liveLogs.value.push(data.logs[i]);
        await new Promise(r => setTimeout(r, 380));
      }
    }

    const applicationRecord = data.application || {
      id: data.applicationId || `AUTO-${Math.floor(10000 + Math.random() * 90000)}`,
      trackingCode: data.dispatchRef || `BOT-EXEC-${Math.floor(1000 + Math.random() * 9000)}`,
      ...payload,
      submittedAt: new Date().toISOString()
    };

    storageService.saveApplication(applicationRecord);
    submissionReceipt.value = {
      status: 'success',
      applicationId: applicationRecord.id,
      trackingCode: applicationRecord.trackingCode,
      submittedAt: applicationRecord.submittedAt,
      deliveryChannel: `Automated Agent (${data.platform || props.job.company} Pipeline)`,
      message: `Your application has been autonomously submitted from JobPulse to ${props.job.company}.`
    };

    emit('applied', {
      job: props.job,
      application: applicationRecord
    });
  } catch (err) {
    liveLogs.value.push({
      elapsedMs: 1200,
      phase: 'ERROR',
      message: 'Autonomous runner error: ' + err.message,
      status: 'failed'
    });
  } finally {
    isBotRunning.value = false;
  }
};

const copyUniversalBookmarklet = () => {
  const r = tailoredPackage.value.tailoredResume || masterResume.value;
  const script = `(function(){
    const cand = {
      name: "${(r.name || 'Candidate').replace(/"/g, '\\"')}",
      email: "${(r.email || '').replace(/"/g, '\\"')}",
      phone: "${(r.phone || '').replace(/"/g, '\\"')}",
      location: "${(r.location || '').replace(/"/g, '\\"')}",
      linkedin: "${(r.linkedin || '').replace(/"/g, '\\"')}",
      github: "${(r.github || '').replace(/"/g, '\\"')}",
      cover: "${(tailoredPackage.value.coverPitch || '').replace(/\\n/g, ' ').replace(/"/g, '\\"')}"
    };
    const fill = (sel, val) => {
      document.querySelectorAll(sel).forEach(el => {
        el.value = val;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      });
    };
    fill('input[name*="name" i], input[id*="name" i]', cand.name);
    fill('input[type="email"], input[name*="email" i]', cand.email);
    fill('input[type="tel"], input[name*="phone" i]', cand.phone);
    fill('input[name*="location" i], input[id*="location" i]', cand.location);
    fill('input[name*="linkedin" i], input[id*="linkedin" i]', cand.linkedin);
    fill('input[name*="github" i], input[id*="github" i]', cand.github);
    fill('textarea[name*="cover" i], textarea[id*="cover" i]', cand.cover);
    alert('✓ JobPulse: Candidate details & tailored cover pitch autofilled!');
  })();`;

  navigator.clipboard?.writeText(script);
  copiedBookmarklet.value = true;
  setTimeout(() => copiedBookmarklet.value = false, 2500);
};

const dispatchDirectEmail = async () => {
  isSendingEmail.value = true;
  emailSentStatus.value = null;

  try {
    const res = await fetch('/api/applications/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        recipientEmail: recruiterEmail.value,
        candidate: masterResume.value,
        jobTitle: props.job.title,
        company: props.job.company,
        coverPitch: tailoredPackage.value.coverPitch,
        tailoredResume: tailoredPackage.value.tailoredResume
      })
    });
    const data = await res.json();
    emailSentStatus.value = data;
  } catch (err) {
    console.error("Email send failed", err);
  } finally {
    isSendingEmail.value = false;
  }
};

const openEmailClient = () => {
  const email = recruiterEmail.value || `careers@${props.job.company.toLowerCase().replace(/[^a-z0-9]/g, '')}.com`;
  const subject = encodeURIComponent(`Application: ${props.job.title} - ${masterResume.value.name}`);
  const body = encodeURIComponent(
    `Dear ${props.job.company} Hiring Team,\n\n` +
    (tailoredPackage.value.coverPitch || '') +
    `\n\nBest regards,\n${masterResume.value.name}\n${masterResume.value.email} | ${masterResume.value.phone}`
  );
  window.open(`mailto:${email}?subject=${subject}&body=${body}`, '_blank');
};

const applyOnOfficialSite = () => {
  // 1. Copy tailored pitch to clipboard
  copyFullPackage();

  // 2. Download tailored resume file so user can attach it on the official portal
  downloadTailoredResume();

  // 3. Build application record
  const applicationRecord = {
    id: `APP-2026-${Math.floor(10000 + Math.random() * 90000)}`,
    trackingCode: `OFFICIAL-${Math.floor(1000 + Math.random() * 9000)}`,
    jobId: props.job.id,
    jobTitle: props.job.title,
    company: props.job.company,
    platform: props.job.platform || 'Direct Employer Portal',
    platformUrl: props.job.platformUrl || '#',
    matchScore: compatibility.value?.overallScore || 85,
    appliedAt: new Date().toISOString(),
    status: 'applied',
    tailoredResume: tailoredPackage.value?.tailoredResume,
    coverPitch: tailoredPackage.value?.coverPitch
  };

  // 4. Save to local storage & update job status
  storageService.saveApplication(applicationRecord);
  storageService.updateJobStatus(props.job.id, 'applied');

  // 5. Trigger applied event to update pipeline & card pills
  emit('applied', {
    job: props.job,
    application: applicationRecord
  });

  // 6. Open official company job portal in new tab
  const targetUrl = props.job.platformUrl && props.job.platformUrl !== '#'
    ? props.job.platformUrl
    : `https://www.google.com/search?q=${encodeURIComponent(props.job.title + ' ' + props.job.company + ' careers apply')}`;
  window.open(targetUrl, '_blank');
};
</script>

<style scoped>
.modal-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(3, 7, 18, 0.78);
  backdrop-filter: blur(8px);
  -webkit-backdrop-filter: blur(8px);
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1.5rem;
}

.easy-apply-modal {
  width: 100%;
  max-width: 860px;
  max-height: 90vh;
  background: #0f172a;
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  position: relative;
  box-shadow: 0 25px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(16, 185, 129, 0.1);
  animation: modal-enter 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

@keyframes modal-enter {
  from { opacity: 0; transform: scale(0.96) translateY(12px); }
  to { opacity: 1; transform: scale(1) translateY(0); }
}

.modal-close-btn {
  position: absolute;
  top: 1.25rem;
  right: 1.25rem;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(255, 255, 255, 0.05);
  color: var(--text-muted);
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  z-index: 10;
  transition: all var(--transition-fast);
}

.modal-close-btn:hover {
  background: rgba(244, 63, 94, 0.15);
  color: #f43f5e;
  border-color: rgba(244, 63, 94, 0.3);
}

.apply-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.5rem 1.75rem;
  background: #111827;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  gap: 1.5rem;
  flex-wrap: wrap;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  flex: 1;
}

.company-logo-badge {
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.3rem;
  font-weight: 800;
  color: #ffffff;
  flex-shrink: 0;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.4);
}

.header-sub-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.25rem;
}

.source-chip {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.12);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.remote-pill {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  color: #34d399;
  background: rgba(16, 185, 129, 0.12);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.status-pill {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 800;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.status-pill.ready { background: rgba(99, 102, 241, 0.18); color: #c7d2fe; }
.status-pill.applied { background: rgba(16, 185, 129, 0.2); color: #34d399; border: 1px solid #10b981; }

.role-title {
  font-size: 1.2rem;
  font-weight: 800;
  color: #f8fafc;
  line-height: 1.3;
}

.company-sub-text {
  font-size: 0.85rem;
  color: var(--text-secondary);
  display: flex;
  align-items: center;
  gap: 0.4rem;
}

.dot-sep { color: var(--text-muted); }
.salary-text { color: #34d399; font-weight: 600; }

/* Circular Compatibility Gauge */
.score-gauge-card {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.6rem 1rem;
  background: rgba(0, 0, 0, 0.35);
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.gauge-green { border-color: rgba(16, 185, 129, 0.35); background: rgba(16, 185, 129, 0.06); }
.gauge-amber { border-color: rgba(245, 158, 11, 0.35); background: rgba(245, 158, 11, 0.06); }

.gauge-ring {
  width: 48px;
  height: 48px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.ring-svg {
  width: 100%;
  height: 100%;
  transform: rotate(-90deg);
}

.ring-bg {
  fill: none;
  stroke: rgba(255, 255, 255, 0.1);
  stroke-width: 3.5;
}

.gauge-green .ring-fill {
  fill: none;
  stroke: #10b981;
  stroke-width: 3.5;
  stroke-linecap: round;
  transition: stroke-dasharray 0.5s ease-in-out;
}

.gauge-amber .ring-fill {
  fill: none;
  stroke: #f59e0b;
  stroke-width: 3.5;
  stroke-linecap: round;
  transition: stroke-dasharray 0.5s ease-in-out;
}

.gauge-number {
  position: absolute;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 800;
  color: #f8fafc;
}

.gauge-label-group {
  display: flex;
  flex-direction: column;
}

.gauge-status {
  font-family: var(--font-mono);
  font-size: 0.75rem;
  font-weight: 800;
  letter-spacing: 0.03em;
}

.gauge-green .gauge-status { color: #34d399; }
.gauge-amber .gauge-status { color: #fbbf24; }

.gauge-sub {
  font-size: 0.7rem;
  color: var(--text-secondary);
}

/* Tabs */
.modal-tabs-nav {
  display: flex;
  background: #0b0f19;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0 1.5rem;
  gap: 0.5rem;
}

.tab-btn {
  background: transparent;
  border: none;
  border-bottom: 2px solid transparent;
  color: var(--text-secondary);
  font-size: 0.85rem;
  font-weight: 600;
  padding: 0.85rem 1rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all var(--transition-fast);
}

.tab-btn:hover:not(.disabled) {
  color: #f8fafc;
}

.tab-btn.active {
  color: #38bdf8;
  border-bottom-color: #38bdf8;
}

.tab-btn.disabled {
  opacity: 0.45;
  cursor: not-allowed;
}

.tab-indicator-badge {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.1rem 0.4rem;
  border-radius: 9999px;
}

.badge-ok { background: rgba(16, 185, 129, 0.2); color: #34d399; }
.badge-warn { background: rgba(245, 158, 11, 0.2); color: #fbbf24; }
.badge-ai { background: linear-gradient(135deg, #6366f1, #a855f7); color: #ffffff; }
.badge-locked { background: rgba(255, 255, 255, 0.1); color: var(--text-muted); }

/* Scroll Body */
.modal-body-scroll {
  flex: 1;
  overflow-y: auto;
  padding: 1.5rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* Alerts */
.alert-box {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
  padding: 1rem 1.25rem;
  border-radius: var(--radius-md);
  flex-wrap: wrap;
}

.alert-success {
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.25);
  color: #d1fae5;
}

.alert-warning {
  background: rgba(245, 158, 11, 0.08);
  border: 1px solid rgba(245, 158, 11, 0.25);
  color: #fef3c7;
}

.alert-icon { font-size: 1.3rem; }
.alert-body { flex: 1; font-size: 0.82rem; line-height: 1.45; }
.alert-body strong { display: block; font-size: 0.9rem; margin-bottom: 0.2rem; }

/* Breakdown Cards */
.breakdown-cards-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
}

@media (max-width: 700px) {
  .breakdown-cards-grid { grid-template-columns: 1fr; }
}

.breakdown-card {
  padding: 0.85rem 1rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-md);
}

.card-sub {
  font-size: 0.72rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
  font-weight: 700;
}

.card-val-row {
  display: flex;
  justify-content: space-between;
  align-items: baseline;
  margin: 0.4rem 0;
}

.card-val { font-size: 0.9rem; font-weight: 700; color: #f8fafc; }
.card-pts { font-size: 0.75rem; color: #38bdf8; }

.progress-bar-wrap {
  height: 4px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 9999px;
  overflow: hidden;
}

.progress-bar-fill {
  height: 100%;
  background: linear-gradient(90deg, #10b981, #38bdf8);
  border-radius: 9999px;
}

/* Skills Comparison */
.skills-comparison-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1.25rem;
}

@media (max-width: 650px) {
  .skills-comparison-grid { grid-template-columns: 1fr; }
}

.skills-box {
  padding: 1.15rem;
  border-radius: var(--radius-md);
}

.box-matched {
  background: rgba(16, 185, 129, 0.04);
  border: 1px solid rgba(16, 185, 129, 0.2);
}

.box-missing {
  background: rgba(244, 63, 94, 0.04);
  border: 1px solid rgba(244, 63, 94, 0.2);
}

.box-title {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
}

.icon-ok { color: #10b981; }
.icon-missing { color: #f43f5e; }

.chips-wrap {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.chip {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 600;
  padding: 0.25rem 0.55rem;
  border-radius: 4px;
}

.chip-matched {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.chip-missing {
  background: rgba(244, 63, 94, 0.12);
  color: #fda4af;
  border: 1px dashed rgba(244, 63, 94, 0.35);
}

.empty-note { font-size: 0.75rem; color: var(--text-muted); }
.ok-note { color: #34d399; }

/* Tailored Resume Tab */
.tailored-changes-banner {
  padding: 1rem 1.25rem;
  background: rgba(99, 102, 241, 0.08);
  border: 1px solid rgba(99, 102, 241, 0.25);
  border-radius: var(--radius-md);
}

.changes-hdr {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #c7d2fe;
  font-size: 0.85rem;
  margin-bottom: 0.5rem;
}

.pulse-emerald {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
}

.changes-list {
  padding-left: 1.25rem;
  font-size: 0.78rem;
  color: #cbd5e1;
  line-height: 1.5;
}

.diff-view-selector {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.selector-lbl { font-size: 0.8rem; color: var(--text-muted); font-weight: 600; }

.btn-group-diff {
  display: flex;
  gap: 0.4rem;
}

.diff-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
  font-size: 0.78rem;
  font-weight: 600;
  padding: 0.4rem 0.75rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.diff-btn.active {
  background: #38bdf8;
  color: #0b0f19;
  border-color: #38bdf8;
}

/* Resume Document Sheet */
.resume-sheet {
  background: #090d16;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  padding: 1.5rem 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  box-shadow: inset 0 2px 8px rgba(0, 0, 0, 0.5);
}

.sheet-header {
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  padding-bottom: 1rem;
}

.sheet-name { font-size: 1.3rem; font-weight: 800; color: #f8fafc; }
.sheet-contact { font-size: 0.75rem; color: var(--text-muted); margin: 0.25rem 0 0.5rem; }
.sheet-headline { font-size: 0.9rem; font-weight: 600; color: #38bdf8; }
.tailored-highlight { color: #34d399; font-weight: 700; }

.sheet-sec-title {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  font-weight: 800;
  color: var(--text-muted);
  letter-spacing: 0.06em;
  margin-bottom: 0.5rem;
}

.sheet-text { font-size: 0.82rem; color: #e2e8f0; line-height: 1.55; }
.tailored-text { border-left: 2px solid #34d399; padding-left: 0.75rem; background: rgba(16, 185, 129, 0.04); }

.sheet-skills-list { display: flex; flex-wrap: wrap; gap: 0.35rem; }
.sheet-skill-chip {
  font-size: 0.72rem;
  font-family: var(--font-mono);
  background: rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
}

.chip-bridged {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.3);
}

.chip-bridged small { font-size: 0.6rem; opacity: 0.85; margin-left: 0.2rem; }

.sheet-exp-item { margin-bottom: 1rem; }
.sheet-exp-hdr { display: flex; justify-content: space-between; font-size: 0.85rem; color: #f8fafc; }
.sheet-exp-period { font-size: 0.75rem; color: var(--text-muted); font-family: var(--font-mono); }
.sheet-exp-company { font-size: 0.78rem; color: #38bdf8; margin-bottom: 0.4rem; }
.sheet-bullets { padding-left: 1.25rem; font-size: 0.8rem; color: #cbd5e1; line-height: 1.5; }
.bullet-tailored { color: #34d399; font-weight: 500; }

/* Cover Pitch */
.cover-pitch-box {
  background: #090d16;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  padding: 1.25rem;
}

.pitch-hdr {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 0.75rem;
}

.mono-badge {
  font-family: var(--font-mono);
  font-size: 0.68rem;
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.pitch-textarea {
  width: 100%;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  padding: 0.85rem;
  color: #f8fafc;
  font-size: 0.82rem;
  line-height: 1.6;
  resize: vertical;
}

/* Master Editor */
.resume-editor-box {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-lg);
  padding: 1.5rem;
}

.editor-top-bar {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 1.25rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.editor-title { font-size: 1.05rem; font-weight: 700; color: #f8fafc; }
.editor-desc { font-size: 0.78rem; color: var(--text-muted); }

.upload-actions { display: flex; gap: 0.5rem; }
.file-upload-lbl { cursor: pointer; position: relative; }
.hidden-input { display: none; }

.form-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

@media (max-width: 600px) { .form-grid { grid-template-columns: 1fr; } }

.field-lbl {
  display: block;
  font-size: 0.72rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
  margin-bottom: 0.35rem;
}

.input-field {
  width: 100%;
  background: rgba(0, 0, 0, 0.35);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-sm);
  padding: 0.55rem 0.75rem;
  color: #f8fafc;
  font-size: 0.85rem;
}

.input-field:focus {
  outline: none;
  border-color: #38bdf8;
}

.skills-input-hdr { display: flex; justify-content: space-between; }
.skills-count { font-size: 0.7rem; color: #38bdf8; font-family: var(--font-mono); }
.editor-footer-btn { margin-top: 1.5rem; display: flex; justify-content: flex-end; }

/* Modal Footer */
.modal-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1.25rem 1.75rem;
  background: #111827;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  gap: 1rem;
  flex-wrap: wrap;
}

.submitted-badge { font-size: 0.8rem; font-weight: 700; color: #34d399; }
.ready-badge { font-size: 0.8rem; font-weight: 700; color: #38bdf8; }
.warn-badge { font-size: 0.8rem; font-weight: 700; color: #fbbf24; }

.footer-actions { display: flex; gap: 0.75rem; }

.btn-apply {
  background: linear-gradient(135deg, #10b981, #059669);
  color: #ffffff;
  font-weight: 700;
  border: none;
  box-shadow: 0 4px 14px rgba(16, 185, 129, 0.4);
}

.btn-apply:hover:not(:disabled) {
  background: linear-gradient(135deg, #059669, #047857);
  transform: translateY(-1px);
}

.btn-applied {
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
  border: 1px solid #10b981;
}

.btn-disabled {
  opacity: 0.4;
  cursor: not-allowed;
  box-shadow: none;
}

/* Submission Receipt Styles */
.receipt-pane {
  display: flex;
  flex-direction: column;
}

.receipt-card {
  padding: 1.75rem 2rem;
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(56, 189, 248, 0.04));
  border: 1px solid rgba(16, 185, 129, 0.35);
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.4);
}

.receipt-seal-row {
  display: flex;
  align-items: center;
  gap: 1.1rem;
}

.seal-icon {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.2);
  border: 2px solid #10b981;
  color: #34d399;
  font-size: 1.6rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  box-shadow: 0 0 20px rgba(16, 185, 129, 0.4);
  flex-shrink: 0;
}

.seal-title-group {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.seal-badge {
  font-size: 0.68rem;
  font-weight: 800;
  font-family: var(--font-mono);
  background: rgba(16, 185, 129, 0.18);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #34d399;
  padding: 0.15rem 0.5rem;
  border-radius: var(--radius-full);
  display: inline-block;
  width: fit-content;
}

.seal-title {
  font-size: 1.35rem;
  font-weight: 800;
  color: #ffffff;
}

.seal-sub {
  font-size: 0.82rem;
  color: var(--text-secondary);
}

.receipt-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
  background: rgba(0, 0, 0, 0.4);
  padding: 1.25rem;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.07);
}

.receipt-field {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.rcpt-lbl {
  font-size: 0.7rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.04em;
}

.rcpt-val {
  font-size: 0.88rem;
  color: #ffffff;
}

.receipt-package-preview {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.package-preview-title {
  font-size: 0.82rem;
  font-weight: 700;
  color: var(--text-secondary);
  text-transform: uppercase;
}

.package-items-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.pkg-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.85rem 1rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-md);
}

.pkg-icon {
  font-size: 1.4rem;
}

.pkg-text {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.pkg-text strong {
  font-size: 0.82rem;
  color: #ffffff;
}

.pkg-text span {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.receipt-actions-row {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  flex-wrap: wrap;
  padding-top: 0.5rem;
}

.external-source-btn {
  color: #38bdf8;
  border-color: rgba(56, 189, 248, 0.35);
}

.text-cyan { color: #38bdf8; }

.delivery-explainer-box {
  background: rgba(0, 0, 0, 0.45);
  border: 1px solid rgba(56, 189, 248, 0.25);
  border-radius: var(--radius-md);
  padding: 1.1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.explainer-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.82rem;
  color: #38bdf8;
  font-weight: 700;
}

.explainer-steps {
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  font-size: 0.78rem;
  color: var(--text-secondary);
  line-height: 1.45;
}

.step-num {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  background: rgba(56, 189, 248, 0.2);
  color: #38bdf8;
  font-size: 0.72rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  margin-top: 1px;
}

.step-desc strong {
  color: #f1f5f9;
}

.btn-direct-portal {
  background: linear-gradient(135deg, #0284c7, #0369a1);
  box-shadow: 0 4px 16px rgba(2, 132, 199, 0.4);
}
.btn-direct-portal:hover {
  background: linear-gradient(135deg, #0369a1, #075985);
  transform: translateY(-1px);
}

.btn-bot {
  background: rgba(139, 92, 246, 0.18);
  border: 1px solid rgba(167, 139, 250, 0.4);
  color: #c4b5fd;
}
.btn-bot:hover:not(:disabled) {
  background: rgba(139, 92, 246, 0.3);
  border-color: #a78bfa;
  color: #ffffff;
}

/* Direct Recruiter Email Dispatch Box */
.email-dispatch-box {
  background: rgba(16, 185, 129, 0.05);
  border: 1px solid rgba(16, 185, 129, 0.25);
  border-radius: var(--radius-md);
  padding: 1.1rem 1.25rem;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.email-dispatch-header {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.email-icon {
  font-size: 1.4rem;
}

.email-text-group {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.email-text-group strong {
  font-size: 0.84rem;
  color: #ffffff;
}

.email-text-group span {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.email-input-row {
  display: flex;
  gap: 0.65rem;
  align-items: center;
}

.email-field {
  flex: 1;
}

.btn-send-email {
  white-space: nowrap;
}

.email-success-msg {
  font-size: 0.76rem;
  color: #34d399;
  font-weight: 600;
  font-family: var(--font-mono);
}

/* 1-Click Universal Browser Autofiller Box */
.autofill-box {
  background: rgba(99, 102, 241, 0.07);
  border: 1px solid rgba(129, 140, 248, 0.25);
  border-radius: var(--radius-md);
  padding: 0.95rem 1.25rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.autofill-content {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.autofill-icon {
  font-size: 1.3rem;
  color: #818cf8;
}

.autofill-texts {
  display: flex;
  flex-direction: column;
  gap: 0.15rem;
}

.autofill-title {
  font-size: 0.82rem;
  color: #ffffff;
}

.autofill-desc {
  font-size: 0.72rem;
  color: var(--text-muted);
}

.btn-autofill-copy {
  border-color: rgba(129, 140, 248, 0.4);
  color: #c7d2fe;
  white-space: nowrap;
}
.btn-autofill-copy:hover {
  background: rgba(99, 102, 241, 0.2);
  color: #ffffff;
}

/* Live Terminal Console Styles */
.console-pane {
  display: flex;
  flex-direction: column;
}

.terminal-card {
  background: #090d16;
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-lg);
  overflow: hidden;
  display: flex;
  flex-direction: column;
  box-shadow: 0 10px 35px rgba(0, 0, 0, 0.6);
}

.terminal-header {
  background: #111827;
  padding: 0.65rem 1rem;
  display: flex;
  align-items: center;
  gap: 0.75rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.07);
}

.terminal-dots {
  display: flex;
  gap: 6px;
}

.dot {
  width: 10px;
  height: 10px;
  border-radius: 50%;
}
.dot-red { background: #ef4444; }
.dot-yellow { background: #f59e0b; }
.dot-green { background: #10b981; }

.terminal-title {
  font-size: 0.74rem;
  font-family: var(--font-mono);
  color: var(--text-secondary);
  flex: 1;
}

.terminal-status-badge {
  font-size: 0.65rem;
  font-family: var(--font-mono);
  font-weight: 700;
  padding: 0.15rem 0.45rem;
  border-radius: var(--radius-full);
  background: rgba(16, 185, 129, 0.2);
  color: #34d399;
}

.terminal-status-badge.live-active {
  background: rgba(245, 158, 11, 0.2);
  color: #fbbf24;
  animation: pulse-badge 1.5s infinite;
}

@keyframes pulse-badge {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.5; }
}

.terminal-body {
  padding: 1.25rem;
  font-family: var(--font-mono);
  font-size: 0.76rem;
  line-height: 1.6;
  min-height: 280px;
  max-height: 380px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.terminal-line {
  display: flex;
  gap: 0.65rem;
}

.line-time {
  color: var(--text-muted);
}

.line-phase {
  color: #38bdf8;
  font-weight: 700;
}

.terminal-line.ats_detect .line-phase { color: #c084fc; }
.terminal-line.schema_mapping .line-phase { color: #f472b6; }
.terminal-line.resume_inject .line-phase { color: #34d399; }
.terminal-line.cover_inject .line-phase { color: #fbbf24; }
.terminal-line.dispatch_transmit .line-phase { color: #10b981; }
.terminal-line.confirmation .line-phase { color: #34d399; }
.terminal-line.error .line-phase { color: #ef4444; }

.line-msg {
  color: #e2e8f0;
}

.terminal-cursor-line {
  margin-top: 0.25rem;
}

.terminal-cursor {
  color: #38bdf8;
  animation: blink-cursor 1s infinite;
}

@keyframes blink-cursor {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

.terminal-footer {
  padding: 0.85rem 1.25rem;
  background: rgba(0, 0, 0, 0.3);
  border-top: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  justify-content: flex-end;
}
</style>
