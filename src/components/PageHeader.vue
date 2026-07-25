<script setup>
/**
 * PageHeader — the standard heading for every route.
 *
 * Renders an eyebrow, a heading, an optional description, and an
 * optional slot for a trailing action (e.g. "New audit" button).
 */
defineProps({
  eyebrow: { type: String, default: '' },
  title: { type: String, required: true },
  description: { type: String, default: '' },
  /** Element to render the title as. */
  headingLevel: { type: String, default: 'h1' },
  /** Optional id to expose to page-scoped `aria-labelledby`. */
  titleId: { type: String, default: '' },
})
</script>

<template>
  <header class="ph">
    <div class="ph__text">
      <p v-if="eyebrow" class="ph__eyebrow">{{ eyebrow }}</p>
      <component
        :is="headingLevel"
        :id="titleId || undefined"
        class="ph__title"
      >{{ title }}</component>
      <p v-if="description" class="ph__desc">{{ description }}</p>
    </div>
    <div v-if="$slots.action" class="ph__action">
      <slot name="action" />
    </div>
  </header>
</template>

<style scoped>
.ph {
  display: flex;
  align-items: flex-start;
  justify-content: space-between;
  gap: var(--space-3);
}

.ph__text {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
  min-width: 0;
}

.ph__eyebrow {
  font-size: var(--font-size-meta);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.ph__title {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  line-height: var(--line-height-snug);
  letter-spacing: -0.01em;
}

.ph__desc {
  font-size: var(--font-size-body-sm);
  color: var(--color-text-secondary);
  max-width: 62ch;
}

.ph__action {
  flex-shrink: 0;
}
</style>
