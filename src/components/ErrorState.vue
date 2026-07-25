<script setup>
/**
 * ErrorState — canonical error card. Announces via `role="alert"`.
 *
 *   <ErrorState :message="error" @retry="reload" />
 */
import { PhWarningCircle } from '@phosphor-icons/vue'
import BaseButton from './BaseButton.vue'

defineProps({
  title: { type: String, default: "Something went wrong" },
  message: { type: String, required: true },
  retryLabel: { type: String, default: 'Try again' },
})

const emit = defineEmits(['retry'])
</script>

<template>
  <div class="es" role="alert">
    <span class="es__icon" aria-hidden="true">
      <PhWarningCircle :size="24" weight="fill" />
    </span>
    <div class="es__body">
      <p class="es__title">{{ title }}</p>
      <p class="es__text">{{ message }}</p>
    </div>
    <BaseButton variant="secondary" size="sm" @click="emit('retry')">
      {{ retryLabel }}
    </BaseButton>
  </div>
</template>

<style scoped>
.es {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-4);
  background: var(--color-surface-card);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  border-left: 4px solid var(--color-critical);
}

.es__icon {
  display: inline-flex;
  color: var(--color-critical);
  flex-shrink: 0;
}

.es__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  flex: 1;
  min-width: 0;
}

.es__title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.es__text {
  font-size: var(--font-size-body-sm);
  color: var(--color-text-secondary);
  overflow-wrap: anywhere;
}
</style>
