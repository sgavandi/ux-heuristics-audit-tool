<script setup>
import AppLayout from '@/layouts/AppLayout.vue'
</script>

<template>
  <v-app>
    <v-main>
      <AppLayout>
        <router-view v-slot="{ Component }">
          <transition name="page" mode="out-in">
            <component :is="Component" />
          </transition>
        </router-view>
      </AppLayout>
    </v-main>
  </v-app>
</template>

<style>
/* Page transition — 300ms per --duration-default. Unscoped so the
   classes apply to the routed component regardless of its own scoping. */
.page-enter-active,
.page-leave-active {
  transition:
    opacity var(--duration-default) var(--easing-standard),
    transform var(--duration-default) var(--easing-standard);
}

.page-enter-from {
  opacity: 0;
  transform: translateY(8px);
}

.page-leave-to {
  opacity: 0;
  transform: translateY(-8px);
}
</style>
