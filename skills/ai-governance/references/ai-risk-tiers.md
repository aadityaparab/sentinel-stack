# AI Risk Tiers: EU AI Act Classification

Quick reference for classifying AI systems by regulatory risk. Maps to EU AI Act Articles 6-8 (risk-based approach).

---

## The Four Risk Tiers

### 1. UNACCEPTABLE RISK

**Definition:** AI systems that create an unacceptable risk of harm to fundamental rights and freedoms.

**Regulatory Basis:** EU AI Act Article 5 — **Prohibited**. Cannot be deployed, period.

**Examples:**
- Real-time remote biometric identification in public spaces (mass surveillance)
- Social scoring systems that rank citizens by behavior/characteristics
- Subliminal manipulation (e.g., hidden persuasion techniques targeting unconscious mind)
- AI that exploits vulnerabilities due to age, disability, or socioeconomic status
- Non-consensual deepfakes used to defame or manipulate
- Behavioral prediction for enforcement (assuming someone will commit crime based on profile)

**Obligations:**
- **NONE.** Cannot use. Period. No amount of documentation makes this compliant.
- Exception: Member States may impose carve-outs for law enforcement with specific safeguards (Article 5(3)) — rare, highly regulated.

**Data Classification:** Not applicable; the risk is in the system design itself.

**Handling:**
```
UNACCEPTABLE RISK DETECTED
Status: BLOCKED — Project must pivot or be cancelled
Escalate to: Chief Risk Officer, Chief Compliance Officer, Legal Counsel
Override Possible: NO
```

---

### 2. HIGH RISK

**Definition:** AI systems that could have a significant impact on fundamental rights and freedoms, or on safety, health, or well-being.

**Regulatory Basis:** EU AI Act Articles 6-8 — **High-risk applications** (Annex III lists 17 categories).

**Examples (from Annex III):**
- **Employment & Labor:**
  - Recruitment/hiring recommendation systems
  - Resume screening and candidate ranking
  - Worker performance monitoring & promotion decisions
  
- **Law Enforcement:**
  - Predictive policing (risk of crime in areas/persons)
  - Automated detection of persons for investigation
  
- **Education:**
  - Automated grading systems affecting student progression
  - Adaptive learning systems that determine curriculum path
  - Student performance prediction for sorting into tracks
  
- **Financial Services:**
  - Creditworthiness assessment for lending/insurance
  - Automated decision on credit terms (interest rate)
  
- **Critical Infrastructure:**
  - AI managing electrical grid, water, gas, or transport systems
  - Cybersecurity threat detection (autonomous response)
  
- **Law & Justice:**
  - Predictive analysis for sentencing recommendations
  - Risk assessment for bail/parole decisions
  - Automated legal due diligence

**Obligations (Article 9-15):**

| Obligation | Description |
|---|---|
| **Risk Assessment (Art. 9)** | Document what could go wrong. Data quality, model performance, edge cases, bias vectors. |
| **Data Governance (Art. 10)** | High-quality training data, representative samples, bias testing, documented provenance. |
| **Technical Documentation (Art. 11)** | System card: purpose, logic, performance metrics, limitations, human override procedure. |
| **Record Keeping (Art. 12)** | Immutable logs of model deployment, versions, training data, performance monitoring. |
| **Transparency (Art. 13)** | Users must know they're interacting with high-risk AI; understand output limitations. |
| **Human Oversight (Art. 26)** | Meaningful human review before or after AI decision. Not a rubber stamp. |
| **Bias Monitoring (Art. 10)** | Continuous testing for disparate impact; trigger retraining if drift detected. |
| **Performance Monitoring (Art. 26)** | Measure real-world model performance; alert if KPIs degrade. |

**Example Control Package:**
```
AI System: Hiring Recommendation Engine
Risk Tier: HIGH

RISK ASSESSMENT:
  - False positive rate leads to qualified candidates rejected
  - Model bias against protected classes (gender, age, ethnicity)
  - Training data from historical hiring may encode past discrimination

MITIGATION:
  ✓ Training data audit: verify representative sample across demographics
  ✓ Separate test set: measure false positive/negative rates by protected class
  ✓ Human review: HR reviews recommendations before rejection
  ✓ Transparency: candidates informed that AI assisted decision
  ✓ Appeal mechanism: candidate can request human-only review
  ✓ Monitoring: monthly bias metrics; alert if disparate impact detected
  ✓ Documentation: audit trail of every recommendation and override

APPROVALS REQUIRED:
  - Chief Risk Officer (risk assessment sign-off)
  - Chief Compliance Officer (legal compliance)
  - HR Director (operational feasibility)
  
REVIEW CADENCE:
  - Monthly: bias & performance metrics review
  - Quarterly: model retraining assessment
  - Annually: independent audit of human oversight quality
```

---

### 3. LIMITED RISK

**Definition:** AI systems with specific transparency obligations, typically involving interaction with humans but lower likelihood of fundamental rights impact.

**Regulatory Basis:** EU AI Act Article 52 — **Transparency requirements**.

**Examples:**
- Chatbots and conversational AI (user must know they're talking to AI)
- Content recommendation systems (YouTube, TikTok, Netflix recommendation algorithms)
- Resume screening tools (notifying candidates how their data is used)
- Deepfake detection tools
- Sentiment analysis for customer feedback
- Spam/fraud detection (users should know scores exist)
- Price comparison/search result ranking

**Obligations (Article 52):**

| Obligation | Description |
|---|---|
| **Transparency** | Users/customers must be informed that they're interacting with AI. |
| **Disclosure Timing** | Before interaction begins (not hidden; no deception). |
| **Informed Consent** | Explicit opt-in required (in most jurisdictions). |
| **Appeal/Objection** | Users can request human review of output. |
| **Documentation** | Record that disclosure was provided and when. |

**Example Control Package:**
```
AI System: Chatbot Customer Support
Risk Tier: LIMITED

TRANSPARENCY DISCLOSURE:
  "This conversation uses AI to help answer your questions. 
   A human specialist reviews complex requests. 
   You can request a human agent at any time by typing 'human'."

CONSENT TRACKING:
  - User must acknowledge disclosure before chat starts
  - Timestamp and log acknowledgment
  - If declined: offer human-only support

HUMAN ESCALATION:
  - Sentiment analysis: if confidence < 0.7, suggest human agent
  - Complex queries (multi-turn > 5) escalate to human
  - User can request human at any time

RETENTION:
  - Conversation logs retained for 1 year (training improvement)
  - User can request deletion anytime
  - PII redacted before training use
```

---

### 4. MINIMAL RISK

**Definition:** AI systems with no significant impact on rights, safety, health, or well-being. Very low likelihood of harm.

**Regulatory Basis:** EU AI Act — **No specific obligations**. Voluntary best practices apply.

**Examples:**
- Simple rule-based systems (if-then logic, no learning)
- Spell checkers & grammar tools
- Image recognition for photo organization (local device, no upstream processing)
- Calendar assistants
- Reminder notifications
- Accessibility tools (text-to-speech, image alt-text generation)

**Obligations:**
- **None.** Use common sense (don't process sensitive data without consent; tell users it's AI if relevant).
- Consider transparency as a best practice, not a legal requirement.

**Example:**
```
AI System: Email Spam Filter
Risk Tier: MINIMAL

ACTIONS:
  - Filter spam into separate folder (reversible; user can recover)
  - No impact on fundamental rights
  - User expects spam filtering (implied consent)
  - No transparency required, but can include: 
    "powered by AI" in help text (nice-to-have)
```

---

## Quick Classification Flowchart

```
START: Describe your AI use case
  |
  ├─ Does it involve:
  |  - Real-time biometric ID of persons in public?
  |  - Social scoring / citizen ranking?
  |  - Subliminal manipulation?
  |  - Behavioral prediction for law enforcement?
  |  └─> YES → UNACCEPTABLE RISK [PROHIBITED — STOP]
  |
  ├─ Does it involve (from Annex III):
  |  - Employment decisions (hiring, promotion, performance)?
  |  - Law enforcement (predictive policing, risk assessment)?
  |  - Education (grading, student sorting)?
  |  - Credit/insurance decisions?
  |  - Critical infrastructure?
  |  - Sentencing/bail/parole?
  |  └─> YES → HIGH RISK [Article 9-15 obligations apply]
  |
  ├─ Does it involve:
  |  - Human interaction (chatbot, recommendation engine)?
  |  - User doesn't obviously know it's AI?
  |  - Could impact user decisions (price, content choice)?
  |  └─> YES → LIMITED RISK [Article 52 transparency required]
  |
  └─> NO → MINIMAL RISK [Best practices; no strict obligations]

DECISION TREE OUTPUTS:
  Unacceptable → Project cannot proceed
  High → Risk assessment + oversight + monitoring required
  Limited → Transparency disclosure + opt-in consent required
  Minimal → Best practices suggested; no mandatory controls
```

---

## Mapping to Other Frameworks

### GDPR Article 22 (Automated Decision-Making)
- **Applies to:** Decisions with legal or similarly significant effects
- **Examples:** Hiring, lending, job performance evaluation
- **Requirement:** Right to explanation + human review
- **Overlap:** Most High-Risk EU AI Act systems also trigger Article 22

### NIST AI RMF (Artificial Intelligence Risk Management Framework)
- **Map Risk Tier → NIST Severity:**
  - Unacceptable → CRITICAL
  - High → HIGH
  - Limited → MEDIUM
  - Minimal → LOW

### Internal Organization Risk Scale
```
Unacceptable → Red zone (cannot use)
High → Amber zone (proceed only with controls)
Limited → Yellow zone (proceed with transparency)
Minimal → Green zone (proceed with common sense)
```

---

## Configuration in org-config.yaml

```yaml
ai-governance:
  risk-frameworks:
    primary: "EU AI Act"
    secondary: ["GDPR Article 22", "internal-policy"]
  
  risk-tiers:
    Unacceptable:
      regulation: "EU AI Act Article 5"
      blocked: true
      examples: ["mass surveillance", "social scoring", "subliminal manipulation"]
    
    High:
      regulation: "EU AI Act Articles 6-8, Annex III"
      approval-required: true
      obligations:
        - risk-assessment
        - high-quality-training-data
        - technical-documentation
        - human-oversight
        - transparency
        - continuous-monitoring
    
    Limited:
      regulation: "EU AI Act Article 52"
      approval-required: false
      obligations:
        - transparency-disclosure
        - explicit-consent
        - appeal-mechanism
    
    Minimal:
      regulation: "No specific mandate"
      approval-required: false
      obligations: []
      notes: "Best practices recommended but not required"
```

---

## Key Principles

1. **Risk is context-dependent.** Same AI technology can be Minimal in one use case and High/Unacceptable in another. A resume screening tool → High. A resume suggestion tool for job seekers → Limited.

2. **Impact on fundamental rights drives tier.** The threshold is not technical sophistication but potential for harm to dignity, freedom, fairness, privacy.

3. **Obligation scales with risk.** Unacceptable = cannot use. High = extensive documentation & oversight. Limited = transparency. Minimal = common sense.

4. **Continuous monitoring is essential.** A system approved as High-Risk today may drift (model bias, data quality decay) and require re-classification.

5. **No silver bullet mitigations.** You cannot make an Unacceptable system acceptable by adding oversight. Some risks are inherently unacceptable and must be avoided.

---

## Document Version

- Version: 1.0
- Based on: EU AI Act (Regulation (EU) 2024/1689), effective 2025-01-02
- Last Updated: 2026-04-12
- Reference: Articles 5-8, Annex II & III
