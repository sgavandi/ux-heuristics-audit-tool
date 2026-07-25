<script setup>
/**
 * SettingsPage — evaluator preferences + data controls.
 *
 * Persists lightweight preferences to localStorage under a single
 * versioned key so future migrations are trivial. Runs no server call.
 */
import { computed, onMounted, ref, watch } from 'vue'
import { PhGear, PhWarning } from '@phosphor-icons/vue'
import { useAudits } from '@/composables/useAudits.js'
import PageHeader from '@/components/PageHeader.vue'
import BaseCard from '@/components/BaseCard.vue'
import BaseButton from '@/components/BaseButton.vue'
import BaseSelect from '@/components/BaseSelect.vue'
import LoadingState from '@/components/LoadingState.vue'
import ErrorState from '@/components/ErrorState.vue'

const STORAGE_KEY = 'uxha.preferences.v1'

const { frameworks, isLoading, error, reload, reset } = useAudits()

const prefs = ref({
  defaultFrameworkId: '',
  reduceMotion: false,
})

const frameworkOptions = computed(() =>
  frameworks.value.map((f) => ({ value: f.id, label: f.name })),
)

const savedAt = ref(null)

onMounted(() => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) {
      const parsed = JSON.parse(raw)
      prefs.value = { ...prefs.value, ...parsed }
    }
  } catch {
    // Storage may be unavailable (private mode) — ignore and use defaults.
  }
})

watch(
  prefs,
  (value) => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(value))
      savedAt.value = new Date().toISOString()
    } catch {
      // Best-effort save; the UI already reflects the change.
    }
  },
  { deep: true },
)

// Default framework is only meaningful after frameworks load. Backfill
// the first framework once available if the user hasn't picked one.
watch(frameworks, (list) => {
  if (!prefs.value.defaultFrameworkId && list.length > 0) {
    prefs.value.defaultFrameworkId = list[0].id
  }
})

function clearData() {
  const confirmed = window.confirm(
    'Reset all local audit data? This will remove any drafts and cannot be undone in this session.',
  )
  if (!confirmed) return
  reset()
  reload()
}
</script>

<template>
  <section aria-labelledby="settings-title" class="page">
    <PageHeader
      eyebrow="Preferences"
      title="Settings"
      title-id="settings-title"
      description="Tune defaults for new audits and manage local data."
    />

    <LoadingState v-if="isLoading" message="Loading settings…" />
    <ErrorState
      v-else-if="error"
      title="Couldn’t load settings"
      :message="error"
      @retry="reload"
    />

    <template v-else>
      <BaseCard padding="md" class="stack">
        <div class="stack__title">
          <PhGear :size="20" weight="regular" aria-hidden="true" />
          <h2>Audit defaults</h2>
        </div>
        <BaseSelect
          v-model="prefs.defaultFrameworkId"
          label="Default framework"
          :options="frameworkOptions"
          helper="Selected automatically when you start a new audit."
        />
      </BaseCard>

      <BaseCard padding="md" class="stack">
        <div class="stack__title">
          <h2>Accessibility</h2>
        </div>
        <label class="toggle">
          <input
            v-model="prefs.reduceMotion"
            type="checkbox"
            class="toggle__input"
          />
          <span class="toggle__label">
            <span class="toggle__title">Prefer reduced motion in this app</span>
            <span class="toggle__desc">
              In addition to your system setting, disables non-essential
              animations app-wide.
            </span>
          </span>
        </label>
      </BaseCard>

      <BaseCard padding="md" class="stack">
        <div class="stack__title">
          <PhWarning :size="20" weight="regular" aria-hidden="true" />
          <h2>Data</h2>
        </div>
        <p class="stack__desc">
          Local audit data is stored in memory only during this dev
          session and is reset when the page reloads. Use the button
          below to wipe the current state now.
        </p>
        <div>
          <BaseButton variant="secondary" size="sm" @click="clearData">
            Reset local data
          </BaseButton>
        </div>
      </BaseCard>

      <p v-if="savedAt" class="saved" aria-live="polite">Preferences saved.</p>
    </template>
  </section>
</template>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: var(--space-4);
}

.stack {
  display: flex;
  flex-direction: column;
  gap: var(--space-3);
}

.stack__title {
  display: flex;
  align-items: center;
  gap: var(--space-2);
  color: var(--color-text-primary);
}

.stack__title h2 {
  font-size: var(--font-size-body);
  font-weight: var(--font-weight-semibold);
  margin: 0;
}

.stack__desc {
  font-size: var(--font-size-body-sm);
  color: var(--color-text-secondary);
}

.toggle {
  display: flex;
  align-items: flex-start;
  gap: var(--space-3);
  cursor: pointer;
  padding: var(--space-2) 0;
}

.toggle__input {
  appearance: none;
  -webkit-appearance: none;
  flex-shrink: 0;
  width: 44px;
  height: 26px;
  border-radius: 9999px;
  background: var(--color-border-subtle);
  position: relative;
  cursor: pointer;
  transition: background var(--transition-default);
  margin-top: 2px;
}

.toggle__input::after {
  content: '';
  position: absolute;
  top: 3px;
  left: 3px;
  width: 20px;
  height: 20px;
  border-radius: 50%;
  background: #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
  transition: transform var(--transition-default);
}

.toggle__input:checked {
  background: var(--gradient-accent);
}

.toggle__input:checked::after {
  transform: translateX(18px);
}

.toggle__input:focus-visible {
  outline: 2px solid var(--color-accent-end);
  outline-offset: 2px;
}

.toggle__label {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.toggle__title {
  font-size: var(--font-size-body-sm);
  font-weight: var(--font-weight-medium);
  color: var(--color-text-primary);
}

.toggle__desc {
  font-size: var(--font-size-meta);
  color: var(--color-text-secondary);
}

.saved {
  font-size: var(--font-size-meta);
  color: var(--color-text-tertiary);
  text-align: center;
}
</style>
