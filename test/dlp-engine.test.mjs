import { test } from 'node:test'
import assert from 'node:assert/strict'

import { DEFAULT_PATTERNS, scanForPatterns, redactMatches, luhn } from '../dist/dlp-patterns.js'
import { scoreSensitivity, determineAction } from '../dist/dlp-engine.js'

const META = { content_size_bytes: 100, has_file_upload: false, hour_of_day: 10, ai_provider: 'anthropic' }
const score = (content) => scoreSensitivity(content, DEFAULT_PATTERNS, null, null, { ...META, content_size_bytes: content.length })

test('clean content scores zero and is allowed', () => {
  const r = score('Please summarise last quarter revenue trends for the board deck.')
  assert.equal(r.sensitivity_score, 0)
  assert.equal(r.action, 'allow')
  assert.equal(r.detections.length, 0)
})

test('an AWS access key is critical enough to block outright', () => {
  // 95 (critical) clears the 85 block threshold, and block precedes redaction
  const r = score('deploy with AKIAIOSFODNN7EXAMPLE please')
  assert.equal(r.action, 'block')
  assert.equal(r.sensitivity_score, 95)
  assert.equal(r.detections[0].pattern_id, 'aws_access_key')
})

test('a high-severity secret is redacted rather than blocked', () => {
  const jwt = 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NSJ9.dBjftJeZ4CVPmB92K27uhbUJU1p1r_wW1gFWFOEjXk'
  const r = score(`bearer ${jwt}`)
  assert.equal(r.sensitivity_score, 75)
  assert.equal(r.action, 'redact')
  assert.ok(r.redacted_patterns.includes('jwt'))
  assert.ok(!r.cleaned_content.includes(jwt))
  assert.ok(r.cleaned_content.includes('[REDACTED:jwt]'))
})

test('an email alone is low severity and only logged', () => {
  const r = score('forward it to alex@example.com')
  assert.equal(r.action, 'log')
  assert.equal(r.sensitivity_score, 25)
  assert.equal(r.detections[0].pattern_id, 'email')
})

test('luhn rejects a non-card 16-digit run and accepts a real test number', () => {
  assert.equal(luhn('1234567812345678'), false)
  assert.equal(luhn('4242 4242 4242 4242'), true)
})

test('credit card numbers are validated, not just matched', () => {
  assert.equal(scanForPatterns('order ref 1234567812345678', DEFAULT_PATTERNS).some(m => m.pattern_id === 'credit_card'), false)
  assert.equal(scanForPatterns('card 4242 4242 4242 4242', DEFAULT_PATTERNS).some(m => m.pattern_id === 'credit_card'), true)
})

test('every documented pattern fires on a representative sample', () => {
  const samples = {
    ssn_us: 'ssn 123-45-6789',
    credit_card: 'card 4242 4242 4242 4242',
    private_key: '-----BEGIN RSA PRIVATE KEY-----',
    aws_access_key: 'AKIAIOSFODNN7EXAMPLE',
    jwt: 'eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIxMjM0NSJ9.dBjftJeZ4CVPmB92K27uhbUJU1p1r_wW1gFWFOEjXk',
    api_key: 'api_key = "abcd1234abcd1234abcd"',
    db_connection_string: 'postgres://user:pw@db.internal:5432/app',
    internal_ip: 'host 10.0.4.17',
    email: 'alex@example.com',
    phone: 'call 415-555-0132',
  }
  for (const [id, sample] of Object.entries(samples)) {
    const hit = scanForPatterns(sample, DEFAULT_PATTERNS).some(m => m.pattern_id === id)
    assert.ok(hit, `pattern ${id} did not fire on its own sample`)
  }
})

test('multiple tiers add the documented bonus', () => {
  // one industry-style keyword pack alongside a Tier 1 hit
  const pack = [{ id: 'fund_perf', label: 'Fund performance', category: 'finance', severity: 'high', action: 'alert', regex: /\b(IRR|TVPI|DPI)\b/g }]
  const r = scoreSensitivity('IRR 18.2% for AKIAIOSFODNN7EXAMPLE', DEFAULT_PATTERNS, pack, null, META, 'finance')
  // base 95 (critical) + 10 for the second tier, capped at 100
  assert.equal(r.sensitivity_score, 100)
  assert.equal(r.action, 'block')
})

test('determineAction honours the configured thresholds', () => {
  const cfg = { alert_threshold: 40, block_threshold: 85, redact_secrets: true }
  assert.equal(determineAction(90, false, cfg), 'block')
  assert.equal(determineAction(50, true, cfg), 'redact')
  assert.equal(determineAction(50, false, cfg), 'alert')
  assert.equal(determineAction(10, false, cfg), 'log')
  assert.equal(determineAction(0, false, cfg), 'allow')
})

test('redaction leaves non-redact matches intact', () => {
  const content = 'mail alex@example.com key AKIAIOSFODNN7EXAMPLE'
  const { cleaned, redacted } = redactMatches(content, scanForPatterns(content, DEFAULT_PATTERNS))
  assert.ok(cleaned.includes('alex@example.com'), 'email is log-only, must not be redacted')
  assert.ok(!cleaned.includes('AKIAIOSFODNN7EXAMPLE'))
  assert.deepEqual(redacted, ['aws_access_key'])
})
