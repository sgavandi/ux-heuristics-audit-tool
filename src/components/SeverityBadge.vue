<script setup>
/**
 * SeverityBadge — compact pill that communicates a severity rating.
 *
 * Uses BOTH a color and a text label so information is never conveyed
 * by color alone (WCAG 2.2 SC 1.4.1).
 */
import { computed } from 'vue'
import { PhCheckCircle, PhWarningCircle, PhXCircle } from '@phosphor-icons/vue'

const props = defineProps({
  severity: {
    type: String,
    required: true,
    validator: (v) => ['pass', 'warning', 'critical'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md'].includes(v),
  },
  /** Override the auto-generated label. */
  label: { type: String, default: '' },
})

const LABELS = {
  pass: 'Pass',
  warning: 'Warning',
  critical: 'Critical',
}

const ICONS = {
  pass: PhCheckCircle,
  warning: PhWarningCircle,
  critical: PhXCircle,
}

const displayLabel = computed(() => props.label || LABELS[props.severity])
const iconComponent = computed(() => ICONS[props.severity])
const iconSize = computed(() => (props.size === 'sm' ? 12 : 14))
</script>

<template>
  <span
    class="sev"
    :class="[`sev--${severity}`, `sev--${size}`]"
  >
    <component :is="iconComponent" :size="iconSize" weight="fill" aria-hidden="true" />
    <span class="sev__label">{{ displayLabel }}</span>
  </span>
</template>

<style scoped>
.sev {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  border-radius: 9999px;
  font-weight: var(--font-weight-semibold);
  line-height: 1;
}

.sev--sm {
  padding: 4px 8px;
  font-size: var(--font-size-meta);
}

.sev--md {
  padding: 6px 10px;
  font-size: var(--font-size-body-sm);
}

.sev--pass {
  background: color-mix(in srgb, var(--color-pass) 14%, transparent);
  color: color-mix(in srgb, var(--color-pass) 80%, var(--color-text-primary));
}
.sev--warning {
  background: color-mix(in srgb, var(--color-warning) 18%, transparent);
  color: color-mix(in srgb, var(--color-warning) 80%, var(--color-text-primary));
}
.sev--critical {
  background: color-mix(in srgb, var(--color-critical) 16%, transparent);
  color: color-mix(in srgb, var(--color-critical) 80%, var(--color-text-primary));
}
</style>
