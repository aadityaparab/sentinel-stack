---
name: vendor-ai-risk
description: Third-party AI vendor risk assessment skill. Evaluates AI vendors and tools across five dimensions: security, privacy, AI-specific risks, contractual protections, and regulatory compliance. Outputs a vendor risk scorecard with a go/no-go recommendation. Two modes: quick triage (5-minute assessment) and deep due diligence. Use when evaluating AI tools for procurement, vendor due diligence, or third-party AI risk assessment.
---

# Vendor AI Risk

**Skill Name:** vendor-ai-risk  
**Version:** 1.0.0  
**Category:** GRC / Procurement  
**Maturity:** Production  

## Overview

The Vendor AI Risk skill evaluates third-party AI vendors and tools for risk across five dimensions: security, privacy, AI-specific risks, contractual protections, and regulatory compliance. It outputs a vendor risk scorecard with a go/no-go recommendation and conditions. Two modes support different decision timelines: quick triage (5 minutes) and deep due diligence (full assessment).

## Triggers

This skill activates on requests containing these keywords (pushy mode enabled):
- "AI vendor assessment"
- "evaluate AI tool"
- "AI vendor risk"
- "third party AI"
- "AI procurement"
- "should we use this AI tool"
- "vendor due diligence for AI"
- "vendor evaluation"
- "AI tool assessment"

## Capabilities

### Assessment Modes

#### Mode 1: Quick Triage (5-minute assessment)
Fast, high-level screening for red flags. Suitable for initial procurement filtering.

**Input Required:**
- Vendor name and AI product
- Intended use case (internal analytics, customer-facing, compliance-sensitive, regulated industry)
- Data sensitivity classification (public, internal, confidential, restricted)

**Output:**
- Go/no-go recommendation (Fast-Track, Review Needed, Not Recommended)
- Top 5 risk factors
- Critical questions for vendor
- Estimated cost and timeline for deep assessment

---

#### Mode 2: Deep Assessment (full due diligence)
Comprehensive evaluation across all risk categories. Suitable for strategic vendor partnerships or regulated use cases.

**Input Required:**
- Vendor responses to detailed due diligence questionnaire
- Security certifications (SOC 2, ISO 27001, etc.)
- Privacy documentation (DPA, data processing terms, sub-processor list)
- Model transparency information (model card, testing reports, bias audits)
- Proposed contract terms

**Output:**
- Detailed risk scorecard (0-100 per dimension, 0-100 overall)
- Go/no-go recommendation with conditions
- Required contractual amendments
- Monitoring and compliance checkpoints
- Recommended exclusions or data restrictions

---

## Risk Assessment Dimensions

### 1. Security Assessment

**Evaluation Criteria:**

| Factor | Assessment | Red Flags |
|--------|-----------|-----------|
| **Certifications** | SOC 2 Type II (required) | No SOC 2, < 1 year in force |
| **Encryption Standards** | TLS 1.3 for transit; AES-256 at rest | TLS 1.2, unencrypted storage, no standards |
| **Access Controls** | MFA, RBAC, principle of least privilege | Shared passwords, no audit logging |
| **Vulnerability Disclosure** | Documented responsible disclosure program | No program, slow response (>90 days) |
| **Incident Response SLA** | < 4 hours detection, < 1 hour notification | No SLA, > 24 hour response |
| **Penetration Testing** | Annual third-party pen tests, remediation tracked | No pen tests, unclear remediation |
| **Data Segregation** | Customer data logically isolated, tenant isolation verified | Shared databases, co-location risks |
| **Backup & Recovery** | RTO < 4 hours, RPO < 1 hour, tested quarterly | No backups, untested recovery |

**Scoring:**
- 90-100: Best-in-class security posture
- 70-89: Acceptable with monitoring
- 50-69: Multiple gaps, conditional approval
- <50: Critical gaps, not recommended

---

### 2. Privacy Assessment

**Evaluation Criteria:**

| Factor | Assessment | Red Flags |
|--------|-----------|-----------|
| **Data Processing Agreement (DPA)** | GDPR-compliant DPA provided | Refuses DPA, generic terms only |
| **Training Data Use** | Explicit: "No training on customer data" | Ambiguous, trains on data, opt-out only |
| **Data Residency** | Meets org requirements (EU/US/specific region) | Cross-border transfers, no residency control |
| **Retention Limits** | Auto-deletes per policy (default < 30 days) | Indefinite retention, unclear purge |
| **Sub-processors** | List provided, change notification 30+ days | No list, unannounced changes |
| **Data Subject Rights** | Supports GDPR: access, deletion, export | No API for rights requests, manual process |
| **Breach Notification** | Commits to <72 hour GDPR notification | Notification timeline vague |
| **Consent Management** | Consent collection & withdrawal tools | No mechanism, assumes consent |
| **Right to Audit** | Permits customer security audits annually | Audit access restricted, no API |

**Scoring:**
- 90-100: Privacy-by-design, GDPR+ compliant
- 70-89: GDPR compliant with minor caveats
- 50-69: GDPR compliant but limited transparency
- <50: Privacy gaps, compliance risk

---

### 3. AI-Specific Risks

**Evaluation Criteria:**

| Factor | Assessment | Red Flags |
|--------|-----------|-----------|
| **Model Transparency** | Model card published (architecture, performance, limitations) | No documentation, "black box" |
| **Bias & Fairness Testing** | Third-party bias audit, fairness metrics disclosed | No testing, dismissed as "not applicable" |
| **Hallucination Rate** | Benchmarked hallucination rate published (<5% ideal) | Untested, vendor dismisses concern |
| **Output Reliability** | Factuality benchmarks, confidence scores in output | No confidence metrics, high variance |
| **Model Versioning** | Major version changes tracked, backwards compatibility tested | Silent model updates, breaking changes |
| **Training Data Provenance** | Training data composition documented (no copyrighted materials) | Unknown sources, copyright disputes |
| **Adversarial Robustness** | Tested against prompt injection, jailbreaks | No adversarial testing |
| **Update Frequency** | Clear schedule for security/performance patches | Ad-hoc, slow updates |
| **Fine-tuning Options** | Supports org-specific fine-tuning for accuracy | No customization, one-size-fits-all |
| **Explainability** | Output includes reasoning/confidence/uncertainty | Black-box scores without explanation |

**Scoring:**
- 90-100: Highly transparent, well-tested, low hallucination risk
- 70-89: Transparent, some gaps in testing
- 50-69: Minimally transparent, hallucination risk acknowledged
- <50: No transparency, high hallucination risk

---

### 4. Contractual & Commercial

**Evaluation Criteria:**

| Factor | Assessment | Red Flags |
|--------|-----------|-----------|
| **Liability for AI Outputs** | Vendor assumes liability for inaccurate/biased outputs | Vendor disclaims all liability for outputs |
| **Indemnification** | Vendor indemnifies for IP infringement, regulatory violations | No indemnification clause |
| **Service Level Agreement (SLA)** | Uptime SLA >=99.5%, credits for breaches | No SLA, no service credits |
| **Support Response** | <1 hour for critical, <24 hours for high (24/7 availability) | Best-effort, no SLA |
| **Audit Rights** | Permits annual compliance audits, SOC 2 audit cooperation | Audit access denied |
| **Termination Rights** | 30-day termination without cause, data deletion SLA | Long lock-in, data retention post-termination |
| **Price Clarity** | Transparent pricing, no hidden per-API-call charges | Opaque pricing, surprise overages |
| **Insurance** | E&O insurance $5M+, cyber liability $10M+ | No insurance, low coverage |
| **Data Ownership** | Customer owns all data and model outputs | Vendor claims rights to outputs |
| **Dispute Resolution** | Arbitration available, appeal rights | Binding vendor-chosen jurisdiction |

**Scoring:**
- 90-100: Vendor-friendly terms, comprehensive protections
- 70-89: Balanced terms with some vendor protections
- 50-69: Vendor-favorable terms, mitigation required
- <50: Unacceptable terms, recommend renegotiation or avoid

---

### 5. Regulatory Compliance

**Evaluation Criteria by Jurisdiction:**

| Regulation | Assessment Criteria | Red Flags |
|-----------|------------------|-----------|
| **EU AI Act** | Vendor compliant with risk tier classification (high-risk requires conformity assessment) | Non-compliance, refuses assessment |
| **GDPR** | Compliant processor, DPA in place, adequate safeguards | No DPA, unlawful processing |
| **HIPAA** | (Healthcare) BAA in place, encryption, access controls | Refuses BAA, no security roadmap |
| **PCI-DSS** | (Payment cards) No cardholder data processing without Level 1 certification | Processes PAN without certification |
| **FedRAMP** | (US Gov) FedRAMP authorization if serving federal agencies | Not authorized, cannot serve federal use cases |
| **SOC 2 Type II** | (Financial/data services) Current Type II attestation | Only Type I, no history, or expired |
| **CCPA** | California consumer privacy compliance | Non-compliant data handling |
| **PIPEDA** | (Canada) Privacy compliance documented | Fails Canadian privacy standards |
| **Industry Certification** | ISO 27001 / ISO 27018 (if applicable) | No industry certifications |

**Scoring:**
- 90-100: Exceeds regulatory requirements in all applicable jurisdictions
- 70-89: Compliant with applicable regulations
- 50-69: Compliant with major regs, gaps in secondary regs
- <50: Non-compliant, regulatory risk

---

## Risk Scorecard Output

### Summary

```
================================================================================
                     VENDOR AI RISK SCORECARD
================================================================================

Vendor: CloudAI Analytics Pro
Assessment Date: 2026-04-12
Assessment Mode: Deep
Assessed By: Security Team / Procurement

Use Case: Internal financial forecasting, non-sensitive data
Data Classification: Internal
Intended Deployment: Production

================================================================================
                         RISK DIMENSION SCORES
================================================================================

Security Assessment                          : 82/100 [ACCEPTABLE]
Privacy Assessment                           : 75/100 [ACCEPTABLE]
AI-Specific Risks                            : 68/100 [REVIEW NEEDED]
Contractual & Commercial                     : 71/100 [ACCEPTABLE]
Regulatory Compliance                        : 88/100 [STRONG]
                                              ____________
OVERALL RISK SCORE                           : 77/100 [GO WITH CONDITIONS]

================================================================================
                          RECOMMENDATION
================================================================================

STATUS: GO WITH CONDITIONS

Vendor is acceptable for internal use with the following conditions:
1. [CRITICAL] Require hallucination rate benchmark < 3% or add human review step
2. [HIGH] Amend contract: liability clause for biased outputs / indemnification
3. [HIGH] Obtain explicit opt-out from training data; add to DPA
4. [MEDIUM] Annual bias audit required; results shared with team

Estimated Start Date: 2026-05-01 (30 days for negotiation + onboarding)
Approval Gate: CIO + Legal sign-off after conditions documented

================================================================================
                       DETAILED FINDINGS
================================================================================

SECURITY [82/100]
✓ SOC 2 Type II current (expires 2027-06-30)
✓ TLS 1.3 + AES-256 encryption
✓ MFA enforced, RBAC implemented
✗ Incident response SLA: 8 hours (target <4 hours)
  Mitigation: Acceptable for non-critical internal use
✓ Annual pen tests with remediation tracking
✓ Tenant isolation verified in architecture review

PRIVACY [75/100]
✓ GDPR-compliant DPA template provided
✗ Data retention: 90 days default (want <30 days)
  Mitigation: Negotiate shorter default; API for manual deletion
✓ Sub-processor list current; 30-day change notification
✓ Supports data subject deletion requests
⚠ Training data: "not used, but may be used for model improvements"
  Mitigation: Add explicit opt-out and DPA amendment

AI-SPECIFIC RISKS [68/100]
✓ Model card published; architecture transparent
✗ Hallucination rate: Vendor reports 8% (want <3%)
  Mitigation: Add human review step for financial outputs
  Cost: 1-2 hours/week analyst time
✓ Bias testing: Third-party audit available, results accessible
✓ Confidence scores in output; uncertainty bounds provided
✗ Adversarial robustness: Not tested for prompt injection
  Mitigation: Acceptable for internal use; not customer-facing
✓ Fine-tuning available (cost: $5K one-time + $500/month)

CONTRACTUAL [71/100]
✓ Vendor assumes output liability for factually incorrect data
✗ Biased output liability: Vendor disclaims, offered shared liability
  Mitigation: Negotiate stronger indemnification
✓ 99.8% uptime SLA with service credits
✓ 24/7 support, <1 hour response for critical
✓ 30-day termination without cause
✓ Data deleted within 30 days of termination
✗ Insurance: E&O $3M (want $5M); cyber $5M (want $10M)
  Mitigation: Acceptable for non-critical financial forecasting

REGULATORY COMPLIANCE [88/100]
✓ EU AI Act: Vendor self-certifies non-high-risk
✓ GDPR compliant (DPA in place)
✓ SOC 2 Type II attestation
✓ No HIPAA/PCI-DSS required (internal non-regulated use)
⚠ ISO 27001 in progress (certification expected Q3 2026)

================================================================================
                   REQUIRED ACTIONS BEFORE APPROVAL
================================================================================

[CRITICAL PRIORITY]
- [ ] Obtain written commitment: hallucination rate <3% SLA
      Owner: Procurement | Due: 2026-04-15
- [ ] Amend contract liability clause to include biased/discriminatory outputs
      Owner: Legal | Due: 2026-04-20
- [ ] Add DPA amendment: no training use, explicit opt-out
      Owner: Legal + Vendor | Due: 2026-04-25

[HIGH PRIORITY]
- [ ] Negotiate data retention: 30-day default (from 90)
      Owner: Privacy | Due: 2026-04-18
- [ ] Request ISO 27001 interim attestation or third-party audit
      Owner: Security | Due: 2026-05-01

[MEDIUM PRIORITY]
- [ ] Fine-tune model on historical financial data (3-month pilot)
      Owner: Data Science | Due: 2026-05-15
- [ ] Schedule annual bias audit; add to compliance calendar
      Owner: Compliance | Due: 2026-05-01

================================================================================
                       ONGOING MONITORING
================================================================================

Quarterly Compliance Check (every 90 days):
- [ ] Verify data retention policy still <30 days
- [ ] Confirm no unauthorized model updates
- [ ] Review incident logs (if any)
- [ ] Confirm training data non-use

Annual Review (every 12 months):
- [ ] Obtain updated SOC 2 attestation
- [ ] Third-party bias audit results
- [ ] Cost-benefit analysis vs. competitive offerings
- [ ] Regulatory/legal changes requiring DPA update
- [ ] Executive assessment: Continue, renegotiate, or replace

Immediate Escalation Triggers:
- Incident involving customer data or compliance violation
- Unannounced model version change affecting output format/accuracy
- Security incident; vendor notification delay >72 hours
- Regulatory warning or audit finding
- Financial/viability concerns (acquisition, layoffs, etc.)

================================================================================
```

---

## Quick Triage Output (5-minute assessment)

For initial screening:

```
VENDOR AI RISK - QUICK TRIAGE
Vendor: TinyML Startup Inc.
Date: 2026-04-12

USE CASE: Customer chatbot integration
DATA SENSITIVITY: Confidential customer messages

RED FLAGS IDENTIFIED (Top 5):
1. [CRITICAL] No SOC 2 certification; founded 2024
2. [HIGH] Training data policy: "May use for model improvement"
3. [HIGH] No published model card; "proprietary methodology"
4. [MEDIUM] No liability clause in standard terms
5. [MEDIUM] Incident response SLA > 24 hours

RECOMMENDATION: NOT RECOMMENDED (customer-facing + high data sensitivity)
RATIONALE: Too many material gaps for confidential data + customer exposure
           Recommend revisiting after SOC 2 certification + updated terms

ALTERNATIVE: Consider larger vendors (OpenAI, Anthropic) with better compliance posture
            OR use vendor only for internal, non-sensitive use cases

NEXT STEPS:
- Request SOC 2 roadmap and target date
- If available, start deep assessment in 12 months when certified
- Budget 2-3 weeks for full due diligence if they provide strong updates

ESTIMATED COST: 40 hours internal time for deep assessment (if revisited)
```

---

## Integration Points

- **policy-drafter skill**: Vendor policy assessment informs vendor policy requirements
- **audit-trail skill**: Vendor assessments logged; approval decisions traceable
- **config/org-config.yaml**: Pulls `org.risk_appetite`, `org.industry`, `org.jurisdictions` to customize risk thresholds
- **guardrails skill**: Approved vendors integrated into guardrail allow-lists

---

## Best Practices

✓ Conduct quick triage for all vendors before investing in deep assessment  
✓ Involve Legal, Security, Privacy, and Finance in assessment  
✓ Document all vendor commitments and amendments in DPA  
✓ Build vendor assessments into annual risk management cycle  
✓ Escalate immediately if vendor fails critical checks post-approval  
✓ Plan vendor replacement strategy (contract should allow 30-day exit)  
✓ Review competitive landscape annually (faster, cheaper, less risky options?)  
✓ Share lessons learned across organization (incident database)  

---

**Prompt Guidance for LLM:**

When assessing vendors, ask:
- What is the intended use case? (Internal analytics, customer-facing, compliance-critical?)
- What data sensitivity will be processed? (Public, internal, confidential, restricted?)
- Which regulations apply? (GDPR, HIPAA, PCI-DSS, industry-specific?)
- What is the organization's risk appetite? (Conservative, balanced, risk-tolerant?)
- Do we already have preferred vendors or contractual frameworks?
- What is the timeline for approval? (5-minute triage vs. full due diligence)

Then provide actionable, prioritized recommendations that balance risk, cost, and opportunity.
