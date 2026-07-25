<script setup>
/**
 * HistoryPage — every completed audit, newest first.
 */
import { PhClockCounterClockwise } from '@phosphor-icons/vue'
import { useAudits } from '@/composables/useAudits.js'
import PageHeader from '@/components/PageHeader.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import EmptyState from '@/components/EmptyState.vue'
import AuditListItem from '@/components/AuditListItem.vue'

const { completedAudits, isLoading, error, reload } = useAudits()
</script>

<template>
  <section aria-labelledby="history-title" class="page">
    <PageHeader
      eyebrow="Archive"
      title="History"
      title-id="history-title"
      description="Every audit you’ve completed. Sorted by most recently updated."
    />

    <LoadingState v-if="isLoading" message="Loading history…" />

    <ErrorState
      v-else-if="error"
      title="Couldn’t load history"
      :message="error"
      @retry="reload"
    />

    <EmptyState
      v-else-if="completedAudits.length === 0"
      :icon="PhClockCounterClockwise"
      title="No completed audits yet"
      description="Finish an audit to see it show up here alongside its shareable report."
    />

    <ul v-else class="list">
      <li v-for="audit in completedAudits" :key="audit.id">
        <AuditListItem :audit="audit" />
      </li>
    </ul>
  </section>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}
</style>
