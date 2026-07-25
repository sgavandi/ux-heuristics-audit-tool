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
