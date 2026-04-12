# Sentinel Stack

**Open-source AI governance for every LLM.**

10 specialized agents that embed DLP, EU AI Act compliance, and real-time audit evidence into your AI workflows — so compliance happens automatically, not after the fact.

Works with **Claude, GPT-4, Gemini, Copilot, Cursor**, and any model that reads markdown.

> *"Compliance isn't something you do separately. It's a byproduct of doing your work through guardrails."*

---

## The Problem

Every company using AI is sitting on a ticking compliance clock.

- The **EU AI Act** is enforceable. High-risk AI systems need risk classification, human oversight documentation, and transparency disclosures.
- **SOC 2 auditors** are asking about AI controls for the first time — and most companies don't have answers.
- **CISOs** want to know what data is flowing into which models. GRC analysts are drowning in spreadsheets documenting it all after the fact.
- **Nobody wants to slow down.** Teams are shipping with AI and compliance is chasing them with a clipboard.

## The Approach

Sentinel Stack takes a fundamentally different approach: **governance is embedded in the workflow, not bolted on after.**

Every AI interaction passes through a DLP engine and compliance guardrails. Every blocked request automatically becomes audit evidence that your controls work. Every 4-eyes review gate becomes segregation-of-duties proof. Every scan — even the clean ones — becomes evidence that your monitoring is active.

You don't "do GRC" separately. It happens because your AI workflows run through Sentinel Stack.

---

## The 11 Skills

### Always-On Protection
| Skill | What it does |
|-------|-------------|
| **guardrails** | Scans every prompt and file for sensitive data before processing. Hard blocks on client data and financial identifiers. Soft blocks with clarification for ambiguous cases. Enforces GDPR/privacy handling. Appends 4-eyes review gates to high-stakes outputs. Emits compliance signals on every decision. |
| **dlp-engine** | 3-tier sensitivity scoring engine. Tier 1: regex pattern matching (SSNs, API keys, credentials). Tier 2: industry classifiers (private markets, healthcare, fintech, legal). Tier 3: behavioral baselines (anomalous request size, off-hours, new provider). Produces a 0-100 score → allow / log / alert / redact / block. |

### AI Governance
| Skill | What it does |
|-------|-------------|
| **ai-governance** | Classifies AI use cases by EU AI Act risk tier (Unacceptable / High / Limited / Minimal). Enforces your AI acceptable use policy. Determines transparency obligations — when must users know they're interacting with AI? Specifies meaningful human oversight requirements for high-risk systems. Tags AI-generated content with data lineage metadata. |
| **vendor-ai-risk** | Evaluates third-party AI tools across 5 dimensions: security, privacy, AI-specific risks (bias, hallucination, transparency), contractual requirements (DPA, liability, SLAs), and regulatory compliance. Quick triage mode (5 min) and deep assessment mode (full due diligence). Produces a scored risk card with go/no-go recommendation. |

### Compliance Automation
| Skill | What it does |
|-------|-------------|
| **compliance-evidence** | Auto-generates framework-mapped evidence from normal guardrail operations. Every DLP block → Data Classification control evidence. Every 4-eyes gate → Segregation of Duties proof. Maps to SOC 2 Type II, ISO 27001, NIST CSF, and GDPR Article 30. Generates evidence packages on demand for auditors. |
| **risk-register** | Living risk register that auto-populates from guardrail detections. Every hard block, soft block, and behavioral anomaly becomes a risk entry. 5×5 likelihood-impact scoring. Categorizes across Data Privacy, AI Ethics, Regulatory, Operational, Reputational, Financial. Tracks treatment (accept/mitigate/transfer/avoid) with owner assignment. Trend analysis and board-ready reports. |
| **audit-trail** | Structured JSON-lines logs from every guardrail decision, DLP scan, 4-eyes review, and AI-assisted output. Ready for SIEM ingestion (Splunk, ELK, Datadog). Retention guidance by regulation (GDPR, SOC 2, HIPAA). Generates audit reports by time period, framework, or event type. |
| **policy-drafter** | Drafts organizational AI policies: Acceptable Use, Data Handling, Third-Party AI Vendor, and Incident Response. Pre-fills with sensible defaults based on your industry and jurisdiction. Flags sections that must be customized. Includes version control, review cadence, and approval workflow. |

### Decision Support
| Skill | What it does |
|-------|-------------|
| **decision-audit** | Audits governance decisions for data quality, logical consistency, and strategic alignment. Validates that risk assessments are evidence-based. Flags assumptions and gaps. Useful for documenting why AI governance decisions were made the way they were. |
| **first-principles** | Structured problem decomposition from fundamental assumptions. Useful for policy design, risk modeling, and evaluating whether existing controls address the actual risk or just the perceived one. |

### Efficiency

| Skill | What it does |
|-------|-------------|
| **caveman** | Always-on token-efficient mode. Compresses conversational prose ~65–75% (status updates, explanations, tool preambles) while keeping policies, risk register entries, audit logs, compliance evidence, DLP classifications, AI risk tiers, code, and regulation citations at full audit-grade fidelity. Adapted from [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) (MIT). Disable per-session with "verbose" or "normal mode". |

---

## Works With Every Major AI Platform

| Platform | How | Guide |
|----------|-----|-------|
| **Claude Code** | `claude --with sentinel-stack/CLAUDE.md` | Native — full skill routing |
| **Claude Desktop** | Add skills to `.claude/skills/` | Native skill support |
| **GitHub Copilot** | `.github/copilot-instructions.md` | [platforms/copilot/](platforms/copilot/) |
| **OpenAI / ChatGPT** | Custom GPT or Projects | [platforms/openai/](platforms/openai/) |
| **Google Gemini** | Gems or Vertex AI | [platforms/gemini/](platforms/gemini/) |
| **Cursor / Windsurf** | Rules files or context | [platforms/cursor/](platforms/cursor/) |
| **Any LLM** | `INSTRUCTIONS.md` as system prompt | Universal |

The skills are plain markdown. Any model that can read context can follow them.

---

## Quick Start

```bash
git clone https://github.com/aadityaparab/sentinel-stack.git
cd sentinel-stack
bash scripts/setup.sh
```

### Claude Code
```bash
claude --with sentinel-stack/CLAUDE.md
```

### GitHub Copilot
```bash
cp platforms/copilot/.github/copilot-instructions.md your-repo/.github/
```

### OpenAI Custom GPT
Upload `INSTRUCTIONS.md` + skill files as knowledge — see [platforms/openai/](platforms/openai/)

### Any LLM
Load `INSTRUCTIONS.md` as your system prompt. Load individual skill files as context when needed.

---

## How It Works

```
User Request
    │
    ▼
┌──────────────────────────────────────────┐
│  Guardrails (always-on)                  │
│  ├── Scan prompt + attached files        │
│  ├── DLP engine scores sensitivity       │
│  └── Emit compliance signal ─────────────┼──→ Risk Register (auto-entry)
│                                          │──→ Compliance Evidence (auto-mapped)
│                                          │──→ Audit Trail (auto-logged)
└──────────────────────────────────────────┘
    │
    ├── HARD BLOCK → stop, log incident, explain how to re-submit
    ├── SOFT BLOCK → ask specific clarifying question, log
    └── CLEAN → proceed
         │
         ▼
    AI produces output
         │
         ├── High-stakes? → 4-Eyes review gate appended
         ├── AI-generated? → Data lineage tag + transparency check
         └── Compliance signal emitted (even for clean passes)
```

Every interaction — blocked or clean — generates compliance evidence. No extra steps.

---

## Configuration

```bash
cp config/org-config.example.yaml config/org-config.yaml
```

| Section | What it controls |
|---------|-----------------|
| `company.*` | Name, industry, jurisdiction |
| `dlp.*` | Sensitivity thresholds, industry pack (private-markets / healthcare / fintech / legal / saas), custom regex patterns |
| `guardrails.*` | Active policies, 4-eyes approver roles, escalation contacts |
| `ai_governance.*` | Risk appetite, prohibited AI use cases, transparency policy, oversight requirements |

See [docs/CUSTOMIZATION.md](docs/CUSTOMIZATION.md) for detailed guidance per industry.

---

## Architecture

```
sentinel-stack/
├── INSTRUCTIONS.md              # Universal — works with any LLM
├── CLAUDE.md                    # Claude-specific orchestrator
├── platforms/
│   ├── copilot/                 # GitHub Copilot
│   ├── openai/                  # ChatGPT / GPT API
│   ├── gemini/                  # Google Gemini / Vertex AI
│   └── cursor/                  # Cursor, Windsurf, Zed
├── config/
│   └── org-config.example.yaml  # Your org's settings
├── skills/
│   ├── guardrails/              # Always-on DLP + compliance scanning
│   │   ├── SKILL.md
│   │   └── references/
│   │       ├── data-classification.md
│   │       └── review-gates.md
│   ├── dlp-engine/              # 3-tier sensitivity scoring
│   │   ├── SKILL.md
│   │   └── dlp-engine.ts        # TypeScript reference implementation
│   ├── ai-governance/           # EU AI Act + AI usage policy
│   │   ├── SKILL.md
│   │   └── references/
│   │       └── ai-risk-tiers.md
│   ├── risk-register/           # Auto-populated risk register
│   ├── compliance-evidence/     # SOC 2 / ISO 27001 / NIST / GDPR
│   ├── audit-trail/             # Structured compliance logs
│   ├── policy-drafter/          # AI policy templates
│   ├── vendor-ai-risk/          # Third-party AI assessment
│   ├── decision-audit/          # Governance decision validation
│   └── first-principles/        # Problem decomposition
├── scripts/
│   └── setup.sh
└── docs/
    ├── ARCHITECTURE.md
    ├── CUSTOMIZATION.md
    └── SKILL-HIERARCHY.md
```

---

## Who This Is For

- **Founders & CTOs** shipping AI features who need governance that doesn't slow them down
- **GRC analysts** tired of documenting AI controls in spreadsheets after the fact
- **CISOs & security teams** who need an AI governance framework yesterday
- **Compliance officers** preparing for SOC 2, ISO 27001, or EU AI Act audits
- **Anyone evaluating AI vendors** who wants a structured risk assessment

---

## Contributing

PRs welcome. Each skill is a self-contained directory:

```
skill-name/
├── SKILL.md           # Required — instructions + workflow
└── references/        # Optional — loaded on demand
```

Keep `SKILL.md` under 500 lines. Use `references/` for large lookup tables or policy documents.

## License

MIT
