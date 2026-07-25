/**
 * Small date/number formatting helpers used across pages.
 *
 * Everything uses the browser's `Intl` API — no dependencies.
 */

const DATE_FORMAT = new Intl.DateTimeFormat(undefined, {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
})

/**
 * Human-readable date. `2026-07-24T…` → "24 Jul 2026".
 * @param {string} iso
 * @returns {string}
 */
export function formatDate(iso) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  return DATE_FORMAT.format(d)
}

const RELATIVE = new Intl.RelativeTimeFormat(undefined, { numeric: 'auto' })

const UNITS = [
  { limit: 60, divisor: 1, unit: 'second' },
  { limit: 60 * 60, divisor: 60, unit: 'minute' },
  { limit: 60 * 60 * 24, divisor: 60 * 60, unit: 'hour' },
  { limit: 60 * 60 * 24 * 7, divisor: 60 * 60 * 24, unit: 'day' },
  { limit: 60 * 60 * 24 * 30, divisor: 60 * 60 * 24 * 7, unit: 'week' },
  { limit: 60 * 60 * 24 * 365, divisor: 60 * 60 * 24 * 30, unit: 'month' },
  { limit: Infinity, divisor: 60 * 60 * 24 * 365, unit: 'year' },
]

/**
 * Human-friendly relative time. `2026-07-23T…` (yesterday) → "yesterday".
 *
 * @param {string} iso
 * @param {Date} [now]
 * @returns {string}
 */
export function formatRelative(iso, now = new Date()) {
  if (!iso) return ''
  const d = new Date(iso)
  if (Number.isNaN(d.getTime())) return ''
  const diffSeconds = Math.round((d.getTime() - now.getTime()) / 1000)
  const abs = Math.abs(diffSeconds)
  for (const { limit, divisor, unit } of UNITS) {
    if (abs < limit) return RELATIVE.format(Math.round(diffSeconds / divisor), unit)
  }
  return ''
}

const PLATFORM_LABELS = {
  ios: 'iOS',
  android: 'Android',
  web: 'Web',
  desktop: 'Desktop',
}

/** Return the display label for a platform code. */
export function platformLabel(platform) {
  return PLATFORM_LABELS[platform] ?? platform ?? ''
}

const STATUS_LABELS = {
  draft: 'Draft',
  'in-progress': 'In progress',
  complete: 'Complete',
}

/** Return the display label for an audit status. */
export function statusLabel(status) {
  return STATUS_LABELS[status] ?? status ?? ''
}
