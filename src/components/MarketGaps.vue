<template>
  <div class="market-gaps-root">
    <!-- Hero Banner -->
    <div class="gaps-hero glass-panel">
      <div class="hero-top-row">
        <div class="badge-group">
          <span class="pulse-badge">ANALYSIS & SOLUTION MATRIX</span>
          <span class="telemetry-badge mono">7 Gaps Solved</span>
        </div>
        <div class="live-stats-mini mono">
          <span class="stat-item"><strong class="text-emerald">{{ jobs.length }}</strong> Live Opportunities</span>
          <span class="stat-sep">•</span>
          <span class="stat-item"><strong class="text-cyan">{{ uniquePlatforms.length }}</strong> Platforms Unified</span>
          <span class="stat-sep">•</span>
          <span class="stat-item"><strong class="text-amber">100%</strong> Candidate-First</span>
        </div>
      </div>

      <h1 class="hero-title">
        What Today's Job Market <span class="gradient-text">Lacks</span> (And How JobPulse Solves It)
      </h1>
      <p class="hero-desc">
        The modern hiring ecosystem is broken for applicants. Companies invest billions in automated filtering algorithms, leaving candidates trapped in opaque portals, ghost listings, and silent rejections. Here is our architectural breakdown of the <strong>7 fundamental flaws</strong> and how JobPulse engineering solves every one.
      </p>

      <!-- Quick Interactive Matrix Strip -->
      <div class="matrix-pills-row">
        <a 
          v-for="(gap, index) in gaps" 
          :key="gap.id" 
          :href="'#gap-' + gap.id" 
          class="matrix-quick-pill"
          :class="gap.colorClass"
        >
          <span class="gap-num mono">#{{ index + 1 }}</span>
          <span class="gap-short-label">{{ gap.shortTitle }}</span>
        </a>
      </div>
    </div>

    <!-- Architectural Comparison Table: Legacy vs JobPulse -->
    <div class="comparison-card glass-panel">
      <div class="card-header">
        <div>
          <h2 class="section-title">Legacy Portals vs. JobPulse Platform</h2>
          <p class="section-subtitle">Direct feature-by-feature architectural comparison</p>
        </div>
        <span class="header-tag mono">ZERO HARDCODED DATA</span>
      </div>

      <div class="table-container">
        <table class="comparison-table">
          <thead>
            <tr>
              <th class="th-feature">Ecosystem Dimension</th>
              <th class="th-legacy">Legacy Platforms (LinkedIn, Indeed)</th>
              <th class="th-jobpulse">JobPulse Intelligent Platform</th>
              <th class="th-action">Interactive Action</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="gap in gaps" :key="'table-' + gap.id">
              <td class="td-feature">
                <span class="feature-icon">{{ gap.icon }}</span>
                <strong>{{ gap.title }}</strong>
              </td>
              <td class="td-legacy">
                <div class="legacy-flaw-cell">
                  <span class="flaw-cross">❌</span>
                  <span>{{ gap.legacyFlaw }}</span>
                </div>
              </td>
              <td class="td-jobpulse">
                <div class="jobpulse-sol-cell">
                  <span class="sol-check">✅</span>
                  <div>
                    <strong>{{ gap.jobpulseTitle }}</strong>
                    <p class="sol-desc">{{ gap.jobpulseSummary }}</p>
                  </div>
                </div>
              </td>
              <td class="td-action">
                <button class="btn btn-sm btn-outline-emerald" @click="handleAction(gap.actionTarget)">
                  {{ gap.actionLabel }} ⚡
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>

    <!-- The 7 Detailed Problem & Solution Cards -->
    <div class="cards-list">
      <div 
        v-for="(gap, idx) in gaps" 
        :key="gap.id" 
        :id="'gap-' + gap.id" 
        class="gap-card glass-panel"
      >
        <div class="gap-card-top">
          <div class="gap-badge-meta">
            <span class="gap-number-badge mono">GAP #0{{ idx + 1 }}</span>
            <span class="category-pill" :class="gap.colorClass">{{ gap.category }}</span>
          </div>
          <button class="btn btn-primary btn-sm action-top-btn" @click="handleAction(gap.actionTarget)">
            <span>{{ gap.actionLabel }}</span>
            <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
              <path d="m9 18 6-6-6-6"/>
            </svg>
          </button>
        </div>

        <h3 class="gap-card-title">{{ gap.title }}</h3>

        <div class="problem-solution-grid">
          <!-- The Problem -->
          <div class="pane-problem">
            <div class="pane-hdr text-rose">
              <span class="pane-icon">❌</span>
              <h4>The Problem in Today's Market</h4>
            </div>
            <ul class="flaws-list">
              <li v-for="(p, pi) in gap.problemPoints" :key="pi">
                {{ p }}
              </li>
            </ul>
            <div class="impact-stat-box">
              <span class="stat-label">MARKET IMPACT:</span>
              <strong class="stat-value mono text-rose">{{ gap.marketStat }}</strong>
            </div>
          </div>

          <!-- The JobPulse Solution -->
          <div class="pane-solution">
            <div class="pane-hdr text-emerald">
              <span class="pane-icon">✅</span>
              <h4>The JobPulse Solution</h4>
            </div>
            <p class="solution-narrative">{{ gap.solutionNarrative }}</p>
            <ul class="sol-features-list">
              <li v-for="(s, si) in gap.solutionFeatures" :key="si">
                <span class="check-bullet">✓</span>
                <span>{{ s }}</span>
              </li>
            </ul>

            <!-- Dynamic Telemetry Widget Inside Card -->
            <div class="dynamic-card-telemetry">
              <div v-if="gap.id === 'ats'" class="telemetry-inner">
                <div class="mini-ats-visual">
                  <div class="mini-gauge-ring">
                    <span class="mono ring-val">100</span>
                    <span class="ring-sub">SCALE</span>
                  </div>
                  <div class="mini-gauge-info">
                    <strong>5 Real-time Heuristic Checks</strong>
                    <span>Contact Info (15pt), Metrics (25pt), Action Verbs (20pt), Headings (15pt), Readability (25pt)</span>
                  </div>
                </div>
              </div>

              <div v-else-if="gap.id === 'fragmented'" class="telemetry-inner">
                <div class="platforms-pill-cloud">
                  <span v-for="plat in platformCounts" :key="plat.name" class="plat-badge mono">
                    {{ plat.name }}: <strong class="text-cyan">{{ plat.count }}</strong>
                  </span>
                </div>
              </div>

              <div v-else-if="gap.id === 'tailoring'" class="telemetry-inner">
                <div class="tailor-speed-visual">
                  <div class="stat-bubble">
                    <span class="mono text-rose line-through">45 mins</span>
                    <span class="bubble-sub">Manual Tailoring</span>
                  </div>
                  <span class="arrow-trans">➔</span>
                  <div class="stat-bubble highlight">
                    <span class="mono text-emerald">3 seconds</span>
                    <span class="bubble-sub">JobPulse Gap-Filling</span>
                  </div>
                </div>
              </div>

              <div v-else-if="gap.id === 'ad-spend'" class="telemetry-inner">
                <div class="radar-formula-visual mono">
                  <span class="formula-chip">Skills Fit: 65%</span>
                  <span>+</span>
                  <span class="formula-chip">Domain Alignment: 20%</span>
                  <span>+</span>
                  <span class="formula-chip">Seniority: 15%</span>
                  <span>=</span>
                  <span class="formula-chip result">100% Fit First</span>
                </div>
              </div>

              <div v-else-if="gap.id === 'ghost-jobs'" class="telemetry-inner">
                <div class="freshness-telemetry-row">
                  <span class="fresh-dot active"></span>
                  <span class="fresh-txt">Live Web Scraper Ingestion Timestamps on Every Job Record</span>
                  <span class="fresh-badge mono text-emerald">{{ jobs.length }} Active Crawled Roles</span>
                </div>
              </div>

              <div v-else-if="gap.id === 'compensation'" class="telemetry-inner">
                <div class="currency-distribution-row">
                  <span v-for="curr in currencyCounts" :key="curr.currency" class="curr-stat mono">
                    <span class="curr-symbol">{{ curr.symbol }}</span>
                    <span>{{ curr.currency }}: <strong>{{ curr.count }}</strong> roles</span>
                  </span>
                </div>
              </div>

              <div v-else-if="gap.id === 'tracking'" class="telemetry-inner">
                <div class="kanban-pipeline-preview">
                  <span class="pipe-step">Wishlist</span>
                  <span class="pipe-arrow">→</span>
                  <span class="pipe-step active">⚡ Applied (Tailored)</span>
                  <span class="pipe-arrow">→</span>
                  <span class="pipe-step">Interviewing</span>
                  <span class="pipe-arrow">→</span>
                  <span class="pipe-step">Offered</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div class="gap-card-footer">
          <span class="footer-note mono">Built directly into JobPulse core engine</span>
          <button class="btn btn-secondary btn-sm" @click="handleAction(gap.actionTarget)">
            Launch {{ gap.shortTitle }} ⚡
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';

const props = defineProps({
  jobs: {
    type: Array,
    default: () => []
  }
});

const emit = defineEmits(['change-view', 'open-easy-apply', 'upload-resume']);

// Unique platforms from live jobs
const uniquePlatforms = computed(() => {
  const set = new Set(props.jobs.map(j => j.platform).filter(Boolean));
  return Array.from(set);
});

// Platform counts from live jobs
const platformCounts = computed(() => {
  const counts = {};
  for (const j of props.jobs) {
    counts[j.platform] = (counts[j.platform] || 0) + 1;
  }
  return Object.entries(counts).map(([name, count]) => ({ name, count }));
});

// Currency counts from live jobs
const currencyCounts = computed(() => {
  const counts = { USD: 0, INR: 0, EUR: 0 };
  const symbols = { USD: '$', INR: '₹', EUR: '€' };

  for (const j of props.jobs) {
    const curr = j.salary?.currency || 'USD';
    counts[curr] = (counts[curr] || 0) + 1;
  }

  return Object.entries(counts).map(([currency, count]) => ({
    currency,
    count,
    symbol: symbols[currency] || '$'
  }));
});

// The 7 Market Gaps & Solutions Data Matrix
const gaps = [
  {
    id: 'ats',
    category: 'Candidate Transparency',
    colorClass: 'pill-emerald',
    icon: '🎯',
    shortTitle: 'ATS Checker',
    title: 'The "ATS Black Hole" & Blind Rejections',
    legacyFlaw: 'Over 75% blind silent rejections by Workday, Taleo, Lever. Zero explanatory feedback.',
    jobpulseTitle: 'Real-Time 0-100 ATS Score Checker & Free API',
    jobpulseSummary: 'Live 5-dimension radial score gauge, missing keyword analysis, and 100% free open REST API.',
    marketStat: '75% of applications silently dropped before human review',
    problemPoints: [
      'Over 75% of job applications are filtered out by ATS parsers before any human recruiter reviews them.',
      'Rejections are silent and opaque: candidates receive generic automated emails with zero insights into why they failed.',
      'Commercial ATS resume scoring tools charge predatory monthly subscriptions ($20-$50/month) just to score a single PDF.'
    ],
    solutionNarrative: 'JobPulse includes a free, fully transparent ATS scoring engine analyzing 5 critical heuristic dimensions directly in your browser with zero paywalls.',
    solutionFeatures: [
      'Contact Completeness (15 pts), Standard Headings (15 pts), Metrics (25 pts), Action Verbs (20 pts), and Readability (25 pts).',
      'Target Job Matcher: Select any scraped job to instantly view keyword overlap percentage and missing keywords.',
      'Free open REST API (/api/ats/analyze) with zero API keys or authentication required.'
    ],
    actionLabel: 'Open ATS Optimizer',
    actionTarget: 'ats'
  },
  {
    id: 'fragmented',
    category: 'Search Aggregation',
    colorClass: 'pill-cyan',
    icon: '🌐',
    shortTitle: 'Multi-Platform Ingestion',
    title: 'Fragmented Walled Gardens & Portal Fatigue',
    legacyFlaw: 'Candidates juggle 5-10 separate portals daily, repeating queries and enduring intrusive ads.',
    jobpulseTitle: 'Unified Multi-Platform Ingestion Engine',
    jobpulseSummary: 'Consolidates LinkedIn, Indeed, RemoteOK, Wellfound & WeWorkRemotely in a single live feed.',
    marketStat: '5-10 fragmented job sites searched daily per candidate',
    problemPoints: [
      'Candidates must manage accounts across multiple disjointed platforms with inconsistent search filters.',
      'Sponsored ads and duplicate listings waste hours of candidate attention.',
      'No unified way to compare compensation, requirements, and remote flexibility across sources.'
    ],
    solutionNarrative: 'JobPulse multi-platform scrapers pull live openings into a unified glassmorphic dashboard with normalized schemas, standardized filters, and zero advertising clutter.',
    solutionFeatures: [
      'Single unified search across LinkedIn, Indeed, RemoteOK, Wellfound, and WeWorkRemotely.',
      'Multi-factor filtering by Tech Stack, Experience Level, Job Schedule, and Minimum Compensation.',
      'Fast client-side full-text search with instant feedback.'
    ],
    actionLabel: 'Explore All Scraped Roles',
    actionTarget: 'explorer'
  },
  {
    id: 'tailoring',
    category: 'AI Engineering',
    colorClass: 'pill-purple',
    icon: '⚡',
    shortTitle: 'AI Resume Tailoring',
    title: 'The Manual Resume Tailoring Bottleneck',
    legacyFlaw: 'Manually customizing resumes for 30-50 applications takes 40-60 hours of exhausting repetitive work.',
    jobpulseTitle: 'Automated 75%+ Gap-Filling & Tailoring Engine',
    jobpulseSummary: 'Instantly aligns headline, bridges secondary skills, and drafts 1-paragraph personalized cover pitches.',
    marketStat: '40-60 hours wasted tailoring 30-50 applications',
    problemPoints: [
      'Sending generic resumes yields dismal sub-2% recruiter response rates.',
      'Tailoring summaries, skills, and experience for each role requires 45 minutes of manual writing per application.',
      'Leads to applicant burnout and low application velocity.'
    ],
    solutionNarrative: 'When JobPulse calculates that your candidate profile is >= 75% compatible with a target opening, our Gap-Filling Engine tailors your package in 3 seconds flat.',
    solutionFeatures: [
      'Dynamically tailors headline and professional summary directly to target role and company.',
      'Bridges secondary skill gaps with transferable enterprise engineering highlights.',
      'Drafts a personalized 1-paragraph cover letter pitch ready for immediate submission.'
    ],
    actionLabel: 'Test 1-Click Tailor in Explorer',
    actionTarget: 'explorer'
  },
  {
    id: 'ad-spend',
    category: 'Candidate First',
    colorClass: 'pill-indigo',
    icon: '🎯',
    shortTitle: 'Confidence Matching',
    title: 'Ad-Spend Priority vs. True Candidate Fit',
    legacyFlaw: 'Commercial job boards rank results by who paid the most advertising budget, not skill relevance.',
    jobpulseTitle: 'Candidate-First Confidence Radar',
    jobpulseSummary: 'Orders jobs by multidimensional compatibility index: 65% Skills, 20% Domain, 15% Seniority.',
    marketStat: '100% of legacy search results distorted by ad bids',
    problemPoints: [
      'Traditional platforms monetize by promoting "Sponsored" jobs regardless of whether they fit the job seeker.',
      'Relevant opportunities are buried under pages of paid corporate advertising.',
      'Candidates waste time applying to poorly matched sponsored roles.'
    ],
    solutionNarrative: 'JobPulse flips the paradigm: our default sorting is "Highest Resume Match", ordering opportunities exclusively by mathematical relevance to your background.',
    solutionFeatures: [
      'Top #1, #2, #3 Most Confident Matches spotlighted at the top of the explorer.',
      'Explicit confidence rationales explaining why each match fits your profile.',
      'Zero paid sponsorships or ad-promoted listings.'
    ],
    actionLabel: 'View Candidate Radar',
    actionTarget: 'explorer'
  },
  {
    id: 'ghost-jobs',
    category: 'Listing Freshness',
    colorClass: 'pill-amber',
    icon: '👻',
    shortTitle: 'Ghost Job Protection',
    title: '"Ghost Jobs" & Stale Postings',
    legacyFlaw: '30%-40% of major board listings are ghost jobs: already filled, frozen, or posted for PR/compliance.',
    jobpulseTitle: 'Live Scraper Timestamps & Active Telemetry',
    jobpulseSummary: 'Tracks exact crawler ingestion timestamps and freshness indicators to eliminate wasted effort.',
    marketStat: '30-40% of public job board postings are ghost jobs',
    problemPoints: [
      'Companies leave expired job posts open for months to project false growth or satisfy regulatory mandates.',
      'Candidates spend hours submitting thoughtful applications into dead hiring pipelines.',
      'Major platforms do not disclose when listings were internally closed.'
    ],
    solutionNarrative: 'JobPulse records exact crawler ingestion timestamps on every listing, verifying that roles were actively extracted from live sources within recent hours or days.',
    solutionFeatures: [
      'Exact scraping age displayed on every job card (e.g., "18m ago", "1h ago").',
      'Real-time scraper telemetry logs documenting crawler activity and ingestion cycles.',
      'Automatic pruning of expired or unreachable links.'
    ],
    actionLabel: 'Check Job Freshness in Explorer',
    actionTarget: 'explorer'
  },
  {
    id: 'compensation',
    category: 'Pay Transparency',
    colorClass: 'pill-emerald',
    icon: '💰',
    shortTitle: 'Salary Transparency',
    title: 'Compensation Opacity & Currency Friction',
    legacyFlaw: 'Salaries are hidden or listed with misleading wide ranges ($50k-$250k). Multi-currency friction.',
    jobpulseTitle: 'Transparent Compensation & Multi-Currency Sliders',
    jobpulseSummary: 'Upfront salary badges, Min Salary filter slider, and dedicated INR (₹ Lakhs) and USD ($) formatting.',
    marketStat: '60%+ of traditional listings hide compensation',
    problemPoints: [
      'Employers frequently conceal pay rates until late in the interview pipeline, wasting applicant time.',
      'Global and remote engineers struggle comparing USD, INR CTC, and EUR rates.',
      'Wide brackets ($40k-$180k) disguise true compensation baselines.'
    ],
    solutionNarrative: 'JobPulse requires transparent salary ranges on ingested roles, providing an interactive Min Salary Slider and native formatting for both US ($) and Indian tech hubs (₹ Lakhs/yr).',
    solutionFeatures: [
      'Interactive Min Salary slider to instantly filter below-market compensation.',
      'Dedicated CTC formatting for Indian tech hubs (Bengaluru, Hyderabad, Pune, Chennai).',
      'Normalized currency conversions across USD, INR, and EUR.'
    ],
    actionLabel: 'Filter by Minimum Salary',
    actionTarget: 'explorer'
  },
  {
    id: 'tracking',
    category: 'Pipeline Workflow',
    colorClass: 'pill-cyan',
    icon: '📊',
    shortTitle: 'Kanban Tracker',
    title: 'Disconnected Application Tracking',
    legacyFlaw: 'Applicants rely on messy spreadsheets and notes, losing track of customized resume versions and statuses.',
    jobpulseTitle: 'Integrated Kanban Pipeline & Dual Cloud Sync',
    jobpulseSummary: 'Drag-and-drop stages from Wishlist to Offer, with tailored match badges and Aiven Cloud sync.',
    marketStat: '80%+ of job seekers use disconnected spreadsheets',
    problemPoints: [
      'Tracking 40+ job submissions across spreadsheets is disorganized and prone to missed interviews.',
      'Candidates forget which tailored resume version, cover pitch, and portfolio link was submitted to which role.',
      'No linkage between job postings, resume snapshots, and application status.'
    ],
    solutionNarrative: 'JobPulse features a built-in Kanban Career Tracker that binds the exact tailored application package, match score, and company profile directly to the card.',
    solutionFeatures: [
      'Visual pipeline stages: Wishlist, Applied, Interviewing, Offered, Archived.',
      'Clicking any applied card opens the exact tailored resume and cover pitch submitted.',
      'Dual persistence: offline browser LocalStorage + Aiven OpenSearch cloud synchronization.'
    ],
    actionLabel: 'Open Kanban Tracker',
    actionTarget: 'tracker'
  }
];

const handleAction = (target) => {
  if (target === 'upload-resume') {
    emit('upload-resume');
  } else {
    emit('change-view', target);
  }
  window.scrollTo({ top: 0, behavior: 'smooth' });
};
</script>

<style scoped>
.market-gaps-root {
  display: flex;
  flex-direction: column;
  gap: 2rem;
  padding-bottom: 4rem;
}

/* Hero Section */
.gaps-hero {
  padding: 2.25rem;
  border-radius: var(--radius-xl);
  background: linear-gradient(135deg, rgba(15, 23, 42, 0.95) 0%, rgba(13, 20, 36, 0.92) 100%);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: var(--shadow-xl);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.hero-top-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-wrap: wrap;
  gap: 1rem;
}

.badge-group {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.pulse-badge {
  background: rgba(16, 185, 129, 0.15);
  color: #34d399;
  border: 1px solid rgba(16, 185, 129, 0.35);
  padding: 0.25rem 0.65rem;
  border-radius: var(--radius-full);
  font-size: 0.72rem;
  font-weight: 800;
  letter-spacing: 0.05em;
}

.telemetry-badge {
  background: rgba(56, 189, 248, 0.12);
  color: #38bdf8;
  border: 1px solid rgba(56, 189, 248, 0.3);
  padding: 0.25rem 0.6rem;
  border-radius: var(--radius-full);
  font-size: 0.72rem;
  font-weight: 700;
}

.live-stats-mini {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.stat-sep {
  color: rgba(255, 255, 255, 0.2);
}

.hero-title {
  font-size: 2.2rem;
  font-weight: 800;
  line-height: 1.2;
  letter-spacing: -0.02em;
  color: #ffffff;
}

.gradient-text {
  background: linear-gradient(90deg, #f43f5e, #fb7185, #38bdf8);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-desc {
  font-size: 1rem;
  color: var(--text-secondary);
  line-height: 1.6;
  max-width: 980px;
}

.matrix-pills-row {
  display: flex;
  flex-wrap: wrap;
  gap: 0.6rem;
  margin-top: 0.5rem;
}

.matrix-quick-pill {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.4rem 0.85rem;
  border-radius: var(--radius-full);
  text-decoration: none;
  font-size: 0.8rem;
  font-weight: 600;
  transition: all var(--transition-fast);
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: #cbd5e1;
}

.matrix-quick-pill:hover {
  transform: translateY(-2px);
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
}

.gap-num {
  font-size: 0.7rem;
  font-weight: 800;
  opacity: 0.8;
}

/* Comparison Table Card */
.comparison-card {
  padding: 1.75rem;
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
}

.card-header {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: 1rem;
}

.section-title {
  font-size: 1.45rem;
  font-weight: 800;
  color: #f8fafc;
}

.section-subtitle {
  font-size: 0.85rem;
  color: var(--text-secondary);
  margin-top: 0.2rem;
}

.header-tag {
  font-size: 0.68rem;
  padding: 0.25rem 0.6rem;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34d399;
  border-radius: var(--radius-full);
  font-weight: 700;
}

.table-container {
  overflow-x: auto;
  border-radius: var(--radius-lg);
  border: 1px solid rgba(255, 255, 255, 0.08);
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
  font-size: 0.88rem;
}

.comparison-table thead tr {
  background: rgba(0, 0, 0, 0.4);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.comparison-table th {
  padding: 0.9rem 1.1rem;
  font-family: var(--font-mono);
  font-size: 0.74rem;
  font-weight: 700;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.comparison-table td {
  padding: 1rem 1.1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  vertical-align: middle;
}

.comparison-table tbody tr:hover {
  background: rgba(255, 255, 255, 0.02);
}

.td-feature {
  white-space: nowrap;
}

.feature-icon {
  margin-right: 0.5rem;
  font-size: 1.05rem;
}

.legacy-flaw-cell {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  color: #fda4af;
  font-size: 0.84rem;
  line-height: 1.4;
}

.flaw-cross {
  font-size: 0.8rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.jobpulse-sol-cell {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  color: #e2e8f0;
}

.sol-check {
  font-size: 0.8rem;
  flex-shrink: 0;
  margin-top: 2px;
}

.sol-desc {
  font-size: 0.78rem;
  color: var(--text-secondary);
  margin-top: 0.2rem;
  line-height: 1.35;
}

.btn-outline-emerald {
  background: rgba(16, 185, 129, 0.08);
  border: 1px solid rgba(16, 185, 129, 0.3);
  color: #34d399;
  white-space: nowrap;
}

.btn-outline-emerald:hover {
  background: rgba(16, 185, 129, 0.2);
  color: #ffffff;
  border-color: #10b981;
}

/* Cards List */
.cards-list {
  display: flex;
  flex-direction: column;
  gap: 1.75rem;
}

.gap-card {
  padding: 1.85rem;
  border-radius: var(--radius-xl);
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  scroll-margin-top: 80px;
  border: 1px solid rgba(255, 255, 255, 0.09);
  transition: all var(--transition-normal);
}

.gap-card:hover {
  border-color: rgba(56, 189, 248, 0.3);
  box-shadow: 0 12px 35px -8px rgba(0, 0, 0, 0.5), 0 0 20px rgba(56, 189, 248, 0.05);
}

.gap-card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
}

.gap-badge-meta {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.gap-number-badge {
  font-size: 0.72rem;
  font-weight: 800;
  background: rgba(255, 255, 255, 0.06);
  color: #cbd5e1;
  padding: 0.2rem 0.55rem;
  border-radius: 4px;
}

.category-pill {
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.2rem 0.6rem;
  border-radius: var(--radius-full);
}

.pill-emerald { background: rgba(16, 185, 129, 0.12); color: #34d399; border: 1px solid rgba(16, 185, 129, 0.3); }
.pill-cyan { background: rgba(56, 189, 248, 0.12); color: #38bdf8; border: 1px solid rgba(56, 189, 248, 0.3); }
.pill-purple { background: rgba(168, 85, 247, 0.12); color: #c084fc; border: 1px solid rgba(168, 85, 247, 0.3); }
.pill-indigo { background: rgba(99, 102, 241, 0.12); color: #a5b4fc; border: 1px solid rgba(99, 102, 241, 0.3); }
.pill-amber { background: rgba(245, 158, 11, 0.12); color: #fbbf24; border: 1px solid rgba(245, 158, 11, 0.3); }

.action-top-btn {
  display: flex;
  align-items: center;
  gap: 0.45rem;
  padding: 0.45rem 0.85rem;
  font-size: 0.8rem;
}

.gap-card-title {
  font-size: 1.4rem;
  font-weight: 800;
  color: #ffffff;
  letter-spacing: -0.01em;
}

.problem-solution-grid {
  display: grid;
  grid-template-columns: 1fr 1.25fr;
  gap: 1.5rem;
}

@media (max-width: 900px) {
  .problem-solution-grid {
    grid-template-columns: 1fr;
  }
}

/* Pane Problem */
.pane-problem {
  background: rgba(244, 63, 94, 0.03);
  border: 1px solid rgba(244, 63, 94, 0.18);
  border-radius: var(--radius-lg);
  padding: 1.35rem;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  gap: 1rem;
}

.pane-hdr {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  font-size: 0.92rem;
  font-weight: 700;
}

.pane-hdr h4 {
  font-size: 0.95rem;
  margin: 0;
}

.text-rose { color: #fda4af; }
.text-emerald { color: #34d399; }
.text-cyan { color: #38bdf8; }
.text-amber { color: #fbbf24; }

.flaws-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.65rem;
}

.flaws-list li {
  font-size: 0.85rem;
  color: #f1f5f9;
  line-height: 1.45;
  position: relative;
  padding-left: 1.15rem;
}

.flaws-list li::before {
  content: '•';
  position: absolute;
  left: 0.2rem;
  color: #f43f5e;
  font-weight: 800;
}

.impact-stat-box {
  background: rgba(244, 63, 94, 0.08);
  border: 1px solid rgba(244, 63, 94, 0.25);
  border-radius: var(--radius-md);
  padding: 0.65rem 0.85rem;
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
}

.stat-label {
  font-size: 0.65rem;
  font-weight: 800;
  color: #fda4af;
  letter-spacing: 0.05em;
}

.stat-value {
  font-size: 0.88rem;
  font-weight: 700;
}

/* Pane Solution */
.pane-solution {
  background: rgba(16, 185, 129, 0.03);
  border: 1px solid rgba(16, 185, 129, 0.22);
  border-radius: var(--radius-lg);
  padding: 1.35rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.solution-narrative {
  font-size: 0.88rem;
  color: #e2e8f0;
  line-height: 1.5;
}

.sol-features-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.55rem;
}

.sol-features-list li {
  font-size: 0.84rem;
  color: #cbd5e1;
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  line-height: 1.4;
}

.check-bullet {
  color: #10b981;
  font-weight: 800;
  font-size: 0.85rem;
  flex-shrink: 0;
}

/* Dynamic Card Telemetry */
.dynamic-card-telemetry {
  margin-top: 0.5rem;
  padding-top: 0.85rem;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
}

.mini-ats-visual {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.mini-gauge-ring {
  width: 54px;
  height: 54px;
  border-radius: 50%;
  border: 3px solid #10b981;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background: rgba(16, 185, 129, 0.1);
}

.ring-val {
  font-size: 1rem;
  font-weight: 800;
  color: #34d399;
  line-height: 1;
}

.ring-sub {
  font-size: 0.55rem;
  color: var(--text-muted);
}

.mini-gauge-info {
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  font-size: 0.8rem;
  color: var(--text-secondary);
}

.mini-gauge-info strong {
  color: #f8fafc;
}

.platforms-pill-cloud {
  display: flex;
  flex-wrap: wrap;
  gap: 0.45rem;
}

.plat-badge {
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.1);
  padding: 0.25rem 0.55rem;
  border-radius: 4px;
  font-size: 0.75rem;
  color: #cbd5e1;
}

.tailor-speed-visual {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.stat-bubble {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid rgba(255, 255, 255, 0.08);
  padding: 0.5rem 0.85rem;
  border-radius: var(--radius-md);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.stat-bubble.highlight {
  background: rgba(16, 185, 129, 0.12);
  border-color: rgba(16, 185, 129, 0.35);
}

.line-through {
  text-decoration: line-through;
  opacity: 0.75;
}

.bubble-sub {
  font-size: 0.68rem;
  color: var(--text-muted);
}

.arrow-trans {
  font-size: 1.1rem;
  color: #38bdf8;
}

.radar-formula-visual {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.4rem;
  font-size: 0.75rem;
  color: var(--text-secondary);
}

.formula-chip {
  background: rgba(255, 255, 255, 0.05);
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  color: #cbd5e1;
}

.formula-chip.result {
  background: rgba(16, 185, 129, 0.2);
  border: 1px solid rgba(16, 185, 129, 0.4);
  color: #34d399;
  font-weight: 800;
}

.freshness-telemetry-row {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  font-size: 0.82rem;
  color: #cbd5e1;
}

.fresh-dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
  background: #10b981;
  box-shadow: 0 0 8px #10b981;
}

.fresh-badge {
  background: rgba(16, 185, 129, 0.1);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  font-size: 0.72rem;
  margin-left: auto;
}

.currency-distribution-row {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.75rem;
}

.curr-stat {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(255, 255, 255, 0.04);
  border: 1px solid rgba(255, 255, 255, 0.09);
  padding: 0.3rem 0.65rem;
  border-radius: var(--radius-sm);
  font-size: 0.78rem;
  color: #cbd5e1;
}

.curr-symbol {
  color: #34d399;
  font-weight: 800;
}

.kanban-pipeline-preview {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 0.5rem;
  font-size: 0.78rem;
}

.pipe-step {
  background: rgba(255, 255, 255, 0.04);
  padding: 0.25rem 0.55rem;
  border-radius: 4px;
  color: var(--text-secondary);
}

.pipe-step.active {
  background: rgba(56, 189, 248, 0.18);
  border: 1px solid rgba(56, 189, 248, 0.4);
  color: #38bdf8;
  font-weight: 700;
}

.pipe-arrow {
  color: var(--text-muted);
}

.gap-card-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 1px solid rgba(255, 255, 255, 0.07);
  padding-top: 1rem;
}

.footer-note {
  font-size: 0.72rem;
  color: var(--text-muted);
}
</style>
