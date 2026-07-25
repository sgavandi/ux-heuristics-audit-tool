<script setup>
/**
 * SeverityDistribution — a single, segmented horizontal bar that shows
 * the split of pass / warning / critical ratings for an audit.
 *
 * Includes a legend beneath so counts are always readable and the
 * chart doesn't rely on color alone.
 */
import { computed } from 'vue'

const props = defineProps({
  pass: { type: Number, default: 0 },
  warning: { type: Number, default: 0 },
  critical: { type: Number, default: 0 },
  /** When false, the legend is hidden (useful in compact rows). */
  showLegend: { type: Boolean, default: true },
})

const total = computed(() => props.pass + props.warning + props.critical)

const segments = computed(() => {
  if (total.value === 0) return []
  return [
    { key: 'pass', label: 'Pass', count: props.pass, colorVar: '--color-pass' },
    { key: 'warning', label: 'Warning', count: props.warning, colorVar: '--color-warning' },
    { key: 'critical', label: 'Critical', count: props.critical, colorVar: '--color-critical' },
  ].filter((s) => s.count > 0)
})

const ariaLabel = computed(() => {
  if (total.value === 0) return 'No ratings yet'
  return `Severity distribution: ${props.pass} pass, ${props.warning} warning, ${props.critical} critical.`
})
</script>

<template>
  <div class="dist" role="group" :aria-label="ariaLabel">
    <div v-if="total === 0" class="dist__empty">No ratings yet</div>

    <div v-else class="dist__bar" aria-hidden="true">
      <span
        v-for="seg in segments"
        :key="seg.key"
        class="dist__seg"
        :style="{
          width: `${(seg.count / total) * 100}%`,
          background: `var(${seg.colorVar})`,
        }"
      />
    </div>

    <ul v-if="showLegend && total > 0" class="dist__legend">
      <li
        v-for="seg in [
          { key: 'pass', label: 'Pass', count: pass, colorVar: '--color-pass' },
          { key: 'warning', label: 'Warning', count: warning, colorVar: '--color-warning' },
          { key: 'critical', label: 'Critical', count: critical, colorVar: '--color-critical' },
        ]"
        :key="seg.key"
        class="dist__legend-item"
      >
        <span
          class="dist__dot"
          :style="{ background: `var(${seg.colorVar})` }"
          aria-hidden="true"
        />
        <span class="dist__legend-label">{{ seg.label }}</span>
        <span class="dist__legend-count">{{ seg.count }}</span>
      </li>
    </ul>
  </div>
</template>

<style scoped>
.dist {
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.dist__bar {
  display: flex;
  height: 10px;
  border-radius: 9999px;
  overflow: hidden;
  background: var(--color-border-subtle);
}

.dist__seg {
  display: block;
  height: 100%;
  transition: width var(--transition-default);
}

/* Rounded caps on the first and last visible segments. */
.dist__seg:first-child { border-top-left-radius: 9999px; border-bottom-left-radius: 9999px; }
.dist__seg:last-child  { border-top-right-radius: 9999px; border-bottom-right-radius: 9999px; }

.dist__empty {
  height: 10px;
  border-radius: 9999px;
  background: var(--color-border-subtle);
  color: var(--color-text-tertiary);
  font-size: var(--font-size-meta);
  padding-left: var(--space-3);
  display: flex;
  align-items: center;
  font-style: italic;
}

.dist__legend {
  display: flex;
  flex-wrap: wrap;
  gap: var(--space-3);
  list-style: none;
  padding: 0;
  margin: 0;
}

.dist__legend-item {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  font-size: var(--font-size-meta);
  color: var(--color-text-secondary);
}

.dist__dot {
  width: 8px;
  height: 8px;
  border-radius: 50%;
}

.dist__legend-label {
  font-weight: var(--font-weight-medium);
}

.dist__legend-count {
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}
</style>
