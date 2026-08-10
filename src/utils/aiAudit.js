/**
 * Heuristic-rating generators for AI-assisted audits.
 *
 * Two paths:
 *   - `generateRatingsWithOpenAI` — asks a chat model to produce a
 *     structured JSON rating for every heuristic in the framework.
 *   - `generateMockRatings`       — deterministic pseudo-AI used as a
 *     fallback when no LLM is configured, or for tests. Seeded by
 *     product name so the same input always yields the same audit.
 *
 * Both return the same shape:
 *   [{ heuristicId, severity: 'pass'|'warning'|'critical', note: string }]
 *
 * This module runs in both the browser and a Vercel serverless
 * function, so it must stay free of Vue / Node-only imports.
 */

const SEVERITIES = ['pass', 'warning', 'critical']

// FNV-1a 32-bit hash — small, dependency-free, good enough for seeding.
function hash(str) {
  let h = 0x811c9dc5
  for (let i = 0; i < str.length; i += 1) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 0x01000193) >>> 0
  }
  return h
}

function pickSeverity(seed) {
  // Weighted so audits feel realistic: ~55% pass, ~30% warning, ~15% critical.
  const bucket = seed % 100
  if (bucket < 55) return 'pass'
  if (bucket < 85) return 'warning'
  return 'critical'
}

const NOTE_TEMPLATES = {
  pass: [
    'Meets expectations for {product} on {platform}. No blockers observed.',
    '{product} handles this well — clear affordances and predictable feedback.',
    'Solid coverage on {platform}. Nothing to flag for this heuristic.',
  ],
  warning: [
    'Partially met. {product} on {platform} has gaps around edge cases and error recovery.',
    'Works in the happy path but degrades under stress. Worth a design review.',
    'Inconsistent implementation across surfaces — {platform} experience varies by flow.',
  ],
  critical: [
    'Not met. {product} on {platform} breaks a fundamental expectation here.',
    'High-impact issue: users on {platform} cannot recover without external help.',
    'Blocks core tasks on {platform}. Needs a dedicated fix before ship.',
  ],
}

/**
 * Deterministic rating generator used when no LLM is configured.
 * @param {{ heuristics: Array<{ id: string, name?: string, category?: string }>, productName: string, platform?: string, description?: string, url?: string }} input
 */
export function generateMockRatings(input) {
  const { heuristics, productName, platform = 'web', description = '', url = '' } = input
  const salt = `${productName}::${platform}::${description}::${url}`

  return heuristics.map((h) => {
    const seed = hash(`${salt}::${h.id}`)
    const severity = pickSeverity(seed)
    const templates = NOTE_TEMPLATES[severity]
    const template = templates[seed % templates.length]
    const note = template
      .replace('{product}', productName || 'the product')
      .replace('{platform}', friendlyPlatform(platform))
    return { heuristicId: h.id, severity, note }
  })
}

function friendlyPlatform(p) {
  switch (p) {
    case 'ios':
      return 'iOS'
    case 'android':
      return 'Android'
    case 'desktop':
      return 'desktop'
    default:
      return 'web'
  }
}

/**
 * Call OpenAI Chat Completions with JSON-mode to produce ratings.
 * Only used by the server-side API function — never call this from the
 * browser (it would leak the API key).
 *
 * @param {object} input
 * @param {string} apiKey
 * @returns {Promise<Array<{ heuristicId: string, severity: string, note: string }>>}
 */
export async function generateRatingsWithOpenAI(input, apiKey) {
  const { heuristics, productName, platform, description, url } = input

  const heuristicSummary = heuristics
    .map((h) => `- ${h.id}: ${h.name}${h.summary ? ` — ${h.summary}` : ''}`)
    .join('\n')

  const system = [
    'You are a senior UX researcher performing a heuristic evaluation.',
    'Return ratings for every heuristic supplied by the user.',
    'Severity must be one of: "pass" (heuristic met), "warning" (partial), "critical" (blocking issue).',
    'Notes must be one or two concise sentences that a designer could act on.',
    'Respond with strict JSON matching: { "ratings": [{ "heuristicId": string, "severity": string, "note": string }] }.',
  ].join(' ')

  const user = [
    `Product: ${productName}`,
    `Platform: ${friendlyPlatform(platform)}`,
    url ? `URL: ${url}` : null,
    description ? `Context: ${description}` : null,
    '',
    'Rate every heuristic below and return one entry per id:',
    heuristicSummary,
  ]
    .filter(Boolean)
    .join('\n')

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || 'gpt-4o-mini',
      temperature: 0.4,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: system },
        { role: 'user', content: user },
      ],
    }),
  })

  if (!response.ok) {
    const detail = await response.text()
    throw new Error(`OpenAI request failed (${response.status}): ${detail.slice(0, 200)}`)
  }

  const payload = await response.json()
  const raw = payload.choices?.[0]?.message?.content
  if (!raw) throw new Error('OpenAI returned no content')

  const parsed = JSON.parse(raw)
  const ratings = Array.isArray(parsed.ratings) ? parsed.ratings : []

  const allowed = new Set(heuristics.map((h) => h.id))
  const cleaned = ratings
    .filter((r) => r && allowed.has(r.heuristicId) && SEVERITIES.includes(r.severity))
    .map((r) => ({
      heuristicId: r.heuristicId,
      severity: r.severity,
      note: typeof r.note === 'string' ? r.note.trim().slice(0, 400) : '',
    }))

  // Fill any heuristic the model missed with a mock rating so the audit
  // is always fully populated.
  const covered = new Set(cleaned.map((r) => r.heuristicId))
  const missing = heuristics.filter((h) => !covered.has(h.id))
  if (missing.length > 0) {
    cleaned.push(...generateMockRatings({ ...input, heuristics: missing }))
  }
  return cleaned
}
