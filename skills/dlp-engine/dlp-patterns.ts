/**
 * DLP Pattern Library — Reference Implementation
 *
 * Tier 1 of the scoring engine: high-confidence regex detection of known
 * sensitive formats. These are the ten default patterns documented in
 * SKILL.md, all of them public, well-known formats.
 *
 * Pure functions, zero dependencies. Consumed by dlp-engine.ts.
 *
 * Part of the Sentinel Stack open-source toolkit.
 * See SKILL.md for documentation.
 */

// ─── Types ───────────────────────────────────────────────────────────────────

export interface PatternDefinition {
  /** stable identifier, surfaced in detections and redaction markers */
  id: string
  /** human label for reports */
  label: string
  /** grouping used by reporters: pii | secrets | infrastructure */
  category: string
  severity: 'critical' | 'high' | 'medium' | 'low'
  /** what the engine should do when this pattern hits */
  action: 'redact' | 'alert' | 'log'
  /** must be a global regex — scanForPatterns relies on lastIndex */
  regex: RegExp
  /**
   * Optional second gate for formats that are cheap to match but expensive to
   * get wrong (card numbers). Return false to discard the candidate.
   */
  validate?: (value: string) => boolean
}

export interface PatternMatch {
  pattern_id: string
  category: string
  severity: string
  action: string
  match_count: number
  /** distinct matched values, used for redaction */
  matches: string[]
}

// ─── Validators ──────────────────────────────────────────────────────────────

/** Luhn check — keeps arbitrary 16-digit runs from being reported as cards. */
export function luhn(value: string): boolean {
  const digits = value.replace(/[^\d]/g, '')
  if (digits.length < 13 || digits.length > 19) return false
  let sum = 0
  let double = false
  for (let i = digits.length - 1; i >= 0; i--) {
    let d = digits.charCodeAt(i) - 48
    if (double) {
      d *= 2
      if (d > 9) d -= 9
    }
    sum += d
    double = !double
  }
  return sum % 10 === 0
}

// ─── The ten default patterns (SKILL.md → Tier 1) ────────────────────────────

export const DEFAULT_PATTERNS: PatternDefinition[] = [
  {
    id: 'ssn_us',
    label: 'US Social Security number',
    category: 'pii',
    severity: 'critical',
    action: 'redact',
    // excludes the reserved 000/666/9xx area and 00 group / 0000 serial
    regex: /\b(?!000|666|9\d\d)\d{3}-(?!00)\d{2}-(?!0000)\d{4}\b/g,
  },
  {
    id: 'credit_card',
    label: 'Credit card number',
    category: 'pii',
    severity: 'critical',
    action: 'redact',
    regex: /\b(?:\d[ -]?){12,18}\d\b/g,
    validate: luhn,
  },
  {
    id: 'private_key',
    label: 'Private key block',
    category: 'secrets',
    severity: 'critical',
    action: 'redact',
    regex: /-----BEGIN (?:RSA |OPENSSH |EC |DSA |PGP )?PRIVATE KEY-----/g,
  },
  {
    id: 'aws_access_key',
    label: 'AWS access key ID',
    category: 'secrets',
    severity: 'critical',
    action: 'redact',
    regex: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/g,
  },
  {
    id: 'jwt',
    label: 'JSON Web Token',
    category: 'secrets',
    severity: 'high',
    action: 'redact',
    regex: /\beyJ[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\.[A-Za-z0-9_-]{8,}\b/g,
  },
  {
    id: 'api_key',
    label: 'API key or token assignment',
    category: 'secrets',
    severity: 'high',
    action: 'redact',
    regex:
      /\b(?:api[_-]?key|apikey|access[_-]?token|auth[_-]?token|secret[_-]?key)\b\s*[:=]\s*["']?([A-Za-z0-9_\-]{16,})["']?/gi,
  },
  {
    id: 'db_connection_string',
    label: 'Database connection string',
    category: 'secrets',
    severity: 'high',
    action: 'redact',
    regex: /\b(?:postgres(?:ql)?|mysql|mongodb(?:\+srv)?|redis|amqp|mssql):\/\/[^\s"'<>]+/gi,
  },
  {
    id: 'internal_ip',
    label: 'Internal IP address',
    category: 'infrastructure',
    severity: 'medium',
    action: 'alert',
    regex:
      /\b(?:10\.\d{1,3}\.\d{1,3}\.\d{1,3}|192\.168\.\d{1,3}\.\d{1,3}|172\.(?:1[6-9]|2\d|3[01])\.\d{1,3}\.\d{1,3})\b/g,
  },
  {
    id: 'email',
    label: 'Email address',
    category: 'pii',
    severity: 'low',
    action: 'log',
    regex: /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}\b/g,
  },
  {
    id: 'phone',
    label: 'Phone number',
    category: 'pii',
    severity: 'low',
    action: 'log',
    regex: /(?:\+?1[ .-]?)?\(?\b\d{3}\)?[ .-]\d{3}[ .-]\d{4}\b/g,
  },
]

// ─── Scanning ────────────────────────────────────────────────────────────────

/**
 * Run a pattern set over content. Returns one PatternMatch per pattern that
 * hit at least once, with the distinct matched values attached so the caller
 * can redact them.
 */
export function scanForPatterns(content: string, patterns: PatternDefinition[]): PatternMatch[] {
  const results: PatternMatch[] = []
  if (!content) return results

  for (const pattern of patterns) {
    const flags = pattern.regex.flags.includes('g') ? pattern.regex.flags : pattern.regex.flags + 'g'
    const re = new RegExp(pattern.regex.source, flags)
    const seen = new Set<string>()

    let m: RegExpExecArray | null
    while ((m = re.exec(content)) !== null) {
      // capture group 1 when present (e.g. the key, not the whole assignment)
      const value = (m[1] ?? m[0]).trim()
      if (value && (!pattern.validate || pattern.validate(value))) seen.add(value)
      if (m.index === re.lastIndex) re.lastIndex++
    }

    if (seen.size > 0) {
      results.push({
        pattern_id: pattern.id,
        category: pattern.category,
        severity: pattern.severity,
        action: pattern.action,
        match_count: seen.size,
        matches: [...seen],
      })
    }
  }

  return results
}

// ─── Redaction ───────────────────────────────────────────────────────────────

/**
 * Replace every value from redact-action matches with a marker naming the
 * pattern that caught it. Returns the cleaned text and the pattern ids redacted.
 */
export function redactMatches(
  content: string,
  matches: PatternMatch[]
): { cleaned: string; redacted: string[] } {
  let cleaned = content
  const redacted: string[] = []

  for (const match of matches) {
    if (match.action !== 'redact') continue
    let hit = false
    // longest first, so a short value nested in a longer one cannot corrupt it
    for (const value of [...match.matches].sort((a, b) => b.length - a.length)) {
      if (!cleaned.includes(value)) continue
      cleaned = cleaned.split(value).join(`[REDACTED:${match.pattern_id}]`)
      hit = true
    }
    if (hit) redacted.push(match.pattern_id)
  }

  return { cleaned, redacted }
}
