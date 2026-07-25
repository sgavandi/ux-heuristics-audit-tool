<script setup>
import { PhListChecks } from '@phosphor-icons/vue'
import PagePlaceholder from '@/components/PagePlaceholder.vue'
</script>

<template>
  <PagePlaceholder
    eyebrow="In progress"
    title="Active Audits"
    description="Continue where you left off. Live audits currently being evaluated will show up here."
    :icon="PhListChecks"
  />
</template>
