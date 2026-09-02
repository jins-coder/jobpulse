<template>
  <div class="tracker-root">
    <div class="tracker-header glass-panel">
      <div class="header-info">
        <h2 class="title">Career Pipeline & Application Tracker</h2>
        <p class="subtitle">Track saved scraped listings through each interview stage.</p>
      </div>

      <div class="summary-pills">
        <div class="summary-chip" v-for="col in columns" :key="col.id">
          <span class="chip-dot" :class="col.id"></span>
          <span class="chip-label">{{ col.title }}:</span>
          <span class="chip-count mono">{{ getColumnJobs(col.id).length }}</span>
        </div>
      </div>
    </div>

    <!-- Kanban Board Grid -->
    <div class="kanban-grid">
      <div 
        v-for="col in columns" 
        :key="col.id" 
        class="kanban-column glass-panel"
      >
        <div class="column-header">
          <div class="column-title-group">
            <span class="column-indicator" :class="col.id"></span>
            <h3 class="column-title">{{ col.title }}</h3>
          </div>
          <span class="column-badge mono">{{ getColumnJobs(col.id).length }}</span>
        </div>

        <div class="column-body">
          <div 
            v-if="getColumnJobs(col.id).length === 0" 
            class="empty-column"
          >
            <span>No jobs in {{ col.title.toLowerCase() }}</span>
          </div>

          <div 
            v-for="job in getColumnJobs(col.id)" 
            :key="job.id" 
            class="kanban-card"
            @click="$emit('select-job', job)"
          >
            <div class="card-top">
              <span class="platform-mini-tag">{{ job.platform }}</span>
              <button 
                class="card-remove-btn" 
                @click.stop="$emit('change-status', { jobId: job.id, status: null })"
                title="Remove from tracker"
              >
                ✕
              </button>
            </div>

            <h4 class="card-job-title">{{ job.title }}</h4>
            <div class="card-company-name">{{ job.company }}</div>

            <!-- Tailored Match Badge -->
            <div v-if="job.matchScore" class="card-tailor-badge" @click.stop="$emit('easy-apply', job)">
              <span>⚡ {{ job.matchScore }}% Tailored Match</span>
            </div>

            <div class="card-meta-bottom">
              <span class="salary-text mono">{{ job.salary?.formatted || 'Competitive' }}</span>
              
              <!-- Quick Stage Selector -->
              <select 
                class="quick-stage-select" 
                :value="job.status" 
                @click.stop
                @change="handleStageChange(job.id, $event)"
              >
                <option value="saved">Saved</option>
                <option value="applied">Applied</option>
                <option value="interviewing">Interviewing</option>
                <option value="offered">Offered</option>
                <option value="rejected">Archived</option>
              </select>
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

const emit = defineEmits(['select-job', 'change-status', 'easy-apply']);

const columns = [
  { id: 'saved', title: 'Saved / Wishlist' },
  { id: 'applied', title: 'Applied' },
  { id: 'interviewing', title: 'Interviewing' },
  { id: 'offered', title: 'Offers Received' },
  { id: 'rejected', title: 'Archived' }
];

const getColumnJobs = (statusId) => {
  return props.jobs.filter(j => j.status === statusId);
};

const handleStageChange = (jobId, event) => {
  emit('change-status', { jobId, status: event.target.value });
};
</script>

<style scoped>
.tracker-root {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.tracker-header {
  padding: 1.5rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1.5rem;
  flex-wrap: wrap;
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

.summary-pills {
  display: flex;
  align-items: center;
  gap: 0.6rem;
  flex-wrap: wrap;
}

.summary-chip {
  display: flex;
  align-items: center;
  gap: 0.4rem;
  background: rgba(0, 0, 0, 0.4);
  padding: 0.35rem 0.65rem;
  border-radius: var(--radius-full);
  border: 1px solid var(--border-subtle);
  font-size: 0.75rem;
}

.chip-dot {
  width: 6px;
  height: 6px;
  border-radius: 50%;
}
.chip-dot.saved { background: var(--accent-cyan); }
.chip-dot.applied { background: var(--accent-amber); }
.chip-dot.interviewing { background: var(--accent-violet); }
.chip-dot.offered { background: var(--accent-emerald); }
.chip-dot.rejected { background: var(--accent-rose); }

.chip-label {
  color: var(--text-muted);
}

.chip-count {
  font-weight: 700;
  color: #ffffff;
}

/* Kanban Board */
.kanban-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 1rem;
  align-items: flex-start;
}

.kanban-column {
  padding: 1rem;
  min-height: 520px;
  display: flex;
  flex-direction: column;
  gap: 0.85rem;
}

.column-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.65rem;
  border-bottom: 1px solid var(--border-subtle);
}

.column-title-group {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.column-indicator {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}
.column-indicator.saved { background: var(--accent-cyan); }
.column-indicator.applied { background: var(--accent-amber); }
.column-indicator.interviewing { background: var(--accent-violet); }
.column-indicator.offered { background: var(--accent-emerald); }
.column-indicator.rejected { background: var(--accent-rose); }

.column-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: var(--text-primary);
}

.column-badge {
  background: rgba(255, 255, 255, 0.08);
  font-size: 0.72rem;
  font-weight: 700;
  padding: 0.1rem 0.45rem;
  border-radius: var(--radius-full);
  color: var(--text-secondary);
}

.column-body {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
}

.empty-column {
  padding: 3rem 1rem;
  text-align: center;
  font-size: 0.78rem;
  color: var(--text-muted);
  border: 1px dashed rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-md);
}

.kanban-card {
  padding: 0.85rem;
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border-subtle);
  border-radius: var(--radius-md);
  cursor: pointer;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  transition: all var(--transition-fast);
}

.kanban-card:hover {
  background: rgba(255, 255, 255, 0.07);
  border-color: rgba(255, 255, 255, 0.18);
  transform: translateY(-2px);
}

.card-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.platform-mini-tag {
  font-size: 0.65rem;
  font-weight: 700;
  font-family: var(--font-mono);
  color: var(--accent-cyan);
}

.card-remove-btn {
  background: transparent;
  border: none;
  color: var(--text-muted);
  font-size: 0.8rem;
  cursor: pointer;
  padding: 0.1rem 0.3rem;
}

.card-remove-btn:hover {
  color: var(--accent-rose);
}

.card-job-title {
  font-size: 0.88rem;
  font-weight: 700;
  color: #ffffff;
  line-height: 1.3;
}

.card-company-name {
  font-size: 0.78rem;
  color: var(--text-secondary);
}

.card-meta-bottom {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 0.5rem;
  padding-top: 0.5rem;
  border-top: 1px solid rgba(255, 255, 255, 0.05);
}

.salary-text {
  font-size: 0.72rem;
  color: #34d399;
  font-weight: 600;
}

.quick-stage-select {
  background: rgba(0, 0, 0, 0.4);
  border: 1px solid var(--border-subtle);
  color: var(--text-muted);
  font-size: 0.68rem;
  font-family: var(--font-main);
  border-radius: 4px;
  padding: 0.15rem 0.35rem;
  cursor: pointer;
  outline: none;
}

@media (max-width: 1200px) {
  .kanban-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}
@media (max-width: 768px) {
  .kanban-grid {
    grid-template-columns: 1fr;
  }
}

.card-tailor-badge {
  display: inline-flex;
  align-items: center;
  font-family: var(--font-mono);
  font-size: 0.65rem;
  font-weight: 700;
  color: #34d399;
  background: rgba(16, 185, 129, 0.12);
  border: 1px solid rgba(16, 185, 129, 0.3);
  padding: 0.15rem 0.45rem;
  border-radius: 4px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.card-tailor-badge:hover {
  background: rgba(16, 185, 129, 0.25);
  border-color: #10b981;
}
</style>
