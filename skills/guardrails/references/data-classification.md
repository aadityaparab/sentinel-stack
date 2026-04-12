# Data Classification Reference

This file defines what counts as each data type for the purposes of the guardrails skill.
Use it to classify data in both prompt text AND attached files before deciding whether to block, flag, or proceed.

---

## How to Use This File

The skill runs two passes — prompt text first, then files. Apply the same classification logic to both.
For files, scan structure (headers, sheet names, slide titles) before content — structure alone often reveals sensitivity.

---

## Client Data (Policy 1)

Client data is any information that is specific to a client or their assets.
The exact nature of client data varies by industry — configure hard-block patterns in `config/org-config.yaml`.

### Clearly Client Data — Always Hard Block if Identifiable

| Type | In Prompt Text | In Files (XLSX / PDF / PPTX) |
|------|---------------|------------------------------|
| Client / firm names | Named clients, account names, firm identifiers | Sheet names, column headers, or cell values with client identifiers; report headers; slide titles |
| Customer identifiers | Account IDs, customer codes, contract numbers | ID columns with populated values; customer schedule sheets |
| Financial figures tied to real entities | Revenue, pricing, metrics linked to a named client | Performance tables with entity columns populated |
| Internal system exports | Data exported directly from your internal tools | Structured exports with columns matching internal schemas |
| Client contact details | Names, emails, phone numbers of individuals at client firms | Contact sheets; CRM exports |

### Structural Fingerprints — File Patterns That Indicate Client Data

Even before reading cell values, these structural patterns strongly suggest client data:

**XLSX structural fingerprints:**
- Sheet names referencing clients, accounts, or domain-specific entities
- Column header combinations pairing entity names with financial metrics
- Pivot tables or named ranges referencing client entities

**PDF structural fingerprints:**
- Report-style layout with a firm/client name in the header or footer
- Tables with entity-specific column headers
- Watermarks or footers stating "Confidential" or "For [Name] Use Only"

**PPTX structural fingerprints:**
- Slide titles referencing real clients or accounts
- Logos or branding belonging to a client (not your org)
- Speaker notes referencing specific client details

### Acceptable Anonymized Equivalents

| Real data | Acceptable substitute |
|-----------|----------------------|
| "Acme Corp" | "Client A" or "SaaS Company — Mid-Market" |
| Specific revenue: $12.4M | "$[X]M" or a synthetic figure clearly labeled "example" |
| Named customer contact | "Contact 1 (VP Engineering)" |
| System export with real entities | Same export with entity columns replaced by "Entity A", "Entity B" |

**Rule of thumb:** If someone outside your org who read the prompt or file could identify the client, it must be anonymized before use.

---

## Personal Data (Policy 2)

Personal data is any information that identifies or could identify a living individual.

### Employee Personal Data

| Type | In Prompt Text | In Files | Sensitivity |
|------|---------------|----------|-------------|
| Name + role | "Jane Smith, Engineering Lead" | Name columns in HR exports | Medium |
| Compensation | Salary, equity, bonus amounts | Compensation columns with populated values | High |
| Performance ratings | Review scores, calibration ratings | Rating columns with individual names | High |
| Health / leave records | Medical leave details | Medical or absence tracking sheets | Very High |
| Demographic data | Gender, ethnicity, age, nationality | Diversity reporting sheets; HRIS exports | Very High |
| Home address / personal contact | Personal email, home address | Address or personal contact columns | High |

### Candidate Personal Data

| Type | In Files | Sensitivity |
|------|----------|-------------|
| CV / resume | Entire document is a CV; tracker with candidate work history | High |
| Interview scores | Feedback columns alongside candidate names | High |
| Salary expectations | Expected salary column in candidate tracker | High |
| Contact details | Pipeline tracker with email + phone columns | Medium |

### What is NOT Personal Data Under This Policy

- Job titles without names (e.g. "the Head of Engineering" in a general context)
- Team-level aggregates without individual identifiers
- Anonymized personas for user research
- Column headers without populated data (an empty template is not personal data)

---

## 4-Eyes-Required Outputs (Policy 3)

These cover outputs, not just inputs. If the output will feed directly into one of these actions, a second human must review.

### Finance
| Action | 4-Eyes Required? |
|--------|-----------------|
| Journal entry for ERP posting | Always |
| Financial statement shared externally | Always |
| Variance analysis for board/investor reporting | Always |
| Internal budget model or forecast | If shared externally |

### Legal
| Action | 4-Eyes Required? |
|--------|-----------------|
| Contract or NDA routed for e-signature | Always |
| Contract review shared with counterparty | Always |
| Legal response sent to regulator or third party | Always |
| Internal contract summary for reference | Not required |

### HR
| Action | 4-Eyes Required? |
|--------|-----------------|
| Offer letter submitted to candidate | Always |
| Compensation change submitted to HRIS | Always |
| Performance rating in formal review cycle | Always |
| Interview question guide used internally | Not required |

### Data / Engineering
| Action | 4-Eyes Required? |
|--------|-----------------|
| SQL query against live production | Always |
| Dashboard shared with external stakeholders | If contains client/financial data |
| Schema documentation for internal use | Not required |

---

## Quick Classification Card

Run through this in order for both prompt text and every attached file:

1. **Does it name a specific client or customer?** → Policy 1 (Client Data) — Hard block
2. **Does it contain financial instrument identifiers?** → Policy 1 — Hard block
3. **Does it identify a specific real individual by name + any other attribute?** → Policy 2 (Personal Data)
4. **Is it an internal system export with entity identifiers?** → Policy 1 — Hard block
5. **Will the output feed directly into a finance, legal, HR, or production system?** → Policy 3 (4-Eyes Gate)
6. **None of the above** → No guardrail triggered, proceed normally
