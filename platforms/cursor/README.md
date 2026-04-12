# Sentinel Stack — Cursor / Windsurf / IDE Setup

Works with any AI-powered IDE that supports custom instructions or rules files.

## Cursor

### Project-level rules

Create `.cursor/rules` in your project root:

```bash
mkdir -p .cursor
cp sentinel-stack/INSTRUCTIONS.md .cursor/rules/sentinel-stack.md
```

Or add to `.cursorrules` in your project root:

```
@sentinel-stack See INSTRUCTIONS.md for AI governance and compliance rules.
Always check for sensitive data before processing requests.
Append 4-eyes review gates to financial, legal, HR, and production outputs.
```

### Workspace context

Add skill files to Cursor's context by referencing them:
```
@file:sentinel-stack/skills/guardrails/SKILL.md
@file:sentinel-stack/skills/ai-governance/SKILL.md
```

## Windsurf

### Cascade rules

Add to `.windsurfrules` in your project:

```
Follow the AI governance and compliance instructions in sentinel-stack/INSTRUCTIONS.md.
Before processing sensitive data, apply the guardrails from sentinel-stack/skills/guardrails/SKILL.md.
```

### Memory

Add Sentinel Stack principles to Windsurf's memory for persistent context across sessions.

## Zed

Add to `.zed/settings.json`:

```json
{
  "assistant": {
    "default_model": {
      "provider": "anthropic",
      "model": "claude-sonnet-4-5-20250514"
    },
    "system_prompt": "Follow the Sentinel Stack instructions for AI governance..."
  }
}
```

## VS Code + Continue

Add to `.continue/config.json`:

```json
{
  "systemMessage": "You are operating with the Sentinel Stack...",
  "docs": [
    {
      "title": "Sentinel Stack",
      "startUrl": "sentinel-stack/INSTRUCTIONS.md"
    }
  ]
}
```

## General Pattern for Any IDE

Most AI-powered IDEs support one of these mechanisms:

1. **Rules file** in project root (`.cursorrules`, `.windsurfrules`, etc.)
2. **System instructions** in settings
3. **Context files** that can be referenced or @-mentioned
4. **Custom prompts/templates** for specific workflows

The approach is the same for all:
1. Point the IDE at `INSTRUCTIONS.md` as the base instructions
2. Reference individual `SKILL.md` files when doing specific tasks
3. Keep `config/org-config.yaml` accessible for org-specific settings

## What Works Everywhere

| Feature | IDE Support | Notes |
|---------|-------------|-------|
| Guardrail awareness | ✅ Advisory | Model follows instructions when provided as context |
| 4-eyes review gates | ✅ Full | Text-based, works in any output |
| AI governance | ✅ Full | Classification and policy checks |
| Code review with DLP | ✅ Good | Flags secrets, PII, credentials in code |
| Policy drafting | ✅ Full | Markdown-based, works everywhere |
| CRM integration | ❌ | IDE tools typically don't have CRM access |
| File scanning | ✅ Partial | Can scan files open in the editor |
