import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { fetchAudits, fetchFrameworks } from '@/services/dataService.js'

/**
 * Audits store — the app's canonical source of truth for audit data.
 *
 * Uses the standard three-flag pattern (isLoading / error / data) so any
 * view can render loading, error, empty and populated states explicitly.
 */
export const useAuditsStore = defineStore('audits', () => {
  /** @type {import('vue').Ref<Audit[]>} */
  const audits = ref([])

  /** @type {import('vue').Ref<HeuristicFramework[]>} */
  const frameworks = ref([])

  const isLoading = ref(false)
  const error = ref(null)
  const hasLoadedOnce = ref(false)

  const isEmpty = computed(
    () => hasLoadedOnce.value && !isLoading.value && audits.value.length === 0,
  )

  /** Total audits across every status. */
  const totalCount = computed(() => audits.value.length)

  /** Audits currently in progress (status === 'in-progress'). */
  const activeAudits = computed(() =>
    audits.value.filter((a) => a.status === 'in-progress'),
  )

  /** Audits marked complete. Newest first. */
  const completedAudits = computed(() =>
    audits.value
      .filter((a) => a.status === 'complete')
      .slice()
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)),
  )

  /**
   * Fetch audits + frameworks in parallel.
   * @param {{ force?: boolean }} [options]
   */
  async function load({ force = false } = {}) {
    if (isLoading.value) return
    if (hasLoadedOnce.value && !force) return

    isLoading.value = true
    error.value = null
    try {
      const [nextAudits, nextFrameworks] = await Promise.all([
        fetchAudits(),
        fetchFrameworks(),
      ])
      audits.value = nextAudits
      frameworks.value = nextFrameworks
      hasLoadedOnce.value = true
    } catch (e) {
      error.value = e instanceof Error ? e.message : 'Unable to load audits.'
    } finally {
      isLoading.value = false
    }
  }

  function reset() {
    audits.value = []
    frameworks.value = []
    isLoading.value = false
    error.value = null
    hasLoadedOnce.value = false
  }

  return {
    // state
    audits,
    frameworks,
    isLoading,
    error,
    hasLoadedOnce,
    // getters
    isEmpty,
    totalCount,
    activeAudits,
    completedAudits,
    // actions
    load,
    reset,
  }
})
