# Sentinel Stack — Google Gemini Setup

## Option 1: Google AI Studio (Gems)

Create a Gem with Sentinel Stack instructions:

1. Go to [aistudio.google.com](https://aistudio.google.com)
2. Create a new Gem
3. **System Instructions**: Paste the contents of `INSTRUCTIONS.md`
4. Upload key skill files as context documents:
   - `skills/guardrails/SKILL.md`
   - `skills/ai-governance/SKILL.md`
   - `skills/dlp-engine/SKILL.md`
   - `config/org-config.example.yaml`
5. Save and use

## Option 2: Gemini API with System Instructions

```python
import google.generativeai as genai

genai.configure(api_key="YOUR_API_KEY")

# Load instructions
with open("INSTRUCTIONS.md") as f:
    instructions = f.read()

# Load relevant skills as context
skills_context = ""
for skill_path in skill_files:
    with open(skill_path) as f:
        skills_context += f"\n---\n# {skill_path}\n{f.read()}"

model = genai.GenerativeModel(
    model_name="gemini-2.0-flash",
    system_instruction=instructions + "\n\n" + skills_context
)

chat = model.start_chat()
response = chat.send_message("Classify this AI use case by risk tier...")
```

## Option 3: Google Workspace (Gemini for Workspace)

If your org uses Gemini in Google Workspace:

1. Use Gemini in Docs/Sheets with Sentinel Stack prompts
2. Paste the relevant skill instructions when starting a task
3. Reference `org-config.yaml` settings manually

## Option 4: Vertex AI Agent Builder

For enterprise deployments:

1. Create a new Agent in Vertex AI Agent Builder
2. Set `INSTRUCTIONS.md` as the agent's system prompt
3. Upload skill files to the agent's data store
4. Configure grounding with your org's data sources

## What Works / What Doesn't

| Feature | Gemini Support | Notes |
|---------|---------------|-------|
| Guardrail scanning | ✅ Advisory | Follows instructions in system prompt |
| 4-eyes review gates | ✅ Full | Appended to outputs |
| AI governance classification | ✅ Full | Risk tiers and oversight requirements |
| DLP pattern detection | ✅ Advisory | Instruction-following based |
| Risk register | ✅ Full | Conversation-based tracking |
| Compliance evidence | ✅ Full | Framework-mapped artifacts |
| Policy drafting | ✅ Full | Template-based generation |
| File scanning | ✅ With upload | Gemini can process uploaded documents |
| Google Workspace integration | ✅ Native | Works with Docs, Sheets, Slides |
| MCP/CRM integration | ❌ Limited | Use Vertex AI extensions for API calls |
