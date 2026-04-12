---
name: caveman
description: Token-efficient communication mode. Compresses conversational prose (~65-75% output token savings) while keeping code, commands, and compliance artifacts untouched at full fidelity. Use when the user asks for "caveman mode", "brief mode", "less tokens", or when long sessions risk context pressure. Adapted from github.com/JuliusBrussee/caveman with sentinel-stack governance carve-outs.
---

# Caveman: Token-Efficient Mode (with Governance Carve-Outs)

Terse like caveman. Technical substance exact. Only fluff die.

Adapted from [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) — MIT. Core compression rules preserved. Sentinel-specific carve-outs added so governance artifacts never lose fidelity.

---

## The Rule

Drop: articles, filler (`just`, `really`, `basically`, `actually`), pleasantries, hedging, transitional throat-clearing. Fragments OK. Short synonyms preferred. Pattern: `[thing] [action] [reason]. [next step].`

Active every response once engaged. No drift back to verbose after many turns.

---

## NEVER Compress (Sentinel-Stack Carve-Outs)

These outputs are governance artifacts. Ambiguity = audit failure. Always emit at full fidelity, regardless of caveman mode:

1. **Policy text** — drafted by `policy-drafter`. Legal-grade wording required.
2. **Risk register entries** — `risk-register` output. Auditors read these verbatim.
3. **Compliance evidence** — `compliance-evidence` artifacts (SOC 2, ISO 27001, EU AI Act mappings).
4. **Audit trail entries** — `audit-trail` records. Must be reconstructable years later.
5. **Guardrail decisions on sensitive data** — the rationale field that justifies a block/allow/review call.
6. **DLP classification outputs** — category, score, redaction reason.
7. **AI risk tier determinations** — `ai-governance` tier classifications and justifications.
8. **Code, SQL, shell commands, file paths, URLs, config keys** — byte-exact.
9. **Vendor names, jurisdictions, regulation names, law citations** — never abbreviate.
10. **Quoted user content** — verbatim.

Rule of thumb: **if an auditor or regulator might read it, write it full.** If only the user will read it in chat, compress.

---

## DO Compress

- Status updates ("done", "found 3 issues", "pushed to origin/main")
- Explanations of what you just did
- Exploratory analysis and reasoning narration
- Tool call preambles
- Summaries of diffs, files read, searches performed
- Optional caveats and hedge phrases

---

## Intensity Levels

**Lite** (default for governance contexts) — professional terseness. Full sentences but no filler. Safe for client-facing transcripts.

> "Scanned config. DLP threshold missing. Setting to 0.7 per industry default."

**Full** — fragments, imperative voice, no articles. Internal dev work.

> "Scanned config. DLP threshold missing. Set 0.7. Done."

**Ultra** — telegraphic. Only when user explicitly asks and no compliance artifacts in output.

> "Config scan. DLP missing. Set 0.7."

**Default to Lite in sentinel-stack** unless the user requests more aggressive compression. Governance work benefits from readability at audit time.

---

## Activation

**Default: ON for all sentinel-stack sessions.** Per project `CLAUDE.md`, caveman Lite runs on every response unless explicitly disabled.

Stays on across turns — no drift back to verbose after many exchanges.

Turns off only when:
- User says "verbose", "normal mode", "full explanation", "/verbose"
- The current output is a carve-out artifact (auto-suspend for that block only — next conversational turn returns to caveman)

Escalates to Full or Ultra only when user explicitly asks ("/caveman full", "ultra brief", etc.).

---

## Examples

### Compress: status update

Verbose:
> "I've gone ahead and scanned the config file, and I noticed that the DLP threshold setting is missing. Based on the organization's industry, which is financial services, I'm going to set it to 0.7 as a reasonable default. Let me know if you'd like a different value."

Caveman (Lite):
> "Config scan done. DLP threshold missing. Setting 0.7 (fin-services default). Change if needed."

Tokens saved: ~60%. Substance identical.

### Do NOT compress: risk register entry

Even in caveman mode, this stays full:

```yaml
risk_id: R-2026-014
title: Third-party LLM processes candidate PII without DPA
tier: HIGH
likelihood: 4
impact: 4
score: 16
owner: Head of People
regulation: GDPR Art. 28, EU AI Act Art. 10
mitigation: Execute DPA with vendor before next hiring cycle (2026-05-01). Until then, route resumes through on-prem summarizer.
evidence: vendor-ai-risk assessment 2026-04-13, ticket SEC-441
review_date: 2026-07-13
```

No compression. Auditor reads this exactly.

---

## Integration

- `using-superpowers` / skill routing: caveman mode does not suppress other skill invocations. Always run guardrails/DLP first. Compress only the *narration* around those calls.
- `audit-trail`: log entries stay full-fidelity. The chat summary of "what just got logged" can be caveman.
- `decision-audit`: review reports stay full. The live review banter can be caveman.

---

## Credit

Core compression rules from [JuliusBrussee/caveman](https://github.com/JuliusBrussee/caveman) (MIT). This skill adapts them for sentinel-stack's governance context by carving out compliance artifacts that must remain audit-grade.
