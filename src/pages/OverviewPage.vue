<script setup>
import { PhSquaresFour } from '@phosphor-icons/vue'
import PagePlaceholder from '@/components/PagePlaceholder.vue'
</script>

<template>
  <PagePlaceholder
    eyebrow="Dashboard"
    title="Overview"
    description="Your audit overview will appear here — recent scores, in-progress audits, and peer benchmarks."
    :icon="PhSquaresFour"
  />
</template>
