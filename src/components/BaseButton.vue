<script setup>
/**
 * BaseButton — pill-shaped primary interaction element.
 *
 * Follows the project brief: all buttons are pill-shaped
 * (`--radius-button`, effectively fully rounded). Three variants:
 *
 *   - primary   → accent gradient background, high emphasis
 *   - secondary → white surface with accent-tinted border
 *   - ghost     → transparent, minimal chrome
 *
 * Hover / focus / active states are visually distinct and every
 * transition respects `--transition-default` / `--transition-fast`.
 */
import { computed } from 'vue'
import { PhCircleNotch } from '@phosphor-icons/vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (v) => ['primary', 'secondary', 'ghost'].includes(v),
  },
  size: {
    type: String,
    default: 'md',
    validator: (v) => ['sm', 'md', 'lg'].includes(v),
  },
  type: { type: String, default: 'button' },
  disabled: { type: Boolean, default: false },
  loading: { type: Boolean, default: false },
  block: { type: Boolean, default: false },
  iconOnly: { type: Boolean, default: false },
})

const rootClasses = computed(() => [
  'btn',
  `btn--${props.variant}`,
  `btn--${props.size}`,
  {
    'btn--block': props.block,
    'btn--loading': props.loading,
    'btn--icon-only': props.iconOnly,
  },
])

const spinnerSize = computed(() => (props.size === 'sm' ? 14 : props.size === 'lg' ? 18 : 16))
</script>

<template>
  <button
    :class="rootClasses"
    :type="type"
    :disabled="disabled || loading"
    :aria-busy="loading || undefined"
  >
    <span v-if="loading" class="btn__spinner" aria-hidden="true">
      <PhCircleNotch :size="spinnerSize" weight="bold" />
    </span>
    <span v-if="$slots.leading && !loading" class="btn__leading" aria-hidden="true">
      <slot name="leading" />
    </span>
    <span class="btn__label">
      <slot />
    </span>
    <span v-if="$slots.trailing" class="btn__trailing" aria-hidden="true">
      <slot name="trailing" />
    </span>
  </button>
</template>

<style scoped>
.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  gap: var(--space-2);

  border: none;
  border-radius: var(--radius-button);
  font-family: var(--font-family-base);
  font-weight: var(--font-weight-semibold);
  letter-spacing: 0.01em;
  cursor: pointer;
  text-decoration: none;
  white-space: nowrap;

  transition:
    background var(--transition-default),
    color var(--transition-default),
    box-shadow var(--transition-default),
    transform var(--transition-fast),
    border-color var(--transition-default);
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.55;
  transform: none !important;
}

/* ------ Sizes ------ */
.btn--sm { min-height: 36px; padding: 0 var(--space-3); font-size: var(--font-size-body-sm); }
.btn--md { min-height: 44px; padding: 0 var(--space-4); font-size: var(--font-size-body); }
.btn--lg { min-height: 52px; padding: 0 var(--space-5); font-size: var(--font-size-body); }

.btn--block { width: 100%; }

.btn--icon-only.btn--sm { width: 36px; padding: 0; }
.btn--icon-only.btn--md { width: 44px; padding: 0; }
.btn--icon-only.btn--lg { width: 52px; padding: 0; }

/* ------ Primary ------ */
.btn--primary {
  background: var(--gradient-accent);
  color: var(--color-text-on-accent);
  box-shadow: var(--shadow-fab);
}
.btn--primary:hover:not(:disabled) {
  transform: translateY(-1px);
  box-shadow: 0 16px 40px -10px rgba(139, 92, 246, 0.45);
}
.btn--primary:active:not(:disabled) {
  transform: translateY(0) scale(0.98);
}

/* ------ Secondary ------ */
.btn--secondary {
  background: var(--color-surface-card);
  color: var(--color-text-primary);
  box-shadow: inset 0 0 0 1.5px color-mix(in srgb, var(--color-accent-end) 55%, transparent);
}
.btn--secondary:hover:not(:disabled) {
  box-shadow:
    inset 0 0 0 1.5px var(--color-accent-end),
    0 8px 20px -12px rgba(15, 23, 42, 0.15);
}
.btn--secondary:active:not(:disabled) {
  transform: scale(0.98);
}

/* ------ Ghost ------ */
.btn--ghost {
  background: transparent;
  color: var(--color-text-primary);
}
.btn--ghost:hover:not(:disabled) {
  background: color-mix(in srgb, var(--color-accent-end) 10%, transparent);
  color: var(--color-text-primary);
}
.btn--ghost:active:not(:disabled) {
  transform: scale(0.98);
}

/* ------ Focus ------ */
.btn:focus-visible {
  outline: 2px solid var(--color-accent-end);
  outline-offset: 2px;
}

/* ------ Loading ------ */
.btn__spinner {
  display: inline-flex;
  animation: btn-spin 900ms linear infinite;
}
@keyframes btn-spin {
  to { transform: rotate(360deg); }
}
@media (prefers-reduced-motion: reduce) {
  .btn__spinner { animation: none; }
}
.btn--loading .btn__label { opacity: 0.85; }

.btn__leading,
.btn__trailing {
  display: inline-flex;
  align-items: center;
}
</style>
