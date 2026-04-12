# Skill Hierarchy and Dependencies

This document maps skill dependencies, triggering conditions, and common workflows.

## Dependency Graph

```
                         CONFIG
                      org-config.yaml
                            |
          ________________________|_______________________
         |                       |                       |
    GUARDRAILS          DLP-ENGINE               AI-GOVERNANCE
         |                   |                        |
         |___________________|                        |
                  |                                   |
           Compliance Signal                   Vendor-AI-Risk
                |                                  |
      __________|_________                        |
     |         |         |                        |
RISK-REGISTER | COMPLIANCE- | AUDIT-TRAIL      POLICY-
              EVIDENCE                         DRAFTER
```

## Core Skills

### Guardrails (Always-On)

**Purpose:** Data governance policy enforcement

**Trigger:** Every request involving:
- Client data
- Personal data
- Financial records
- Legal documents
- HR decisions

**Inputs:**
- `org-config.yaml` (approvers, policies, escalation contacts)
- `skills/guardrails/references/data-classification.md`
- `skills/guardrails/references/review-gates.md`

**Outputs:**
- Decision: hard_block | soft_block | proceed | proceed_with_gate
- Compliance signal (for downstream skills)
- User guidance (if blocked)

**Downstream Dependencies:**
- Risk-register (if hard_block)
- Compliance-evidence (all signals)
- Audit-trail (all decisions)

---

### DLP Engine (Always-On)

**Purpose:** Content sensitivity scoring

**Trigger:** When guardrails need quantitative assessment, or explicit request

**Inputs:**
- `org-config.yaml` (thresholds, industry pack, custom patterns)
- Content to scan

**Outputs:**
- Sensitivity score (0-100)
- Detections (pattern, industry, behavioral)
- Action (allow/log/alert/redact/block)
- Compliance signal (for high scores)

**Downstream Dependencies:**
- Risk-register (if score >= block_threshold)
- Compliance-evidence (if high score)
- Audit-trail (all scans)

---

### AI Governance (Risk-Based)

**Purpose:** EU AI Act risk classification

**Trigger:** When evaluating:
- New AI system or tool
- High-risk use case
- Compliance question about AI

**Inputs:**
- `org-config.yaml` (risk appetite, prohibited uses, frameworks)
- `skills/ai-governance/references/ai-risk-tiers.md`
- Use case description

**Outputs:**
- Risk tier: Unacceptable | High | Limited | Minimal
- Compliance checklist
- Governance requirements
- Framework mapping

**Downstream Dependencies:**
- Vendor-AI-risk (uses same framework)
- Policy-drafter (generates policies for risk tier)
- Compliance-evidence (maps to control requirements)

---

## Compliance Automation Skills

These respond to signals from guardrails and DLP.

### Risk Register (Signal-Triggered)

**Purpose:** Track governance risks in 5x5 matrix

**Trigger:** 
- Guardrail hard-block → creates "Control Gap" risk
- DLP score >= 85 → creates "Data Exposure" risk
- Any compliance violation → creates relevant risk

**Inputs:**
- Compliance signals (from guardrails, DLP)
- Risk assessment data
- `org-config.yaml` (risk appetite, frameworks)

**Outputs:**
- Risk entries (YAML format)
- Risk queries (by category, severity, age)
- Escalation reports

**Downstream Dependencies:**
- Compliance-evidence (risks map to controls)
- Audit-trail (risk lifecycle logged)
- Decision-audit (risks reviewed for quality)

---

### Compliance Evidence (Signal-Triggered)

**Purpose:** Generate audit-ready compliance evidence

**Trigger:**
- Guardrail decision
- DLP detection
- Risk update
- Compliance signal with framework mappings

**Inputs:**
- Compliance signal with control mappings
- `org-config.yaml` (frameworks)
- Decision context

**Outputs:**
- Evidence artifacts (by framework)
- Control-to-evidence mapping
- Audit-ready documentation
- Evidence package (for auditors)

**Downstream Dependencies:**
- Audit-trail (evidence logged with timestamps)

---

### Audit Trail (Event-Triggered)

**Purpose:** Structured governance event logging

**Trigger:** Every governance event:
- Guardrail decision
- DLP scan
- Risk change
- Compliance action
- Config change

**Inputs:**
- Event details (timestamp, user, action, outcome)
- `org-config.yaml` (retention, alert settings)

**Outputs:**
- JSON-lines (for SIEM)
- CSV (for analysis)
- Audit reports (narrative)
- Real-time alerts (critical events)

**Downstream Dependencies:**
- None (terminal skill)
- Used by: decision-audit, compliance-evidence packaging

---

## Decision Support Skills

These support human decision-making (on-demand).

### Vendor AI Risk (On-Demand)

**Purpose:** Assess third-party AI vendors

**Trigger:** Explicit user request or new vendor tool evaluation

**Inputs:**
- Vendor details (name, product, use case)
- `org-config.yaml` (approved frameworks, certifications)
- `skills/ai-governance/references/ai-risk-tiers.md`

**Outputs:**
- Quick triage: red/yellow/green (5 min)
- Deep assessment: risk scorecard, negotiation points (2-3 hours)

**Downstream Dependencies:**
- Policy-drafter (policies for vendor use)
- Compliance-evidence (vendor assessment becomes evidence)
- Audit-trail (assessment logged)

---

### Policy Drafter (On-Demand)

**Purpose:** Generate governance policies

**Trigger:** Explicit user request to create or update policy

**Inputs:**
- `org-config.yaml` (company, industry, roles, frameworks)
- Policy template selection
- Customization requirements

**Outputs:**
- Markdown (source)
- DOCX (for approval)
- HTML (for wiki)
- PDF (for archive)

**Downstream Dependencies:**
- Guardrails (implements policies)
- Audit-trail (policy updates logged)
- Training (policies taught)

---

### Decision Audit (On-Demand)

**Purpose:** QA governance decisions for quality

**Trigger:** Periodic review or when decision quality is questioned

**Inputs:**
- Decision records (guardrail, risk, compliance)
- Audit criteria (logic, evidence, bias, authority)
- `org-config.yaml` (policies, authorities)

**Outputs:**
- Audit report (findings by decision)
- Aggregate findings (patterns)
- Recommendations

**Downstream Dependencies:**
- Audit-trail (decisions to review)
- Risk-register (decision gaps become risks)

---

### First Principles (On-Demand)

**Purpose:** Reason through novel governance questions

**Trigger:** Explicit user request for governance reasoning

**Inputs:**
- Governance question
- Relevant policies and principles
- `org-config.yaml` (frameworks, risk appetite)

**Outputs:**
- Structured analysis (assumptions, evidence, reasoning)
- Recommended decision
- What could change the decision

**Downstream Dependencies:**
- Policy-drafter (novel policies drafted from conclusion)
- Guardrails (new policies implemented)

---

## Common Workflows

### Workflow 1: User Makes Request with Sensitive Data

```
1. User: "Help me analyze this client data"
   ↓
2. Guardrails (always-on)
   → Scans for client identifiers
   → Detects: "client firm name + financial figures"
   → Soft-flag: Asks if anonymized
   ↓
3. User: "This is anonymized; Client A refers to [redacted]"
   ↓
4. Guardrails resumes
   → Treats as anonymized
   → No 4-eyes gate needed (not a decision)
   → Proceed normally
   ↓
5. Compliance Signal emitted
   → Type: clean_pass
   → Severity: low
   ↓
6. Audit-trail logs
   → Event: user_request_scanned
   → User: alice@company.com
   → Outcome: passed
```

### Workflow 2: Hard-Block Triggers Risk and Evidence Collection

```
1. User: "Check this client data with ChatGPT"
   ↓
2. Guardrails (always-on)
   → Hard-block: client name present (Acme Corp, not anonymized)
   → Decision: HARD BLOCK
   ↓
3. Compliance Signal emitted
   {
     type: "hard_block",
     policy: "policy_1_client_data",
     frameworks: [SOC2-CC6.1, ISO27001-A.8.2, GDPR-Art32]
   }
   ↓
4. Risk-Register (signal-triggered)
   → Creates: RISK-2026-001
   → Category: Data Exposure
   → Likelihood: 3 (policy worked, prevented exposure)
   → Impact: 4 (client data is sensitive)
   → Score: 12 (High)
   ↓
5. Compliance-Evidence (signal-triggered)
   → Maps to: SOC2-CC6.1 (access controls working)
   → Maps to: ISO27001-A.8.2 (preventive control)
   → Evidence type: control_effectiveness
   → Adds to: Q2 2026 audit package
   ↓
6. Audit-Trail (event-triggered)
   → Logs: guardrail_hard_block event
   → Timestamp: 2026-04-13T14:30:00Z
   → User: bob@company.com
   → Policy: policy_1_client_data
   → Outcome: blocked, user asked to re-submit
   ↓
7. User gets response
   "Hard-block: Client data (Acme Corp) detected. 
    Please anonymize (e.g., Client A) and re-submit."
```

### Workflow 3: Evaluating New Vendor AI Tool

```
1. User: "Can we use Vendor X for customer service chatbot?"
   ↓
2. Vendor-AI-Risk (on-demand)
   → Quick triage (5 min)
   → Risk: YELLOW
   → Recommendation: Approve with controls
   ↓
3. User wants deeper assessment
   ↓
4. Vendor-AI-Risk (on-demand)
   → Deep due diligence (2 hours)
   → Data handling: Good (DPA available)
   → Security: SOC 2 certified
   → Incident history: 1 minor incident, transparent response
   → Risk score: 7/10 (Yellow)
   → Conditions: Disable training data collection, sign DPA
   ↓
5. Policy-Drafter (on-demand)
   → Generate "Vendor AI Use Policy"
   → Config: Vendor X, customer service chatbot, limited risk
   → Output: Policy document with approval template
   ↓
6. Vendor-AI-Risk assessment + policy
   ↓
7. Legal reviews & approves
   ↓
8. Audit-Trail logs
   → Event: vendor_approved
   → Risk: Yellow
   → Approver: General Counsel
   → Conditions: Training data opt-out, DPA signed
   ↓
9. Tool deployed with monitoring
   → Audit-trail tracks all uses
   → Monthly vendor performance review
   → Annual re-assessment
```

### Workflow 4: Quarterly Audit and Compliance Reporting

```
1. Compliance Officer: "Generate Q2 2026 audit package"
   ↓
2. Compliance-Evidence (on-demand)
   → Retrieve all compliance signals (Apr-Jun 2026)
   → Organize by framework:
      - SOC 2 (15 controls covered)
      - ISO 27001 (18 controls covered)
      - GDPR (8 articles covered)
   ↓
3. Risk-Register (on-demand)
   → List all risks Q2 2026
   → Aging report (how long each risk has been open)
   → Mitigation tracking (action completion)
   ↓
4. Audit-Trail (on-demand)
   → Export all events Q2 2026
   → Generate summary report
   → Incident log
   ↓
5. Decision-Audit (on-demand)
   → Audit sample of guardrail decisions
   → Check: consistency, evidence quality, authority
   → Report: finding by decision, aggregate patterns
   ↓
6. Package all:
   → Evidence by framework (SOC2, ISO, GDPR folders)
   → Risk register and aging
   → Audit findings
   → Incident summary
   → Decision audit results
   ↓
7. Auditor (or internal reviewer) reviews package
   → Signs off on control effectiveness
   → Notes any gaps
   → Plans follow-up actions
```

### Workflow 5: Novel Governance Question

```
1. User: "Can we use AI to predict which employees will leave?
            Worried about fairness/privacy implications."
   ↓
2. First-Principles (on-demand)
   → Question: What are governance requirements for employee 
              attrition prediction?
   → Identifies:
      - Accountability: Who's responsible if prediction is wrong?
      - Transparency: Must employee know they're being monitored?
      - Fairness: Could model discriminate by age, gender, race?
      - Data: What data is used? How's it protected?
   ↓
3. AI-Governance assessment (on-demand)
   → Employee data + AI decision = HIGH RISK
   → Requirements: Explainability, human oversight, bias testing
   ↓
4. First-Principles (continued)
   → Synthesizes:
      - Use case is HIGH RISK under EU AI Act
      - Requires: Transparency to employee, bias testing
      - Governance: HR Lead + CISO review each prediction
      - Recommendation: Allow with controls
   ↓
5. Policy-Drafter (on-demand)
   → Generate: "Employee Attrition Prediction Policy"
   → Config: High-risk AI, requires oversight, bias testing
   → Output: Policy document with approval checklist
   ↓
6. New policy → Training → Deployment → Monitoring
```

---

## Skill Selection Flowchart

```
What are you trying to do?

├─ Check if request is allowed?
│  └─ Use: Guardrails
│
├─ Score sensitivity of content?
│  └─ Use: DLP-Engine
│
├─ Classify AI system by risk?
│  └─ Use: AI-Governance
│
├─ Assess vendor tool?
│  └─ Use: Vendor-AI-Risk
│
├─ Generate/update policy?
│  └─ Use: Policy-Drafter
│
├─ Reason through governance Q without precedent?
│  └─ Use: First-Principles
│
├─ Audit decisions for quality?
│  └─ Use: Decision-Audit
│
├─ Check what the system did (for auditors)?
│  └─ Use: Audit-Trail + Compliance-Evidence
│
└─ Track governance risks?
   └─ Use: Risk-Register
```
