<script setup>
/**
 * BaseCard — the primary surface primitive.
 *
 * Follows the project brief:
 *   - Pure white surface (#FFFFFF) on top of the ambient gradient.
 *   - Generous 24 px radius for primary cards; 16 px for nested cards.
 *   - Soft, subtle drop shadow.
 *
 * Note on radii: The project plan mentioned `12px` for cards but the
 * brief defines 20–24 px as the visual identity. Following the brief
 * (see PHASE 2 handoff notes for rationale).
 */

defineProps({
  /** Nested cards get subtle borders + reduced radius/shadow. */
  nested: { type: Boolean, default: false },

  /** Inner padding scale — always 8 px grid multiples. */
  padding: {
    type: String,
    default: 'md',
    validator: (v) => ['none', 'sm', 'md', 'lg'].includes(v),
  },

  /** Element to render for semantics (article, section, etc.). */
  tag: { type: String, default: 'div' },

  /** Show a raised state on hover (for interactive cards). */
  interactive: { type: Boolean, default: false },
})
</script>

<template>
  <component
    :is="tag"
    class="card"
    :class="[
      nested && 'card--nested',
      interactive && 'card--interactive',
      `card--pad-${padding}`,
    ]"
  >
    <slot />
  </component>
</template>

<style scoped>
.card {
  background: var(--color-surface-card);
  border-radius: var(--radius-card);
  box-shadow: var(--shadow-card);
  transition:
    box-shadow var(--transition-default),
    transform var(--transition-fast);
}

.card--nested {
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-card-nested);
  box-shadow: var(--shadow-nested);
}

.card--interactive {
  cursor: pointer;
}

.card--interactive:hover {
  box-shadow: var(--shadow-card-hover);
  transform: translateY(-1px);
}

.card--interactive:active {
  transform: translateY(0);
}

.card--interactive:focus-visible {
  outline: 2px solid var(--color-accent-end);
  outline-offset: 2px;
}

.card--pad-none { padding: 0; }
.card--pad-sm   { padding: var(--space-3); }
.card--pad-md   { padding: var(--space-4); }
.card--pad-lg   { padding: var(--space-5); }
</style>
