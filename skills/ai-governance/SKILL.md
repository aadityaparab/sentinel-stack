# AI Governance

**Aliases:** AI usage policy, EU AI Act, AI risk classification, model governance, responsible AI, AI compliance, acceptable use policy for AI, AI risk assessment

**Maturity:** Production

**Description:**
Classify AI use cases by regulatory risk tier, enforce organizational AI acceptable use policies, determine transparency and human oversight requirements, track data lineage for AI-assisted outputs, and generate compliance artifacts for model governance.

---

## Overview

AI is moving from experimental to mission-critical, but governance hasn't kept pace. This skill embeds AI risk assessment and compliance into your operational workflows — not as a retrospective audit, but as a real-time guard rail.

The skill maps every proposed AI use case against:
1. **EU AI Act risk tiers** (Unacceptable → High → Limited → Minimal)
2. **Your organization's AI acceptable use policy** (from `config/org-config.yaml`)
3. **Transparency & disclosure requirements** for end users/customers
4. **Human oversight obligations** — defining what "meaningful review" actually means
5. **Data lineage tracking** — so downstream consumers know what's AI-generated vs. human-authored

This is not optional compliance theater. If your use case triggers a High or Unacceptable risk classification, the skill surfaces mandatory obligations that must be satisfied before deployment.

---

## Core Capabilities

### 1. AI System Risk Classification

**Input:** Description of a proposed AI use case (e.g., "Using an LLM to generate hiring recommendations based on CV analysis")

**Process:**
- Extract key attributes: data involved, decision autonomy, affected population, reversibility, sector
- Cross-reference against EU AI Act Annex III (high-risk) and Annex II (limited-risk) definitions
- Map to internal risk tier framework (Minimal → Limited → High → Unacceptable)
- Return: risk tier, justification, applicable obligations

**Output Example:**
```
Risk Tier: HIGH
Rationale: AI system used to support hiring decisions. EU AI Act Article 6(2) classifies 
employment decisions as high-risk. Impacts fundamental rights (employment opportunity).
Applicable Obligations:
  - High-quality training data (Article 10)
  - Documented risk assessment (Article 9)
  - Performance monitoring (Article 26)
  - Human oversight by qualified personnel (Article 26(3))
  - Transparent documentation (Article 13)
```

---

### 2. AI Usage Policy Enforcement

**Input:** Proposed AI use case (description + risk tier classification result)

**Process:**
- Load org's AI acceptable use policy from `config/org-config.yaml` → `ai-policies` section
- Check against prohibited uses:
  - Automated hiring decisions without human review
  - Autonomous financial transactions above thresholds
  - Processing of special category data (health, biometric, criminal) without explicit safeguards
  - Real-time remote biometric identification (unless carve-out applies)
  - Subliminal/manipulative uses
  - Social scoring
  - Unauthorized profiling
- Return: policy compliance status, flagged violations, required mitigations

**Configuration Reference:**
```yaml
ai-policies:
  prohibited-uses:
    - hiring-decisions-unreviewed
    - autonomous-financial-transfers
    - special-category-processing
    - real-time-biometric-id
  oversight-thresholds:
    high-risk-review: true
    approval-required-by: ["Chief Risk Officer", "Chief Compliance Officer"]
  disclosure-required: true
  data-retention-limits: "P1Y"  # 1 year post-decision
```

**Output:**
- PASS / BLOCKED / CONDITIONAL (requires mitigations)
- If BLOCKED: which policy was violated, no exceptions possible
- If CONDITIONAL: list mitigations needed to proceed (e.g., "Require 4-eyes review gate for all hiring recommendations")

---

### 3. Transparency & Disclosure Requirements

**Input:** Risk tier + use case description + affected audience (employees, customers, public)

**Process:**
- Determine if users/customers must be informed they're interacting with AI (EU AI Act Article 52)
- Identify when explicit consent is required vs. just disclosure
- Generate templated disclosure language
- Check internal disclosure policy thresholds

**Output:**
Generates disclosure language like:

```
TRANSPARENCY DISCLOSURE (Required)

[Your interaction with] this system uses artificial intelligence to [summarize: function]. 
The AI system processes [data categories] to generate [output type].

A human [job title] has reviewed [frequency] of outputs before [action taken].
To appeal or request human review, contact [support channel].

Data generated from this interaction will be retained for [duration] and used for [purposes].
```

Also produces:
- Timing of disclosure (before interaction, during, after)
- Consent requirement (explicit Y/N)
- Revocation mechanism (how user opts out)
- Mapping to EU AI Act Article 52 (transparency) + GDPR Article 21 (right to object)

---

### 4. Human Oversight Requirements

**For High and Unacceptable risk tiers**, the skill doesn't just say "require human oversight" — it defines what that means operationally.

**Input:** Risk tier + use case + available data + existing guardrails

**Output Example:**

```
MANDATORY HUMAN OVERSIGHT SPECIFICATION

Risk Tier: HIGH
Use Case: AI-assisted hiring recommendation system

REVIEW TRIGGER: Every candidate recommendation for roles above Director level
REVIEWER QUALIFICATION: Hiring Manager + Talent Acquisition Lead (segregation required)
REVIEW SCOPE (Minimum):
  - Verify AI reasoning aligns with legal criteria (EEOC Article 106)
  - Check for disparate impact signals in recommendation patterns
  - Validate training data quality assumptions
  - Confirm no personal data from external sources was used without consent

DECISION AUTHORITY:
  - Reviewer may override AI recommendation without escalation
  - Reviewer must document override rationale in decision log
  - Overrides >10% of AI recommendations → trigger root cause analysis

DOCUMENTATION REQUIRED:
  - Reviewer name, date, time of review
  - Override decision (if applicable) + justification
  - Feedback to ML team for model retraining signal
  - Audit trail (immutable, tamper-evident log)

AUDIT & EFFECTIVENESS:
  - Monthly sample audit (10% of reviewed decisions)
  - Quarterly effectiveness metrics: false positive rate, override frequency
  - Report to Chief Risk Officer if override rate diverges >5% from baseline
```

---

### 5. Data Lineage Tagging for AI

**Input:** Any content or data artifact (generated, augmented, or influenced by AI)

**Process:**
- Tag outputs with metadata:
  - `AI_GENERATED`: AI created this from scratch
  - `AI_AUGMENTED`: Human + AI collaborative output
  - `AI_INFLUENCED`: AI provided input; human made final decision
  - `HUMAN_ONLY`: No AI involvement
- Capture: which AI model, version, timestamp, training data cutoff
- Link to transparency obligations (downstream consumers must know)

**Output:**
Metadata object for every artifact:
```json
{
  "ai-lineage": {
    "status": "AI_AUGMENTED",
    "models": [
      {
        "name": "claude-opus-4",
        "version": "20250201",
        "timestamp": "2026-04-12T14:32:00Z",
        "training-data-cutoff": "2025-02-01"
      }
    ],
    "human-involvement": {
      "created-by": "user@company.com",
      "reviewed-by": "manager@company.com",
      "review-date": "2026-04-12",
      "override": false
    },
    "disclosure-required": true,
    "retention-until": "2027-04-12"
  }
}
```

Downstream systems use this to:
- Trigger required disclosures automatically
- Enforce retention policies
- Generate audit trails
- Support subject access requests (GDPR Article 15)

---

## Integration with Sentinel Stack

This skill **consumes signals** from the core toolkit:

| Guardrail Signal | AI Governance Response |
|---|---|
| DLP hard block (data classified as sensitive) | Check if high-risk AI use case is attempting to process it → escalate |
| DLP soft block (confidence below threshold) | Tag AI output with lower confidence; require human oversight |
| 4-eyes review gate triggered | Automatically log as "human oversight satisfied" for that decision |
| Behavioral pattern anomaly | Flag as potential prohibited use pattern (e.g., social scoring) |

**References guardrail detections and logs**, not just forward-facing use cases.

---

## How to Invoke

**Trigger Phrases:**
- "Is this AI use case compliant?"
- "Classify this AI system's risk"
- "What's our policy on [use case]?"
- "Generate a disclosure for this AI feature"
- "Define oversight requirements for this model"
- "What data can we feed into this AI system?"
- "Document the human review process for this AI decision"

**Example Prompt:**
```
Skill: ai-governance

We're building an AI system that:
- Analyzes job applicants' written responses to structured questions
- Generates a shortlist of top 10 candidates for HR review
- HR may override the shortlist but 95% of recommendations are implemented

Classify risk tier, flag policy issues, define required human oversight, 
and generate employee transparency disclosure.
```

---

## Configuration Requirements

Expects `config/org-config.yaml` to provide:

```yaml
ai-governance:
  # Applicable regulatory frameworks
  frameworks: ["EU AI Act", "GDPR", "internal-policy"]
  
  # Risk classification scheme (you may extend)
  risk-tiers: ["Unacceptable", "High", "Limited", "Minimal"]
  
  # Who can approve high-risk use cases?
  high-risk-approval-required-by:
    - "Chief Risk Officer"
    - "Chief Compliance Officer"
    - "Legal Counsel"
  
  # Transparency & consent defaults
  transparency:
    disclosure-required-for-tiers: ["High", "Limited"]
    explicit-consent-required: true
    consent-audit-required: true
  
  # Human oversight defaults
  oversight:
    minimum-qualifications: "Domain expert or manager"
    documentation-required: true
    audit-frequency: "quarterly"
    
  # AI acceptable use policy
  ai-policies:
    prohibited-uses:
      - hiring-decisions-unreviewed
      - autonomous-financial-transfers
      - special-category-processing
      - real-time-biometric-id
    approval-required-for: ["High", "Unacceptable"]
    disclosure-required: true
    data-retention-limits: "P1Y"
```

---

## Outputs & Artifacts

- **Risk Classification Report** — suitable for architecture review boards
- **Policy Compliance Memo** — legal sign-off or exceptions
- **Transparency Disclosure Templates** — production-ready for UI/docs
- **Human Oversight Specification** — for process documentation
- **Data Lineage Metadata** — embedded in outputs for audit
- **Risk Register Entries** — auto-populates the risk-register skill

---

## Key Principles

1. **No rubber-stamp oversight.** If human oversight is required, the skill specifies what the human must actually check, not just that a button was clicked.
2. **Data-driven accountability.** Every AI decision is tagged with lineage so auditors can trace back.
3. **Regulatory mapping, not guessing.** Risk tiers map to EU AI Act Articles; obligations are cited.
4. **Org policy enforcement.** Your org's AI acceptable use policy is the source of truth, not generic guidelines.
5. **Operational integration.** Results feed guardrails, risk registers, and compliance evidence pipelines.

---

## See Also

- `ai-governance/references/ai-risk-tiers.md` — Detailed EU AI Act risk tier definitions
- `risk-register` skill — Auto-populates from AI governance decisions
- `compliance-evidence` skill — Generates control evidence for audits
