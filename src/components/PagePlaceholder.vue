<script setup>
defineProps({
  eyebrow: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String, required: true },
  icon: { type: [Object, Function], required: true },
})
</script>

<template>
  <section class="page-placeholder" :aria-labelledby="`${title.toLowerCase().replace(/\s+/g, '-')}-title`">
    <header class="page-placeholder__header">
      <span class="page-placeholder__icon" aria-hidden="true">
        <component :is="icon" :size="28" weight="duotone" />
      </span>
      <div>
        <p class="page-placeholder__eyebrow">{{ eyebrow }}</p>
        <h1
          :id="`${title.toLowerCase().replace(/\s+/g, '-')}-title`"
          class="page-placeholder__title"
        >
          {{ title }}
        </h1>
      </div>
    </header>
    <p class="page-placeholder__desc">{{ description }}</p>
  </section>
</template>

<style scoped>
.page-placeholder {
  background: var(--color-surface-card);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  padding: var(--space-4);
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.page-placeholder__header {
  display: flex;
  align-items: center;
  gap: var(--space-3);
}

.page-placeholder__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 48px;
  height: 48px;
  border-radius: var(--radius-full);
  background: var(--gradient-accent);
  color: var(--color-text-on-accent);
  flex-shrink: 0;
}

.page-placeholder__eyebrow {
  font-size: var(--font-size-meta);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-tertiary);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.page-placeholder__title {
  font-size: var(--font-size-h2);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  line-height: var(--line-height-snug);
}

.page-placeholder__desc {
  font-size: var(--font-size-body-sm);
  color: var(--color-text-secondary);
}
</style>
