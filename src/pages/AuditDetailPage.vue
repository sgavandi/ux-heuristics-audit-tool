<script setup>
/**
 * AuditDetailPage — the audit's "real-time dashboard" + evaluation
 * interface.
 *
 * Layout (top to bottom):
 *   1. Header with product name, platform, status.
 *   2. Live-updating score ring, severity distribution and status
 *      controls (mark complete / reopen).
 *   3. Category breakdown bars.
 *   4. Heuristic list, each with inline severity picker + note field
 *      that persists via `setRating`.
 */
import { computed, reactive, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  PhArrowLeft,
  PhCheck,
  PhCheckCircle,
  PhWarningCircle,
  PhXCircle,
  PhNotePencil,
  PhFileMagnifyingGlass,
} from '@phosphor-icons/vue'
import { useAudits } from '@/composables/useAudits.js'
import {
  scoreForRatings,
  severityCounts,
  categoryBreakdown,
} from '@/utils/scoring.js'
import { formatRelative, platformLabel, statusLabel } from '@/utils/format.js'
import PageHeader from '@/components/PageHeader.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import EmptyState from '@/components/EmptyState.vue'
import ScoreRing from '@/components/ScoreRing.vue'
import SeverityDistribution from '@/components/SeverityDistribution.vue'
import CategoryBar from '@/components/CategoryBar.vue'

const props = defineProps({
  id: { type: String, required: true },
})

const router = useRouter()

const {
  isLoading,
  error,
  hasLoadedOnce,
  reload,
  getAuditById,
  getFrameworkById,
  setRating,
  setStatus,
} = useAudits()

// The store exposes plain functions for lookups; wrap in computeds so
// the view reacts when the underlying audits array changes.
const audit = computed(() => getAuditById(props.id))
const framework = computed(() =>
  audit.value ? getFrameworkById(audit.value.frameworkId) : null,
)

const isMissing = computed(
  () => hasLoadedOnce.value && !isLoading.value && !audit.value,
)

const score = computed(() =>
  audit.value ? scoreForRatings(audit.value.ratings) : 0,
)

const counts = computed(() =>
  audit.value
    ? severityCounts(audit.value.ratings)
    : { pass: 0, warning: 0, critical: 0, total: 0 },
)

const breakdown = computed(() =>
  audit.value && framework.value
    ? categoryBreakdown(audit.value, framework.value)
    : [],
)

// Ratings keyed by heuristicId for quick lookup in the list.
const ratingByHeuristic = computed(() => {
  const map = new Map()
  if (audit.value) {
    for (const r of audit.value.ratings) map.set(r.heuristicId, r)
  }
  return map
})

// Per-heuristic note draft state so users can edit notes locally
// before persisting. A reactive plain object so `v-model` can bind
// directly to individual keys.
const noteDrafts = reactive({})
const openNoteFor = ref(null)

watch(
  () => audit.value?.ratings,
  (ratings) => {
    if (!ratings) return
    for (const r of ratings) {
      if (!(r.heuristicId in noteDrafts)) {
        noteDrafts[r.heuristicId] = r.note ?? ''
      }
    }
  },
  { immediate: true, deep: true },
)

const SEVERITIES = [
  { value: 'pass', label: 'Pass', icon: PhCheckCircle },
  { value: 'warning', label: 'Warning', icon: PhWarningCircle },
  { value: 'critical', label: 'Critical', icon: PhXCircle },
]

// Track which severity change is in flight so the button shows a
// disabled state while the mutation resolves.
const pendingHeuristic = ref(null)

async function chooseSeverity(heuristicId, severity) {
  if (!audit.value) return
  const current = ratingByHeuristic.value.get(heuristicId)
  // If the user re-taps the same severity, no-op.
  if (current?.severity === severity) return
  pendingHeuristic.value = heuristicId
  try {
    await setRating(audit.value.id, heuristicId, {
      severity,
      note: noteDrafts[heuristicId] ?? '',
    })
  } finally {
    pendingHeuristic.value = null
  }
}

async function saveNote(heuristicId) {
  if (!audit.value) return
  const current = ratingByHeuristic.value.get(heuristicId)
  if (!current) return // Can't save a note without a severity yet.
  const note = noteDrafts[heuristicId] ?? ''
  await setRating(audit.value.id, heuristicId, {
    severity: current.severity,
    note,
  })
  openNoteFor.value = null
}

const canComplete = computed(
  () =>
    !!audit.value &&
    !!framework.value &&
    counts.value.total === framework.value.heuristics.length &&
    audit.value.status !== 'complete',
)

const isReopenable = computed(() => audit.value?.status === 'complete')

const statusChipClass = computed(() =>
  audit.value ? `chip chip--${audit.value.status}` : 'chip',
)

async function markComplete() {
  if (!audit.value) return
  await setStatus(audit.value.id, 'complete')
}

async function reopen() {
  if (!audit.value) return
  await setStatus(audit.value.id, 'in-progress')
}
</script>

<template>
  <section aria-labelledby="audit-title" class="page">
    <PageHeader
      eyebrow="Audit"
      :title="audit?.productName || 'Audit'"
      title-id="audit-title"
      :description="audit ? `${platformLabel(audit.platform)} · Updated ${formatRelative(audit.updatedAt)}` : ''"
    >
      <template #action>
        <BaseButton variant="ghost" size="sm" @click="router.back()">
          <template #leading><PhArrowLeft :size="14" weight="bold" /></template>
          Back
        </BaseButton>
      </template>
    </PageHeader>

    <LoadingState v-if="isLoading && !audit" message="Loading audit…" />

    <ErrorState
      v-else-if="error"
      title="Couldn’t load audit"
      :message="error"
      @retry="reload"
    />

    <EmptyState
      v-else-if="isMissing"
      :icon="PhFileMagnifyingGlass"
      title="Audit not found"
      :description="`We couldn’t find an audit with id ${id}. It may have been reset.`"
    >
      <template #action>
        <BaseButton variant="secondary" size="sm" @click="router.push({ name: 'audits' })">
          Go to active audits
        </BaseButton>
      </template>
    </EmptyState>

    <template v-else-if="audit && framework">
      <!-- Live dashboard -->
      <BaseCard padding="md" class="dashboard">
        <div class="dashboard__ring">
          <ScoreRing
            :value="score"
            :size="140"
            :label="statusLabel(audit.status)"
            :sublabel="`${counts.total} of ${framework.heuristics.length} rated`"
          />
        </div>
        <div class="dashboard__body">
          <span :class="statusChipClass">{{ statusLabel(audit.status) }}</span>
          <p class="dashboard__note">
            {{
              counts.total === framework.heuristics.length
                ? 'All heuristics rated. Ready to complete.'
                : `${framework.heuristics.length - counts.total} heuristic${framework.heuristics.length - counts.total === 1 ? '' : 's'} left to rate.`
            }}
          </p>
          <SeverityDistribution
            :pass="counts.pass"
            :warning="counts.warning"
            :critical="counts.critical"
          />
          <div class="dashboard__actions">
            <BaseButton
              v-if="canComplete"
              variant="primary"
              size="sm"
              @click="markComplete"
            >
              <template #leading><PhCheck :size="14" weight="bold" /></template>
              Mark complete
            </BaseButton>
            <BaseButton
              v-else-if="isReopenable"
              variant="secondary"
              size="sm"
              @click="reopen"
            >
              Reopen for editing
            </BaseButton>
          </div>
        </div>
      </BaseCard>

      <!-- Category breakdown -->
      <BaseCard padding="md" class="stack">
        <h2 class="stack__title">Category breakdown</h2>
        <CategoryBar
          v-for="cat in breakdown"
          :key="cat.category"
          :label="cat.category"
          :value="cat.score"
          :rated-count="cat.ratedCount"
          :meta="
            cat.ratedCount === 0
              ? '—'
              : `${cat.ratedCount} of ${cat.total} rated`
          "
        />
      </BaseCard>

      <!-- Heuristics list / evaluation interface -->
      <section aria-labelledby="heuristics-title" class="group">
        <h2 id="heuristics-title" class="group__title">Heuristics</h2>
        <ul class="hlist">
          <li v-for="h in framework.heuristics" :key="h.id" class="hitem">
            <BaseCard padding="md" nested>
              <div class="hitem__top">
                <div class="hitem__meta">
                  <p class="hitem__category">{{ h.category }}</p>
                  <p class="hitem__name">{{ h.name }}</p>
                  <p class="hitem__summary">{{ h.summary }}</p>
                </div>
              </div>

              <div
                class="hitem__sevs"
                role="radiogroup"
                :aria-label="`Rating for ${h.name}`"
              >
                <button
                  v-for="sev in SEVERITIES"
                  :key="sev.value"
                  type="button"
                  role="radio"
                  :aria-checked="ratingByHeuristic.get(h.id)?.severity === sev.value"
                  :disabled="pendingHeuristic === h.id"
                  :class="[
                    'sev',
                    `sev--${sev.value}`,
                    {
                      'sev--active':
                        ratingByHeuristic.get(h.id)?.severity === sev.value,
                    },
                  ]"
                  @click="chooseSeverity(h.id, sev.value)"
                >
                  <component :is="sev.icon" :size="16" weight="fill" aria-hidden="true" />
                  <span>{{ sev.label }}</span>
                </button>
              </div>

              <!-- Note affordance appears once a rating exists. -->
              <div v-if="ratingByHeuristic.get(h.id)" class="hitem__note">
                <button
                  v-if="openNoteFor !== h.id && !ratingByHeuristic.get(h.id).note"
                  type="button"
                  class="note-toggle"
                  @click="openNoteFor = h.id"
                >
                  <PhNotePencil :size="14" weight="regular" aria-hidden="true" />
                  Add a note
                </button>

                <template v-else>
                  <label :for="`note-${h.id}`" class="note-label">
                    Note
                  </label>
                  <textarea
                    :id="`note-${h.id}`"
                    v-model="noteDrafts[h.id]"
                    class="note-input"
                    rows="2"
                    placeholder="What did you observe?"
                    @focus="openNoteFor = h.id"
                  ></textarea>
                  <div class="note-actions">
                    <BaseButton
                      variant="secondary"
                      size="sm"
                      @click="saveNote(h.id)"
                    >
                      Save note
                    </BaseButton>
                    <BaseButton
                      v-if="openNoteFor === h.id"
                      variant="ghost"
                      size="sm"
                      @click="openNoteFor = null"
                    >
                      Close
                    </BaseButton>
                  </div>
                </template>
              </div>
            </BaseCard>
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

.dashboard {
  display: flex;
  gap: var(--space-4);
  flex-wrap: wrap;
  align-items: center;
}

.dashboard__ring {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
}

.dashboard__body {
  flex: 1;
  min-width: 200px;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.dashboard__note {
  font-size: var(--font-size-body-sm);
  color: var(--color-text-secondary);
}

.dashboard__actions {
  padding-top: var(--space-1);
}

.stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.stack__title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  margin: 0;
}

.chip {
  align-self: flex-start;
  font-size: var(--font-size-meta);
  font-weight: var(--font-weight-semibold);
  padding: 4px 10px;
  border-radius: 9999px;
  line-height: 1;
}

.chip--draft {
  background: color-mix(in srgb, var(--color-text-tertiary) 18%, transparent);
  color: color-mix(in srgb, var(--color-text-tertiary) 90%, var(--color-text-primary));
}
.chip--in-progress {
  background: color-mix(in srgb, var(--color-warning) 18%, transparent);
  color: color-mix(in srgb, var(--color-warning) 80%, var(--color-text-primary));
}
.chip--complete {
  background: color-mix(in srgb, var(--color-pass) 14%, transparent);
  color: color-mix(in srgb, var(--color-pass) 80%, var(--color-text-primary));
}

.group {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.group__title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-secondary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.hlist {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.hitem__top {
  display: flex;
  gap: var(--space-3);
  align-items: flex-start;
  justify-content: space-between;
}

.hitem__meta {
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.hitem__category {
  font-size: var(--font-size-meta);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.hitem__name {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.hitem__summary {
  font-size: var(--font-size-body-sm);
  color: var(--color-text-secondary);
}

.hitem__sevs {
  display: flex;
  gap: var(--space-2);
  flex-wrap: wrap;
  padding-top: var(--space-3);
}

.sev {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 12px;
  border-radius: 9999px;
  border: 1.5px solid var(--color-border-subtle);
  background: var(--color-surface-card);
  color: var(--color-text-secondary);
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-semibold);
  cursor: pointer;
  transition:
    background var(--transition-default),
    color var(--transition-default),
    border-color var(--transition-default),
    transform var(--transition-fast);
}

.sev:hover:not(:disabled) {
  transform: translateY(-1px);
  border-color: color-mix(in srgb, var(--color-accent-end) 40%, var(--color-border-subtle));
}

.sev:active:not(:disabled) {
  transform: translateY(0) scale(0.97);
}

.sev:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.sev:focus-visible {
  outline: 2px solid var(--color-accent-end);
  outline-offset: 2px;
}

/* Active states use color + fill icon + text so information is
   never conveyed by color alone. */
.sev--pass.sev--active {
  background: color-mix(in srgb, var(--color-pass) 14%, transparent);
  color: color-mix(in srgb, var(--color-pass) 80%, var(--color-text-primary));
  border-color: color-mix(in srgb, var(--color-pass) 40%, transparent);
}
.sev--warning.sev--active {
  background: color-mix(in srgb, var(--color-warning) 18%, transparent);
  color: color-mix(in srgb, var(--color-warning) 80%, var(--color-text-primary));
  border-color: color-mix(in srgb, var(--color-warning) 45%, transparent);
}
.sev--critical.sev--active {
  background: color-mix(in srgb, var(--color-critical) 16%, transparent);
  color: color-mix(in srgb, var(--color-critical) 80%, var(--color-text-primary));
  border-color: color-mix(in srgb, var(--color-critical) 45%, transparent);
}

.hitem__note {
  padding-top: var(--space-3);
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.note-toggle {
  align-self: flex-start;
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: none;
  padding: 4px 6px;
  border-radius: var(--radius-input);
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-accent-end);
  cursor: pointer;
  transition: background var(--transition-default);
}
.note-toggle:hover {
  background: color-mix(in srgb, var(--color-accent-end) 10%, transparent);
}
.note-toggle:focus-visible {
  outline: 2px solid var(--color-accent-end);
  outline-offset: 2px;
}

.note-label {
  font-size: var(--font-size-meta);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.note-input {
  font: inherit;
  font-size: var(--font-size-body);
  color: var(--color-text-primary);
  background: var(--color-surface-card);
  border: 1.5px solid var(--color-border-subtle);
  border-radius: var(--radius-input);
  padding: 10px var(--space-3);
  resize: vertical;
  outline: none;
  transition:
    border-color var(--transition-default),
    box-shadow var(--transition-default);
}

.note-input:focus-visible {
  border-color: var(--color-accent-end);
  box-shadow: 0 0 0 3px color-mix(in srgb, var(--color-accent-end) 22%, transparent);
}

.note-actions {
  display: flex;
  gap: var(--space-2);
}
</style>
