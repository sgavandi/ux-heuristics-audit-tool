<script setup>
import { PhClockCounterClockwise } from '@phosphor-icons/vue'
import PagePlaceholder from '@/components/PagePlaceholder.vue'
</script>

<template>
  <PagePlaceholder
    eyebrow="Archive"
    title="History"
    description="Past audits, benchmark snapshots, and shared reports will be listed here."
    :icon="PhClockCounterClockwise"
  />
</template>
