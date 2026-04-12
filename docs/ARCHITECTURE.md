# Sentinel Stack Architecture

## System Overview

Sentinel Stack is a layered governance architecture that operates at multiple levels:

```
USER REQUEST
    ↓
[ENTRY POINT]
  - ChatGPT, Claude, Gemini, IDE, Copilot
    ↓
[ALWAYS-ON GUARDRAILS]
  - Policy enforcement
  - Data classification
  - 4-eyes review gates
    ↓
[INTELLIGENCE LAYER]
  - DLP scoring
  - AI risk assessment
  - Compliance mapping
    ↓
[AUTOMATION LAYER]
  - Risk register updates
  - Compliance evidence generation
  - Audit trail logging
    ↓
[DECISION SUPPORT]
  - Policy drafting
  - Vendor assessment
  - Decision auditing
    ↓
OUTPUT (with compliance signals)
```

## Skill Layers

### Layer 1: Always-On (Foundational)

These skills are **always active** and automatically triggered:

- **guardrails** — Data governance policy enforcement
- **dlp-engine** — Sensitivity scoring and pattern detection

**Triggering logic:**
- Guardrails: Automatically scans all requests involving sensitive data
- DLP-engine: Scores all content for sensitivity

**Example flow:**
```
User: "Help me analyze this client data"
↓ Guardrails scans automatically
→ Detects "client data" keyword
→ Asks: "Is this real or anonymized?"
↓ User confirms anonymized
→ Proceed with guardrail checks
↓ DLP engine scores content (35/100)
→ Score < alert threshold
→ Allow request, log event
```

### Layer 2: AI Governance (Risk-Based)

These skills activate based on risk assessment:

- **ai-governance** — EU AI Act risk classification
- **vendor-ai-risk** — Third-party tool assessment

**Triggering logic:**
- Activates when: Evaluating new AI system, vendor tool, or high-risk use case
- Determines: Risk tier (Unacceptable/High/Limited/Minimal)
- Outputs: Compliance requirements, human oversight needs

**Example flow:**
```
Vendor request: "Can we use new vendor tool X for hiring decisions?"
↓ AI governance skill triggered
→ Assesses: Employment decisions + vendor tool
→ Risk tier: HIGH (employment decisions)
→ Governance requirement: Dual human review, bias testing, documentation
→ Outputs: Assessment report + approval checklist
```

### Layer 3: Compliance Automation (Signal-Based)

These skills respond to compliance signals:

- **risk-register** — Auto-creates risks from hard-blocks
- **compliance-evidence** — Maps decisions to framework controls
- **audit-trail** — Logs all governance events

**Triggering logic:**
- Activated by: Compliance signals from guardrails, DLP, risk events
- Each signal includes: Control mappings, severity, evidence type
- Outputs: Structured logs, evidence artifacts, risk entries

**Example flow:**
```
Guardrail: Hard-block on client data
  ↓ Emits compliance signal:
    {
      timestamp: "2026-04-13T14:30:00Z",
      type: "hard_block",
      policy: "policy_1_client_data",
      frameworks: [
        {control: "SOC2-CC6.1", evidence_type: "control_effectiveness"},
        {control: "GDPR-Art32", evidence_type: "monitoring"}
      ]
    }
  ↓
  Risk-register: Creates RISK-2026-001
  Compliance-evidence: Maps to SOC2-CC6.1, GDPR-Art32
  Audit-trail: Logs governance event
```

### Layer 4: Decision Support (On-Demand)

These skills support human decision-making:

- **policy-drafter** — Generate governance policies
- **decision-audit** — QA governance decisions
- **first-principles** — Reason through novel questions

**Triggering logic:**
- Activated by: Explicit user request
- Use cases: Policy creation, decision review, novel governance questions

**Example flow:**
```
User: "Create an Acceptable Use Policy for our company"
↓ Policy-drafter skill
→ Reads org-config.yaml (company name, frameworks, risk appetite)
→ Generates policy with:
  - Company-specific roles and approvers
  - Compliance framework references
  - DLP thresholds
  - Data handling requirements
→ Outputs: Markdown + DOCX ready for approval
```

---

## Control Flow

### Request Evaluation Flow

```
[1] USER REQUEST ARRIVES
    ↓
[2] GUARDRAIL ASSESSMENT
    ├─ Step 0: File scan (if files attached)
    ├─ Step 1: Hard-block check (client data, PII, financial records)
    │   ├─ HARD BLOCK detected → reject request (no proceeding)
    │   └─ No hard block → continue
    ├─ Step 2: Soft-flag check (ambiguous data)
    │   ├─ Soft flag detected → ask clarification, wait for response
    │   └─ Clean → continue
    ├─ Step 3: 4-eyes gate check (finance, legal, HR, production)
    │   ├─ Gate required → append review gate to output
    │   └─ No gate → continue
    └─ Decision made: Hard Block | Soft Flag | Proceed | Proceed + Gate
    ↓
[3] DLP SCORING (if proceeding)
    ├─ Tier 1: Pattern scanning (SSN, credit cards, API keys)
    ├─ Tier 2: Industry classifiers (fund names, portfolio data)
    ├─ Tier 3: Behavioral baselines (unusual request size/timing)
    └─ Final score (0-100) + action (allow/log/alert/redact/block)
    ↓
[4] EMIT COMPLIANCE SIGNAL
    ├─ Type: hard_block | soft_block | clean_pass | four_eyes_gate
    ├─ Frameworks: [SOC2, ISO27001, GDPR, etc.]
    ├─ Severity: critical | high | medium | low
    └─ Timestamp + metadata
    ↓
[5] AUTOMATION TRIGGERED
    ├─ Risk-register: Create/update risk if hard-block
    ├─ Compliance-evidence: Log control effectiveness
    └─ Audit-trail: Record governance event
    ↓
[6] PRODUCE OUTPUT
    ├─ User-facing: Response or explanation of block
    ├─ Audit-facing: Governance signals, logs, evidence
    └─ Escalation: If critical risk or policy violation
```

---

## Configuration Layer

The configuration drives all skill behavior:

```
org-config.yaml
├─ Company Identity
│  └─ Name, industry, jurisdiction
├─ DLP Configuration
│  ├─ Industry pack selection
│  ├─ Thresholds (alert, block)
│  └─ Custom patterns
├─ Guardrails Configuration
│  ├─ Policies enabled
│  ├─ Approvers by domain
│  └─ Escalation contacts
├─ AI Governance
│  ├─ Risk appetite
│  ├─ Prohibited uses
│  └─ Oversight requirements
├─ Compliance Frameworks
│  ├─ Applicable frameworks (SOC2, ISO, GDPR)
│  ├─ Retention policies
│  └─ Reporting requirements
├─ Vendor Management
│  ├─ Approved vendors
│  └─ Assessment requirements
└─ Roles & Permissions
   └─ Authority mapping
```

**Usage:**
- Guardrails reads: DLP thresholds, policy configuration, approver contacts
- AI-governance reads: Risk appetite, prohibited uses, oversight levels
- Policy-drafter reads: Company name, frameworks, roles, risk appetite
- All skills read: Industry pack, retention requirements, escalation contacts

---

## Compliance Signal Architecture

Every decision emits a structured signal:

```yaml
compliance_signal:
  timestamp: "2026-04-13T14:30:00Z"
  type: "hard_block | soft_block | clean_pass | four_eyes_gate"
  
  # What triggered the signal
  trigger:
    source: "guardrails | dlp | risk | audit"
    policy_triggered: "policy_1_client_data | policy_2_privacy | ..."
    severity: "critical | high | medium | low"
  
  # Framework controls this maps to
  frameworks:
    - control: "SOC2-CC6.1"         # Control ID
      control_name: "Logical access controls"
      evidence_type: "control_effectiveness | monitoring | incident"
    - control: "ISO27001-A.8.2"
      evidence_type: "control_effectiveness"
    - control: "GDPR-Art32"
      evidence_type: "monitoring"
  
  # Downstream skill actions
  downstream_actions:
    risk_register: "create | update | escalate"
    compliance_evidence: "map | collect"
    audit_trail: "log"
```

**Consumer Skills:**
1. **risk-register** — Creates/updates risk entry if hard_block
2. **compliance-evidence** — Collects evidence for framework controls
3. **audit-trail** — Logs structured event with all context
4. **decision-audit** — Uses signal to validate decision quality

---

## Integration Points

| Integration | Purpose | Format | Frequency |
|-------------|---------|--------|-----------|
| **SIEM** (Splunk, ELK) | Real-time monitoring | JSON-lines | Continuous |
| **Incident Tracking** (Jira, Linear) | Bug/risk tracking | API calls | On-demand |
| **Email/Slack** | Escalation alerts | Plain text | On-demand |
| **Spreadsheet/Database** | Reporting, analytics | CSV, JSON | Daily/Weekly |
| **Audit Systems** | Compliance evidence | PDF, DOCX | Quarterly |

---

## Extending the Stack

### Adding a New Skill

1. Create `skills/[skill-name]/SKILL.md` with:
   - Name and description (YAML frontmatter)
   - Workflow instructions
   - Output formats
   - Integration points

2. Define how it triggers:
   - Always-on: Auto-scans all requests
   - Passive: Responds to signals
   - On-demand: User explicitly requests

3. Define inputs/outputs:
   - What config does it read?
   - What signals does it emit?
   - What logs does it produce?

4. Add to `docs/SKILL-HIERARCHY.md` showing dependencies

### Adding a New Data Type

1. Add to `data_classification.md` with examples
2. Add DLP patterns to `config/org-config.yaml`
3. Update guardrail hard-block signals
4. Document in policy-drafter templates

### Adding a New Framework

1. Add to compliance frameworks in `org-config.yaml`
2. Create control mapping list (control ID → evidence type)
3. Update compliance-evidence skill documentation
4. Add to audit checklist in decision-audit

---

## Performance and Scaling

### Guardrails Performance

- Scan: ~50ms for prompt text
- File scan: Depends on file size (streaming)
- Typical latency: 100-200ms total

### DLP Performance

- Pattern scanning: ~200ms for typical prompt
- Industry classification: ~100ms
- Behavioral analysis: Instant (loaded from memory)
- Typical latency: 300-400ms total

### Compliance Automation

- Risk register entry: ~50ms
- Compliance evidence collection: ~100ms
- Audit trail logging: ~10ms
- Typical latency: 100-200ms total

**Total request latency (end-to-end):** ~500-800ms

### Scaling

- Single instance: ~100 requests/minute
- Multi-instance: Add instances horizontally
- Database: Use time-series DB for audit trail (Influx, Prometheus)
- SIEM: Stream logs to external aggregation system

---

## Security and Trust

### No Secrets in Config

- Config file contains no credentials, API keys, or secrets
- All secrets loaded from environment variables or secure vaults
- Config is version-controllable, audit-traceable

### No Data Retention

- Guardrails and DLP process content but don't store it
- Only metadata is logged (what was blocked, why)
- Audit trail stores decision but not actual data
- Comply with GDPR right to deletion

### Audit Trail Immutability

- Logs are append-only
- Timestamps are immutable
- Events can't be deleted (only archived)
- Provides forensic trail for investigations

---

## Governance Assurance

**Controls that ensure governance works:**

1. **Configuration Governance**
   - org-config.yaml version controlled
   - Changes require approval
   - Audit trail of all config changes

2. **Decision Audit**
   - Quarterly review of governance decisions
   - Consistency checks (similar cases treated similarly)
   - Authority validation (right person deciding)

3. **Compliance Evidence**
   - Auto-collection from signals
   - Framework mapping validated
   - Audit-ready packaging

4. **Risk Management**
   - Compliance gaps tracked in risk register
   - Remediation tracked and monitored
   - Regular escalation of unresolved risks

5. **Training and Awareness**
   - All staff trained on policies
   - New hires complete onboarding
   - Training tracked in audit trail
