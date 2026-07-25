import { onMounted } from 'vue'
import { storeToRefs } from 'pinia'
import { useAuditsStore } from '@/stores/audits.js'

/**
 * Composable that exposes audit data alongside its loading / error / empty
 * state. It also triggers an initial fetch on mount so components can just
 * consume the refs without wiring lifecycle logic themselves.
 *
 * Usage:
 *   const { audits, isLoading, error, isEmpty, reload } = useAudits()
 */
export function useAudits({ autoLoad = true } = {}) {
  const store = useAuditsStore()

  const {
    audits,
    frameworks,
    isLoading,
    error,
    hasLoadedOnce,
    isEmpty,
    totalCount,
    activeAudits,
    completedAudits,
  } = storeToRefs(store)

  if (autoLoad) {
    onMounted(() => {
      store.load()
    })
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
    load: store.load,
    reload: () => store.load({ force: true }),
    reset: store.reset,
  }
}
