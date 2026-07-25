<script setup>
/**
 * CategoryBar — horizontal gradient progress bar with rounded caps,
 * used for individual heuristic categories.
 *
 * Accessibility:
 *   - Renders as `role="progressbar"` with correct `aria-valuenow`,
 *     `aria-valuemin`, `aria-valuemax`, and `aria-label`.
 *   - Every value and label is visible on-screen — never hover-only.
 */
import { computed } from 'vue'

const props = defineProps({
  /** Category label shown above the bar. */
  label: { type: String, required: true },

  /** 0–100. Clamped. */
  value: { type: Number, required: true },

  /**
   * Optional right-aligned context line.
   * e.g. "6 of 8 rated" or "5 pass · 2 warning · 1 critical".
   */
  meta: { type: String, default: '' },

  /**
   * If a rated count is zero, we render a muted "not started" state
   * rather than a 0-% bar.
   */
  ratedCount: { type: Number, default: null },
})

const clamped = computed(() => Math.max(0, Math.min(100, props.value)))
const notStarted = computed(() => props.ratedCount === 0)

const ariaLabel = computed(() => {
  if (notStarted.value) return `${props.label}: not started`
  const parts = [`${props.label}: ${Math.round(clamped.value)} percent`]
  if (props.meta) parts.push(props.meta)
  return parts.join('. ')
})
</script>

<template>
  <div class="cbar">
    <div class="cbar__header">
      <p class="cbar__label">{{ label }}</p>
      <p v-if="meta" class="cbar__meta">{{ meta }}</p>
    </div>

    <div
      class="cbar__track"
      role="progressbar"
      :aria-label="ariaLabel"
      :aria-valuemin="0"
      :aria-valuemax="100"
      :aria-valuenow="notStarted ? undefined : Math.round(clamped)"
      :aria-valuetext="notStarted ? 'Not started' : undefined"
    >
      <div
        v-if="!notStarted"
        class="cbar__fill"
        :style="{ width: `${clamped}%` }"
      />
      <div
        v-else
        class="cbar__empty"
        aria-hidden="true"
      >Not started</div>
    </div>
  </div>
</template>

<style scoped>
.cbar {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.cbar__header {
  display: flex;
  align-items: baseline;
  justify-content: space-between;
  gap: var(--space-3);
}

.cbar__label {
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.cbar__meta {
  font-size: var(--font-size-meta);
  color: var(--color-text-tertiary);
}

.cbar__track {
  position: relative;
  height: 10px;
  border-radius: 9999px;
  background: var(--color-border-subtle);
  overflow: hidden;
}

.cbar__fill {
  height: 100%;
  background: var(--gradient-accent);
  border-radius: inherit;
  transition: width var(--transition-default);
}

.cbar__empty {
  height: 100%;
  display: flex;
  align-items: center;
  padding-left: var(--space-3);
  font-size: var(--font-size-meta);
  color: var(--color-text-secondary);
  font-style: italic;
}
</style>
