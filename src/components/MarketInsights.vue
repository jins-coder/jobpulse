<template>
  <div class="insights-root">
    <div class="insights-header glass-panel">
      <div class="header-content">
        <h2 class="title">Market Insights & Scraped Intelligence</h2>
        <p class="subtitle">Aggregated metrics, salary distributions, and technology trends across {{ jobs.length }} scraped postings.</p>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="insights-grid">
      <!-- In-Demand Skills -->
      <div class="chart-card glass-panel">
        <h3 class="chart-title">Most Demanded Skills & Tech Stack</h3>
        <p class="chart-sub">Extracted keyword frequency across all active job postings</p>
        
        <div class="bars-container">
          <div v-for="skill in topSkills" :key="skill.name" class="bar-row">
            <div class="bar-label-group">
              <span class="bar-name">{{ skill.name }}</span>
              <span class="bar-count mono">{{ skill.count }} jobs</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill emerald-fill" :style="{ width: `${skill.percent}%` }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Salary by Experience Level -->
      <div class="chart-card glass-panel">
        <h3 class="chart-title">Average Salary by Experience Level</h3>
        <p class="chart-sub">Annual compensation median for software engineers</p>

        <div class="bars-container">
          <div v-for="lvl in salaryByLevel" :key="lvl.level" class="bar-row">
            <div class="bar-label-group">
              <span class="bar-name">{{ lvl.level }}</span>
              <span class="bar-count mono">${{ Math.round(lvl.avg / 1000) }}k/yr</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill indigo-fill" :style="{ width: `${(lvl.avg / 240000) * 100}%` }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Source Platform Distribution -->
      <div class="chart-card glass-panel">
        <h3 class="chart-title">Platform Channel Distribution</h3>
        <p class="chart-sub">Where the highest density of tech jobs originated</p>

        <div class="platform-share-list">
          <div v-for="plat in platformShares" :key="plat.name" class="platform-share-item">
            <div class="share-meta">
              <span class="plat-title">{{ plat.name }}</span>
              <span class="plat-pct mono">{{ plat.percent }}%</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill cyan-fill" :style="{ width: `${plat.percent}%` }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- Remote vs Hybrid Breakdown -->
      <div class="chart-card glass-panel">
        <h3 class="chart-title">Work Flexibility Overview</h3>
        <p class="chart-sub">Remote vs. hybrid and office location ratio</p>

        <div class="flexibility-display">
          <div class="flex-stat-circle">
            <span class="circle-val mono">{{ remotePercent }}%</span>
            <span class="circle-label">Remote First</span>
          </div>

          <div class="flex-info-list">
            <div class="flex-item">
              <span class="dot-remote"></span>
              <span class="flex-name">Fully Remote / Worldwide:</span>
              <strong class="mono">{{ remoteCount }}</strong>
            </div>
            <div class="flex-item">
              <span class="dot-hybrid"></span>
              <span class="flex-name">On-site / Hybrid:</span>
              <strong class="mono">{{ jobs.length - remoteCount }}</strong>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  jobs: { type: Array, default: () => [] }
});

const topSkills = computed(() => {
  const counts = {};
  for (const j of props.jobs) {
    for (const t of (j.tags || [])) {
      counts[t] = (counts[t] || 0) + 1;
    }
  }

  const sorted = Object.entries(counts)
    .map(([name, count]) => ({
      name,
      count,
      percent: Math.min(100, Math.round((count / (props.jobs.length || 1)) * 100))
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);

  return sorted;
});

const salaryByLevel = computed(() => {
  const levels = ['Entry', 'Mid', 'Senior', 'Lead'];
  return levels.map(lvl => {
    const matching = props.jobs.filter(j => (j.experienceLevel || '').toLowerCase() === lvl.toLowerCase());
    const avg = matching.length
      ? matching.reduce((sum, j) => sum + (j.salary?.min || 110000), 0) / matching.length
      : (lvl === 'Entry' ? 95000 : lvl === 'Mid' ? 140000 : lvl === 'Senior' ? 180000 : 210000);

    return {
      level: lvl,
      avg
    };
  });
});

const platformShares = computed(() => {
  const counts = {};
  for (const j of props.jobs) {
    counts[j.platform] = (counts[j.platform] || 0) + 1;
  }
  return Object.entries(counts).map(([name, count]) => ({
    name,
    count,
    percent: Math.round((count / (props.jobs.length || 1)) * 100)
  }));
});

const remoteCount = computed(() => {
  return props.jobs.filter(j => j.isRemote).length;
});

const remotePercent = computed(() => {
  if (!props.jobs.length) return 0;
  return Math.round((remoteCount.value / props.jobs.length) * 100);
});
</script>

<style scoped>
.insights-root {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.insights-header {
  padding: 1.5rem;
}

.title {
  font-size: 1.3rem;
  font-weight: 700;
  color: #ffffff;
}

.subtitle {
  font-size: 0.85rem;
  color: var(--text-secondary);
}

.insights-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

.chart-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.chart-title {
  font-size: 1.05rem;
  font-weight: 700;
  color: #ffffff;
}

.chart-sub {
  font-size: 0.78rem;
  color: var(--text-muted);
  margin-bottom: 0.75rem;
}

.bars-container {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.bar-row {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.bar-label-group {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.82rem;
}

.bar-name {
  color: var(--text-primary);
  font-weight: 600;
}

.bar-count {
  color: var(--text-muted);
  font-size: 0.75rem;
}

.bar-track {
  width: 100%;
  height: 7px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.4s ease;
}

.emerald-fill {
  background: linear-gradient(90deg, #10b981, #059669);
}

.indigo-fill {
  background: linear-gradient(90deg, #6366f1, #8b5cf6);
}

.cyan-fill {
  background: linear-gradient(90deg, #06b6d4, #0284c7);
}

.platform-share-list {
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.platform-share-item {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.share-meta {
  display: flex;
  align-items: center;
  justify-content: space-between;
  font-size: 0.82rem;
}

.plat-title {
  font-weight: 600;
  color: var(--text-primary);
}

.plat-pct {
  color: #38bdf8;
  font-weight: 700;
}

.flexibility-display {
  display: flex;
  align-items: center;
  gap: 2rem;
  padding-top: 1rem;
}

.flex-stat-circle {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: rgba(16, 185, 129, 0.1);
  border: 2px solid var(--accent-emerald);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.circle-val {
  font-size: 1.45rem;
  font-weight: 800;
  color: #34d399;
}

.circle-label {
  font-size: 0.65rem;
  color: var(--text-muted);
  text-transform: uppercase;
}

.flex-info-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.flex-item {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.85rem;
}

.dot-remote {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-emerald);
}

.dot-hybrid {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: var(--accent-amber);
}

.flex-name {
  color: var(--text-secondary);
}

@media (max-width: 850px) {
  .insights-grid {
    grid-template-columns: 1fr;
  }
}
</style>
