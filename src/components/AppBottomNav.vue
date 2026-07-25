<script setup>
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import {
  PhSquaresFour,
  PhListChecks,
  PhClockCounterClockwise,
  PhGear,
} from '@phosphor-icons/vue'

const route = useRoute()

const tabs = [
  { name: 'overview', label: 'Overview', icon: PhSquaresFour },
  { name: 'audits',   label: 'Audits',   icon: PhListChecks },
  { name: 'history',  label: 'History',  icon: PhClockCounterClockwise },
  { name: 'settings', label: 'Settings', icon: PhGear },
]

const activeName = computed(() => route.name)
</script>

<template>
  <nav class="bottom-nav" aria-label="Primary">
    <ul class="bottom-nav__list">
      <li
        v-for="tab in tabs"
        :key="tab.name"
        class="bottom-nav__item"
      >
        <router-link
          :to="{ name: tab.name }"
          class="bottom-nav__link"
          :class="{ 'bottom-nav__link--active': activeName === tab.name }"
          :aria-current="activeName === tab.name ? 'page' : undefined"
        >
          <span class="bottom-nav__icon" aria-hidden="true">
            <component
              :is="tab.icon"
              :size="24"
              :weight="activeName === tab.name ? 'fill' : 'regular'"
            />
          </span>
          <span class="bottom-nav__label">{{ tab.label }}</span>
        </router-link>
      </li>
    </ul>
  </nav>
</template>

<style scoped>
.bottom-nav {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10;

  display: flex;
  justify-content: center;

  padding: var(--space-2) var(--space-3)
           calc(var(--space-2) + var(--safe-inset-bottom));

  /* Soft top fade so the nav lifts off the ambient gradient. */
  background: linear-gradient(
    to top,
    rgba(255, 255, 255, 0.85) 0%,
    rgba(255, 255, 255, 0.6) 60%,
    rgba(255, 255, 255, 0) 100%
  );
  backdrop-filter: none;
}

.bottom-nav__list {
  list-style: none;
  margin: 0;
  padding: var(--space-2);
  display: flex;
  gap: var(--space-1);

  width: 100%;
  max-width: var(--container-max);

  background: var(--color-surface-card);
  border-radius: var(--radius-pill);
  box-shadow: var(--shadow-card);
}

.bottom-nav__item {
  flex: 1;
  display: flex;
}

.bottom-nav__link {
  flex: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 2px;

  padding: var(--space-2) var(--space-1);
  min-height: 56px; /* Comfortable one-hand tap target. */

  border-radius: var(--radius-pill);
  text-decoration: none;
  color: var(--color-text-tertiary);
  font-size: var(--font-size-meta);
  font-weight: var(--font-weight-medium);
  line-height: 1;

  transition:
    color var(--transition-default),
    background var(--transition-default),
    transform var(--transition-fast);
}

.bottom-nav__link:hover {
  color: var(--color-text-primary);
}

.bottom-nav__link:active {
  transform: scale(0.97);
}

.bottom-nav__icon {
  display: inline-flex;
  color: currentColor;
}

.bottom-nav__link--active {
  color: var(--color-text-on-accent);
  background: var(--gradient-accent);
  box-shadow: var(--shadow-fab);
}

.bottom-nav__link--active:hover {
  color: var(--color-text-on-accent);
}

.bottom-nav__label {
  font-size: var(--font-size-meta);
  letter-spacing: 0.02em;
}
</style>
