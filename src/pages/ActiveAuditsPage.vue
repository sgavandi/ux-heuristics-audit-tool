<script setup>
/**
 * ActiveAuditsPage — every open (draft + in-progress) audit.
 *
 * Explicit loading / error / empty / populated states.
 */
import { useRouter } from 'vue-router'
import { PhListChecks, PhPlus } from '@phosphor-icons/vue'
import { useAudits } from '@/composables/useAudits.js'
import PageHeader from '@/components/PageHeader.vue'
import BaseButton from '@/components/BaseButton.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'
import EmptyState from '@/components/EmptyState.vue'
import AuditListItem from '@/components/AuditListItem.vue'

const router = useRouter()
const { openAudits, isLoading, error, reload } = useAudits()
</script>

<template>
  <section aria-labelledby="active-title" class="page">
    <PageHeader
      eyebrow="In progress"
      title="Active Audits"
      title-id="active-title"
      description="Everything currently in flight — drafts and audits mid-evaluation."
    >
      <template #action>
        <BaseButton variant="primary" size="sm" @click="router.push({ name: 'new-audit' })">
          <template #leading><PhPlus :size="14" weight="bold" /></template>
          New audit
        </BaseButton>
      </template>
    </PageHeader>

    <LoadingState v-if="isLoading" message="Loading active audits…" />

    <ErrorState
      v-else-if="error"
      title="Couldn’t load audits"
      :message="error"
      @retry="reload"
    />

    <EmptyState
      v-else-if="openAudits.length === 0"
      :icon="PhListChecks"
      title="No open audits"
      description="Kick off a new audit and it will appear here so you can resume anytime."
    >
      <template #action>
        <BaseButton variant="primary" @click="router.push({ name: 'new-audit' })">
          <template #leading><PhPlus :size="14" weight="bold" /></template>
          Start an audit
        </BaseButton>
      </template>
    </EmptyState>

    <ul v-else class="list">
      <li v-for="audit in openAudits" :key="audit.id">
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
