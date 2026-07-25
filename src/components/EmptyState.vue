<script setup>
/**
 * EmptyState — reusable empty-state card with icon, title,
 * description and optional CTA slot.
 */
defineProps({
  /** Phosphor icon component. */
  icon: { type: [Object, Function], default: null },
  title: { type: String, required: true },
  description: { type: String, default: '' },
})
</script>

<template>
  <div class="empty">
    <span v-if="icon" class="empty__icon" aria-hidden="true">
      <component :is="icon" :size="32" weight="duotone" />
    </span>
    <div class="empty__body">
      <p class="empty__title">{{ title }}</p>
      <p v-if="description" class="empty__text">{{ description }}</p>
    </div>
    <div v-if="$slots.action" class="empty__action">
      <slot name="action" />
    </div>
  </div>
</template>

<style scoped>
.empty {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-5) var(--space-4);
  background: var(--color-surface-card);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
}

.empty__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 50%;
  color: var(--color-accent-end);
  background: color-mix(in srgb, var(--color-accent-end) 10%, transparent);
}

.empty__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.empty__title {
  font-size: var(--font-size-h3);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.empty__text {
  font-size: var(--font-size-body);
  color: var(--color-text-secondary);
  max-width: 42ch;
}

.empty__action {
  display: flex;
  gap: var(--space-2);
  padding-top: var(--space-1);
}
</style>
