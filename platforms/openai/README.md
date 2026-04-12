# Sentinel Stack — OpenAI / ChatGPT Setup

## Option 1: Custom GPT

Create a Custom GPT with Sentinel Stack built in:

1. Go to [chat.openai.com](https://chat.openai.com) → Explore GPTs → Create
2. **Name**: "Sentinel Stack" (or your company name + "AI Governance")
3. **Instructions**: Paste the contents of `INSTRUCTIONS.md`
4. **Knowledge files**: Upload these files:
   - `skills/guardrails/SKILL.md`
   - `skills/guardrails/references/data-classification.md`
   - `skills/guardrails/references/review-gates.md`
   - `skills/ai-governance/SKILL.md`
   - `skills/ai-governance/references/ai-risk-tiers.md`
   - `skills/dlp-engine/SKILL.md`
   - `skills/risk-register/SKILL.md`
   - `skills/compliance-evidence/SKILL.md`
   - `config/org-config.example.yaml` (or your customized `org-config.yaml`)
   - Add any other skill files relevant to your use case

5. **Conversation starters**:
   - "Scan this document for sensitive data"
   - "Classify this AI use case by risk tier"
   - "Generate compliance evidence for our SOC 2 audit"
   - "Draft an AI acceptable use policy"
   - "Assess this AI vendor for risk"

## Option 2: ChatGPT Projects

1. Create a new Project in ChatGPT
2. Add `INSTRUCTIONS.md` as the project instructions
3. Upload skill files to the project's file storage
4. All conversations in the project will follow Sentinel Stack guidelines

## Option 3: API / Assistants

Use the OpenAI Assistants API with file search:

```python
from openai import OpenAI

client = OpenAI()

# Upload skill files
files = []
for skill_file in skill_paths:
    f = client.files.create(file=open(skill_file, "rb"), purpose="assistants")
    files.append(f.id)

# Create assistant with Sentinel Stack instructions
assistant = client.beta.assistants.create(
    name="Sentinel Stack",
    instructions=open("INSTRUCTIONS.md").read(),
    model="gpt-4o",
    tools=[{"type": "file_search"}],
    tool_resources={"file_search": {"vector_store_ids": [vector_store.id]}}
)
```

## Option 4: OpenAI Codex CLI

If using the OpenAI Codex CLI tool:

```bash
# Set INSTRUCTIONS.md as context
codex --instructions sentinel-stack/INSTRUCTIONS.md
```

## What Works / What Doesn't

| Feature | GPT Support | Notes |
|---------|-------------|-------|
| Guardrail scanning | ✅ Advisory | GPT follows instructions but can't enforce system-level blocks |
| 4-eyes review gates | ✅ Full | Appended to outputs as formatted blocks |
| AI governance classification | ✅ Full | EU AI Act tiers, transparency, oversight |
| DLP pattern detection | ✅ Advisory | GPT flags patterns but relies on instruction-following |
| Risk register | ✅ Full | Can maintain and update in conversation |
| Compliance evidence | ✅ Full | Generates SOC 2 / ISO artifacts |
| Policy drafting | ✅ Full | Templates and customization |
| CRM integration | ❌ Limited | No native MCP — use GPT Actions for API calls |
| File scanning | ✅ With upload | Upload files for GPT to scan |
| Behavioral baselines | ❌ No | Requires persistent state across sessions |
