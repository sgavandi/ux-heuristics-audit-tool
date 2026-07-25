<script setup>
/**
 * NewAuditPage — the create-audit flow.
 *
 * A single-step form (per the brief's "streamlined setup"). On submit:
 *   - Validates inputs.
 *   - Creates an audit via the store.
 *   - Navigates to `/audits/:id` so the evaluator can begin rating.
 */
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import { PhArrowLeft, PhArrowRight } from '@phosphor-icons/vue'
import { useAudits } from '@/composables/useAudits.js'
import PageHeader from '@/components/PageHeader.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const router = useRouter()
const { frameworks, isLoading, error, reload, createAudit } = useAudits()

const productName = ref('')
const platform = ref('web')
const frameworkId = ref('')

const platformOptions = [
  { value: 'ios', label: 'iOS' },
  { value: 'android', label: 'Android' },
  { value: 'web', label: 'Web' },
  { value: 'desktop', label: 'Desktop' },
]

const frameworkOptions = computed(() =>
  frameworks.value.map((f) => ({ value: f.id, label: f.name })),
)

// Backfill framework choice with the first framework once available.
watch(frameworks, (list) => {
  if (!frameworkId.value && list.length > 0) frameworkId.value = list[0].id
})

// Validation
const submitted = ref(false)
const productNameError = computed(() => {
  if (!submitted.value) return ''
  if (!productName.value.trim()) return 'Please enter a product name.'
  if (productName.value.trim().length < 2) return 'Product name is too short.'
  return ''
})
const frameworkError = computed(() =>
  submitted.value && !frameworkId.value ? 'Please select a framework.' : '',
)

const isValid = computed(
  () => !productNameError.value && !frameworkError.value && productName.value.trim().length >= 2 && !!frameworkId.value,
)

const isSubmitting = ref(false)
const submitError = ref(null)

async function submit() {
  submitted.value = true
  if (!isValid.value) return
  isSubmitting.value = true
  submitError.value = null
  try {
    const created = await createAudit({
      productName: productName.value.trim(),
      platform: platform.value,
      frameworkId: frameworkId.value,
    })
    router.replace({ name: 'audit-detail', params: { id: created.id } })
  } catch (e) {
    submitError.value = e instanceof Error ? e.message : 'Could not create audit.'
  } finally {
    isSubmitting.value = false
  }
}

// Focus the first field once frameworks arrive.
onMounted(() => {
  requestAnimationFrame(() => {
    document.querySelector('input[type="text"]')?.focus()
  })
})
</script>

<template>
  <section aria-labelledby="new-audit-title" class="page">
    <PageHeader
      eyebrow="Start"
      title="New audit"
      title-id="new-audit-title"
      description="Give the audit a name and pick your framework. You can add ratings and notes as you go."
    >
      <template #action>
        <BaseButton variant="ghost" size="sm" @click="router.back()">
          <template #leading><PhArrowLeft :size="14" weight="bold" /></template>
          Back
        </BaseButton>
      </template>
    </PageHeader>

    <LoadingState v-if="isLoading" message="Loading frameworks…" />

    <ErrorState
      v-else-if="error"
      title="Couldn’t load setup data"
      :message="error"
      @retry="reload"
    />

    <BaseCard v-else padding="md">
      <form class="form" @submit.prevent="submit" novalidate>
        <BaseInput
          v-model="productName"
          label="Product name"
          placeholder="e.g. Acme Banking · Mobile"
          helper="The name of the product being evaluated."
          :error="productNameError"
          required
          autocomplete="off"
        />

        <BaseSelect
          v-model="platform"
          label="Platform"
          :options="platformOptions"
          helper="The environment the audit is being conducted on."
          required
        />

        <BaseSelect
          v-model="frameworkId"
          label="Heuristic framework"
          :options="frameworkOptions"
          placeholder="Select a framework"
          helper="Determines which heuristics you'll rate against."
          :error="frameworkError"
          required
        />

        <p v-if="submitError" role="alert" class="form__error">
          {{ submitError }}
        </p>

        <div class="form__actions">
          <BaseButton
            type="submit"
            variant="primary"
            :loading="isSubmitting"
            block
          >
            Create audit
            <template #trailing><PhArrowRight :size="16" weight="bold" /></template>
          </BaseButton>
        </div>
      </form>
    </BaseCard>
  </section>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.form {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.form__actions {
  padding-top: var(--space-2);
}

.form__error {
  font-size: var(--font-size-body-sm);
  color: var(--color-critical);
}
</style>
