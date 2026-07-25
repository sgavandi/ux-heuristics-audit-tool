<script setup>
import { PhShieldCheck } from '@phosphor-icons/vue'
</script>

<template>
  <v-app>
    <v-main>
      <v-container class="d-flex flex-column align-center justify-center" style="min-height: 100vh; gap: 16px;">
        <PhShieldCheck :size="48" weight="duotone" />
        <h1 style="font-family: 'Inter', sans-serif; font-weight: 700; margin: 0;">
          UX Heuristics Audit Tool
        </h1>
        <p style="font-family: 'Inter', sans-serif; color: #64748B; margin: 0;">
          Phase 1 scaffold — Vite + Vue 3 + Vuetify + Phosphor + Inter.
        </p>
        <v-btn color="primary" rounded="pill">
          Scaffold ready
        </v-btn>
      </v-container>
    </v-main>
  </v-app>
</template>
