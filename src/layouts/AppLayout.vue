<script setup>
import AppBottomNav from '@/components/AppBottomNav.vue'
</script>

<template>
  <div class="shell">
    <main class="shell__content">
      <slot />
    </main>
    <AppBottomNav />
  </div>
</template>

<style scoped>
.shell {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.shell__content {
  flex: 1;
  width: 100%;
  max-width: var(--container-max);
  margin: 0 auto;
  padding: calc(var(--space-5) + var(--safe-inset-top))
           var(--space-4)
           calc(var(--nav-height) + var(--space-6) + var(--safe-inset-bottom));

  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

/* Widen breathing room on tablet+ but keep the content column mobile-first. */
@media (min-width: 640px) {
  .shell__content {
    padding-left: var(--space-5);
    padding-right: var(--space-5);
  }
}
</style>
