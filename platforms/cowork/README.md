# Sentinel Stack — Claude Cowork Setup

Sentinel Stack ships as a native Claude plugin. Once installed, all 11 skills are available in Cowork with `/sentinel-stack:skill-name` syntax.

## Install

### Option 1: From GitHub (recommended)

1. Open the Claude Desktop app and switch to the **Cowork** tab
2. Click **Customize** in the left sidebar
3. Click **Browse plugins → Add marketplace**
4. Enter:

   ```text
   https://github.com/aadityaparab/sentinel-stack
   ```

5. Find **sentinel-stack** in the catalog and click **Install**

All 11 skills load automatically. No zip needed.

Or from the Claude Code CLI:

```bash
/plugin marketplace add https://github.com/aadityaparab/sentinel-stack
/plugin install sentinel-stack@sentinel-stack
```

### Option 2: Local install

Clone or copy the repo to your machine, then in Cowork:

1. **Settings → Plugins → Add Local Plugin**
2. Point to the `sentinel-stack/` directory
3. Cowork reads `.claude-plugin/plugin.json` and registers all skills

## Available Skills

After install, invoke skills with `/sentinel-stack:skill-name`:

| Skill | Invoke | Trigger |
|-------|--------|---------|
| Guardrails | `/sentinel-stack:guardrails` | Client data, personal data, financial records, HR decisions |
| DLP Engine | `/sentinel-stack:dlp-engine` | Data classification, content scanning, sensitivity scoring |
| AI Governance | `/sentinel-stack:ai-governance` | EU AI Act, AI risk tier, model governance |
| Risk Register | `/sentinel-stack:risk-register` | Risk assessment, risk matrix, risk appetite |
| Compliance Evidence | `/sentinel-stack:compliance-evidence` | SOC 2, ISO 27001, audit artifacts |
| Audit Trail | `/sentinel-stack:audit-trail` | Audit logs, compliance trail, interaction history |
| Policy Drafter | `/sentinel-stack:policy-drafter` | AI use policy, data handling policy |
| Vendor AI Risk | `/sentinel-stack:vendor-ai-risk` | Third-party AI tool evaluation |
| Decision Audit | `/sentinel-stack:decision-audit` | Governance decision quality review |
| First Principles | `/sentinel-stack:first-principles` | Novel governance reasoning |
| Caveman | `/sentinel-stack:caveman` | Token-efficient mode |

## Always-On Guardrails in Cowork

Unlike Claude Code (which reads `CLAUDE.md` to auto-trigger skills), Cowork requires explicit invocation. To replicate the always-on guardrail behavior, add this to your Cowork project instructions:

```
You are operating with Sentinel Stack AI governance.

Before processing any request involving:
- Client data or personal data → invoke /sentinel-stack:guardrails
- Financial records, legal documents, HR decisions → invoke /sentinel-stack:guardrails
- AI use case evaluation → invoke /sentinel-stack:ai-governance
- Data classification → invoke /sentinel-stack:dlp-engine

Read config/org-config.yaml for organization-specific thresholds and escalation contacts.
```

Go to **Project Settings → Instructions** in Cowork and paste the above.

## Differences from Claude Code

| Behavior | Claude Code | Cowork |
|----------|------------|--------|
| Guardrails auto-trigger | Yes (via `CLAUDE.md`) | Manual or via project instructions |
| Skill invocation | `/skill-name` | `/sentinel-stack:skill-name` |
| Config loading | Auto (reads `config/org-config.yaml`) | Reference in project instructions |
| Caveman mode always-on | Yes (via `CLAUDE.md`) | Add to project instructions if desired |

## Troubleshooting

**"SKILL.md must start with YAML frontmatter"**
All skills now have YAML frontmatter. If you see this error, ensure you're on the latest version of this repo (v1.0.1+).

**Skills not appearing after install**
Check that `.claude-plugin/plugin.json` exists in the repo root. Cowork requires this file to discover skills.

**Skill invocation not recognized**
Use the full namespaced form: `/sentinel-stack:guardrails`, not `/guardrails`. In Cowork, all plugin skills are namespaced by the plugin name from `plugin.json`.
