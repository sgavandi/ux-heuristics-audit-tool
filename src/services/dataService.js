/**
 * Data service — the single boundary between the app and any data source.
 *
 * In development the service resolves against the local mock dataset in
 * `mockData.js`. When `VITE_API_BASE_URL` is set the same function
 * signatures will make real HTTP calls (implementation of the remote path
 * is intentionally minimal here — Phase 4 only needs the shape).
 *
 * All functions are async and reject on failure. Callers (stores/composables)
 * are responsible for translating the rejection into a user-facing error.
 */

import { audits as mockAudits, frameworks as mockFrameworks } from './mockData.js'
import { generateMockRatings } from '@/utils/aiAudit.js'

const API_BASE = import.meta.env.VITE_API_BASE_URL || ''
const USE_REMOTE = Boolean(API_BASE)

// Simulated network latency so loading states in the UI are actually
// exercised in development. Set to 0 to make tests deterministic.
const MOCK_LATENCY_MS = 350

/**
 * Cheap deep clone — good enough for JSON-safe data. Keeps callers from
 * mutating the shared mock arrays by accident.
 */
const clone = (value) => JSON.parse(JSON.stringify(value))

const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms))

async function request(path) {
  const response = await fetch(`${API_BASE}${path}`, {
    headers: { Accept: 'application/json' },
  })
  if (!response.ok) {
    throw new Error(`Request failed (${response.status}) for ${path}`)
  }
  return response.json()
}

/**
 * Fetch every audit summary the user has access to.
 * @returns {Promise<Audit[]>}
 */
export async function fetchAudits() {
  if (USE_REMOTE) return request('/audits')
  await delay(MOCK_LATENCY_MS)
  return clone(mockAudits)
}

/**
 * Fetch a single audit by id, or null if it does not exist.
 * @param {string} id
 * @returns {Promise<Audit|null>}
 */
export async function fetchAuditById(id) {
  if (USE_REMOTE) return request(`/audits/${id}`)
  await delay(MOCK_LATENCY_MS)
  const found = mockAudits.find((a) => a.id === id)
  return found ? clone(found) : null
}

/**
 * Fetch all heuristic frameworks (Nielsen, etc.).
 * @returns {Promise<HeuristicFramework[]>}
 */
export async function fetchFrameworks() {
  if (USE_REMOTE) return request('/frameworks')
  await delay(MOCK_LATENCY_MS)
  return clone(mockFrameworks)
}

// ------------------------------------------------------------------ //
// Mutations                                                          //
// ------------------------------------------------------------------ //
//
// In development these mutate the in-memory mock arrays. In production
// they would call POST/PATCH/DELETE endpoints. Callers receive a fresh
// clone of the affected resource so the store never shares references
// with the mock.

async function mutate(fn) {
  await delay(MOCK_LATENCY_MS / 2)
  return fn()
}

/**
 * Create a new audit. Returns the created audit.
 *
 * @param {{ productName: string, platform: 'ios'|'android'|'web'|'desktop', frameworkId: string }} input
 * @returns {Promise<Audit>}
 */
export async function createAudit(input) {
  if (USE_REMOTE) {
    const response = await fetch(`${API_BASE}/audits`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(input),
    })
    if (!response.ok) throw new Error(`Create failed (${response.status})`)
    return response.json()
  }
  return mutate(() => {
    const now = new Date().toISOString()
    const audit = {
      id: `a-${Date.now().toString(36)}`,
      productName: input.productName.trim(),
      platform: input.platform,
      frameworkId: input.frameworkId,
      status: 'draft',
      createdAt: now,
      updatedAt: now,
      ratings: [],
    }
    mockAudits.unshift(audit)
    return clone(audit)
  })
}

/**
 * Upsert a rating for a heuristic on an audit. Also nudges the audit
 * from `draft` → `in-progress` on the first rating.
 *
 * @param {string} auditId
 * @param {string} heuristicId
 * @param {{ severity: 'pass'|'warning'|'critical', note?: string }} patch
 * @returns {Promise<Audit>}
 */
export async function upsertRating(auditId, heuristicId, patch) {
  if (USE_REMOTE) {
    const response = await fetch(
      `${API_BASE}/audits/${auditId}/ratings/${heuristicId}`,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify(patch),
      },
    )
    if (!response.ok) throw new Error(`Rate failed (${response.status})`)
    return response.json()
  }
  return mutate(() => {
    const audit = mockAudits.find((a) => a.id === auditId)
    if (!audit) throw new Error(`Audit ${auditId} not found`)
    const existing = audit.ratings.find((r) => r.heuristicId === heuristicId)
    if (existing) {
      existing.severity = patch.severity
      if (patch.note !== undefined) existing.note = patch.note
    } else {
      audit.ratings.push({ heuristicId, severity: patch.severity, ...(patch.note ? { note: patch.note } : {}) })
    }
    if (audit.status === 'draft') audit.status = 'in-progress'
    audit.updatedAt = new Date().toISOString()
    return clone(audit)
  })
}

/**
 * Explicitly change an audit's status (typically from
 * `in-progress` → `complete`).
 *
 * @param {string} auditId
 * @param {'draft'|'in-progress'|'complete'} status
 * @returns {Promise<Audit>}
 */
export async function setAuditStatus(auditId, status) {
  if (USE_REMOTE) {
    const response = await fetch(`${API_BASE}/audits/${auditId}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ status }),
    })
    if (!response.ok) throw new Error(`Status update failed (${response.status})`)
    return response.json()
  }
  return mutate(() => {
    const audit = mockAudits.find((a) => a.id === auditId)
    if (!audit) throw new Error(`Audit ${auditId} not found`)
    audit.status = status
    audit.updatedAt = new Date().toISOString()
    return clone(audit)
  })
}

/**
 * Delete an audit.
 * @param {string} auditId
 * @returns {Promise<void>}
 */
export async function deleteAudit(auditId) {
  if (USE_REMOTE) {
    const response = await fetch(`${API_BASE}/audits/${auditId}`, { method: 'DELETE' })
    if (!response.ok) throw new Error(`Delete failed (${response.status})`)
    return
  }
  return mutate(() => {
    const index = mockAudits.findIndex((a) => a.id === auditId)
    if (index >= 0) mockAudits.splice(index, 1)
  })
}

/**
 * Apply a batch of ratings to an audit in a single round-trip and mark
 * it in-progress. Used by the AI-assisted audit flow.
 *
 * @param {string} auditId
 * @param {Array<{ heuristicId: string, severity: 'pass'|'warning'|'critical', note?: string }>} ratings
 * @returns {Promise<Audit>}
 */
export async function applyRatingsBatch(auditId, ratings) {
  if (USE_REMOTE) {
    const response = await fetch(`${API_BASE}/audits/${auditId}/ratings`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ ratings }),
    })
    if (!response.ok) throw new Error(`Batch rate failed (${response.status})`)
    return response.json()
  }
  return mutate(() => {
    const audit = mockAudits.find((a) => a.id === auditId)
    if (!audit) throw new Error(`Audit ${auditId} not found`)
    for (const patch of ratings) {
      const existing = audit.ratings.find((r) => r.heuristicId === patch.heuristicId)
      if (existing) {
        existing.severity = patch.severity
        if (patch.note !== undefined) existing.note = patch.note
      } else {
        audit.ratings.push({
          heuristicId: patch.heuristicId,
          severity: patch.severity,
          ...(patch.note ? { note: patch.note } : {}),
        })
      }
    }
    if (audit.status === 'draft') audit.status = 'in-progress'
    audit.updatedAt = new Date().toISOString()
    return clone(audit)
  })
}

/**
 * Ask the server to generate a full set of ratings for a heuristic
 * framework using an LLM. When the endpoint is unreachable (e.g. in
 * `npm run dev` without `vercel dev`), falls back to the deterministic
 * client-side generator so the flow always completes.
 *
 * @param {{ productName: string, platform: string, description?: string, url?: string, heuristics: Array<any> }} input
 * @returns {Promise<{ ratings: Array<{ heuristicId: string, severity: string, note: string }>, source: 'openai'|'mock' }>}
 */
export async function generateAiRatings(input) {
  try {
    const response = await fetch('/api/ai-audit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(input),
    })
    if (!response.ok) throw new Error(`AI audit failed (${response.status})`)
    return await response.json()
  } catch (error) {
    // Fall back to the client-side mock so the app works without a
    // serverless runtime (e.g. `npm run dev`).
    const ratings = generateMockRatings(input)
    return { ratings, source: 'mock' }
  }
}
