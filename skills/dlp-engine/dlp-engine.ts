/**
 * DLP Scoring Engine — Reference Implementation
 * Combines Tier 1 (pattern scanning), Tier 2 (industry classifiers),
 * and Tier 3 (behavioral baselines) into a unified sensitivity score.
 * Pure functions — no DB calls.
 *
 * Part of the Sentinel Stack open-source toolkit.
 * See SKILL.md for documentation.
 */

import { scanForPatterns, redactMatches, type PatternDefinition, type PatternMatch } from './dlp-patterns'

// ─── Types ───────────────────────────────────────────────────────────────────

export interface Detection {
  type: 'pattern' | 'industry' | 'behavioral'
  pattern_id?: string
  pack_slug?: string
  classifier_id?: string
  severity: string
  confidence?: number
  match_count?: number
  signal?: string
  details?: Record<string, unknown>
}

export interface DlpScanResult {
  sensitivity_score: number
  detections: Detection[]
  action: 'allow' | 'log' | 'alert' | 'redact' | 'block'
  cleaned_content?: string
  redacted_patterns?: string[]
}

export interface UserBaseline {
  avg_daily_requests: number
  avg_prompt_size_bytes: number
  avg_sensitivity_score: number
  typical_ai_providers: string[]
  typical_content_types: string[]
  typical_hours: number[]
  file_upload_frequency: number
  max_observed_size_bytes: number
  sample_count: number
  baseline_ready: boolean
}

interface EventMeta {
  content_size_bytes: number
  has_file_upload: boolean
  hour_of_day: number
  ai_provider: string
}

// ─── Severity → Score Mapping ────────────────────────────────────────────────

const SEVERITY_SCORE: Record<string, number> = {
  critical: 95,
  high: 75,
  medium: 50,
  low: 25,
}

// ─── Score Individual Detections ─────────────────────────────────────────────

function scorePatternMatches(matches: PatternMatch[]): { detections: Detection[]; maxScore: number } {
  const detections: Detection[] = []
  let maxScore = 0

  for (const m of matches) {
    const score = SEVERITY_SCORE[m.severity] || 30
    if (score > maxScore) maxScore = score
    detections.push({
      type: 'pattern',
      pattern_id: m.pattern_id,
      severity: m.severity,
      match_count: m.match_count,
      details: { category: m.category, action: m.action },
    })
  }

  return { detections, maxScore }
}

function scoreIndustryMatches(matches: PatternMatch[], packSlug: string): { detections: Detection[]; maxScore: number } {
  const detections: Detection[] = []
  let maxScore = 0

  for (const m of matches) {
    const score = SEVERITY_SCORE[m.severity] || 40
    const adjustedScore = Math.min(80, score) // Industry classifiers cap at 80
    if (adjustedScore > maxScore) maxScore = adjustedScore
    detections.push({
      type: 'industry',
      classifier_id: m.pattern_id,
      pack_slug: packSlug,
      severity: m.severity,
      confidence: m.match_count / 10, // rough confidence from keyword count
      match_count: m.match_count,
    })
  }

  return { detections, maxScore }
}

function scoreBehavioral(
  baseline: UserBaseline | null,
  meta: EventMeta
): { detections: Detection[]; maxScore: number } {
  if (!baseline || !baseline.baseline_ready) return { detections: [], maxScore: 0 }

  const detections: Detection[] = []
  let maxScore = 0

  // Size anomaly
  if (baseline.avg_prompt_size_bytes > 0 && meta.content_size_bytes > baseline.avg_prompt_size_bytes * 5) {
    const factor = meta.content_size_bytes / baseline.avg_prompt_size_bytes
    const score = Math.min(70, 30 + factor * 5)
    if (score > maxScore) maxScore = score
    detections.push({
      type: 'behavioral',
      signal: 'size_anomaly',
      severity: factor >= 10 ? 'high' : 'medium',
      details: { expected: baseline.avg_prompt_size_bytes, actual: meta.content_size_bytes, deviation_factor: factor },
    })
  }

  // Off-hours
  if (baseline.typical_hours.length > 0 && !baseline.typical_hours.includes(meta.hour_of_day)) {
    const score = 35
    if (score > maxScore) maxScore = score
    detections.push({
      type: 'behavioral',
      signal: 'off_hours',
      severity: 'low',
      details: { expected: baseline.typical_hours, actual: meta.hour_of_day },
    })
  }

  // New provider
  if (baseline.typical_ai_providers.length > 0 && !baseline.typical_ai_providers.includes(meta.ai_provider)) {
    const score = 40
    if (score > maxScore) maxScore = score
    detections.push({
      type: 'behavioral',
      signal: 'new_provider',
      severity: 'medium',
      details: { expected: baseline.typical_ai_providers, actual: meta.ai_provider },
    })
  }

  return { detections, maxScore }
}

// ─── Public API ──────────────────────────────────────────────────────────────

export function scoreSensitivity(
  content: string,
  patternDefs: PatternDefinition[],
  industryPatterns: PatternDefinition[] | null,
  baseline: UserBaseline | null,
  eventMeta: EventMeta,
  industryPackSlug?: string
): DlpScanResult {
  // Tier 1: Pattern scanning
  const patternMatches = scanForPatterns(content, patternDefs)
  const t1 = scorePatternMatches(patternMatches)

  // Tier 2: Industry classifiers
  let t2 = { detections: [] as Detection[], maxScore: 0 }
  if (industryPatterns && industryPatterns.length > 0) {
    const industryMatches = scanForPatterns(content, industryPatterns)
    t2 = scoreIndustryMatches(industryMatches, industryPackSlug || 'unknown')
  }

  // Tier 3: Behavioral
  const t3 = scoreBehavioral(baseline, eventMeta)

  // Combine: highest score wins + multi-tier bonus
  const tierScores = [t1.maxScore, t2.maxScore, t3.maxScore].filter(s => s > 0)
  const baseScore = Math.max(...tierScores, 0)
  const multiTierBonus = Math.min(20, Math.max(0, (tierScores.length - 1) * 10))
  const finalScore = Math.min(100, baseScore + multiTierBonus)

  const allDetections = [...t1.detections, ...t2.detections, ...t3.detections]

  // Determine action
  const hasRedactable = patternMatches.some(m => m.action === 'redact')
  const action = determineAction(finalScore, hasRedactable, {
    alert_threshold: 40,
    block_threshold: 85,
    redact_secrets: true,
  })

  let cleaned_content: string | undefined
  let redacted_patterns: string[] | undefined

  if (action === 'redact' && hasRedactable) {
    const result = redactMatches(content, patternMatches)
    cleaned_content = result.cleaned
    redacted_patterns = result.redacted
  }

  return {
    sensitivity_score: finalScore,
    detections: allDetections,
    action,
    cleaned_content,
    redacted_patterns,
  }
}

export function determineAction(
  score: number,
  hasRedactableMatches: boolean,
  orgConfig: { alert_threshold: number; block_threshold: number; redact_secrets: boolean }
): 'allow' | 'log' | 'alert' | 'redact' | 'block' {
  if (score >= orgConfig.block_threshold) return 'block'
  if (hasRedactableMatches && orgConfig.redact_secrets) return 'redact'
  if (score >= orgConfig.alert_threshold) return 'alert'
  if (score > 0) return 'log'
  return 'allow'
}
