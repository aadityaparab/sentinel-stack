# Sentinel Stack — GitHub Copilot Setup

GitHub Copilot enables inline AI suggestions in your IDE. This guide integrates Sentinel Stack governance into Copilot.

## Option 1: Repository-Level Instructions

Create `.github/copilot-instructions.md` in your repository root:

```bash
mkdir -p .github
cp sentinel-stack/.github/copilot-instructions.md .github/copilot-instructions.md
```

This file is automatically loaded by Copilot when working in this repository.

## Option 2: VS Code User Settings

Configure Copilot at the user level for all repositories:

1. Open VS Code Settings (Cmd/Ctrl + ,)
2. Search: "Copilot instructions"
3. Set the instructions file path to your Sentinel Stack INSTRUCTIONS.md
4. Apply to all repositories

## Option 3: Organization Policy (GitHub Enterprise)

If your organization uses GitHub Enterprise:

1. Go to Organization Settings → Copilot
2. Set default Copilot instructions
3. Point to: `.github/copilot-instructions.md`
4. Apply to all repositories in organization

## What Works in Copilot

| Feature | Support | Notes |
|---------|---------|-------|
| Guardrail awareness | ✅ Advisory | Copilot flags patterns it recognizes from instructions |
| 4-eyes review gates | ✅ Full | Appended to code comments |
| AI governance | ✅ Full | Classifications and risk tier awareness |
| DLP pattern detection | ✅ Good | Flags secrets, API keys, PII in code |
| Code review with governance | ✅ Full | Applies data handling to code suggestions |
| Policy awareness | ✅ Full | References company policies |
| Risk awareness | ✅ Advisory | Mentions risk register in comments |

## Common Use Cases in Copilot

### 1. Code Review with Governance

```
// CODE: Hardcoded API key in function
const API_KEY = "sk-..."

COPILOT SUGGESTION:
// Alert: API key detected (high-risk secret)
// - Move to environment variable
// - Use secure vault for production
// - See: guardrails SKILL for data handling
```

### 2. Data Handling in Code

```
// User comment: "Function to export customer data"

COPILOT SUGGESTION:
// Warning: Check if customer data requires:
// - Anonymization (guardrails Policy 1)
// - Encryption (ISO27001 requirement)
// - Audit logging (audit-trail skill)
// Verify with: Compliance Officer before deployment
```

### 3. AI Integration in Code

```
// User comment: "Add ChatGPT API for document analysis"

COPILOT SUGGESTION:
// Governance check required:
// - Is this high-risk (employment, credit decisions)?
// - If yes: See ai-governance SKILL for requirements
// - Requires: Explainability, human oversight, bias testing
// Contact: Compliance team for approval
```

### 4. Financial/Legal/HR Code

```
// Function: Calculate salary adjustment
function adjustSalary(employeeId, percentage) {
  // ...
}

COPILOT SUGGESTION:
// Alert: HR/Compensation decision
// - Requires 4-eyes review (policy_3_four_eyes_review)
// - Must have audit log of who approved
// - Approver: CHRO (from org-config.yaml)
// See: guardrails references/review-gates.md
```

## Integration Points

### Copilot + Guardrails

Copilot in VS Code gets guardrails context through instructions.

**Workflow:**
1. User writes code that handles sensitive data
2. Copilot suggestion includes guardrail reminder
3. User manually adds safeguards
4. Code review catches if guardrails missed

### Copilot + DLP Patterns

Copilot can flag secrets and PII in code suggestions.

**Example:**
```python
# BAD (Copilot will warn):
api_key = "sk-1234567890abcdef"
password = "my_secure_password"

# GOOD (Copilot suggests):
api_key = os.environ.get("API_KEY")
password = get_from_secure_vault("APP_PASSWORD")
```

## Setting Up Copilot Instructions

### Template Instructions for Copilot

Place in `.github/copilot-instructions.md`:

```markdown
# Sentinel Stack Governance Instructions for GitHub Copilot

You are an AI code assistant operating within data governance policies.

## Data Handling

- Do not suggest code that hardcodes secrets, API keys, or credentials
- Flag if code processes client data, personal data, or financial data
- Suggest anonymization for any data handling

## Policy Compliance

- When suggesting code for employment, finance, legal, or HR decisions:
  Reference: "Requires 4-eyes review per Policy 3"
- When suggesting code that stores personal data:
  Reference: "Privacy compliance check required per Policy 2"
- When suggesting AI integration:
  Reference: "AI governance assessment required"

## Security

- Suggest moving secrets to environment variables
- Recommend encryption for sensitive data
- Suggest audit logging for critical operations
- Warn about database queries against production

## Output

When suggesting code, include:
1. The working code
2. Security/compliance notes (as comments)
3. Link to relevant SKILL if applicable

Example:
\`\`\`python
# ✓ Secure approach
api_key = os.environ.get("OPENAI_API_KEY")
# See: guardrails SKILL for data handling
\`\`\`
```

## Limitations

Copilot cannot:
- Enforce hard blocks (unlike guardrails skill)
- Auto-append 4-eyes review gates
- Maintain state or decision history
- Integrate with SIEM or audit systems
- Make final governance decisions

**Copilot is advisory.** Code review still needs human approval.

## Best Practices

1. **Use in pair programming:** Copilot + human reviewer is most effective
2. **Train team:** Brief developers on governance aware coding
3. **Review carefully:** Copilot suggestions are guidance, not law
4. **Escalate:** If Copilot flags something high-risk, escalate to compliance
5. **Document decisions:** Code review comments should explain governance choices

## Workflow Example

```
Developer: Writes function to process employee data

Copilot: "Alert: Personal data (employee info) detected.
         - Does function handle compensation? → Requires 4-eyes
         - Is this stored in code? → Move to secure vault
         - Will this be shared externally? → Requires audit"

Developer: "Adding audit logging and moving data to vault"

Code Review (Human): "APPROVED - compliance notes verified"

Deployment: Code goes to production with safeguards
```

## Troubleshooting

**Issue:** Copilot suggestions include hardcoded secrets

**Solution:**
- Add example to `.github/copilot-instructions.md`
- Show Copilot what "good" looks like
- Example: "For API keys: Use `os.environ.get()` not hardcoding"

**Issue:** Copilot doesn't mention governance

**Solution:**
- Copilot instructions may not be loaded
- Check: Repository has `.github/copilot-instructions.md`
- Verify: File is in correct location
- Reload: Close and reopen VS Code

**Issue:** Copilot slowing down coding

**Solution:**
- Instructions can be verbose (trade-off: safety vs. speed)
- Trim instructions to most critical governance points
- Use comments to indicate when full checks needed

## Integration with Sentinel Stack Workflow

Copilot works with other Sentinel Stack skills:

```
Code written with Copilot suggestions
  ↓
Code review (human + governance checks)
  ↓
Deployment to staging
  ↓
Guardrails SKILL validates at runtime
  ↓
Audit-trail logs all governance events
  ↓
Decision-audit reviews governance quality
```

The multi-layer approach catches governance issues at:
- **Development time:** Copilot guidance
- **Code review time:** Human check
- **Runtime:** Guardrails enforcement
- **Audit time:** Evidence collection and review
