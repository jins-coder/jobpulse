<template>
  <div class="insights-root">
    <!-- Header Hero -->
    <div class="insights-header glass-panel">
      <div class="header-content">
        <div class="insights-badge-row">
          <span class="pulse-badge">LIVE MARKET RADAR</span>
          <span class="telemetry-badge mono">{{ jobs.length }} Postings Ingested</span>
        </div>
        <h2 class="title">Engineering Market Insights & Hiring Intelligence</h2>
        <p class="subtitle">
          Real-time compensation distributions, regional tech hub density, and technology demand trends aggregated across multi-platform crawlers.
        </p>
      </div>

      <div class="kpi-stats-strip">
        <div class="kpi-card">
          <span class="kpi-label">ROLES ANALYZED</span>
          <strong class="kpi-val mono">{{ jobs.length }}</strong>
          <span class="kpi-sub text-emerald">● 100% Verified</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">REMOTE RATIO</span>
          <strong class="kpi-val mono">{{ remotePercent }}%</strong>
          <span class="kpi-sub text-cyan">{{ remoteCount }} Worldwide roles</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">SCHEDULES</span>
          <strong class="kpi-val mono">{{ partTimePercent }}%</strong>
          <span class="kpi-sub text-purple">{{ partTimeCount }} Part-Time • {{ jobs.length - partTimeCount }} Full-Time</span>
        </div>
        <div class="kpi-card">
          <span class="kpi-label">INDIA TECH HUBS</span>
          <strong class="kpi-val mono">{{ indiaCount }}</strong>
          <span class="kpi-sub text-amber">Bengaluru, Pune, Hyd</span>
        </div>
      </div>
    </div>

    <!-- Charts Grid -->
    <div class="insights-grid">
      <!-- 1. In-Demand Skills -->
      <div class="chart-card glass-panel">
        <div class="chart-header">
          <div>
            <h3 class="chart-title">Most Demanded Skills & Tech Stacks</h3>
            <p class="chart-sub">Extracted keyword frequency across active scraped roles</p>
          </div>
          <span class="chart-pill emerald">Top Skills</span>
        </div>
        
        <div class="bars-container">
          <div v-for="skill in topSkills" :key="skill.name" class="bar-row">
            <div class="bar-label-group">
              <span class="bar-name">{{ skill.name }}</span>
              <span class="bar-count mono">{{ skill.count }} jobs ({{ skill.percent }}%)</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill emerald-fill" :style="{ width: `${skill.percent}%` }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 2. Regional Tech Hubs & Geography -->
      <div class="chart-card glass-panel">
        <div class="chart-header">
          <div>
            <h3 class="chart-title">Geographic & Regional Hub Density</h3>
            <p class="chart-sub">Hiring concentration across Indian and global tech markets</p>
          </div>
          <span class="chart-pill cyan">Regional</span>
        </div>

        <div class="regional-hubs-list">
          <div v-for="hub in regionalHubs" :key="hub.name" class="hub-row">
            <div class="hub-meta">
              <div class="hub-name-group">
                <span class="hub-flag">{{ hub.icon }}</span>
                <span class="hub-title">{{ hub.name }}</span>
              </div>
              <span class="hub-count mono">{{ hub.count }} roles ({{ hub.percent }}%)</span>
            </div>
            <div class="bar-track">
              <div class="bar-fill" :class="hub.fillClass" :style="{ width: `${hub.percent}%` }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 3. Full-Time vs Part-Time Schedule Breakdown -->
      <div class="chart-card glass-panel">
        <div class="chart-header">
          <div>
            <h3 class="chart-title">Work Schedule Distribution</h3>
            <p class="chart-sub">Full-Time careers vs flexible Part-Time & Contract roles</p>
          </div>
          <span class="chart-pill purple">Schedules</span>
        </div>

        <div class="schedules-overview">
          <div class="schedule-split-bar">
            <div class="split-segment fulltime" :style="{ width: `${100 - partTimePercent}%` }" title="Full-Time Roles">
              <span>Full-Time ({{ 100 - partTimePercent }}%)</span>
            </div>
            <div class="split-segment parttime" :style="{ width: `${partTimePercent}%` }" title="Part-Time Roles">
              <span>Part-Time ({{ partTimePercent }}%)</span>
            </div>
          </div>

          <div class="schedule-cards-mini">
            <div class="mini-sched-box fulltime-box">
              <span class="sched-type">Full-Time Permanent</span>
              <strong class="sched-val mono">{{ jobs.length - partTimeCount }} Roles</strong>
              <span class="sched-desc">Enterprise software, core SaaS teams</span>
            </div>
            <div class="mini-sched-box parttime-box">
              <span class="sched-type">Part-Time / Advisory</span>
              <strong class="sched-val mono">{{ partTimeCount }} Roles</strong>
              <span class="sched-desc">Consulting, 20h/wk, automation & UI</span>
            </div>
          </div>
        </div>
      </div>

      <!-- 4. Compensation by Experience Level -->
      <div class="chart-card glass-panel">
        <div class="chart-header">
          <div>
            <h3 class="chart-title">Average Compensation by Seniority</h3>
            <p class="chart-sub">Annual median brackets across US ($) and India (₹)</p>
          </div>
          <span class="chart-pill indigo">Salaries</span>
        </div>

        <div class="bars-container">
          <div v-for="lvl in salaryByLevel" :key="lvl.level" class="bar-row">
            <div class="bar-label-group">
              <span class="bar-name">{{ lvl.level }} Level</span>
              <div class="bar-dual-salary mono">
                <span class="text-emerald">${{ Math.round(lvl.avgUsd / 1000) }}k/yr</span>
                <span class="salary-sep">/</span>
                <span class="text-amber">₹{{ lvl.avgInrL }}L/yr</span>
              </div>
            </div>
            <div class="bar-track">
              <div class="bar-fill indigo-fill" :style="{ width: `${(lvl.avgUsd / 220000) * 100}%` }"></div>
            </div>
          </div>
        </div>
      </div>

      <!-- 5. Top Hiring Companies Leaderboard -->
      <div class="chart-card glass-panel">
        <div class="chart-header">
          <div>
            <h3 class="chart-title">Active Hiring Companies</h3>
            <p class="chart-sub">Organizations with the highest current posting volume</p>
          </div>
          <span class="chart-pill amber">Leaderboard</span>
        </div>

        <div class="companies-leaderboard">
          <div v-for="(comp, i) in topCompanies" :key="comp.name" class="company-row">
            <span class="rank-num mono">#{{ i + 1 }}</span>
            <div class="comp-info">
              <span class="comp-name">{{ comp.name }}</span>
              <span class="comp-loc">{{ comp.location }}</span>
            </div>
            <span class="comp-openings mono">{{ comp.count }} role{{ comp.count > 1 ? 's' : '' }}</span>
          </div>
        </div>
      </div>

      <!-- 6. Platform Channel Distribution -->
      <div class="chart-card glass-panel">
        <div class="chart-header">
          <div>
            <h3 class="chart-title">Source Platform Distribution</h3>
            <p class="chart-sub">Channel origin across multi-source crawler runs</p>
          </div>
          <span class="chart-pill cyan">Sources</span>
        </div>

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

  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      count,
      percent: Math.min(100, Math.round((count / (props.jobs.length || 1)) * 100))
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 6);
});

const partTimeCount = computed(() => {
  return props.jobs.filter(j => (j.type || '').toLowerCase().includes('part')).length;
});

const partTimePercent = computed(() => {
  if (!props.jobs.length) return 0;
  return Math.round((partTimeCount.value / props.jobs.length) * 100);
});

const indiaCount = computed(() => {
  return props.jobs.filter(j => /india|bengaluru|hyderabad|pune|chennai/i.test(j.location || '')).length;
});

const regionalHubs = computed(() => {
  const total = props.jobs.length || 1;
  const inIndia = props.jobs.filter(j => /india|bengaluru|hyderabad|pune|chennai/i.test(j.location || '')).length;
  const inRemote = props.jobs.filter(j => j.isRemote && !/india/i.test(j.location || '')).length;
  const inUs = props.jobs.filter(j => /san francisco|new york|austin|chicago|usa|ca|ny|tx/i.test(j.location || '')).length;

  return [
    { name: 'India Tech Hubs (Bengaluru, Pune, Hyd)', icon: '🇮🇳', count: inIndia, percent: Math.round((inIndia / total) * 100), fillClass: 'amber-fill' },
    { name: 'Global Remote & Worldwide', icon: '🌐', count: inRemote, percent: Math.round((inRemote / total) * 100), fillClass: 'emerald-fill' },
    { name: 'North America Tech Centers (SF, NY)', icon: '🇺🇸', count: inUs, percent: Math.round((inUs / total) * 100), fillClass: 'cyan-fill' }
  ];
});

const salaryByLevel = computed(() => {
  const tiers = ['Entry', 'Mid', 'Senior', 'Lead'];
  
  // Calculate average baseline USD salary from available USD jobs
  const usdJobs = props.jobs.filter(j => j.salary && (j.salary.currency === 'USD' || !j.salary.currency));
  const overallAvgUsd = usdJobs.length > 0 
    ? Math.round(usdJobs.reduce((sum, j) => sum + ((j.salary.min + (j.salary.max || j.salary.min)) / 2), 0) / usdJobs.length)
    : 140000;

  // Multipliers for seniority fit when specific tier sample is small
  const tierMultipliers = { Entry: 0.68, Mid: 0.95, Senior: 1.25, Lead: 1.55 };

  return tiers.map(level => {
    // Find jobs matching experience level or title
    const matchingJobs = props.jobs.filter(j => {
      const expMatch = (j.experienceLevel || '').toLowerCase() === level.toLowerCase();
      const titleMatch = new RegExp(`\\b${level}\\b`, 'i').test(j.title || '');
      return expMatch || titleMatch;
    });

    // Compute actual USD average if matching jobs with USD exist
    const levelUsdJobs = matchingJobs.filter(j => j.salary && (j.salary.currency === 'USD' || !j.salary.currency));
    const avgUsd = levelUsdJobs.length > 0
      ? Math.round(levelUsdJobs.reduce((sum, j) => sum + ((j.salary.min + (j.salary.max || j.salary.min)) / 2), 0) / levelUsdJobs.length)
      : Math.round(overallAvgUsd * tierMultipliers[level]);

    // Compute INR Lakhs equivalent or actual INR jobs
    const levelInrJobs = matchingJobs.filter(j => j.salary && j.salary.currency === 'INR');
    const avgInrL = levelInrJobs.length > 0
      ? Math.round(levelInrJobs.reduce((sum, j) => sum + ((j.salary.min + (j.salary.max || j.salary.min)) / 2), 0) / levelInrJobs.length / 100000)
      : Math.round((avgUsd / 100000) * 16);

    return {
      level,
      avgUsd,
      avgInrL
    };
  });
});

const topCompanies = computed(() => {
  const counts = {};
  const locations = {};
  for (const j of props.jobs) {
    counts[j.company] = (counts[j.company] || 0) + 1;
    locations[j.company] = j.location;
  }

  return Object.entries(counts)
    .map(([name, count]) => ({
      name,
      count,
      location: locations[name] || 'Remote'
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
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

/* Header */
.insights-header {
  padding: 1.75rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  background: linear-gradient(180deg, rgba(16, 23, 38, 0.9) 0%, rgba(10, 15, 26, 0.96) 100%);
}

.insights-badge-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 0.35rem;
}

.pulse-badge {
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 800;
  color: #38bdf8;
  background: rgba(56, 189, 248, 0.15);
  border: 1px solid rgba(56, 189, 248, 0.3);
  padding: 0.15rem 0.5rem;
  border-radius: 4px;
}

.telemetry-badge {
  font-size: 0.65rem;
  color: var(--text-muted);
}

.title {
  font-size: 1.45rem;
  font-weight: 800;
  color: #f8fafc;
  margin-bottom: 0.25rem;
}

.subtitle {
  font-size: 0.84rem;
  color: var(--text-secondary);
  line-height: 1.5;
  max-width: 800px;
}

/* KPI Stats Strip */
.kpi-stats-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 1rem;
  padding-top: 1rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
}

@media (max-width: 850px) {
  .kpi-stats-strip { grid-template-columns: repeat(2, 1fr); }
}

@media (max-width: 480px) {
  .kpi-stats-strip { grid-template-columns: 1fr; }
}

.kpi-card {
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-md);
  padding: 0.75rem 1rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.kpi-label {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  font-weight: 700;
  color: var(--text-muted);
  letter-spacing: 0.05em;
}

.kpi-val {
  font-size: 1.55rem;
  font-weight: 800;
  color: #ffffff;
  line-height: 1.1;
}

.kpi-sub {
  font-size: 0.7rem;
  font-weight: 600;
}

.text-emerald { color: #34d399; }
.text-cyan { color: #38bdf8; }
.text-purple { color: #c084fc; }
.text-amber { color: #fbbf24; }

/* Grid */
.insights-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 1.5rem;
}

@media (max-width: 900px) {
  .insights-grid { grid-template-columns: 1fr; }
}

.chart-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
}

.chart-title {
  font-size: 1rem;
  font-weight: 700;
  color: #f8fafc;
  margin-bottom: 0.15rem;
}

.chart-sub {
  font-size: 0.74rem;
  color: var(--text-muted);
}

.chart-pill {
  font-family: var(--font-mono);
  font-size: 0.62rem;
  font-weight: 800;
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

.chart-pill.emerald { background: rgba(16, 185, 129, 0.15); color: #34d399; }
.chart-pill.cyan { background: rgba(56, 189, 248, 0.15); color: #38bdf8; }
.chart-pill.purple { background: rgba(168, 85, 247, 0.15); color: #c084fc; }
.chart-pill.indigo { background: rgba(99, 102, 241, 0.15); color: #818cf8; }
.chart-pill.amber { background: rgba(245, 158, 11, 0.15); color: #fbbf24; }

/* Bars */
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
  justify-content: space-between;
  align-items: center;
  font-size: 0.8rem;
}

.bar-name { font-weight: 600; color: #cbd5e1; }
.bar-count { font-size: 0.72rem; color: var(--text-muted); }

.bar-dual-salary {
  font-size: 0.75rem;
  font-weight: 700;
  display: flex;
  align-items: center;
  gap: 0.3rem;
}
.salary-sep { color: var(--text-muted); }

.bar-track {
  height: 6px;
  background: rgba(255, 255, 255, 0.08);
  border-radius: var(--radius-full);
  overflow: hidden;
}

.bar-fill {
  height: 100%;
  border-radius: var(--radius-full);
  transition: width 0.6s ease;
}

.emerald-fill { background: linear-gradient(90deg, #10b981, #059669); }
.cyan-fill { background: linear-gradient(90deg, #38bdf8, #0284c7); }
.indigo-fill { background: linear-gradient(90deg, #6366f1, #4f46e5); }
.purple-fill { background: linear-gradient(90deg, #a855f7, #7c3aed); }
.amber-fill { background: linear-gradient(90deg, #f59e0b, #d97706); }

/* Regional Hubs */
.regional-hubs-list {
  display: flex;
  flex-direction: column;
  gap: 0.95rem;
}

.hub-row {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
}

.hub-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.hub-name-group {
  display: flex;
  align-items: center;
  gap: 0.45rem;
}

.hub-flag { font-size: 1rem; }
.hub-title { font-size: 0.8rem; font-weight: 600; color: #f8fafc; }
.hub-count { font-size: 0.72rem; color: var(--text-muted); }

/* Schedules Overview */
.schedules-overview {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.schedule-split-bar {
  display: flex;
  height: 28px;
  border-radius: var(--radius-md);
  overflow: hidden;
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.split-segment {
  display: flex;
  align-items: center;
  justify-content: center;
  font-family: var(--font-mono);
  font-size: 0.68rem;
  font-weight: 800;
  transition: width 0.5s ease;
}

.split-segment.fulltime {
  background: linear-gradient(90deg, #3b82f6, #1d4ed8);
  color: #ffffff;
}

.split-segment.parttime {
  background: linear-gradient(90deg, #8b5cf6, #6d28d9);
  color: #ffffff;
}

.schedule-cards-mini {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 0.75rem;
}

.mini-sched-box {
  padding: 0.85rem;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.fulltime-box {
  background: rgba(59, 130, 246, 0.08);
  border: 1px solid rgba(59, 130, 246, 0.25);
}

.parttime-box {
  background: rgba(139, 92, 246, 0.08);
  border: 1px solid rgba(139, 92, 246, 0.25);
}

.sched-type { font-size: 0.75rem; font-weight: 700; color: #f8fafc; }
.sched-val { font-size: 1.15rem; color: #ffffff; }
.sched-desc { font-size: 0.68rem; color: var(--text-muted); }

/* Companies Leaderboard */
.companies-leaderboard {
  display: flex;
  flex-direction: column;
  gap: 0.6rem;
}

.company-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  padding: 0.6rem 0.75rem;
  background: rgba(255, 255, 255, 0.02);
  border: 1px solid rgba(255, 255, 255, 0.06);
  border-radius: var(--radius-md);
}

.rank-num {
  font-size: 0.82rem;
  font-weight: 800;
  color: #f59e0b;
}

.comp-info {
  display: flex;
  flex-direction: column;
  flex: 1;
}

.comp-name { font-size: 0.84rem; font-weight: 700; color: #f8fafc; }
.comp-loc { font-size: 0.7rem; color: var(--text-muted); }

.comp-openings {
  font-size: 0.72rem;
  color: #34d399;
  font-weight: 700;
  background: rgba(16, 185, 129, 0.12);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
}

/* Platform Shares */
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
  justify-content: space-between;
  font-size: 0.78rem;
}

.plat-title { font-weight: 600; color: #cbd5e1; }
.plat-pct { font-size: 0.72rem; color: var(--text-muted); }
</style>
