/**
 * POST /api/ai-audit
 *
 * Body: {
 *   productName: string,
 *   platform: 'ios'|'android'|'web'|'desktop',
 *   description?: string,
 *   url?: string,
 *   heuristics: Array<{ id, name, summary?, category? }>
 * }
 *
 * Response: { ratings: Array<{ heuristicId, severity, note }>, source: 'openai'|'mock' }
 *
 * Uses OpenAI when `OPENAI_API_KEY` is set on the deployment. Falls back
 * to the deterministic mock generator otherwise so the flow works even
 * without any LLM configured.
 */

import {
  generateMockRatings,
  generateRatingsWithOpenAI,
} from '../src/utils/aiAudit.js'

export const config = { runtime: 'nodejs' }

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ error: 'Method not allowed' })
  }

  let body = req.body
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body)
    } catch {
      return res.status(400).json({ error: 'Invalid JSON body' })
    }
  }

  const {
    productName,
    platform = 'web',
    description = '',
    url = '',
    heuristics,
  } = body || {}

  if (!productName || typeof productName !== 'string') {
    return res.status(400).json({ error: 'productName is required' })
  }
  if (!Array.isArray(heuristics) || heuristics.length === 0) {
    return res.status(400).json({ error: 'heuristics array is required' })
  }

  const apiKey = process.env.OPENAI_API_KEY
  const input = { productName, platform, description, url, heuristics }

  if (apiKey) {
    try {
      const ratings = await generateRatingsWithOpenAI(input, apiKey)
      return res.status(200).json({ ratings, source: 'openai' })
    } catch (error) {
      // Fall through to the mock generator so the client still gets a
      // usable response. Log the error server-side.
      console.error('[ai-audit] OpenAI failed, falling back to mock:', error)
    }
  }

  const ratings = generateMockRatings(input)
  return res.status(200).json({ ratings, source: 'mock' })
}
