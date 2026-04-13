---
name: risk-register
description: Living risk register manager. Auto-populates and maintains a risk register from guardrail detections (DLP, 4-eyes, behavioral anomalies). Scores risks on a 5x5 likelihood-impact matrix, tracks treatment plans (accept/mitigate/transfer/avoid), generates leadership risk reports, and assesses drift against organizational risk appetite. Use for risk assessments, risk matrix updates, or governance reporting.
---

# Risk Register

**Aliases:** risk register, risk log, track risks, risk assessment, risk matrix, risk appetite, risk treatment

**Maturity:** Production

**Description:**
Auto-populate and maintain a living risk register from guardrail detections (DLP, 4-eyes, behavioral anomalies). Score risks on 5×5 likelihood-impact matrix. Track treatment plans (accept/mitigate/transfer/avoid). Generate risk reports for leadership and assess drift against organizational risk appetite.

---

## Overview

Every guardrail detection in Sentinel Stack is a risk signal. This skill turns those signals into a living, leadership-ready risk register — not a static spreadsheet reviewed quarterly, but a real-time dashboard that tracks:

- **What** risks are emerging (categorized: Data Privacy, AI Ethics, Regulatory, Operational, Reputational, Financial)
- **Where** they're happening (which systems, departments, use cases)
- **How severe** they are (5×5 likelihood-impact matrix)
- **What we're doing** about them (treatment: accept/mitigate/transfer/avoid + owner + deadline)
- **Are we improving?** (trend analysis: are detections increasing or decreasing over time?)

This is compliance that's actually useful to operations and leadership.

---

## Core Capabilities

### 1. Auto-Population from Guardrail Detections

**Automatic Risk Entry Creation:**

Every guardrail trigger becomes a risk register entry:

| Guardrail Signal | Risk Category | Risk Description |
|---|---|---|
| **DLP Hard Block** (sensitive data classification match) | Data Privacy | Unauthorized access to sensitive data (PII, health records, financial) |
| **DLP Soft Block** (confidence below threshold) | Data Privacy | High-risk data processing with low confidence classification |
| **4-Eyes Review Gate** (approval needed) | Operational | Material decision made with insufficient oversight; segregation of duties gap |
| **Behavioral Anomaly** (pattern deviation) | Operational | Unusual activity pattern detected; potential fraud/abuse signal |
| **AI System High-Risk Classification** | Regulatory / AI Ethics | High-risk AI system deployed; Article 9-15 obligations may not be met |

**Example Auto-Entry:**

```
RISK REGISTER ENTRY [AUTO-GENERATED]
Timestamp: 2026-04-12 14:32 UTC

Guardrail Signal: DLP Hard Block
System: Document Processing Pipeline
Data Type: Health Records (HIPAA Covered Entity)
Risk ID: RISK-2026-1847

Title: Unauthorized Health Data Processing Attempt
Category: Data Privacy
Severity: HIGH (see scoring below)
Status: OPEN

Description:
  DLP detected attempt to process 47 health records (PHI) through 
  unprotected data pipeline. System lacks encryption, access controls,
  audit logging required by HIPAA § 164.312(a).

Root Cause (Preliminary):
  Employee submitted request to analyze patient outcomes; system 
  mis-routed through general-purpose tool instead of compliance-gated 
  analytics platform.

Immediate Actions Taken:
  ✓ Data access blocked (guardrail hard stop)
  ✓ Employee notified of policy violation
  ✓ Data not exported or compromised
  
Assigned To: Chief Information Security Officer
Treatment: MITIGATE
  - Target: Enhanced staff training on data classification
  - Owner: HR + Compliance
  - Deadline: 2026-05-12
```

**Batch Reporting:**
Daily risk entry summary:
```
2026-04-12 Daily Risk Register Summary

DLP Detections: 3 (↑ 50% vs 2-day avg)
  - 2 Hard blocks (data prevented)
  - 1 Soft block (low-confidence processing allowed with monitoring)

4-Eyes Gate Triggers: 1
  - Finance: Purchase order > $500k required executive approval

Behavioral Anomalies: 0

AI Governance Triggers: 0

→ No new Unacceptable or High-Risk items
→ 1 item escalated to Risk Committee (see below)
```

---

### 2. Risk Scoring: 5×5 Likelihood-Impact Matrix

**Inputs:**
- Guardrail detection frequency (How often does this risk type occur?)
- Impact assessment (If realized, what's the damage: regulatory fine, data breach, reputation hit?)
- Organizational context (Is this our first detection of this risk? Or the 100th?)

**Likelihood Scale (1-5):**
```
1 = Rare (< 1 per year)
2 = Unlikely (1-4 per year)
3 = Possible (5-20 per year)
4 = Likely (> 20 per year)
5 = Almost Certain (weekly or daily)
```

**Impact Scale (1-5):**
```
1 = Minimal (inconvenience, < $10k loss)
2 = Minor (operational disruption, $10k-$100k)
3 = Moderate (material loss, $100k-$1M, media mention)
4 = Major (regulatory fine, significant breach, loss of major client)
5 = Catastrophic (existential threat, criminal liability, $1M+)
```

**Risk Score = Likelihood × Impact (1-25 scale)**

| Score | Severity | Action |
|---|---|---|
| 1-4 | Green (Minimal) | Log & monitor; accept if acceptable to risk appetite |
| 5-9 | Yellow (Low) | Mitigate with standard controls; owner assignment required |
| 10-16 | Orange (Medium) | Escalate to Risk Committee; mitigation plan required |
| 17-24 | Red (High) | Executive escalation; crisis-level response; board notification possible |
| 25 | Critical | Immediate halt; emergency response team; board notification mandatory |

**Scoring Example:**

```
RISK: Unauthorized Health Data Processing

Likelihood: 4 (Occurs frequently due to staff training gaps)
  - Detection history: 5 similar DLP hard blocks in past 90 days
  - Root cause: Data classification training not mandatory; staff confused

Impact: 4 (Regulatory + reputational)
  - Regulatory: HIPAA violation fine up to $100k per incident
  - Breach notification: Required by law; public disclosure
  - Client impact: Healthcare provider client may terminate contract
  - Reputational: "Company can't protect health data" headline

Risk Score: 4 × 4 = 16 (Orange / Medium)
  → Escalate to Risk Committee
  → Mitigation plan required before next quarter

Trending:
  - Last 90 days: 5 similar detections (trend: INCREASING)
  - Pattern: Indicates systemic training/process gap, not one-off
  - Alert: Escalate from Orange to Red if 2+ more detections occur
```

---

### 3. Risk Categorization

Six standardized categories (extensible in config):

| Category | Examples | Typical Owners |
|---|---|---|
| **Data Privacy** | Unauthorized data access, classification gaps, retention violations | CISO, Privacy Officer |
| **AI Ethics** | Bias in AI systems, unfair automated decisions, transparency gaps | Chief Risk Officer, AI Ethics Board |
| **Regulatory** | Non-compliance with GDPR, EU AI Act, SOC 2, ISO 27001, industry rules | Compliance Officer, Legal |
| **Operational** | Process breakdowns, segregation of duties gaps, insufficient oversight | COO, Business Unit Lead |
| **Reputational** | Public perception risk, media exposure, trust erosion | Chief Marketing Officer, Communications |
| **Financial** | Revenue loss, unbudgeted fines, cost overruns | CFO, Finance |

**Example Register View:**

```
RISK REGISTER SUMMARY BY CATEGORY

┌─────────────────────────────────────────────────────┐
│ Category          │ Count │ Red │ Orange │ Yellow │ Green │
├─────────────────────────────────────────────────────┤
│ Data Privacy      │   12  │  1  │   4    │   5    │   2   │
│ AI Ethics         │    3  │  0  │   1    │   2    │   0   │
│ Regulatory        │    8  │  0  │   3    │   4    │   1   │
│ Operational       │   15  │  0  │   5    │   7    │   3   │
│ Reputational      │    2  │  0  │   1    │   1    │   0   │
│ Financial         │    5  │  0  │   2    │   2    │   1   │
├─────────────────────────────────────────────────────┤
│ TOTAL             │   45  │  1  │  16    │  21    │   7   │
└─────────────────────────────────────────────────────┘

ACTION REQUIRED:
  1 Critical (Red) item → Board notification pending
  16 Orange items → Risk Committee owns mitigation
  21 Yellow items → Business owners tracking
```

---

### 4. Risk Treatment Planning

For each risk, track the **treatment strategy** (one of four):

**AVOID:** Eliminate the risk entirely; stop the activity.
```
Example: "Stop accepting health data until HIPAA controls are in place"
Owner: Chief Information Security Officer
Deadline: 2026-05-15
Status: In Progress (training 90% complete)
```

**MITIGATE:** Reduce likelihood or impact through controls.
```
Example: "Implement mandatory data classification training for all staff"
Owner: HR + Compliance
Deadline: 2026-05-12
Actions:
  ✓ Training module developed
  ✓ Launch scheduled for 2026-04-20
  - Monitor: 100% staff completion within 2 weeks
  - Metric: Zero DLP soft blocks after training completion
```

**TRANSFER:** Shift risk to external party (insurance, vendor, partner).
```
Example: "Obtain cyber liability insurance covering data breach costs"
Owner: Risk Manager
Deadline: 2026-05-01
Policy Terms: $5M coverage, $100k deductible, GDPR-specific rider
```

**ACCEPT:** Acknowledge risk; live with it (if within risk appetite).
```
Example: "Low-value test data occasionally misclassified; acceptable risk"
Owner: Data Engineering Lead
Rationale: 
  - Likelihood: 2 (rarely occurs)
  - Impact: 1 (test data, low sensitivity)
  - Score: 2 (Green) — within risk appetite
Caveat: "If score increases to Orange, escalate to mitigation"
```

**Treatment Register:**

```
OPEN TREATMENT ITEMS (Due in next 30 days)

Owner                 │ Treatment    │ Risk Item             │ Deadline   │ % Complete
───────────────────────────────────────────────────────────────────────────────────
CISO                  │ MITIGATE     │ Health data access    │ 2026-05-12 │ 75%
Compliance Officer    │ MITIGATE     │ GDPR Article 30 gaps  │ 2026-04-30 │ 40%
Finance               │ TRANSFER     │ Cyber insurance       │ 2026-05-01 │ 100%
Chief Risk Officer    │ AVOID        │ Unacceptable AI use   │ 2026-04-15 │ BLOCKED
───────────────────────────────────────────────────────────────────────────────────
Overdue: 1 (escalate to CFO)
```

---

### 5. Trend Analysis & Risk Appetite Monitoring

**Questions the skill answers:**

- Are we getting *more* or *fewer* detections over time?
- Is a specific risk category trending up? (e.g., AI Ethics risks rising)
- Have we breached our **risk appetite** threshold?
- What % of treatments are on schedule?

**Risk Appetite Definition (from config):**

```yaml
risk-appetite:
  # Maximum acceptable risk scores per category per quarter
  data-privacy: 40        # Sum of all Data Privacy risk scores
  ai-ethics: 20
  regulatory: 50
  operational: 60
  reputational: 15
  financial: 35
  
  # Escalation triggers
  critical-risk-tolerance: 0  # Zero tolerance for Critical (score 25) items
  red-risk-tolerance: 1       # Max 1 Red (score 17-24) item at a time
  
  # Trend alerts
  detection-spike-threshold: 50%  # Alert if detections up 50% vs previous quarter
```

**Trend Report Example:**

```
QUARTERLY RISK TREND ANALYSIS — Q1 2026

Overall Risk Score Trend:
  Q4 2025: 187 (Orange baseline)
  Q1 2026: 195 (↑ 4.3%)
  
Category Trends:
  Data Privacy:    68 → 75 (↑ 10%) [ALERT: Above risk appetite by 35 points]
  AI Ethics:       12 → 18 (↑ 50%) [ALERT: Trend accelerating]
  Regulatory:      45 → 49 (↑ 9%)  [NORMAL]
  Operational:     42 → 31 (↓ 26%) [POSITIVE]
  Reputational:    14 → 14 (→)     [NORMAL]
  Financial:       16 → 8  (↓ 50%) [POSITIVE]

Risk Appetite Status:
  ✗ Data Privacy: EXCEEDED (75/40 budget)
    → Owner: CISO, escalate health data access control project
    
  ✗ AI Ethics: CAUTION (18/20 budget, only 2 points remaining)
    → Owner: Chief Risk Officer, monitor next 30 days
    
  ✓ All others: Within appetite

Detection Spike Analysis:
  DLP detections: 23 (vs 15 avg) — 53% spike
  Root cause: New healthcare client data; staff not trained on domain
  
  4-Eyes triggers: 8 (vs 5 avg) — 60% spike
  Root cause: Finance team backlog; approval queue building
  
  Behavioral anomalies: 0 (vs 1 avg) — IMPROVEMENT

Recommendations:
  1. Urgently implement data classification training for new healthcare vertical
  2. Fund additional Finance reviewer role to clear approval queue
  3. Maintain current behavioral anomaly detection (working well)
  4. AI Ethics risk rising — prepare board brief for April meeting
```

---

### 6. Leadership Reporting

Skill auto-generates:

**Board Risk Brief (Executive Summary):**
- 1-page summary of critical (Red) items
- Risk appetite status (% within budget by category)
- Top 3 trend signals for board attention
- Recommended board actions

**Risk Committee Dashboard (Detailed):**
- 5×5 matrix heatmap of all risks
- Categorized risk list with owners and deadlines
- Treatment plan progress tracking
- Escalation flags

**Operational Risk Scorecard (Departmental):**
- Which department owns highest-risk items?
- Treatment plan completion rates
- SLA adherence (are overdue items being actioned?)

---

## Integration with Sentinel Stack

```
Guardrail Layer → Risk Register Layer → Leadership Layer

DLP Detection
  (hard block on health data)
    ↓
Risk Register Entry
  (RISK-2026-1847: Unauthorized health data access)
    ↓
Scoring & Categorization
  (16/25 = Orange, Data Privacy category)
    ↓
Treatment Assignment
  (Owner: CISO, Strategy: MITIGATE, Deadline: 2026-05-12)
    ↓
Trend Tracking
  (5 similar items in 90 days = pattern, not one-off)
    ↓
Leadership Escalation
  (Data Privacy risk appetite exceeded; board brief prepared)
```

---

## How to Invoke

**Trigger Phrases:**
- "What are our open risks?"
- "Show me the risk register"
- "What's our risk appetite status?"
- "Are we trending better or worse?"
- "Which risks are overdue?"
- "Generate a board brief on top risks"
- "Which departments own the most risk?"
- "Document treatment plan for [risk item]"

**Example Prompt:**
```
Skill: risk-register

Pull the last 90 days of DLP detections. Auto-populate risk entries.
Score them on the 5x5 matrix. Flag any that exceed our Data Privacy 
risk appetite (currently 40). Generate a trend analysis and board brief.
```

---

## Configuration Requirements

Expects `config/org-config.yaml`:

```yaml
risk-register:
  # Risk categories and definitions
  categories:
    - Data Privacy
    - AI Ethics
    - Regulatory
    - Operational
    - Reputational
    - Financial
  
  # 5×5 Likelihood-Impact scoring
  likelihood-scale: "1=Rare, 2=Unlikely, 3=Possible, 4=Likely, 5=Certain"
  impact-scale: "1=Minimal, 2=Minor, 3=Moderate, 4=Major, 5=Catastrophic"
  
  # Risk appetite (quarterly budgets by category)
  risk-appetite:
    data-privacy: 40
    ai-ethics: 20
    regulatory: 50
    operational: 60
    reputational: 15
    financial: 35
  
  # Escalation thresholds
  critical-risk-tolerance: 0
  red-risk-tolerance: 1
  detection-spike-threshold: 50%
  
  # Reporting
  board-brief-required: true
  risk-committee-frequency: "monthly"
  operational-scorecard-frequency: "weekly"
  trend-analysis-frequency: "quarterly"
```

---

## Outputs & Artifacts

- **Risk Register (Master)** — Living spreadsheet/database of all open, closed, accepted risks
- **5×5 Heatmap** — Visual risk matrix showing score distribution
- **Risk Appetite Dashboard** — Budget remaining per category, escalation flags
- **Treatment Plan Tracker** — Open actions, owners, deadlines, % complete
- **Quarterly Trend Report** — Detection frequencies, category trends, direction
- **Board Brief** — 1-page executive summary of critical items and recommendations
- **Risk Scorecard by Department** — Accountability view (which team owns most risk)

---

## Key Principles

1. **Automated, not bureaucratic.** Risk entries are created automatically from guardrails; humans don't fill out forms.
2. **Real-time, not quarterly.** The register updates continuously; leadership sees live status, not month-old snapshots.
3. **Actionable, not checklist.** Every risk has an owner, a treatment strategy, and a deadline; accountability is clear.
4. **Appetite-driven, not list-driven.** Focus on risks that exceed organizational risk appetite and require executive attention.
5. **Trend-aware.** The skill detects patterns (is this a systemic issue?) and alerts when direction deteriorates.

---

## See Also

- `ai-governance` skill — Provides AI risk classification signals
- `compliance-evidence` skill — Maps risk controls to audit evidence
