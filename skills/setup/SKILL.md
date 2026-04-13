---
name: setup
description: Configure Sentinel Stack for your organization. Walks through company name, industry, jurisdiction, compliance frameworks, AI risk appetite, and escalation contact. Re-runnable — shows current values so you only change what you need. Run this once after installing, then again whenever your governance settings change.
---

# Sentinel Stack Setup Wizard

You are running the Sentinel Stack setup wizard. Your job is to collect answers to 6 questions and write a personalized `config/org-config.yaml` for this organization. The file already exists with generic defaults — you are overwriting it with the user's real values.

## Before You Start

Read the current `config/org-config.yaml`. Extract these current values to use as defaults in each question:
- `company.name`
- `company.domain`
- `company.industry`
- `company.jurisdiction`
- `compliance.frameworks`
- `ai_governance.risk_appetite`
- `guardrails.escalation_contact`

If the file is missing, use these defaults: name="Your Company", domain="your-company.com", industry="technology", jurisdiction="US", frameworks=["SOC2"], risk_appetite="moderate", escalation="compliance-team@your-company.com".

## Questions (ask one at a time, in order)

### Question 1 — Company name and domain

Ask: "What is your company name and website domain? (current: [company.name] / [company.domain])"

Accept free text. Parse out name and domain separately if the user provides both in one answer (e.g. "Acme Corp, acme.com"). If they provide only one, ask a follow-up for the other.

### Question 2 — Industry

Ask: "What industry are you in? (current: [company.industry])"

Present as multiple choice:
- A) Technology / SaaS
- B) Finance / Fintech
- C) Healthcare
- D) Legal
- E) Retail / E-commerce
- F) Other (ask them to specify)

Map answers to config values: A→"technology", B→"fintech", C→"healthcare", D→"legal", E→"retail", F→their text.

### Question 3 — Jurisdiction

Ask: "What is your primary legal jurisdiction? (current: [company.jurisdiction])"

Present as multiple choice:
- A) United States
- B) European Union
- C) United Kingdom
- D) India
- E) APAC
- F) Global (multiple jurisdictions)

Map answers to config values: A→"US", B→"EU", C→"UK", D→"India", E→"APAC", F→"Global".

### Question 4 — Compliance frameworks

Ask: "Which compliance frameworks does your organization follow? Select all that apply. (current: [compliance.frameworks])"

Present as multiple choice (can select more than one):
- A) SOC 2
- B) GDPR
- C) ISO 27001
- D) HIPAA
- E) NIST CSF
- F) PCI DSS
- G) None of the above

Map answers to config values: A→"SOC2", B→"GDPR", C→"ISO27001", D→"HIPAA", E→"NIST_CSF", F→"PCI-DSS". If G, set frameworks to [].

### Question 5 — AI risk appetite

Ask: "What is your organization's AI risk appetite? (current: [ai_governance.risk_appetite])"

Present as multiple choice:
- A) Minimal — conservative. High-risk AI requires board approval. (good for regulated industries)
- B) Moderate — balanced. High-risk AI requires documented review and dual sign-off.
- C) Permissive — growth-oriented. High-risk AI requires one reviewer and audit log.

Map answers to config values: A→"minimal", B→"moderate", C→"permissive".

Also update `oversight_levels` based on this answer:
- minimal: high_risk="board_approval", limited_risk="dual_human_review", minimal_risk="documented_review"
- moderate: high_risk="dual_human_review", limited_risk="documented_review", minimal_risk="monitoring_only"
- permissive: high_risk="documented_review", limited_risk="monitoring_only", minimal_risk="logging_only"

### Question 6 — Escalation contact

Ask: "Who should compliance and security escalations go to? Name, role, or email. (current: [guardrails.escalation_contact])"

Accept free text. Use the answer as the value for both `guardrails.admin_contact` and `guardrails.escalation_contact`, and for `audit_trail.alert_contacts.critical` and `audit_trail.alert_contacts.high`.

## After All Questions

1. Read the full current `config/org-config.yaml`
2. Update ONLY these fields with the user's answers (leave all other fields unchanged):
   - `company.name`
   - `company.domain`
   - `company.industry`
   - `company.jurisdiction`
   - `compliance.frameworks`
   - `ai_governance.risk_appetite`
   - `ai_governance.oversight_levels`
   - `guardrails.admin_contact`
   - `guardrails.escalation_contact`
   - `audit_trail.alert_contacts.critical`
   - `audit_trail.alert_contacts.high`
3. Write the updated YAML back to `config/org-config.yaml`
4. Print this confirmation summary:

```
Sentinel Stack configured for [company.name].

  Company:     [company.name] ([company.domain])
  Industry:    [company.industry]
  Jurisdiction: [company.jurisdiction]
  Frameworks:  [compliance.frameworks joined with ", "]
  Risk appetite: [ai_governance.risk_appetite]
  Escalation:  [guardrails.escalation_contact]

All 11 governance skills are now using your org config.
Run /sentinel-stack:setup again anytime to update these settings.
```
