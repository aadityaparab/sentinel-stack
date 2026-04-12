---
name: policy-drafter
description: AI policy template generator. Drafts acceptable use policies, data handling policies, AI ethics policies, vendor AI assessment policies. Uses org-config.yaml for company details and compliance frameworks. Outputs markdown or docx-ready format. Includes version control metadata. Use when building or updating governance documentation for your organization.
---

# Policy Drafter: AI Governance Policy Generation

This skill generates professional, compliance-ready governance policies customized to your organization. It uses your company details from config, applies relevant frameworks, and produces policies in multiple formats (markdown, docx, HTML).

## Policy Types

### 1. Acceptable Use Policy (AI)

**Purpose:** Define what employees can and cannot do with AI systems.

**Sections:**
- Scope (who, what systems)
- Permitted uses (categorized by risk tier)
- Prohibited uses (explicit list)
- Data handling requirements
- Approval processes
- Consequences for misuse

**Customization:**
- Company name and industry
- Specific AI tools in use (ChatGPT, Claude, Gemini, etc.)
- Risk tolerance
- Prohibited use cases
- Escalation contacts

**Output length:** 3-5 pages

### 2. Data Handling Policy

**Purpose:** Define how sensitive data is processed in AI workflows.

**Sections:**
- Data classification (client, personal, financial, legal, HR)
- Handling rules per data type
- Anonymization requirements
- Encryption standards
- Approved use cases
- Approval authorities
- Incident reporting

**Customization:**
- Industry-specific data types
- DLP thresholds
- GDPR/CCPA obligations
- Internal data governance standards

**Output length:** 4-6 pages

### 3. 4-Eyes Review Policy

**Purpose:** Define when and how decisions require dual approval.

**Sections:**
- Covered decision types (finance, legal, HR, production)
- Approval authorities by domain
- Escalation paths
- Review documentation
- Exceptions and emergency procedures
- Audit and monitoring

**Customization:**
- Company structure
- Approval authorities
- Escalation contacts
- Decision categories

**Output length:** 2-3 pages

### 4. AI Governance and Risk Management Policy

**Purpose:** Define organizational framework for AI risk assessment and mitigation.

**Sections:**
- AI risk classification (EU AI Act tiers)
- Assessment process
- High-risk system requirements
- Vendor AI assessment
- Compliance mapping
- Documentation and audit

**Customization:**
- Applicable frameworks (SOC 2, ISO 27001, GDPR)
- Risk appetite statement
- Organizational roles
- Decision authorities

**Output length:** 5-8 pages

### 5. Vendor AI Assessment Policy

**Purpose:** Evaluate third-party AI tools before adoption.

**Sections:**
- Assessment criteria
- Vendor questionnaire
- Data handling review
- Model transparency requirements
- Security and compliance review
- Risk scoring
- Decision process

**Customization:**
- Compliance frameworks
- Data sensitivity levels
- Organizational standards

**Output length:** 3-4 pages

### 6. AI Ethics Policy

**Purpose:** Set ethical standards for AI development and use.

**Sections:**
- Organizational values
- Fairness and bias mitigation
- Transparency and explainability
- Accountability structure
- Incident response for ethical violations
- Stakeholder engagement

**Customization:**
- Company values
- Industry standards
- Specific ethical concerns

**Output length:** 3-4 pages

### 7. Incident Response Policy (Governance)

**Purpose:** Define process for responding to compliance or governance incidents.

**Sections:**
- Incident definition
- Discovery and reporting
- Investigation process
- Escalation procedures
- Remediation and corrective actions
- Documentation and audit

**Customization:**
- Incident categories
- Escalation authorities
- Response timelines

**Output length:** 2-3 pages

---

## Policy Generation Workflow

### Step 1: Specify what you need

```
Policy Type: Acceptable Use Policy
Scope: All employees and contractors
Focus areas: Data protection, compliance, risk mitigation
Frameworks: GDPR, SOC 2, internal policies
Tone: Professional, clear, enforceable
```

### Step 2: Provide organization context

Read from `org-config.yaml`:
- Company name and domain
- Industry and jurisdiction
- Applicable compliance frameworks
- Data classification scheme
- Roles and authorities
- DLP thresholds
- Risk appetite

### Step 3: Generate policy

Drafts policy with:
- Organization name and context embedded
- Framework-specific language
- Role-based approval structures
- Data handling specifics
- Escalation paths matching your org
- Examples tailored to your industry

### Step 4: Customize and refine

Output includes:
- Markdown source (easy to edit)
- DOCX export ready
- Change tracking metadata
- Version history template

---

## Policy Structure Template

Each generated policy includes:

```markdown
# [Policy Title]

**Document ID:** POL-2026-001
**Version:** 1.0
**Effective Date:** [Date]
**Last Updated:** [Date]
**Owner:** [Role]
**Approvers:** [List]

## Purpose

[2-3 sentences explaining why this policy exists]

## Scope

Who this applies to: [roles/teams]
What it covers: [systems/processes]
Exclusions: [if any]

## Definitions

[Key terms used in policy]

## Policy Requirements

[Numbered requirements with accountability]

## Roles and Responsibilities

[Who does what]

## Approval and Escalation

[Decision authority, exceptions, appeals]

## Compliance and Monitoring

[How compliance is measured]

## Consequences

[What happens if policy is violated]

## Version History

| Version | Date | Author | Change |
|---------|------|--------|--------|
| 1.0 | [Date] | [Name] | Initial draft |

## Appendices

- A: Decision Authority Matrix
- B: Data Classification
- C: Forms and Templates
```

---

## Configuration-Driven Customization

Policies auto-generate with your settings:

```yaml
# From org-config.yaml
company:
  name: "Acme Corp"
  domain: "acme.com"
  industry: "Private Markets"
  jurisdiction: "US/EU"

compliance:
  frameworks: ["SOC2", "ISO27001", "GDPR"]
  
dlp:
  industry_pack: "private-markets"
  alert_threshold: 40
  block_threshold: 85

guardrails:
  admin_contact: "compliance@acme.com"
  approvers:
    finance: "CFO"
    legal: "General Counsel"
    hr: "CHRO"

ai_governance:
  risk_appetite: "limited"
  prohibited_uses: [
    "real-time_biometric_identification",
    "social_scoring",
    "employee_surveillance"
  ]
```

**Result:** Policy references your company, frameworks, roles, and specific standards.

---

## Output Formats

### Markdown (Source)
```
Easy to edit, version control-friendly
Export to: Confluence, GitHub, notion
Includes: Formatting, tables, citations
```

### DOCX (Word Document)
```
Ready for: Executive review, printing, external sharing
Includes: Professional formatting, table of contents
Export from: Markdown template
```

### HTML (Web)
```
Ready for: Internal wiki, learning management system
Includes: Responsive design, navigation
Export from: Markdown
```

### PDF (Archive)
```
Ready for: Audit submission, permanent record
Includes: Signatures, timestamps
Created from: DOCX
```

---

## Policy Review and Approval

Each generated policy includes approval template:

```markdown
## Approvals

| Role | Name | Date | Signature |
|------|------|------|-----------|
| Policy Owner | [Name] | __/__/__ | _________ |
| Compliance Officer | [Name] | __/__/__ | _________ |
| General Counsel | [Name] | __/__/__ | _________ |
| [Framework Owner] | [Name] | __/__/__ | _________ |
| Executive Sponsor | [Name] | __/__/__ | _________ |

**Version Control:**
- Draft: [Date] — [Author]
- Review: [Date] — [Reviewers]
- Approved: [Date] — [Approvers]
- Effective: [Date]
- Next Review: [Date + 1 year]
```

---

## Policy Maintenance

### Annual Review

Each policy should be reviewed annually:

```
Policy Review Checklist:
- [ ] Are frameworks still applicable?
- [ ] Has org structure changed?
- [ ] Are approval authorities still correct?
- [ ] Have compliance requirements changed?
- [ ] Are examples still relevant?
- [ ] Has incident history informed changes?
```

### Updating Policies

```
When you update a policy:
1. Increment version number
2. Note change in version history
3. Update effective date
4. Identify who approved change
5. Archive previous version
6. Communicate change to team
7. Update training materials
```

---

## Integration with Other Skills

- **guardrails**: Policies define the guardrails
- **ai-governance**: Governance policy integrates risk tiers
- **vendor-ai-risk**: Vendor assessment policy standardizes evaluation
- **compliance-evidence**: Policies are evidence of governance framework
- **audit-trail**: Policy updates logged for audit

---

## Output Format

Request policies in any combination:

```
Generate the following policies:
1. Acceptable Use Policy (for all staff)
2. Data Handling Policy (GDPR-focused)
3. 4-Eyes Review Policy (finance/legal/HR)
4. Vendor AI Assessment Policy (tool procurement)

Format: [Markdown | DOCX | HTML | All]
Customize for: [Your org context]
Include: [Signature blocks, version history, definitions]
```

**Result:** Professional, compliance-ready policies customized to your organization, ready for approval and deployment.
