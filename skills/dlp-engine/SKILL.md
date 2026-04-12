---
name: dlp-engine
description: 3-tier DLP (Data Loss Prevention) scoring engine that combines pattern scanning, industry classifiers, and behavioral baselines into a unified sensitivity score. Use this skill when you need to classify content sensitivity, determine whether to allow/log/alert/redact/block a request, or when building data protection workflows. Trigger on any mention of DLP, data classification, content scanning, sensitivity scoring, or data loss prevention.
---

# DLP Scoring Engine

A 3-tier scoring engine that produces a unified sensitivity score (0-100) and determines the appropriate action for any content passing through the system.

## Architecture

```
Content → Tier 1: Pattern Scanning
       → Tier 2: Industry Classifiers
       → Tier 3: Behavioral Baselines
       → Combined Score → Action Decision
```

### Tier 1: Pattern Scanning

Detects known sensitive patterns via regex matching. These are the highest-confidence detections.

**Default patterns (always active):**

| Pattern | Category | Severity | Action |
|---------|----------|----------|--------|
| SSN (XXX-XX-XXXX) | PII | critical | redact |
| Credit card numbers | PII | critical | redact |
| API keys / tokens | secrets | high | redact |
| Private keys (RSA, SSH) | secrets | critical | redact |
| Email addresses | PII | low | log |
| Phone numbers | PII | low | log |
| IP addresses (internal ranges) | infrastructure | medium | alert |
| Database connection strings | secrets | high | redact |
| AWS access keys | secrets | critical | redact |
| JWT tokens | secrets | high | redact |

**Custom patterns:** Define additional patterns in `config/org-config.yaml` under `dlp.custom_patterns`.

### Tier 2: Industry Classifiers

Industry-specific pattern packs that detect domain-relevant sensitive content. Set `dlp.industry_pack` in config.

**Available packs:**

| Pack | Detects |
|------|---------|
| `default` | General business data patterns |
| `private-markets` | Fund names, LP/GP identifiers, NAV/IRR/MOIC figures, portfolio company data, ISIN/LEI/CIK codes |
| `healthcare` | PHI, diagnosis codes, patient identifiers, prescription data, insurance IDs |
| `fintech` | Account numbers, routing numbers, transaction IDs, KYC data, AML flags |
| `legal` | Case numbers, privilege markers, settlement figures, witness identifiers |
| `saas` | Customer tenant data, usage metrics tied to accounts, billing details |

Industry classifiers cap at severity score 80 (they are keyword-based and less precise than Tier 1 pattern matches).

### Tier 3: Behavioral Baselines

Compares current request metadata against established user baselines to detect anomalous behavior.

**Signals monitored:**

| Signal | What it detects | Severity |
|--------|----------------|----------|
| Size anomaly | Request 5x+ larger than user's average | medium-high |
| Off-hours activity | Request outside user's typical working hours | low |
| New AI provider | Request routed to a provider the user hasn't used before | medium |
| Unusual content type | File type or data category the user doesn't typically work with | medium |

Behavioral scoring requires a baseline of at least 20 samples before activating. Until then, this tier is skipped.

## Score Calculation

```
Base Score = max(Tier1 score, Tier2 score, Tier3 score)
Multi-Tier Bonus = min(20, (number of tiers with detections - 1) * 10)
Final Score = min(100, Base Score + Multi-Tier Bonus)
```

The multi-tier bonus reflects that detections across multiple tiers are more concerning than a single-tier detection.

**Severity → Score mapping:**

| Severity | Score |
|----------|-------|
| critical | 95 |
| high | 75 |
| medium | 50 |
| low | 25 |

## Action Determination

Configure thresholds in `config/org-config.yaml`:

```yaml
dlp:
  alert_threshold: 40    # Score >= this → alert
  block_threshold: 85    # Score >= this → block
  redact_secrets: true   # If true, redactable patterns get redacted instead of blocked
```

**Action logic (evaluated in order):**

1. Score >= `block_threshold` → **block** (reject the request entirely)
2. Has redactable pattern matches AND `redact_secrets` is true → **redact** (clean content and proceed)
3. Score >= `alert_threshold` → **alert** (proceed but flag for review)
4. Score > 0 → **log** (proceed and record the detection)
5. Score = 0 → **allow** (no action needed)

## Integration with Guardrails

The DLP engine provides the scoring backend for the guardrails skill. When the guardrails skill detects potential sensitive data, it can invoke the DLP engine for a quantitative assessment:

1. Guardrails scans prompt and files qualitatively (hard-block signals, soft flags)
2. DLP engine scores content quantitatively (0-100 sensitivity score)
3. Combined decision: guardrails policy + DLP score = final action

## TypeScript Reference Implementation

The `dlp-engine.ts` file in this directory provides a pure-function TypeScript implementation of the scoring engine. It exports:

- `scoreSensitivity()` — Main entry point. Takes content, pattern definitions, industry patterns, user baseline, and event metadata. Returns a `DlpScanResult` with score, detections, action, and optional cleaned content.
- `determineAction()` — Score-to-action mapping with configurable thresholds.

Key types:
- `Detection` — A single finding (pattern, industry, or behavioral) with severity and details
- `DlpScanResult` — Complete scan result with score, detections, action, and optional redacted content
- `UserBaseline` — Historical user behavior profile for Tier 3 scoring

The implementation is pure functions with no database calls — baselines and patterns are passed in, making it easy to integrate into any backend.

## Extending the Engine

### Adding custom patterns

Add to `config/org-config.yaml`:

```yaml
dlp:
  custom_patterns:
    - id: "internal_project_code"
      regex: "PRJ-[A-Z]{3}-\\d{4}"
      category: "internal"
      severity: "medium"
      action: "alert"
    - id: "client_account_id"
      regex: "ACC-\\d{8}"
      category: "client_data"
      severity: "high"
      action: "redact"
```

### Creating an industry pack

Create a new file in `config/industry-packs/` with pattern definitions specific to your domain. Reference it in `dlp.industry_pack`.

### Tuning thresholds

Start with defaults (alert: 40, block: 85) and adjust based on your false positive rate:
- Too many alerts → raise `alert_threshold`
- Missing real issues → lower `block_threshold`
- Secrets getting through → ensure `redact_secrets: true`
