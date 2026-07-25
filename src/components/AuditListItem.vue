<script setup>
/**
 * AuditListItem — a reusable card row summarising a single audit.
 * Used in Overview, Active Audits, and History.
 *
 * The whole card is a `<RouterLink>` (via BaseCard's `tag`/`interactive`
 * props would require a custom implementation, so we compose here) so
 * the entire surface is one large tap target for mobile.
 */
import { computed } from 'vue'
import { PhDeviceMobile, PhBrowser, PhDesktop, PhAndroidLogo, PhAppleLogo, PhCaretRight } from '@phosphor-icons/vue'
import { scoreForRatings, severityCounts } from '@/utils/scoring.js'
import { platformLabel, statusLabel, formatRelative } from '@/utils/format.js'
import SeverityDistribution from './SeverityDistribution.vue'

const props = defineProps({
  audit: { type: Object, required: true },
  /** Show the score badge on the right. Off for pure drafts. */
  showScore: { type: Boolean, default: true },
})

const PLATFORM_ICON = {
  ios: PhAppleLogo,
  android: PhAndroidLogo,
  web: PhBrowser,
  desktop: PhDesktop,
}

const platformIcon = computed(() => PLATFORM_ICON[props.audit.platform] ?? PhDeviceMobile)
const score = computed(() => scoreForRatings(props.audit.ratings))
const counts = computed(() => severityCounts(props.audit.ratings))
const hasRatings = computed(() => counts.value.total > 0)

const statusClass = computed(() => `chip chip--${props.audit.status}`)
</script>

<template>
  <router-link
    :to="{ name: 'audit-detail', params: { id: audit.id } }"
    class="row"
    :aria-label="`${audit.productName}, ${statusLabel(audit.status)}, ${hasRatings ? `${score} percent` : 'not started'}`"
  >
    <span class="row__platform" aria-hidden="true">
      <component :is="platformIcon" :size="18" weight="regular" />
    </span>

    <div class="row__main">
      <p class="row__name">{{ audit.productName }}</p>
      <div class="row__submeta">
        <span :class="statusClass">{{ statusLabel(audit.status) }}</span>
        <p class="row__meta">
          {{ platformLabel(audit.platform) }}
          <span aria-hidden="true"> · </span>
          Updated {{ formatRelative(audit.updatedAt) }}
        </p>
      </div>
      <SeverityDistribution
        v-if="hasRatings"
        :pass="counts.pass"
        :warning="counts.warning"
        :critical="counts.critical"
        :show-legend="false"
      />
    </div>

    <div v-if="showScore" class="row__score" aria-hidden="true">
      <span v-if="hasRatings" class="row__score-value">{{ score }}%</span>
      <span v-else class="row__score-empty">—</span>
      <PhCaretRight :size="16" weight="bold" />
    </div>
  </router-link>
</template>

<style scoped>
.row {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-3) var(--space-4);
  background: var(--color-surface-card);
  border-radius: var(--radius-card-nested);
  border: 1px solid var(--color-border-subtle);
  color: inherit;
  text-decoration: none;
  transition:
    box-shadow var(--transition-default),
    transform var(--transition-fast),
    border-color var(--transition-default);
}

.row:hover {
  border-color: color-mix(in srgb, var(--color-accent-end) 45%, var(--color-border-subtle));
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-1px);
}

.row:focus-visible {
  outline: 2px solid var(--color-accent-end);
  outline-offset: 2px;
}

.row__platform {
  flex-shrink: 0;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 36px;
  height: 36px;
  border-radius: 50%;
  color: var(--color-text-secondary);
  background: color-mix(in srgb, var(--color-accent-end) 8%, transparent);
}

.row__main {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.row__submeta {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  flex-wrap: wrap;
}

.row__top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: var(--space-2);
}

.row__name {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  display: -webkit-box;
  -webkit-line-clamp: 2;
  line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  overflow-wrap: anywhere;
  min-width: 0;
  line-height: var(--line-height-snug);
}

.row__meta {
  font-size: var(--font-size-meta);
  color: var(--color-text-tertiary);
}

.chip {
  flex-shrink: 0;
  font-size: var(--font-size-meta);
  font-weight: var(--font-weight-semibold);
  padding: 3px 8px;
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

.row__score {
  display: inline-flex;
  align-items: center;
  gap: var(--space-1);
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.row__score-value {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.row__score-empty {
  font-size: var(--font-size-body);
  color: var(--color-text-tertiary);
}
</style>
