# Setup Skill + Smart Defaults Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship a smart-defaults `org-config.yaml` and a `/sentinel-stack:setup` skill so any public user who installs the plugin gets working governance immediately, with a guided wizard to personalize it — no Cowork Customize flow needed.

**Architecture:** Two deliverables: (1) a real `config/org-config.yaml` with generic defaults that ship with the plugin, and (2) a new `skills/setup/SKILL.md` that walks users through customizing that file in place. A one-line nudge in `skills/guardrails/SKILL.md` surfaces setup discovery to unconfigured users. The plugin.json and marketplace.json are updated to register the new skill and bump the version.

**Tech Stack:** YAML (config), Markdown (skills), JSON (plugin manifest)

---

## File Map

| Action | File | Purpose |
|--------|------|---------|
| Modify | `config/org-config.yaml` | Replace placeholder with smart defaults that work for any company |
| Create | `skills/setup/SKILL.md` | New re-runnable setup wizard skill |
| Modify | `skills/guardrails/SKILL.md` | Add one-line nudge if company name is still default |
| Modify | `.claude-plugin/plugin.json` | Register `skills/setup` in skills list, bump to v1.1.0 |
| Modify | `.claude-plugin/marketplace.json` | Bump plugin version to v1.1.0 |

---

## Task 1: Smart defaults `org-config.yaml`

**Files:**
- Modify: `config/org-config.yaml`

- [ ] **Step 1: Verify current state of org-config.yaml**

```bash
cat config/org-config.yaml
```

Expected: either missing or contains example/placeholder content. If it already has real company data, stop and check with the user before overwriting.

- [ ] **Step 2: Write smart defaults**

Replace the full contents of `config/org-config.yaml` with:

```yaml
# Sentinel Stack — Default Organization Configuration
# Run /sentinel-stack:setup to personalize for your organization.
# This file is safe to edit directly. It drives all 11 governance skills.

---
# Company Identity
company:
  name: "Your Company"
  domain: "your-company.com"
  industry: "technology"
  description: "A technology company"
  jurisdiction: "US"
  hq_location: "United States"

# Data Loss Prevention
dlp:
  industry_pack: "default"
  alert_threshold: 40
  block_threshold: 80
  redact_secrets: true
  custom_patterns: []

# Guardrails
guardrails:
  policies_enabled:
    policy_1_no_client_data: true
    policy_2_privacy_data: true
    policy_3_four_eyes_review: true
  admin_contact: "compliance-team@your-company.com"
  escalation_contact: "compliance-team@your-company.com"
  approvers:
    finance:
      primary: "CFO"
      escalation: "CEO"
    legal:
      primary: "General Counsel"
      escalation: "CEO"
    hr:
      primary: "Chief People Officer"
      escalation: "CEO"
    production:
      primary: "VP Engineering"
      escalation: "CTO"

# AI Governance
ai_governance:
  risk_appetite: "moderate"
  prohibited_uses:
    - "real-time_biometric_identification"
    - "social_scoring"
    - "automated_individual_profiling"
    - "employee_surveillance"
  transparency_requirements:
    high_risk: ["user_disclosure", "explainability", "human_appeal"]
    limited_risk: ["user_disclosure", "documentation"]
    minimal_risk: []
  oversight_levels:
    high_risk: "dual_human_review"
    limited_risk: "documented_review"
    minimal_risk: "monitoring_only"
  high_risk_approvers:
    - role: "Chief Information Officer"
      authority: "Data handling and security"
    - role: "General Counsel"
      authority: "Regulatory and legal risk"

# Compliance Frameworks
compliance:
  frameworks:
    - "SOC2"
  optional_frameworks:
    - "ISO27001"
    - "GDPR"
    - "NIST_CSF"
  retention_days: 2555
  critical_retention_days: 3650
  annual_audit: true
  quarterly_risk_review: true
  monthly_compliance_report: false

# Audit Trail
audit_trail:
  retention_days: 2555
  retention_critical_days: 3650
  archive_after_days: 365
  event_retention:
    incident_reported: 3650
    dlp_scan: 2555
    guardrail_decision: 2555
    config_changed: 730
  alerts_enabled: true
  alert_contacts:
    critical: "compliance-team@your-company.com"
    high: "compliance-team@your-company.com"

# Data Classification
data_classification:
  client_data:
    examples: ["customer names", "account identifiers", "customer-specific data"]
    handling_requirement: "never_share_with_external_ai"
  personal_data:
    examples: ["employee names", "salaries", "performance ratings"]
    handling_requirement: "minimize_use_in_ai"
  financial_data:
    examples: ["revenue", "expenses", "bank accounts"]
    handling_requirement: "never_share_without_anonymization"
  legal_data:
    examples: ["contracts", "NDAs", "intellectual property"]
    handling_requirement: "sensitive_review_required"
  internal_data:
    examples: ["strategy", "roadmaps", "internal metrics"]
    handling_requirement: "internal_only"

# Risk Management
risk_management:
  risk_assessment_frequency: "quarterly"
  risk_acceptance_authority: "Compliance Officer"
  risk_acceptance_max_score: 9
  escalation_score_high: 16
  escalation_score_medium: 9

# Integrations
integrations:
  siem_enabled: false
  siem_platform: ""
  incident_tracking_enabled: false
  incident_tracking_system: ""
  compliance_automation_enabled: false

# Development
development:
  apply_guardrails_in_dev: false
  apply_dlp_in_dev: true
  allow_sandbox_testing: true
  sandbox_data_requirements: "anonymized_only"
```

- [ ] **Step 3: Validate YAML is parseable**

```bash
python3 -c "import yaml; yaml.safe_load(open('config/org-config.yaml'))" && echo "VALID"
```

Expected: `VALID`

- [ ] **Step 4: Commit**

```bash
git add config/org-config.yaml
git commit -m "feat: ship smart-default org-config.yaml with generic baseline settings"
```

---

## Task 2: Create `/sentinel-stack:setup` skill

**Files:**
- Create: `skills/setup/SKILL.md`

- [ ] **Step 1: Create the skill directory**

```bash
mkdir -p skills/setup
```

- [ ] **Step 2: Write SKILL.md**

Create `skills/setup/SKILL.md` with:

````markdown
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
````

- [ ] **Step 3: Verify frontmatter is valid**

```bash
python3 -c "
import re
content = open('skills/setup/SKILL.md').read()
match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
assert match, 'No frontmatter found'
import yaml
fm = yaml.safe_load(match.group(1))
assert 'name' in fm, 'Missing name field'
assert 'description' in fm, 'Missing description field'
print('VALID:', fm['name'])
"
```

Expected: `VALID: setup`

- [ ] **Step 4: Commit**

```bash
git add skills/setup/SKILL.md
git commit -m "feat: add /sentinel-stack:setup re-runnable configuration wizard"
```

---

## Task 3: Add guardrails nudge

**Files:**
- Modify: `skills/guardrails/SKILL.md`

- [ ] **Step 1: Open guardrails skill and find the config read line**

The line to find is near the top of the skill body (after the frontmatter):

```
Read `config/org-config.yaml` for organization-specific settings (company name, industry, escalation contacts, DLP thresholds). If no config exists, use sensible defaults and inform the user they should configure their org settings.
```

- [ ] **Step 2: Add nudge immediately after that line**

Replace:

```
Read `config/org-config.yaml` for organization-specific settings (company name, industry, escalation contacts, DLP thresholds). If no config exists, use sensible defaults and inform the user they should configure their org settings.
```

With:

```
Read `config/org-config.yaml` for organization-specific settings (company name, industry, escalation contacts, DLP thresholds). If no config exists, use sensible defaults and inform the user they should configure their org settings.

If `config/org-config.yaml` exists and `company.name` is still `"Your Company"` (the shipped default), surface this nudge once before proceeding: "Run /sentinel-stack:setup to personalize governance for your organization." Then continue with the guardrail assessment normally.
```

- [ ] **Step 3: Verify the edit looks right**

```bash
head -20 skills/guardrails/SKILL.md
```

Expected: frontmatter block, then `# Data Governance Guardrail` heading, then the config read paragraph, then the nudge paragraph.

- [ ] **Step 4: Commit**

```bash
git add skills/guardrails/SKILL.md
git commit -m "feat: surface /sentinel-stack:setup nudge when org config is still default"
```

---

## Task 4: Register setup skill and bump version

**Files:**
- Modify: `.claude-plugin/plugin.json`
- Modify: `.claude-plugin/marketplace.json`

- [ ] **Step 1: Add setup to plugin.json skills list and bump version**

Open `.claude-plugin/plugin.json`. It currently reads:

```json
{
  "name": "sentinel-stack",
  "version": "1.0.0",
  "description": "...",
  "skills": [
    "skills/guardrails",
    "skills/dlp-engine",
    ...
  ]
}
```

Add `"skills/setup"` as the first entry in the skills array, and change `"version"` to `"1.1.0"`:

```json
{
  "name": "sentinel-stack",
  "version": "1.1.0",
  "description": "AI governance toolkit — DLP scanning, data guardrails, risk register, compliance evidence, audit trail, and EU AI Act classification embedded in your workflow.",
  "skills": [
    "skills/setup",
    "skills/guardrails",
    "skills/dlp-engine",
    "skills/ai-governance",
    "skills/risk-register",
    "skills/compliance-evidence",
    "skills/audit-trail",
    "skills/policy-drafter",
    "skills/vendor-ai-risk",
    "skills/decision-audit",
    "skills/first-principles",
    "skills/caveman"
  ]
}
```

- [ ] **Step 2: Verify plugin.json is valid JSON**

```bash
python3 -c "import json; json.load(open('.claude-plugin/plugin.json')); print('VALID')"
```

Expected: `VALID`

- [ ] **Step 3: Bump version in marketplace.json**

Open `.claude-plugin/marketplace.json`. Find the plugin entry for `"sentinel-stack"` and change its `"version"` from `"1.0.0"` to `"1.1.0"`:

```json
{
  "name": "sentinel-stack",
  "version": "1.1.0",
  ...
}
```

- [ ] **Step 4: Verify marketplace.json is valid JSON**

```bash
python3 -c "import json; json.load(open('.claude-plugin/marketplace.json')); print('VALID')"
```

Expected: `VALID`

- [ ] **Step 5: Commit and push**

```bash
git add .claude-plugin/plugin.json .claude-plugin/marketplace.json
git commit -m "chore: register setup skill and bump version to 1.1.0"
git push origin main
```

Expected output ends with: `main -> main`

---

## Task 5: Smoke test end-to-end

- [ ] **Step 1: Verify all skill SKILL.md files have valid frontmatter**

```bash
python3 -c "
import os, re, yaml

skills_dir = 'skills'
errors = []
for skill in os.listdir(skills_dir):
    path = os.path.join(skills_dir, skill, 'SKILL.md')
    if not os.path.exists(path):
        errors.append(f'{skill}: SKILL.md missing')
        continue
    content = open(path).read()
    match = re.match(r'^---\n(.*?)\n---', content, re.DOTALL)
    if not match:
        errors.append(f'{skill}: no frontmatter')
        continue
    try:
        fm = yaml.safe_load(match.group(1))
        if 'description' not in fm:
            errors.append(f'{skill}: missing description field')
    except Exception as e:
        errors.append(f'{skill}: invalid YAML - {e}')

if errors:
    for e in errors:
        print('FAIL:', e)
else:
    print(f'PASS: all {len(os.listdir(skills_dir))} skills have valid frontmatter')
"
```

Expected: `PASS: all 12 skills have valid frontmatter`

- [ ] **Step 2: Verify plugin.json lists all 12 skills**

```bash
python3 -c "
import json
manifest = json.load(open('.claude-plugin/plugin.json'))
skills = manifest['skills']
print(f'Version: {manifest[\"version\"]}')
print(f'Skills ({len(skills)}):')
for s in skills:
    print(f'  {s}')
assert len(skills) == 12, f'Expected 12 skills, got {len(skills)}'
assert 'skills/setup' in skills, 'setup skill not registered'
print('PASS')
"
```

Expected: version `1.1.0`, 12 skills listed, `PASS`

- [ ] **Step 3: Verify org-config.yaml has all required top-level keys**

```bash
python3 -c "
import yaml
config = yaml.safe_load(open('config/org-config.yaml'))
required = ['company', 'dlp', 'guardrails', 'ai_governance', 'compliance', 'audit_trail', 'data_classification', 'risk_management', 'integrations', 'development']
missing = [k for k in required if k not in config]
if missing:
    print('FAIL: missing keys:', missing)
else:
    print('PASS: all required keys present')
    print('Company name:', config['company']['name'])
"
```

Expected: `PASS: all required keys present` / `Company name: Your Company`
