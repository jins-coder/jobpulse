<template>
  <div class="auth-modal-overlay" @click.self="$emit('close')">
    <div class="auth-modal glass-panel">
      <!-- Modal Header -->
      <div class="modal-header">
        <div class="header-brand-wrap">
          <div class="brand-icon pulse-active">
            <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"/>
              <path d="m4.93 4.93 4.24 4.24"/>
              <path d="m14.83 9.17 4.24-4.24"/>
              <path d="m14.83 14.83 4.24 4.24"/>
              <path d="m9.17 14.83-4.24 4.24"/>
              <circle cx="12" cy="12" r="4"/>
            </svg>
          </div>
          <div>
            <h3 class="modal-title">Job<span class="brand-accent">Pulse</span> Account</h3>
            <p class="modal-subtitle">Sign in to sync your applications and AI tailored resumes</p>
          </div>
        </div>
        <button class="close-btn" @click="$emit('close')">✕</button>
      </div>

      <!-- Quick Demo Login Banner -->
      <div class="demo-banner">
        <div class="demo-info">
          <span class="demo-pill">TEST DRIVE</span>
          <span class="demo-text">Log in as <strong>Alex Morgan</strong> (Senior Vue/Full-Stack)</span>
        </div>
        <button class="btn btn-secondary btn-sm btn-demo" :disabled="isLoading" @click="handleDemoLogin">
          ⚡ 1-Click Demo Login
        </button>
      </div>

      <!-- Tabs (Sign In vs Register) -->
      <div class="auth-tabs">
        <button 
          class="auth-tab" 
          :class="{ active: activeTab === 'login' }"
          @click="switchTab('login')"
        >
          Sign In
        </button>
        <button 
          class="auth-tab" 
          :class="{ active: activeTab === 'register' }"
          @click="switchTab('register')"
        >
          Create Account
        </button>
      </div>

      <!-- Error message -->
      <div v-if="errorMessage" class="auth-error-alert">
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <circle cx="12" cy="12" r="10"/>
          <line x1="12" y1="8" x2="12" y2="12"/>
          <line x1="12" y1="16" x2="12.01" y2="16"/>
        </svg>
        <span>{{ errorMessage }}</span>
      </div>

      <!-- Sign In Form -->
      <form v-if="activeTab === 'login'" @submit.prevent="handleLogin" class="auth-form">
        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input 
            v-model="loginEmail" 
            type="email" 
            required 
            placeholder="alex@jobpulse.io" 
            class="input-field" 
          />
        </div>

        <div class="form-group">
          <label class="form-label">Password</label>
          <input 
            v-model="loginPassword" 
            type="password" 
            required 
            placeholder="••••••••" 
            class="input-field" 
          />
        </div>

        <button type="submit" class="btn btn-primary btn-submit" :disabled="isLoading">
          <span v-if="isLoading" class="spinner"></span>
          <span v-else>Sign In to Account</span>
        </button>
      </form>

      <!-- Create Account Form -->
      <form v-else @submit.prevent="handleRegister" class="auth-form">
        <div class="form-group">
          <label class="form-label">Full Name</label>
          <input 
            v-model="regName" 
            type="text" 
            required 
            placeholder="e.g., Sarah Connor" 
            class="input-field" 
          />
        </div>

        <div class="form-group">
          <label class="form-label">Email Address</label>
          <input 
            v-model="regEmail" 
            type="email" 
            required 
            placeholder="sarah@example.com" 
            class="input-field" 
          />
        </div>

        <div class="form-group">
          <label class="form-label">Professional Headline</label>
          <input 
            v-model="regHeadline" 
            type="text" 
            placeholder="e.g., Full-Stack Engineer | Vue 3 & Node.js" 
            class="input-field" 
          />
        </div>

        <div class="form-group">
          <label class="form-label">Password (min 6 characters)</label>
          <input 
            v-model="regPassword" 
            type="password" 
            required 
            minlength="6"
            placeholder="••••••••" 
            class="input-field" 
          />
        </div>

        <button type="submit" class="btn btn-primary btn-submit" :disabled="isLoading">
          <span v-if="isLoading" class="spinner"></span>
          <span v-else>Create Account & Sign In</span>
        </button>
      </form>

      <!-- Footer Info -->
      <div class="modal-footer-note">
        <span>Protected by Node.js Express Auth & Bcrypt encryption.</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { authService } from '../services/authService.js';

const emit = defineEmits(['close', 'auth-success']);

const activeTab = ref('login');
const isLoading = ref(false);
const errorMessage = ref('');

// Form states
const loginEmail = ref('alex@jobpulse.io');
const loginPassword = ref('password123');

const regName = ref('');
const regEmail = ref('');
const regHeadline = ref('');
const regPassword = ref('');

const switchTab = (tab) => {
  activeTab.value = tab;
  errorMessage.value = '';
};

const handleLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const user = await authService.login({
      email: loginEmail.value,
      password: loginPassword.value
    });
    emit('auth-success', user);
    emit('close');
  } catch (err) {
    errorMessage.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

const handleRegister = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const user = await authService.register({
      name: regName.value,
      email: regEmail.value,
      password: regPassword.value,
      headline: regHeadline.value
    });
    emit('auth-success', user);
    emit('close');
  } catch (err) {
    errorMessage.value = err.message;
  } finally {
    isLoading.value = false;
  }
};

const handleDemoLogin = async () => {
  isLoading.value = true;
  errorMessage.value = '';
  try {
    const user = await authService.demoLogin();
    emit('auth-success', user);
    emit('close');
  } catch (err) {
    errorMessage.value = err.message;
  } finally {
    isLoading.value = false;
  }
};
</script>

<style scoped>
.auth-modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.75);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  z-index: 1100;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.auth-modal {
  width: 100%;
  max-width: 460px;
  background: linear-gradient(180deg, rgba(16, 23, 38, 0.95) 0%, rgba(10, 15, 26, 0.98) 100%);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-xl);
  padding: 1.75rem;
  box-shadow: 0 24px 60px rgba(0, 0, 0, 0.8), 0 0 40px rgba(16, 185, 129, 0.08);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.modal-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
}

.header-brand-wrap {
  display: flex;
  align-items: center;
  gap: 0.75rem;
}

.brand-icon {
  width: 38px;
  height: 38px;
  border-radius: var(--radius-md);
  background: linear-gradient(135deg, #10b981, #059669);
  display: flex;
  align-items: center;
  justify-content: center;
  color: #ffffff;
}

.modal-title {
  font-size: 1.15rem;
  font-weight: 800;
  color: #f8fafc;
}

.brand-accent {
  color: #10b981;
}

.modal-subtitle {
  font-size: 0.76rem;
  color: var(--text-muted);
}

.close-btn {
  background: rgba(255, 255, 255, 0.06);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--text-secondary);
  border-radius: var(--radius-full);
  width: 28px;
  height: 28px;
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

/* Demo Banner */
.demo-banner {
  background: rgba(99, 102, 241, 0.12);
  border: 1px solid rgba(99, 102, 241, 0.3);
  border-radius: var(--radius-md);
  padding: 0.75rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 0.5rem;
}

.demo-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.demo-pill {
  font-family: var(--font-mono);
  font-size: 0.6rem;
  font-weight: 800;
  color: #818cf8;
  background: rgba(99, 102, 241, 0.2);
  padding: 0.1rem 0.35rem;
  border-radius: 4px;
  align-self: flex-start;
}

.demo-text {
  font-size: 0.72rem;
  color: #cbd5e1;
}

.btn-demo {
  background: rgba(99, 102, 241, 0.25);
  border-color: #818cf8;
  color: #ffffff;
  font-size: 0.75rem;
  font-weight: 700;
  padding: 0.4rem 0.75rem;
  white-space: nowrap;
}

.btn-demo:hover {
  background: #6366f1;
}

/* Tabs */
.auth-tabs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  background: rgba(0, 0, 0, 0.4);
  padding: 0.25rem;
  border-radius: var(--radius-md);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.auth-tab {
  background: transparent;
  border: none;
  color: var(--text-secondary);
  font-family: var(--font-main);
  font-size: 0.85rem;
  font-weight: 700;
  padding: 0.5rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.auth-tab.active {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* Form */
.auth-form {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.form-label {
  font-size: 0.78rem;
  font-weight: 600;
  color: var(--text-secondary);
}

.input-field {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
  padding: 0.65rem 0.85rem;
  color: #f8fafc;
  font-size: 0.88rem;
  transition: all var(--transition-fast);
}

.input-field:focus {
  outline: none;
  border-color: #10b981;
  box-shadow: 0 0 10px rgba(16, 185, 129, 0.25);
}

.btn-submit {
  width: 100%;
  padding: 0.75rem;
  font-size: 0.92rem;
  margin-top: 0.5rem;
}

.auth-error-alert {
  background: rgba(244, 63, 94, 0.15);
  border: 1px solid rgba(244, 63, 94, 0.35);
  color: #fda4af;
  padding: 0.6rem 0.85rem;
  border-radius: var(--radius-md);
  font-size: 0.8rem;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.modal-footer-note {
  text-align: center;
  font-size: 0.68rem;
  color: var(--text-muted);
}

.spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #ffffff;
  border-radius: 50%;
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  100% { transform: rotate(360deg); }
}
</style>
