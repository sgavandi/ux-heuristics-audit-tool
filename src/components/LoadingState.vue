<script setup>
/**
 * LoadingState — canonical loading indicator used across pages.
 *
 * Announces via `role="status"` + `aria-live="polite"` so screen
 * readers get an update without stealing focus.
 */
import { PhCircleNotch } from '@phosphor-icons/vue'

defineProps({
  message: { type: String, default: 'Loading…' },
})
</script>

<template>
  <div class="ls" role="status" aria-live="polite">
    <span class="ls__spinner" aria-hidden="true">
      <PhCircleNotch :size="24" weight="bold" />
    </span>
    <p class="ls__text">{{ message }}</p>
  </div>
</template>

<style scoped>
.ls {
  display: flex;
  align-items: center;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-surface-card);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}

.ls__spinner {
  display: inline-flex;
  color: var(--color-text-secondary);
  animation: ls-spin 900ms linear infinite;
}

@keyframes ls-spin {
  to { transform: rotate(360deg); }
}
@media (prefers-reduced-motion: reduce) {
  .ls__spinner { animation: none; }
}

.ls__text {
  font-size: var(--font-size-body);
  color: var(--color-text-secondary);
}
</style>
