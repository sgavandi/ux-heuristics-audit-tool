import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import {
  fetchAudits,
  fetchFrameworks,
  createAudit as createAuditRemote,
  upsertRating as upsertRatingRemote,
  setAuditStatus as setAuditStatusRemote,
  deleteAudit as deleteAuditRemote,
} from '@/services/dataService.js'

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

  /** Draft + in-progress audits. Newest updates first. */
  const openAudits = computed(() =>
    audits.value
      .filter((a) => a.status !== 'complete')
      .slice()
      .sort((a, b) => (a.updatedAt < b.updatedAt ? 1 : -1)),
  )

  /** Look up a single audit by id. Returns `null` when not present. */
  function getAuditById(id) {
    return audits.value.find((a) => a.id === id) ?? null
  }

  /** Look up a framework by id, falling back to the first available. */
  function getFrameworkById(id) {
    return (
      frameworks.value.find((f) => f.id === id) ?? frameworks.value[0] ?? null
    )
  }

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

  /**
   * Merge an updated audit into local state (used after mutations so we
   * don't need a full refetch).
   */
  function _replaceAudit(next) {
    const index = audits.value.findIndex((a) => a.id === next.id)
    if (index >= 0) audits.value[index] = next
    else audits.value.unshift(next)
  }

  /**
   * Create a new audit. Returns the created audit (already merged into
   * local state).
   * @param {{ productName: string, platform: string, frameworkId: string }} input
   */
  async function createAudit(input) {
    const created = await createAuditRemote(input)
    _replaceAudit(created)
    return created
  }

  /**
   * Upsert a rating on an audit. Returns the updated audit.
   * @param {string} auditId
   * @param {string} heuristicId
   * @param {{ severity: 'pass'|'warning'|'critical', note?: string }} patch
   */
  async function setRating(auditId, heuristicId, patch) {
    const next = await upsertRatingRemote(auditId, heuristicId, patch)
    _replaceAudit(next)
    return next
  }

  /**
   * Update an audit's status. Returns the updated audit.
   * @param {string} auditId
   * @param {'draft'|'in-progress'|'complete'} status
   */
  async function setStatus(auditId, status) {
    const next = await setAuditStatusRemote(auditId, status)
    _replaceAudit(next)
    return next
  }

  /**
   * Delete an audit and remove it from local state.
   * @param {string} auditId
   */
  async function removeAudit(auditId) {
    await deleteAuditRemote(auditId)
    audits.value = audits.value.filter((a) => a.id !== auditId)
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
    openAudits,
    // lookups
    getAuditById,
    getFrameworkById,
    // actions
    load,
    createAudit,
    setRating,
    setStatus,
    removeAudit,
    reset,
  }
})
