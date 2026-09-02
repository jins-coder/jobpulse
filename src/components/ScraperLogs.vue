<template>
  <div class="terminal-card glass-panel">
    <!-- Terminal Header Bar -->
    <div class="terminal-bar">
      <div class="terminal-dots">
        <span class="dot dot-red"></span>
        <span class="dot dot-yellow"></span>
        <span class="dot dot-green"></span>
        <span class="terminal-title">scraper-worker-core.sh — bash</span>
      </div>

      <div class="terminal-controls">
        <!-- Level Filters -->
        <div class="level-filters">
          <button 
            v-for="lvl in levels" 
            :key="lvl" 
            class="lvl-btn"
            :class="{ active: selectedLevel === lvl }"
            @click="selectedLevel = lvl"
          >
            {{ lvl }}
          </button>
        </div>

        <button 
          class="ctrl-btn" 
          :class="{ active: autoScroll }" 
          @click="autoScroll = !autoScroll"
          title="Toggle Auto-scroll"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M12 5v14"/>
            <path d="m19 12-7 7-7-7"/>
          </svg>
          <span>Auto-scroll</span>
        </button>

        <button class="ctrl-btn" @click="copyAllLogs" title="Copy Terminal Output">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <rect width="14" height="14" x="8" y="8" rx="2" ry="2"/>
            <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2"/>
          </svg>
          <span>{{ copied ? 'Copied!' : 'Copy' }}</span>
        </button>

        <button class="ctrl-btn" @click="$emit('clear')" title="Clear Logs">
          <svg xmlns="http://www.w3.org/2000/svg" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
            <path d="M3 6h18"/>
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"/>
          </svg>
        </button>
      </div>
    </div>

    <!-- Terminal Screen Body -->
    <div class="terminal-body" ref="bodyRef">
      <div v-if="filteredLogs.length === 0" class="terminal-idle">
        <div class="idle-line">
          <span class="prompt-user">guest@jobpulse-crawler</span>:<span class="prompt-path">~/engine</span>$ ./scraper-daemon --status
        </div>
        <div class="idle-response">
          [STATUS] Engine idle. Ready to initialize multi-source spider worker.
        </div>
        <div class="blinking-cursor">_</div>
      </div>

      <div v-else class="logs-stream">
        <div 
          v-for="entry in filteredLogs" 
          :key="entry.id" 
          class="log-row"
          :class="`level-${entry.level.toLowerCase()}`"
        >
          <span class="log-time">{{ entry.timestamp }}</span>
          <span class="log-pill" :class="`pill-${entry.level.toLowerCase()}`">
            {{ entry.level }}
          </span>
          <span class="log-msg">{{ entry.message }}</span>
        </div>
        <div v-if="isScraping" class="scraping-pulse-line">
          <span class="pulse-indicator"></span>
          <span>DOM crawler thread executing...</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch, nextTick } from 'vue';

const props = defineProps({
  logs: { type: Array, default: () => [] },
  isScraping: { type: Boolean, default: false }
});

defineEmits(['clear']);

const levels = ['ALL', 'INFO', 'NETWORK', 'PARSE', 'SUCCESS', 'WARN'];
const selectedLevel = ref('ALL');
const autoScroll = ref(true);
const copied = ref(false);
const bodyRef = ref(null);

const filteredLogs = computed(() => {
  if (selectedLevel.value === 'ALL') return props.logs;
  return props.logs.filter(l => l.level === selectedLevel.value);
});

const scrollToBottom = () => {
  if (autoScroll.value && bodyRef.value) {
    bodyRef.value.scrollTop = bodyRef.value.scrollHeight;
  }
};

watch(() => props.logs.length, () => {
  nextTick(() => scrollToBottom());
});

const copyAllLogs = () => {
  const text = props.logs.map(l => `[${l.timestamp}] [${l.level}] ${l.message}`).join('\n');
  navigator.clipboard.writeText(text).then(() => {
    copied.value = true;
    setTimeout(() => { copied.value = false; }, 2000);
  });
};
</script>

<style scoped>
.terminal-card {
  background: var(--bg-terminal);
  border: 1px solid rgba(255, 255, 255, 0.12);
  border-radius: var(--radius-lg);
  overflow: hidden;
  box-shadow: var(--shadow-lg);
  display: flex;
  flex-direction: column;
}

.terminal-bar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.65rem 1rem;
  background: #090e18;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
  flex-wrap: wrap;
  gap: 0.75rem;
}

.terminal-dots {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.dot {
  width: 11px;
  height: 11px;
  border-radius: 50%;
}
.dot-red { background: #ef4444; }
.dot-yellow { background: #f59e0b; }
.dot-green { background: #10b981; }

.terminal-title {
  margin-left: 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.75rem;
  color: var(--text-muted);
}

.terminal-controls {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.level-filters {
  display: flex;
  align-items: center;
  background: rgba(0, 0, 0, 0.4);
  padding: 0.2rem;
  border-radius: var(--radius-sm);
  border: 1px solid var(--border-subtle);
}

.lvl-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 700;
  padding: 0.2rem 0.45rem;
  border-radius: 3px;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.lvl-btn:hover {
  color: #ffffff;
}

.lvl-btn.active {
  background: rgba(255, 255, 255, 0.12);
  color: var(--accent-emerald);
}

.ctrl-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.35rem;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--border-subtle);
  color: var(--text-secondary);
  font-family: var(--font-main);
  font-size: 0.75rem;
  padding: 0.3rem 0.6rem;
  border-radius: var(--radius-sm);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.ctrl-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.ctrl-btn.active {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border-color: rgba(16, 185, 129, 0.35);
}

/* Terminal Body */
.terminal-body {
  height: 380px;
  overflow-y: auto;
  padding: 1rem 1.25rem;
  font-family: var(--font-mono);
  font-size: 0.82rem;
  line-height: 1.6;
  background: #060910;
}

.terminal-idle {
  color: var(--text-muted);
  display: flex;
  flex-direction: column;
  gap: 0.4rem;
}

.prompt-user {
  color: #10b981;
}

.prompt-path {
  color: #38bdf8;
}

.idle-response {
  color: var(--text-secondary);
}

.blinking-cursor {
  color: #10b981;
  font-weight: 800;
  animation: blink 1s infinite;
}

@keyframes blink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0; }
}

/* Logs stream */
.logs-stream {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.log-row {
  display: flex;
  align-items: flex-start;
  gap: 0.65rem;
  word-break: break-word;
}

.log-time {
  color: var(--text-muted);
  font-size: 0.75rem;
  white-space: nowrap;
}

.log-pill {
  font-size: 0.65rem;
  font-weight: 700;
  padding: 0.1rem 0.4rem;
  border-radius: 3px;
  white-space: nowrap;
  letter-spacing: 0.03em;
}

.pill-info {
  background: rgba(56, 189, 248, 0.15);
  color: #38bdf8;
}

.pill-network {
  background: rgba(129, 140, 248, 0.18);
  color: #818cf8;
}

.pill-parse {
  background: rgba(192, 132, 252, 0.18);
  color: #c084fc;
}

.pill-success {
  background: rgba(52, 211, 153, 0.18);
  color: #34d399;
}

.pill-warn {
  background: rgba(251, 191, 36, 0.18);
  color: #fbbf24;
}

.pill-error {
  background: rgba(248, 113, 113, 0.18);
  color: #f87171;
}

.log-msg {
  color: var(--text-primary);
  flex: 1;
}

.level-success .log-msg {
  color: #a7f3d0;
}

.level-warn .log-msg {
  color: #fde68a;
}

.level-error .log-msg {
  color: #fca5a5;
}

.scraping-pulse-line {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: var(--accent-emerald);
  font-size: 0.78rem;
  margin-top: 0.5rem;
}

.pulse-indicator {
  width: 7px;
  height: 7px;
  border-radius: 50%;
  background: var(--accent-emerald);
  animation: pulseGlow 1.2s infinite;
}
</style>
