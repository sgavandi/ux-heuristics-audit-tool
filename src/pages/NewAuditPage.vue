<script setup>
/**
 * NewAuditPage — create-audit flow.
 *
 * Two modes:
 *   - manual: create the audit and jump straight to the evaluation UI
 *   - ai:     create the audit, then ask the AI to rate every heuristic
 *             in one batch. Applies the ratings and lands on the detail
 *             page with the score already populated.
 */
import { computed, onMounted, ref, watch } from 'vue'
import { useRouter } from 'vue-router'
import {
  PhArrowLeft,
  PhArrowRight,
  PhSparkle,
  PhPencilSimpleLine,
} from '@phosphor-icons/vue'
import { useAudits } from '@/composables/useAudits.js'
import PageHeader from '@/components/PageHeader.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseInput from '@/components/BaseInput.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const router = useRouter()
const { frameworks, isLoading, error, reload, createAudit, runAiAudit } = useAudits()

const productName = ref('')
const platform = ref('web')
const frameworkId = ref('')
const mode = ref('manual')
const aiUrl = ref('')
const aiDescription = ref('')

const platformOptions = [
  { value: 'ios', label: 'iOS' },
  { value: 'android', label: 'Android' },
  { value: 'web', label: 'Web' },
  { value: 'desktop', label: 'Desktop' },
]

const frameworkOptions = computed(() =>
  frameworks.value.map((f) => ({ value: f.id, label: f.name })),
)

watch(frameworks, (list) => {
  if (!frameworkId.value && list.length > 0) frameworkId.value = list[0].id
})

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
  () =>
    !productNameError.value &&
    !frameworkError.value &&
    productName.value.trim().length >= 2 &&
    !!frameworkId.value,
)

const isSubmitting = ref(false)
const submitError = ref(null)
const aiStage = ref('idle') // 'idle' | 'creating' | 'analysing'

const submitLabel = computed(() =>
  mode.value === 'ai' ? 'Run AI audit' : 'Create audit',
)

const loaderMessage = computed(() => {
  if (aiStage.value === 'creating') return 'Setting up the audit…'
  if (aiStage.value === 'analysing') return 'AI is rating each heuristic…'
  return 'Working…'
})

async function submit() {
  submitted.value = true
  if (!isValid.value) return
  isSubmitting.value = true
  submitError.value = null
  try {
    aiStage.value = 'creating'
    const created = await createAudit({
      productName: productName.value.trim(),
      platform: platform.value,
      frameworkId: frameworkId.value,
    })

    if (mode.value === 'ai') {
      aiStage.value = 'analysing'
      await runAiAudit(created.id, {
        url: aiUrl.value.trim(),
        description: aiDescription.value.trim(),
      })
    }

    router.replace({ name: 'audit-detail', params: { id: created.id } })
  } catch (e) {
    submitError.value = e instanceof Error ? e.message : 'Could not create audit.'
  } finally {
    isSubmitting.value = false
    aiStage.value = 'idle'
  }
}

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
      description="Give the audit a name, pick your framework, and choose how you want to rate the heuristics."
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

    <template v-else>
      <BaseCard padding="md">
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

          <fieldset class="mode" :disabled="isSubmitting">
            <legend class="mode__legend">How do you want to rate?</legend>
            <div class="mode__group" role="radiogroup" aria-label="Audit mode">
              <label
                class="mode__option"
                :class="{ 'mode__option--active': mode === 'manual' }"
              >
                <input
                  v-model="mode"
                  type="radio"
                  name="audit-mode"
                  value="manual"
                  class="mode__radio"
                />
                <span class="mode__icon" aria-hidden="true">
                  <PhPencilSimpleLine :size="18" weight="bold" />
                </span>
                <span class="mode__body">
                  <span class="mode__title">Manual</span>
                  <span class="mode__desc">Rate each heuristic yourself.</span>
                </span>
              </label>

              <label
                class="mode__option"
                :class="{ 'mode__option--active': mode === 'ai' }"
              >
                <input
                  v-model="mode"
                  type="radio"
                  name="audit-mode"
                  value="ai"
                  class="mode__radio"
                />
                <span class="mode__icon mode__icon--accent" aria-hidden="true">
                  <PhSparkle :size="18" weight="fill" />
                </span>
                <span class="mode__body">
                  <span class="mode__title">AI-assisted</span>
                  <span class="mode__desc">
                    Let the AI draft a first pass. You can edit anything after.
                  </span>
                </span>
              </label>
            </div>
          </fieldset>

          <div v-if="mode === 'ai'" class="ai-context">
            <BaseInput
              v-model="aiUrl"
              type="url"
              label="Product URL"
              placeholder="https://…"
              helper="Optional. Helps the AI ground its ratings."
              autocomplete="off"
            />
            <BaseInput
              v-model="aiDescription"
              label="Extra context"
              placeholder="e.g. Onboarding flow for new retail banking customers"
              helper="Optional. One line about the surface or task under review."
              autocomplete="off"
            />
          </div>

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
              {{ submitLabel }}
              <template #trailing><PhArrowRight :size="16" weight="bold" /></template>
            </BaseButton>
          </div>
        </form>
      </BaseCard>

      <LoadingState
        v-if="isSubmitting && mode === 'ai'"
        :message="loaderMessage"
      />
    </template>
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

.mode {
  border: 0;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: var(--space-2);
}

.mode__legend {
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
  padding: 0;
}

.mode__group {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-2);
}

@media (min-width: 480px) {
  .mode__group {
    grid-template-columns: 1fr 1fr;
  }
}

.mode__option {
  position: relative;
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-surface-card);
  border: 1px solid var(--color-border-subtle);
  border-radius: var(--radius-card-nested);
  cursor: pointer;
  transition:
    border-color var(--duration-default) var(--easing-standard),
    box-shadow var(--duration-default) var(--easing-standard);
  min-height: 44px;
}

.mode__option:hover {
  border-color: var(--color-accent-end);
}

.mode__option--active {
  border-color: var(--color-accent-end);
  box-shadow: var(--shadow-nested);
}

.mode__option:focus-within {
  outline: 2px solid var(--color-accent-end);
  outline-offset: 2px;
}

.mode__radio {
  position: absolute;
  opacity: 0;
  inset: 0;
  cursor: pointer;
}

.mode__icon {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: var(--radius-full);
  background: var(--color-border-subtle);
  color: var(--color-text-secondary);
  flex-shrink: 0;
}

.mode__icon--accent {
  background: var(--gradient-accent);
  color: var(--color-text-on-accent);
}

.mode__body {
  display: flex;
  flex-direction: column;
  gap: var(--space-1);
}

.mode__title {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  color: var(--color-text-primary);
}

.mode__desc {
  font-size: var(--font-size-body-sm);
  color: var(--color-text-secondary);
  line-height: 1.4;
}

.ai-context {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
  padding: var(--space-3);
  background: var(--color-border-subtle);
  border-radius: var(--radius-card-nested);
}
</style>
