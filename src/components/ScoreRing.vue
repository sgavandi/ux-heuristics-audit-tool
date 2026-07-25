<script setup>
/**
 * ScoreRing — thick, gradient-filled circular progress ring for the
 * overall audit score. Built as inline SVG so the fill uses a
 * `<linearGradient>` derived from the design tokens.
 *
 * Accessibility:
 *   - The SVG is `role="img"` with an `aria-label` describing the score
 *     so screen readers announce the value, not the raw geometry.
 *   - A visible numeric label sits at the center so the value is never
 *     hover-dependent.
 *
 * Motion:
 *   - The stroke offset transitions using `--transition-default` so
 *     values animate to their target smoothly.
 *   - Honours `prefers-reduced-motion` via the token override.
 */
import { computed, useId } from 'vue'

const props = defineProps({
  /** 0–100. Values outside the range are clamped. */
  value: { type: Number, required: true },

  /** Outer diameter in px. */
  size: { type: Number, default: 160 },

  /** Ring thickness in px. */
  strokeWidth: { type: Number, default: 12 },

  /** Primary label under the number (e.g. "Overall score"). */
  label: { type: String, default: '' },

  /** Optional context line (e.g. "24 of 30 heuristics"). */
  sublabel: { type: String, default: '' },

  /**
   * Formatter for the center number.
   * Defaults to `${Math.round(value)}%`.
   */
  format: {
    type: Function,
    default: (v) => `${Math.round(v)}%`,
  },
})

const uid = useId()
const gradientId = computed(() => `score-ring-grad-${uid}`)

const clamped = computed(() => Math.max(0, Math.min(100, props.value)))
const radius = computed(() => (props.size - props.strokeWidth) / 2)
const center = computed(() => props.size / 2)
const circumference = computed(() => 2 * Math.PI * radius.value)
const dashOffset = computed(
  () => circumference.value - (clamped.value / 100) * circumference.value,
)

const ariaLabel = computed(() => {
  const rounded = Math.round(clamped.value)
  const parts = [`Score: ${rounded} percent`]
  if (props.label) parts.push(props.label)
  if (props.sublabel) parts.push(props.sublabel)
  return parts.join('. ')
})
</script>

<template>
  <div class="ring" :style="{ width: `${size}px`, height: `${size}px` }">
    <svg
      :width="size"
      :height="size"
      :viewBox="`0 0 ${size} ${size}`"
      role="img"
      :aria-label="ariaLabel"
      focusable="false"
    >
      <defs>
        <linearGradient :id="gradientId" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="var(--color-accent-start)" />
          <stop offset="100%" stop-color="var(--color-accent-end)" />
        </linearGradient>
      </defs>

      <!-- Track -->
      <circle
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        stroke="var(--color-border-subtle)"
        :stroke-width="strokeWidth"
      />

      <!-- Progress arc -->
      <circle
        class="ring__arc"
        :cx="center"
        :cy="center"
        :r="radius"
        fill="none"
        :stroke="`url(#${gradientId})`"
        :stroke-width="strokeWidth"
        stroke-linecap="round"
        :stroke-dasharray="circumference"
        :stroke-dashoffset="dashOffset"
      />
    </svg>

    <div class="ring__center" aria-hidden="true">
      <p class="ring__value">{{ format(clamped) }}</p>
      <p v-if="label" class="ring__label">{{ label }}</p>
      <p v-if="sublabel" class="ring__sublabel">{{ sublabel }}</p>
    </div>
  </div>
</template>

<style scoped>
.ring {
  position: relative;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.ring__arc {
  /* Start the arc at 12 o'clock. */
  transform: rotate(-90deg);
  transform-origin: center;
  transition: stroke-dashoffset var(--transition-default);
}

.ring__center {
  position: absolute;
  inset: 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;
  text-align: center;
  padding: var(--space-3);
}

.ring__value {
  font-size: var(--font-size-h1);
  font-weight: var(--font-weight-bold);
  color: var(--color-text-primary);
  line-height: 1;
  letter-spacing: -0.02em;
}

.ring__label {
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-secondary);
}

.ring__sublabel {
  font-size: var(--font-size-meta);
  color: var(--color-text-tertiary);
}
</style>
