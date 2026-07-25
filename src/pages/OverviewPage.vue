<script setup>
/**
 * OverviewPage — the dashboard.
 *
 * Shows a headline "featured" card (the most recent complete audit if
 * available, otherwise the most recently touched), a summary triple of
 * totals, and a list of the top open audits.
 *
 * Explicitly renders four states: loading / error / empty / populated.
 */
import { computed } from 'vue'
import { useRouter } from 'vue-router'
import { PhPlus, PhListChecks } from '@phosphor-icons/vue'
import { useAudits } from '@/composables/useAudits.js'
import { scoreForRatings, severityCounts } from '@/utils/scoring.js'
import { formatRelative, statusLabel } from '@/utils/format.js'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'
import PageHeader from '@/components/PageHeader.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import EmptyState from '@/components/EmptyState.vue'
import AuditListItem from '@/components/AuditListItem.vue'
import ScoreRing from '@/components/ScoreRing.vue'
import SeverityDistribution from '@/components/SeverityDistribution.vue'

const router = useRouter()

const {
  audits,
  isLoading,
  error,
  isEmpty,
  totalCount,
  activeAudits,
  completedAudits,
  openAudits,
  reload,
} = useAudits()

// Featured card: prefer the most recent complete audit; fall back to
// the most recent in-progress; otherwise the most recent draft.
const featuredAudit = computed(() => {
  if (completedAudits.value.length > 0) return completedAudits.value[0]
  if (activeAudits.value.length > 0) {
    return activeAudits.value
      .slice()
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))[0]
  }
  return audits.value
    .slice()
    .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1))[0]
})

const featuredScore = computed(() =>
  featuredAudit.value ? scoreForRatings(featuredAudit.value.ratings) : 0,
)

const featuredCounts = computed(() =>
  featuredAudit.value
    ? severityCounts(featuredAudit.value.ratings)
    : { pass: 0, warning: 0, critical: 0, total: 0 },
)

// List of open audits capped at 3 so the dashboard stays scannable.
const topOpenAudits = computed(() => openAudits.value.slice(0, 3))

function goNew() {
  router.push({ name: 'new-audit' })
}

function openAudit(id) {
  router.push({ name: 'audit-detail', params: { id } })
}
</script>

<template>
  <section aria-labelledby="overview-title" class="page">
    <PageHeader
      eyebrow="Dashboard"
      title="Overview"
      title-id="overview-title"
      description="Your rapid pulse-check on every audit in flight."
    >
      <template #action>
        <BaseButton variant="primary" size="sm" @click="goNew">
          <template #leading><PhPlus :size="14" weight="bold" /></template>
          New audit
        </BaseButton>
      </template>
    </PageHeader>

    <LoadingState v-if="isLoading" message="Loading your audits…" />

    <ErrorState
      v-else-if="error"
      title="Couldn’t load audits"
      :message="error"
      @retry="reload"
    />

    <EmptyState
      v-else-if="isEmpty"
      :icon="PhListChecks"
      title="No audits yet"
      description="Start your first heuristic audit and it will appear here."
    >
      <template #action>
        <BaseButton variant="primary" @click="goNew">
          <template #leading><PhPlus :size="14" weight="bold" /></template>
          Start an audit
        </BaseButton>
      </template>
    </EmptyState>

    <template v-else>
      <!-- Featured -->
      <BaseCard v-if="featuredAudit" padding="md" class="feature">
        <div class="feature__ring">
          <ScoreRing
            :value="featuredScore"
            :size="140"
            :label="statusLabel(featuredAudit.status)"
          />
        </div>
        <div class="feature__body">
          <p class="feature__eyebrow">Featured audit</p>
          <p class="feature__name">{{ featuredAudit.productName }}</p>
          <p class="feature__meta">
            Updated {{ formatRelative(featuredAudit.updatedAt) }}
          </p>
          <SeverityDistribution
            v-if="featuredCounts.total > 0"
            :pass="featuredCounts.pass"
            :warning="featuredCounts.warning"
            :critical="featuredCounts.critical"
          />
          <div class="feature__actions">
            <BaseButton
              variant="secondary"
              size="sm"
              @click="openAudit(featuredAudit.id)"
            >
              Open audit
            </BaseButton>
          </div>
        </div>
      </BaseCard>

      <!-- Summary counts -->
      <BaseCard padding="md">
        <div class="summary" role="list">
          <div class="summary__stat" role="listitem">
            <p class="summary__label">Total</p>
            <p class="summary__value">{{ totalCount }}</p>
          </div>
          <div class="summary__stat" role="listitem">
            <p class="summary__label">Active</p>
            <p class="summary__value">{{ activeAudits.length }}</p>
          </div>
          <div class="summary__stat" role="listitem">
            <p class="summary__label">Complete</p>
            <p class="summary__value">{{ completedAudits.length }}</p>
          </div>
        </div>
      </BaseCard>

      <!-- Open audits list -->
      <section aria-labelledby="open-title" class="group">
        <div class="group__header">
          <h2 id="open-title" class="group__title">Open audits</h2>
          <router-link :to="{ name: 'audits' }" class="group__link">
            See all
          </router-link>
        </div>

        <EmptyState
          v-if="topOpenAudits.length === 0"
          :icon="PhListChecks"
          title="Nothing in flight"
          description="Every open audit has been completed. Start a new one to keep the momentum."
        >
          <template #action>
            <BaseButton variant="primary" size="sm" @click="goNew">
              <template #leading><PhPlus :size="14" weight="bold" /></template>
              New audit
            </BaseButton>
          </template>
        </EmptyState>

        <ul v-else class="list">
          <li v-for="audit in topOpenAudits" :key="audit.id">
            <AuditListItem :audit="audit" />
          </li>
        </ul>
      </section>
    </template>
  </section>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.feature {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  flex-wrap: wrap;
}

.feature__ring {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.feature__body {
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.feature__eyebrow {
  font-size: var(--font-size-meta);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.feature__name {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  line-height: var(--line-height-snug);
}

.feature__meta {
  font-size: var(--font-size-body-sm);
  color: var(--color-text-secondary);
}

.feature__actions {
  padding-top: var(--space-1);
}

.summary {
  display: grid;
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: var(--space-3);
}

.summary__stat {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.summary__label {
  font-size: var(--font-size-meta);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  font-weight: var(--font-weight-medium);
}

.summary__value {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  line-height: 1;
}

.group {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.group__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
}

.group__title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.group__link {
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-accent-end);
  text-decoration: none;
  padding: 4px 8px;
  border-radius: var(--radius-input);
}

.group__link:hover {
  background: color-mix(in srgb, var(--color-accent-end) 10%, transparent);
}

.group__link:focus-visible {
  outline: 2px solid var(--color-accent-end);
  outline-offset: 2px;
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
</style>
