# Review Gates Reference

This file defines who must sign off on 4-eyes-required actions, the escalation path, and the standard review record format.

---

## Why 4-Eyes Exists

Errors in finance, legal, or data outputs that reach clients or regulators carry reputational, contractual, and regulatory consequences. The 4-eyes requirement ensures the same standard of care that your organization's products enforce for its clients.

---

## Who Signs Off on What

Configure these roles in `config/org-config.yaml`. Defaults:

| Domain | Primary Approver | Escalation |
|--------|-----------------|------------|
| Journal entries / ERP posting | Finance Manager or Controller | CFO |
| Financial statements (external) | CFO | CEO |
| Contract routing for signature | Legal Counsel | General Counsel / CEO |
| NDA approval | Legal Counsel | Department Head |
| Offer letters | HR Lead | CHRO / CPO |
| Compensation changes | CHRO | CFO (for exec-level) |
| Performance ratings (formal) | HR Lead + Direct Manager | CHRO |
| Production SQL / data warehouse | Data Engineering Lead | CTO |
| Production deployments | Engineering Lead | CTO |

---

## Escalation Path

If the standard approver is unavailable and the action is time-sensitive:

1. Contact the escalation approver listed above
2. Document why the standard approver was unavailable
3. Proceed only after the escalation approver confirms in writing (chat or email)
4. File the approval record in the relevant system

Never self-approve a 4-eyes-required action. Never ask AI to confirm its own output as the second review.

---

## Files as Input

When a file is attached to a prompt, the guardrail runs a file scan before any other assessment.

| File scan outcome | What happens next |
|-------------------|------------------|
| HARD BLOCK | Request stops entirely. No review gate reached. |
| Clean | Proceed normally. Review gate applies based on intended action. |

The gate is triggered by the action, not the file format. Uploading a PDF does not automatically trigger 4-eyes. What triggers it is whether the output will be acted on directly.

---

## Files as Output

When the output is itself a file, the review gate applies to the file, not just surrounding text.

**Rules for file outputs:**
1. The approver must open and review the actual file — not the AI summary
2. The file format is part of the review record

| File format | What the reviewer must check |
|-------------|------------------------------|
| **XLSX** | Open every populated sheet. Verify formulas, not just displayed values. Check for leaked identifiers in cell comments. |
| **PDF** | Read full document including headers, footers, watermarks. For contracts: verify signature blocks and defined terms. |
| **PPTX** | Review every slide including speaker notes. Verify attributed figures match source data. |
| **CSV / ERP import** | Verify column mapping against target system. Spot-check sample rows. |
| **SQL** | Do not run against production without review. Verify query scope and confirm no destructive operations. |

---

## Standard Review Record

```
REVIEW RECORD
--------------------------
Action:           [e.g. Journal entry Q1 payroll accrual]
Output prepared:  [Date]
Output file:      [Filename and format if applicable]
File scanned:     [ ] Yes — no hard-block signals   [ ] No file attached
Reviewed by:      [Full name, role]
Review date:      [Date]
Decision:         [ ] Approved as-is   [ ] Approved with changes   [ ] Rejected
Notes:            [Changes made or concerns noted]
Signature:        _______________________
```

---

## What Does NOT Require 4-Eyes

- Internal drafts not yet shared outside the team
- Research, summaries, or briefing documents for internal use
- Code review comments on non-production branches
- Marketing content drafts before brand review
- Template generation where no client data is involved
- AI outputs used as a starting point that will be significantly rewritten

The test: **will this output be acted on directly, or does a human still need to do substantial work before it becomes an action?**

---

## Common Mistakes to Avoid

| Mistake | Why it matters |
|---------|---------------|
| Treating the AI output as the second reviewer | AI is not an independent reviewer — it produced the output |
| Verbal approval without a record | No audit trail if challenged later |
| Skipping 4-eyes because "it's just a draft" | If the draft gets submitted directly, it was never a draft |
| Self-approving under time pressure | Urgency is not a waiver — escalate instead |
| Reviewing the AI summary instead of the file | Errors in files are not always visible in summaries |
