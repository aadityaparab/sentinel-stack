# Design: Setup Skill + Smart Defaults

**Date:** 2026-04-14
**Status:** Approved
**Scope:** sentinel-stack plugin

---

## Problem

When a user installs `sentinel-stack` from the GitHub marketplace and runs Cowork's built-in "Customize" flow, it creates a duplicate plugin entry (two `sentinel-stack` entries in Cowork). This happens because Cowork's Customize flow outputs a new `.plugin` file with the same `name: sentinel-stack` as the already-installed version, and Cowork installs it as a second entry rather than replacing the first.

The deeper issue: the plugin relies on an external flow (Cowork Customize) for a core requirement (org config). Building setup into the plugin eliminates the dependency and the duplicate problem entirely.

---

## Solution: A + C

Two changes, designed to work together:

1. **Smart defaults `org-config.yaml`** — ship a real config that works out of the box for any company
2. **`/sentinel-stack:setup` skill** — a re-runnable wizard that personalizes the config in place

---

## Section 1: Smart Defaults `org-config.yaml`

Replace `config/org-config.yaml` (currently empty/missing) with a file that ships as part of the plugin and contains sensible generic defaults.

### Default values

| Field | Default |
|-------|---------|
| `company.name` | `"Your Company"` |
| `company.domain` | `"your-company.com"` |
| `company.industry` | `"technology"` |
| `company.jurisdiction` | `"US"` |
| `compliance.frameworks` | `["soc2"]` |
| `governance.risk_appetite` | `"moderate"` |
| `dlp.alert_threshold` | `40` |
| `dlp.block_threshold` | `80` |
| `escalation.primary` | `"compliance-team@your-company.com"` |
| `ai_governance.high_risk_requires_human_review` | `true` |
| `ai_governance.limited_risk_requires_disclosure` | `true` |

### Behavior

- Plugin works immediately on install with no setup required
- All 11 existing skills read from this file unchanged — no skill modifications needed
- If `company.name` is still `"Your Company"` (unmodified), guardrails skill surfaces a one-line nudge: `"Run /sentinel-stack:setup to personalize governance for your organization."`

---

## Section 2: `/sentinel-stack:setup` Skill

A re-runnable conversational wizard that writes `org-config.yaml` directly into the plugin's `config/` directory.

### Questions (in order)

1. **Company name + domain** — "What is your company name and website domain?"
2. **Industry** — multiple choice: Technology / Finance / Healthcare / Legal / Retail / Other
3. **Jurisdiction** — multiple choice: US / EU / UK / India / APAC / Global
4. **Compliance frameworks** — multiple select: SOC 2 / GDPR / ISO 27001 / HIPAA / NIST CSF / PCI DSS
5. **AI risk appetite** — multiple choice: Minimal (conservative) / Moderate / Permissive
6. **Escalation contact** — "Who should compliance and security escalations go to? (name or email)"

### Re-run behavior

- On re-run, detect existing `org-config.yaml` and pre-fill each question with the current value
- User sees: `"Current value: Authlyx — press Enter to keep, or type a new value"`
- On completion, overwrite `org-config.yaml` in place
- Print a confirmation summary of all saved values

### File write target

```
<plugin-root>/config/org-config.yaml
```

The skill resolves `<plugin-root>` from its own file path at runtime — no hardcoded paths.

### Completion message

```
Sentinel Stack configured for [Company Name].
Active frameworks: [list]
Escalation: [contact]

Your governance guardrails are now live. All 11 skills are using your org config.
```

---

## Section 3: Integration with Existing Skills

No changes to any of the 11 existing skills except one addition to guardrails:

**`skills/guardrails/SKILL.md`** — add at the top, before any other logic:

```
If config/org-config.yaml contains company.name = "Your Company" (the default),
surface this nudge once per session:
"Run /sentinel-stack:setup to personalize governance for your organization."
Then proceed normally with the guardrail assessment.
```

All other skills (`dlp-engine`, `ai-governance`, `risk-register`, etc.) already read from `config/org-config.yaml`. With smart defaults always present, they work without any changes.

---

## What This Fixes

| Problem | Fix |
|---------|-----|
| Cowork Customize creates duplicate plugin | Setup is now built-in — no external Customize flow needed |
| Plugin breaks if `org-config.yaml` is missing | Smart defaults always present |
| No onboarding for new public users | `/sentinel-stack:setup` guides them through config |
| Can't update config without reinstalling | Setup skill is re-runnable at any time |

---

## Out of Scope

- No changes to the marketplace.json or plugin.json
- No changes to skills other than the one guardrails nudge
- No UI or web components
- No automated migration of existing customized configs (users re-run setup)
