/**
 * Scoring helpers for audit ratings.
 *
 * The app maps each severity onto a fractional score:
 *   pass     → 1.0
 *   warning  → 0.5
 *   critical → 0.0
 *
 * All helpers only count *rated* heuristics — an in-progress audit
 * reports the score of what has been evaluated so far, without
 * penalising unrated items.
 */

/** @typedef {import('@/services/mockData').Rating}    Rating */
/** @typedef {import('@/services/mockData').Audit}     Audit */
/** @typedef {import('@/services/mockData').Heuristic} Heuristic */
/** @typedef {import('@/services/mockData').HeuristicFramework} HeuristicFramework */

/** @type {Record<'pass' | 'warning' | 'critical', number>} */
export const SEVERITY_WEIGHT = {
  pass: 1,
  warning: 0.5,
  critical: 0,
}

/**
 * Overall score (0–100) for a set of ratings.
 * Returns 0 when there are no ratings — callers should render an empty
 * state instead of a "0%" score in that case.
 *
 * @param {Rating[]} ratings
 * @returns {number}
 */
export function scoreForRatings(ratings) {
  if (!ratings || ratings.length === 0) return 0
  const sum = ratings.reduce((acc, r) => acc + (SEVERITY_WEIGHT[r.severity] ?? 0), 0)
  return Math.round((sum / ratings.length) * 100)
}

/**
 * Count of ratings by severity.
 * @param {Rating[]} ratings
 * @returns {{ pass: number, warning: number, critical: number, total: number }}
 */
export function severityCounts(ratings) {
  const counts = { pass: 0, warning: 0, critical: 0, total: 0 }
  if (!ratings) return counts
  for (const r of ratings) {
    if (r.severity in counts) counts[r.severity] += 1
  }
  counts.total = ratings.length
  return counts
}

/**
 * Per-category breakdown for an audit given its framework.
 * Returns one entry per category that has at least one heuristic in
 * the framework, whether or not it has been rated. `ratedCount` is 0
 * for untouched categories, and callers can decide how to render.
 *
 * @param {Audit} audit
 * @param {HeuristicFramework} framework
 * @returns {{ category: string, score: number, total: number, ratedCount: number, heuristicIds: string[] }[]}
 */
export function categoryBreakdown(audit, framework) {
  if (!audit || !framework) return []

  const ratingsById = new Map(audit.ratings.map((r) => [r.heuristicId, r]))
  const byCategory = new Map()

  for (const h of framework.heuristics) {
    const bucket = byCategory.get(h.category) ?? {
      category: h.category,
      score: 0,
      total: 0,
      ratedCount: 0,
      heuristicIds: [],
      _sum: 0,
    }
    bucket.total += 1
    bucket.heuristicIds.push(h.id)
    const rating = ratingsById.get(h.id)
    if (rating) {
      bucket.ratedCount += 1
      bucket._sum += SEVERITY_WEIGHT[rating.severity] ?? 0
    }
    byCategory.set(h.category, bucket)
  }

  return Array.from(byCategory.values()).map(({ _sum, ratedCount, ...rest }) => ({
    ...rest,
    ratedCount,
    score: ratedCount === 0 ? 0 : Math.round((_sum / ratedCount) * 100),
  }))
}
