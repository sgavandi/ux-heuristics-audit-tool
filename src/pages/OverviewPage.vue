<script setup>
import { computed, watch } from 'vue'
import {
  PhSquaresFour,
  PhCircleNotch,
  PhWarningCircle,
  PhFolderSimpleDashed,
  PhCheckCircle,
  PhListChecks,
} from '@phosphor-icons/vue'
import { useAudits } from '@/composables/useAudits.js'

const {
  audits,
  frameworks,
  isLoading,
  error,
  isEmpty,
  totalCount,
  activeAudits,
  completedAudits,
  reload,
} = useAudits()

const platformLabel = {
  ios: 'iOS',
  android: 'Android',
  web: 'Web',
  desktop: 'Desktop',
}

// Sort the top-of-mind list: most recently updated first.
const recentAudits = computed(() =>
  audits.value.slice().sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)),
)

// Log a sample response once, when data first arrives, so we can verify
// the shape at runtime during Phase 4 review. Phase 9 will remove.
watch(
  () => audits.value.length,
  (count) => {
    if (count > 0) {
      // eslint-disable-next-line no-console
      console.log('[Phase 4] audits sample:', audits.value[0])
      // eslint-disable-next-line no-console
      console.log('[Phase 4] frameworks sample:', frameworks.value[0])
    }
  },
  { immediate: false },
)
</script>

<template>
  <section class="overview" aria-labelledby="overview-title">
    <header class="overview__header">
      <span class="overview__icon" aria-hidden="true">
        <PhSquaresFour :size="28" weight="duotone" />
      </span>
      <div>
        <p class="overview__eyebrow">Dashboard</p>
        <h1 id="overview-title" class="overview__title">Overview</h1>
      </div>
    </header>

    <!-- Loading -->
    <div
      v-if="isLoading"
      class="card state"
      role="status"
      aria-live="polite"
    >
      <span class="state__icon state__icon--spin" aria-hidden="true">
        <PhCircleNotch :size="24" weight="bold" />
      </span>
      <p class="state__text">Loading your audits…</p>
    </div>

    <!-- Error -->
    <div
      v-else-if="error"
      class="card state state--error"
      role="alert"
    >
      <span class="state__icon" aria-hidden="true">
        <PhWarningCircle :size="24" weight="fill" />
      </span>
      <div class="state__body">
        <p class="state__title">Couldn't load audits</p>
        <p class="state__text">{{ error }}</p>
      </div>
      <v-btn color="primary" size="small" @click="reload">Try again</v-btn>
    </div>

    <!-- Empty -->
    <div
      v-else-if="isEmpty"
      class="card state"
    >
      <span class="state__icon" aria-hidden="true">
        <PhFolderSimpleDashed :size="24" weight="duotone" />
      </span>
      <div class="state__body">
        <p class="state__title">No audits yet</p>
        <p class="state__text">Start a new audit to begin evaluating a product.</p>
      </div>
    </div>

    <!-- Populated -->
    <template v-else>
      <div class="card summary">
        <div class="summary__stat">
          <p class="summary__label">Total audits</p>
          <p class="summary__value">{{ totalCount }}</p>
        </div>
        <div class="summary__stat">
          <p class="summary__label">In progress</p>
          <p class="summary__value">{{ activeAudits.length }}</p>
        </div>
        <div class="summary__stat">
          <p class="summary__label">Complete</p>
          <p class="summary__value">{{ completedAudits.length }}</p>
        </div>
      </div>

      <ul class="audit-list" aria-label="Recent audits">
        <li
          v-for="a in recentAudits"
          :key="a.id"
          class="card card--nested audit-list__item"
        >
          <div class="audit-list__meta">
            <span class="chip">{{ platformLabel[a.platform] }}</span>
            <span class="chip chip--status" :data-status="a.status">
              {{ a.status.replace('-', ' ') }}
            </span>
          </div>
          <p class="audit-list__title">{{ a.productName }}</p>
          <p class="audit-list__sub">
            <PhListChecks :size="14" weight="bold" aria-hidden="true" />
            <span>{{ a.ratings.length }} ratings</span>
            <span aria-hidden="true">·</span>
            <PhCheckCircle :size="14" weight="bold" aria-hidden="true" />
            <span>{{ a.ratings.filter((r) => r.severity === 'pass').length }} pass</span>
          </p>
        </li>
      </ul>
    </template>
  </section>
</template>

<style scoped>
.overview {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.overview__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.overview__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background: var(--gradient-accent);
  color: var(--color-text-on-accent);
  flex-shrink: 0;
}

.overview__eyebrow {
  font-size: var(--font-size-meta);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.overview__title {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  line-height: var(--line-height-snug);
}

.card {
  background: var(--color-surface-card);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: var(--space-4);
}

.card--nested {
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-card-nested);
  box-shadow: var(--shadow-nested);
  padding: var(--space-3);
}

/* ---------- State: loading / error / empty ---------- */
.state {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  min-height: 96px;
}

.state__icon {
  display: inline-flex;
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.state--error .state__icon {
  color: var(--color-critical);
}

.state__icon--spin {
  animation: spin 900ms linear infinite;
}

@media (prefers-reduced-motion: reduce) {
  .state__icon--spin { animation: none; }
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.state__body {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.state__title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.state__text {
  font-size: var(--font-size-body-sm);
  color: var(--color-text-secondary);
}

/* ---------- Summary ---------- */
.summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-3);
}

.summary__stat {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.summary__label {
  font-size: var(--font-size-meta);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.summary__value {
  font-size: 1.75rem;
  font-weight: var(--font-weight-bold);
  line-height: var(--line-height-tight);
  background: var(--gradient-accent);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* ---------- Audit list ---------- */
.audit-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.audit-list__item {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.audit-list__meta {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.audit-list__title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.audit-list__sub {
  display: inline-flex;
  align-items: center;
  gap: var(--space-2);
  font-size: var(--font-size-body-sm);
  color: var(--color-text-secondary);
}

.chip {
  display: inline-flex;
  align-items: center;
  padding: 2px var(--space-2);
  border-radius: var(--radius-pill);
  font-size: var(--font-size-meta);
  font-weight: var(--font-weight-medium);
  background: var(--color-border-subtle);
  color: var(--color-text-primary);
  text-transform: uppercase;
  letter-spacing: 0.06em;
}

.chip--status[data-status='in-progress'] {
  background: color-mix(in srgb, var(--color-warning) 18%, transparent);
  color: color-mix(in srgb, var(--color-warning) 60%, var(--color-text-primary));
}

.chip--status[data-status='complete'] {
  background: color-mix(in srgb, var(--color-pass) 18%, transparent);
  color: color-mix(in srgb, var(--color-pass) 60%, var(--color-text-primary));
}

.chip--status[data-status='draft'] {
  background: var(--color-border-subtle);
  color: var(--color-text-secondary);
}
</style>
