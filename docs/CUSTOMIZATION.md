# Sentinel Stack Customization Guide

This guide walks you through configuring Sentinel Stack for your organization.

## Quick Setup (15 minutes)

### 1. Copy and customize config

```bash
cp config/org-config.example.yaml config/org-config.yaml
```

Edit `config/org-config.yaml` to set:
- [ ] Company name
- [ ] Industry
- [ ] Jurisdiction(s)
- [ ] Compliance frameworks
- [ ] Approver contacts

### 2. Customize guardrails

Edit guardrails settings in config:

```yaml
guardrails:
  admin_contact: "your-compliance@company.com"
  approvers:
    finance: "CFO Name"
    legal: "General Counsel Name"
    hr: "CHRO Name"
```

### 3. Set DLP thresholds

Adjust sensitivity scoring:

```yaml
dlp:
  alert_threshold: 40    # Tune based on false positive rate
  block_threshold: 85    # Tune based on missed detections
```

### 4. Enable compliance frameworks

Select which frameworks apply:

```yaml
compliance:
  frameworks:
    - "SOC2"         # Check if required
    - "ISO27001"     # Check if required
    - "GDPR"         # If EU operations
```

**Done!** Sentinel Stack is now active with your settings.

---

## Configuration Deep Dives

### Company Identity

Set these in config:

```yaml
company:
  name: "Acme Corp"
  industry: "Private Markets"  # Critical: DLP uses this for patterns
  jurisdiction: "US/EU"
```

**Why it matters:**
- **Industry pack:** Different industry → different DLP patterns
  - Private markets: Fund names, LP/GP data, NAV figures
  - Healthcare: PHI, patient IDs, diagnoses
  - Fintech: Account numbers, routing, KYC data
- **Jurisdiction:** Affects privacy regulations
  - EU jurisdiction → GDPR applies (right to deletion, subject access requests)
  - US → CCPA if California customers
  - Cross-border → GDPR + CCPA both apply

### DLP Thresholds

**alert_threshold (default: 40)**
- Sensitivity score >= 40 triggers alert
- Too low (20): Too many alerts (alert fatigue)
- Too high (60): Miss real issues
- **Tuning:** Start at 40; adjust after 2 weeks based on false positive rate

**block_threshold (default: 85)**
- Sensitivity score >= 85 blocks request
- Too low (70): Block legitimate requests
- Too high (95): Only catches obvious violations
- **Tuning:** Keep high; prefer alerts over blocks initially

**redact_secrets (default: true)**
- If true: API keys and credentials are redacted, content proceeds
- If false: API keys trigger hard-block

Example tuning process:

```
Week 1: Run with defaults, monitor alert volume
  → If 10+ alerts/day with false positives → raise alert_threshold to 50
  
Week 2: Adjust alert tuning
  → If 1-2 alerts/day but missing real issues → lower alert_threshold to 35
  
Week 3: Stabilize at optimal threshold
  → Run with tuned settings for 2 weeks
  
Week 5: Review actual incident rate
  → If incidents detected post-block → consider lowering block_threshold
  → If no incidents, block_threshold is right
```

### Guardrails Approvers

Critical for 4-eyes review enforcement:

```yaml
guardrails:
  approvers:
    finance:
      primary: "CFO Name (cfo@company.com)"
      escalation: "CEO"
    legal:
      primary: "General Counsel"
      escalation: "Chief Legal Officer"
    hr:
      primary: "Chief People Officer"
      escalation: "CEO"
    production:
      primary: "VP Engineering"
      escalation: "CTO"
```

**Ensure:**
- Each primary approver has authority in their domain
- Escalation path is defined and understood
- Approvers' calendars are kept up-to-date
- Backup approvers are defined (for vacations)

### AI Governance Configuration

Set your organization's AI risk appetite:

```yaml
ai_governance:
  risk_appetite: "limited"  # Options: minimal, limited, high
  
  prohibited_uses:
    - "real-time_biometric_identification"
    - "social_scoring"
    - "automated_employee_surveillance"
```

**What this controls:**
- **risk_appetite:** How much AI risk you'll accept
  - `minimal` → Only allow minimal/limited-risk AI
  - `limited` → Can do limited + high-risk (with governance)
  - `high` → Can do anything (with appropriate governance)
  
- **prohibited_uses:** Use cases that are never allowed
  - Add to this list based on organizational values or regulation

### Compliance Frameworks

Select frameworks you must comply with:

```yaml
compliance:
  frameworks:
    - "SOC2"      # Service organizations, cloud providers
    - "ISO27001"  # Any org needing formalized info security
    - "GDPR"      # Process EU personal data
    - "NIST_CSF"  # US critical infrastructure
  
  retention_days: 2555  # 7 years for most compliance
```

**Impact:**
- **Evidence collection:** Compliance-evidence skill maps decisions to selected frameworks
- **Audit trail:** Logs are retained per framework requirements
- **Policy generation:** policy-drafter creates policies aligned with frameworks
- **Reporting:** Quarterly reports show compliance against selected frameworks

---

## Tuning by Industry

### Private Markets / VC

**Key config:**
```yaml
company:
  industry: "Private Markets"

dlp:
  industry_pack: "private-markets"
  
guardrails:
  approvers:
    finance: "CFO"
    legal: "General Counsel"
    hr: "CHRO"

ai_governance:
  prohibited_uses:
    - "fund_performance_prediction"  # Relies on market conditions
```

**Custom patterns to add:**
- Fund identifiers (FUND-XXX format)
- Portfolio company IDs
- NAV/IRR/MOIC patterns

**Key policies:**
- No client data in LLM prompts (fund names, LP data, valuations)
- 4-eyes review on all investment memos
- Annual vendor AI assessment for portfolio companies

### Healthcare

**Key config:**
```yaml
company:
  industry: "Healthcare"
  
dlp:
  industry_pack: "healthcare"
  
compliance:
  frameworks: ["HIPAA", "SOC2"]
```

**Custom patterns to add:**
- PHI (patient names, MRN, SSN + health info)
- Diagnosis codes (ICD-10)
- Insurance IDs

**Key policies:**
- No patient data in external AI
- All AI outputs reviewed by licensed clinician
- Data flow audit quarterly

### Fintech

**Key config:**
```yaml
company:
  industry: "Fintech"

dlp:
  industry_pack: "fintech"
  block_threshold: 75  # More conservative on financial data
  
compliance:
  frameworks: ["SOC2", "NIST_CSF", "PCI-DSS"]
```

**Custom patterns:**
- Account numbers, routing numbers
- Card numbers (all Tiers 1 already cover)
- AML flags, KYC data

**Key policies:**
- No financial data in public AI systems
- Compliance testing before any AI-based decision
- Monthly bias testing on credit/lending AI

### Legal

**Key config:**
```yaml
company:
  industry: "Legal"

dlp:
  industry_pack: "legal"
  alert_threshold: 35  # More sensitive for legal data
  
guardrails:
  approvers:
    legal: "Senior Partner"
    
ai_governance:
  prohibited_uses:
    - "legal_advice"  # Licensed activity
```

**Custom patterns:**
- Case numbers, witness names
- Settlement amounts
- Privilege markers

**Key policies:**
- No privileged communications in AI
- Attorney review required before any draft goes external
- Malpractice insurance reviewed annually

---

## Disabling/Adding Skills

### Disabling a Skill

If you don't need a skill, you can disable it:

```yaml
# In a future version, skills might have enable flags:
skills:
  guardrails:
    enabled: true
  dlp_engine:
    enabled: true
  vendor_ai_risk:
    enabled: false  # Not needed yet
  risk_register:
    enabled: false  # Using external tool instead
```

**For now:** Skills are always available. Just don't use them.

### Adding Custom Patterns

Add to `org-config.yaml`:

```yaml
dlp:
  custom_patterns:
    - id: "internal_project_code"
      regex: "PRJ-[A-Z]{3}-\\d{4}"
      category: "internal"
      severity: "high"
      action: "alert"
      
    - id: "vendor_confidential_mark"
      regex: "[VENDOR_NAME] Confidential"
      category: "vendor"
      severity: "high"
      action: "alert"
```

### Adding Custom Data Types

Edit `data_classification.md` in guardrails references:

```markdown
## Your Custom Data Type

Examples:
- Item 1
- Item 2

Handling rule: [your rule]
```

Then reference in guardrails training.

---

## Approval Process for Configuration Changes

**Who:** Compliance Officer (or designated config owner)

**Process:**
1. Draft change to `org-config.yaml`
2. Document reason for change
3. Get approvals:
   - CFO (for DLP/approval changes)
   - General Counsel (for framework/legal changes)
   - CISO (for security settings)
4. Merge to config with version comment
5. Announce change to team
6. Update team training

**Example:**
```yaml
# Version bump + change comment
version: 1.2
last_updated: 2026-04-13
updated_by: "Compliance Officer"
change_log:
  - date: 2026-04-13
    change: "Lowered DLP alert_threshold from 40 to 35"
    reason: "Reduce false positives in testing phase"
    approved_by: "CFO, CISO"
```

---

## Testing Your Configuration

### 1. Test Guardrails

Create test cases:

```
TEST: Hard-block on client name
Input: "Client A revenue was $5M"
Expected: Hard-block (contains client identifier)

TEST: Soft-flag on ambiguous name
Input: "Sarah works in Finance"
Expected: Soft-flag (could be real person or example)

TEST: Allow anonymized data
Input: "Client A (anonymized) in sector X generated return of 15%"
Expected: Proceed (client name redacted, data doesn't identify)
```

Run tests monthly to ensure guardrails are working.

### 2. Test DLP Thresholds

Calibrate using known patterns:

```
Input: Real API key in text
Expected: Block (score 95, >= 85 threshold)

Input: Lots of financial figures without context
Expected: Alert (score 50, >= 40 threshold)

Input: Normal business text
Expected: Allow (score 5, < 40 threshold)
```

### 3. Test 4-Eyes Gates

Verify approvers work:

```
TEST: Finance decision without approval
Outcome: Approval gate appended
Approver: Can review and approve/reject

TEST: Legal contract without General Counsel sign-off
Outcome: Approval gate appended
Approver: General Counsel reviews
```

---

## Monitoring and Tuning

### Weekly Review

```
Metrics to check:
- Guardrail blocks (hard + soft)
- DLP alerts triggered
- False positive rate
- User friction (complaints)
```

**Action if needed:**
- Adjust alert_threshold up if too many false positives
- Adjust block_threshold down if missing real issues
- Update training if users are confused

### Monthly Tuning

```
Review:
- Incident rate (what got through that shouldn't?)
- Control effectiveness (did guardrails catch it?)
- Approver workflow (are gates slowing things down?)
```

### Quarterly Assessment

```
Full org-config review:
- Are approvers still correct?
- Have compliance requirements changed?
- Should we add frameworks?
- Are DLP thresholds right for actual usage?
```

---

## Troubleshooting

**Issue:** Too many DLP alerts (alert fatigue)

**Solution:**
1. Review what's triggering alerts
2. If false positives (not real issues) → raise alert_threshold
3. If real low-risk issues → add context to DLP patterns (make more specific)
4. Example: Change "email address" from alert to log (too common)

**Issue:** Guardrails blocking legitimate data analysis

**Solution:**
1. Check: Is data truly anonymized? (Client A vs. Acme Corp)
2. If legitimate anonymous use:
   - User confirms anonymization explicitly
   - Add context to soft-flag check (reduce false positives)
3. Or: Adjust policy for your use case (with approval)

**Issue:** 4-Eyes gate causing delays

**Solution:**
1. Define SLA for approvals (same-day expected)
2. Designate backup approvers
3. Review: Do all decisions really need 4-eyes? (Too cautious)
4. Or: Speed up approvers (integration with approver's workflow)

---

## Best Practices

1. **Configuration is code:** Version control, review changes, document why
2. **Start conservative:** Higher thresholds, more approvals, then relax
3. **Training first:** Train team on policies before enforcement
4. **Monitor always:** Weekly check-in on metrics
5. **Escalate quickly:** Don't let violations build up
6. **Review quarterly:** Update config based on learnings
7. **Document changes:** Future you will want to know why you decided something
