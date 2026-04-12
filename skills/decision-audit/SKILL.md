---
name: decision-audit
description: Governance decision validation skill. Reviews decisions for logical consistency, evidence quality, bias indicators, and completeness. Checks that decisions reference appropriate policies and have proper authorization. Outputs audit findings with severity ratings. Use for quality assurance of governance decisions or investigating concerns.
---

# Decision Audit: Governance Quality Assurance

This skill audits governance decisions (guardrail outcomes, approvals, risk assessments) for completeness, consistency, and quality. It validates that decisions are well-reasoned, properly documented, and align with policies and authorizations.

## Audit Categories

### 1. Logical Consistency

Does the decision make sense?

**Checks:**
- Is the reasoning internally consistent?
- Do stated facts support the conclusion?
- Are there logical contradictions?
- Does the decision align with previous similar decisions?

**Example audit:**
```
DECISION: Hard-block for "Client A revenue in Q3 was $5M"
REASONING: "Policy 1 blocks client names"

CONSISTENCY CHECK:
- Policy 1 prohibits client identifiers
- Client name "Client A" is redacted (not "Acme Corp")
- Financial figure without entity name may be allowed
- Previous decision on similar data: FLAGGED (not blocked)

FINDING: Inconsistent application
Severity: Medium
Recommendation: Clarify whether anonymized client identifiers + figures are blocked
```

### 2. Evidence Quality

Is the decision supported by evidence?

**Checks:**
- What evidence was reviewed?
- How much evidence?
- Is evidence sufficient for conclusion?
- Are contradictory signals ignored?
- What wasn't checked?

**Example audit:**
```
DECISION: Vendor approved as "low risk"
EVIDENCE REVIEWED:
- ✓ Security certifications (SOC 2 Type II)
- ✗ Data handling practices (not reviewed)
- ✗ Incident history (not checked)
- ✗ Customer references (not obtained)

FINDING: Insufficient evidence
Severity: High
Recommendation: Complete vendor assessment before final approval
```

### 3. Bias and Fairness

Are there indicators of bias in the decision?

**Checks:**
- Are similar situations treated similarly?
- Are there demographic or categorical patterns?
- Are edge cases considered?
- Is there appropriate skepticism of automation?

**Example audit:**
```
DECISION SAMPLE: 10 hard-blocks in guardrail over 1 month
ANALYSIS:
- User demographics: 8 from Finance, 2 from Product
- Data types: 10/10 involved client financial data
- Outcome: All blocked, 0 proceeded

FAIRNESS CHECK:
- Finance team legitimate need for analysis? 
  → Mitigation exists (anonymization)
- All blocks justified by policy?
  → Yes, clear violations
  
FINDING: No bias detected
Severity: None
Conclusion: Decisions consistently applied
```

### 4. Authorization and Authority

Does the decision-maker have the authority to decide?

**Checks:**
- Does policy allow this decision-maker to decide?
- Is escalation required but not done?
- Are there conflicting authorities?
- Is decision within scope of role?

**Example audit:**
```
DECISION: Contractor denied access to HR system
AUTHORITY CHECK:
- Decision made by: Finance Manager
- Policy requires: HR Lead approval
- Escalation documented: No

FINDING: Lack of authority
Severity: High
Recommendation: HR Lead must review and approve
```

### 5. Completeness

Is all necessary information documented?

**Checks:**
- Is decision documented in writing?
- Are supporting facts included?
- Is reasoning explained?
- Are approvers identified?
- Is there an audit trail?

**Example audit:**
```
DECISION: Risk escalated from "Yellow" to "Red"
DOCUMENTATION:
- ✓ Decision date: 2026-04-13
- ✓ Decision maker: Risk Officer
- ✗ Reason for escalation: Not documented
- ✗ New evidence: Not recorded
- ✗ Who approved escalation: Not clear

FINDING: Incomplete documentation
Severity: Medium
Recommendation: Document reason for escalation and approval
```

### 6. Policy Compliance

Does the decision follow applicable policies?

**Checks:**
- What policies apply to this decision?
- Does decision follow policy?
- Are exceptions explicitly authorized?
- Are gaps noted?

**Example audit:**
```
DECISION: 4-eyes gate waived for contract review
POLICY CHECK:
- Policy: 4-eyes required for legal contracts
- Decision: Waived due to "time pressure"
- Authorization: Self-approved (not escalated)

FINDING: Policy violation
Severity: Critical
Recommendation: Reinstate 4-eyes gate; document waiver request
```

---

## Audit Process

### Step 1: Define scope

What decisions are being audited?

```
Audit scope: Guardrail hard-blocks in March 2026
Sample size: All hard-blocks (n=15)
Time period: March 1-31, 2026
Auditor: Compliance Officer
```

### Step 2: Sample and document

Collect decision records:

```
For each decision, gather:
- Decision summary (1-2 sentences)
- Date and decision-maker
- Reasoning/evidence
- Policy cited
- Approvals/escalations
- Outcome
```

### Step 3: Audit against criteria

Apply audit questions to each decision:

| Criterion | Finding | Evidence | Severity |
|-----------|---------|----------|----------|
| Logical consistency | PASS | [note] | - |
| Evidence quality | FLAG | [missing info] | Medium |
| Bias | PASS | [analysis] | - |
| Authorization | PASS | [policy] | - |
| Completeness | FAIL | [what's missing] | High |
| Policy compliance | PASS | [reference] | - |

### Step 4: Aggregate findings

Summarize patterns:

```
AUDIT SUMMARY: March 2026 Guardrail Blocks
Sample size: 15 decisions
Pass rate: 80% (12/15 decisions fully compliant)

Finding breakdown:
- Logical consistency: 100% pass
- Evidence quality: 80% pass (3 missing context)
- Bias: 100% pass
- Authorization: 100% pass
- Completeness: 67% pass (5 missing docs)
- Policy compliance: 100% pass

Key findings:
1. Documentation gaps in 5 decisions (no notes on context)
2. Inconsistent evidence collection (some reviewed policy, others didn't)
3. One decision lacked authorization (user self-approved)

Recommendations:
1. Implement decision documentation template
2. Require evidence review checklist
3. Ensure 4-eyes gate for policy exceptions
```

---

## Decision Audit Checklist

For any governance decision, verify:

**Logical Consistency**
- [ ] Facts support conclusion
- [ ] Reasoning is clear
- [ ] No contradictions
- [ ] Consistent with precedent

**Evidence**
- [ ] Policy was reviewed
- [ ] Evidence was gathered
- [ ] Evidence is sufficient
- [ ] Contradictions addressed

**Bias**
- [ ] Similar cases handled similarly
- [ ] No demographic patterns
- [ ] Edge cases considered
- [ ] Skepticism of automation

**Authorization**
- [ ] Decision-maker has authority
- [ ] Escalation followed if required
- [ ] Conflicts resolved
- [ ] Within scope of role

**Completeness**
- [ ] Decision documented
- [ ] Facts recorded
- [ ] Reasoning explained
- [ ] Approvals identified
- [ ] Audit trail present

**Compliance**
- [ ] Applicable policies identified
- [ ] Policy was followed
- [ ] Exceptions authorized
- [ ] Gaps acknowledged

---

## Output Format

**Decision Audit Report:**

```
GOVERNANCE DECISION AUDIT REPORT

Period: March 1-31, 2026
Sample: Guardrail hard-block decisions
Auditor: Compliance Officer
Date: April 5, 2026

EXECUTIVE SUMMARY
[1-2 paragraph summary of findings]

FINDINGS BY DECISION

Decision 1: [Summary]
Logical Consistency: PASS
Evidence Quality: FLAG — Missing context on data classification
Bias: PASS
Authorization: PASS
Completeness: FAIL — No documented reasoning
Compliance: PASS
Severity: Medium
Recommendation: Add documentation; rerun decision with notes

Decision 2: [Summary]
[Full audit for each decision]

AGGREGATE FINDINGS

Total decisions audited: 15
Fully compliant: 12 (80%)
Flagged for review: 2 (13%)
Non-compliant: 1 (7%)

Key patterns:
- Documentation is weakest area
- Bias and authority are consistently strong
- Consistency needs improvement

RECOMMENDATIONS

1. [Priority 1] Implement decision documentation standard
2. [Priority 2] Create policy exception request process
3. [Priority 3] Quarterly audit cycle
4. [Priority 4] Training on decision reasoning

SIGN-OFF
Auditor: [Name]
Date: [Date]
Findings approved by: [Authority]
```

**Finding Severity Levels:**

| Severity | Definition | Example |
|----------|-----------|---------|
| **Critical** | Decision violates law or policy without authorization | Waived 4-eyes gate on major contract |
| **High** | Decision lacks sufficient authority or evidence | Approved tool without security review |
| **Medium** | Decision is unclear or inconsistently applied | Missing documentation, inconsistent with precedent |
| **Low** | Decision could be better documented | Evidence not fully recorded |

---

## Decision Audit Trends

Track over time:

```
AUDIT TREND REPORT: Governance Decisions 2026

Jan 2026: 92% compliant, 2 high-severity findings
Feb 2026: 89% compliant, 1 high-severity finding
Mar 2026: 85% compliant, 3 medium-severity findings
Apr 2026: [Projected 88% based on Q1 trajectory]

Improving:
- Authorization clarity
- Policy alignment

Declining:
- Documentation completeness
- Evidence gathering thoroughness

Action items:
- Resume training on documentation standards (dropped in Feb)
- Increase monitoring during high-volume periods
- Implement template to improve consistency
```

---

## Integration with Other Skills

- **guardrails**: Audits guardrail hard-block decisions
- **risk-register**: Validates risk assessment decisions
- **compliance-evidence**: Decision audit becomes evidence of control effectiveness
- **audit-trail**: Decision records feed into audit trail
