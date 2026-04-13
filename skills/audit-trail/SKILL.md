---
name: audit-trail
description: Compliance audit log generator. Creates structured, immutable audit records (JSON-lines format) for guardrail decisions, DLP scans, 4-eyes review workflows, and AI-assisted outputs in regulated categories. Designed for SIEM and GRC platform ingestion with built-in retention governance per GDPR, SOC 2, and HIPAA. Use when you need audit logs, compliance trails, or interaction history.
---

# Audit Trail

**Skill Name:** audit-trail  
**Version:** 1.0.0  
**Category:** GRC / Compliance  
**Maturity:** Production  

## Overview

The Audit Trail skill generates compliance-ready logs from all AEGIS Stack interactions. It creates structured, immutable audit records (JSON-lines format) for guardrail decisions, DLP scans, review workflows, and AI-assisted outputs in regulated categories. Logs are designed for ingestion into SIEM and GRC platforms, with built-in retention governance per regulation (GDPR, SOC 2, HIPAA).

## Triggers

This skill activates on requests containing these keywords (pushy mode enabled):
- "audit trail"
- "audit log"
- "activity log"
- "compliance log"
- "interaction log"
- "evidence trail"
- "documentation trail"
- "audit report"
- "compliance evidence"

## Capabilities

### 1. Structured Log Entry Generation

Every significant event is captured in JSON-lines format, one log per line:

```json
{
  "event_id": "evt-2026-04-12-0001-a7f2c9d",
  "event_type": "guardrail_decision",
  "timestamp": "2026-04-12T14:32:17.492Z",
  "system": "guardrails",
  "actor": {
    "user_id": "usr_abc123",
    "user_role": "analyst",
    "session_id": "sess_xyz789"
  },
  "event_details": {
    "guardrail_rule_id": "rule-data-exposure",
    "guardrail_name": "PII Detection",
    "action": "block",
    "confidence_score": 0.92,
    "rationale": "Detected 3 social security numbers and 1 credit card number in prompt",
    "input_summary_hash": "sha256:abc123def456",
    "affected_data_classification": "restricted"
  },
  "outcome": {
    "decision": "blocked",
    "user_notified": true,
    "escalation": false
  },
  "metadata": {
    "environment": "production",
    "config_version": "1.2.3",
    "org_id": "org_12345"
  }
}
```

---

### 2. DLP Scan Result Logging

Every Data Loss Prevention scan generates a detailed audit log:

```json
{
  "event_id": "evt-2026-04-12-0002-b8e3d1f",
  "event_type": "dlp_scan",
  "timestamp": "2026-04-12T14:33:05.115Z",
  "system": "dlp",
  "actor": {
    "user_id": "usr_abc123",
    "session_id": "sess_xyz789"
  },
  "event_details": {
    "scan_id": "dlp_scan_987654",
    "content_type": "chat_prompt",
    "severity": "high",
    "dlp_score": 87,
    "detections": [
      {
        "pattern": "credit_card_visa",
        "matches": 2,
        "confidence": 0.99
      },
      {
        "pattern": "email_corporate",
        "matches": 1,
        "confidence": 0.95
      }
    ],
    "action_taken": "blocked_with_notification",
    "policy_triggered": "policy-data-classification-v2",
    "content_size_bytes": 512
  },
  "outcome": {
    "scan_passed": false,
    "user_allowed_retry": false,
    "admin_escalation_queued": true
  },
  "metadata": {
    "environment": "production",
    "dlp_engine_version": "2.1.4"
  }
}
```

---

### 3. Four-Eyes Review Logging

Every approval/review workflow step is captured:

```json
{
  "event_id": "evt-2026-04-12-0003-c9f4e2a",
  "event_type": "four_eyes_review",
  "timestamp": "2026-04-12T14:34:50.203Z",
  "system": "workflow",
  "actor": {
    "requester_id": "usr_abc123",
    "reviewer_id": "usr_def456",
    "requester_role": "data_analyst",
    "reviewer_role": "compliance_officer"
  },
  "event_details": {
    "review_id": "review_4e_111222",
    "review_type": "high_risk_ai_output",
    "request_description": "Generated policy summary for GDPR compliance review",
    "request_timestamp": "2026-04-12T14:25:00Z",
    "review_decision": "approved",
    "decision_timestamp": "2026-04-12T14:34:45Z",
    "time_to_approval_hours": 0.16,
    "reviewer_comments": "Output quality verified. Hallucinations checked. Ready for executive review.",
    "conditions": ["must_share_with_legal_before_external_use"]
  },
  "content_reviewed": {
    "model_used": "claude-3-5-sonnet",
    "prompt_hash": "sha256:xyz789abc123",
    "output_length_tokens": 1247
  },
  "outcome": {
    "approved": true,
    "conditions_accepted": true,
    "notification_sent": true
  }
}
```

---

### 4. AI-Assisted Output Tagging (Regulated Categories)

For sensitive or regulated outputs, full provenance is logged:

```json
{
  "event_id": "evt-2026-04-12-0004-d0g5f3b",
  "event_type": "ai_output_regulated",
  "timestamp": "2026-04-12T14:35:12.897Z",
  "system": "ai_governance",
  "actor": {
    "user_id": "usr_abc123",
    "user_role": "legal_counsel"
  },
  "event_details": {
    "output_id": "out_legal_2026_001",
    "regulated_category": "legal_analysis",
    "data_classification": "confidential",
    "model_used": {
      "name": "claude-3-5-sonnet",
      "version": "20250101",
      "deployment": "production"
    },
    "prompt_summary": "Draft summary of contract review findings for M&A deal",
    "prompt_hash": "sha256:abc123def456",
    "human_oversight": {
      "status": "completed",
      "reviewer_id": "usr_def456",
      "review_timestamp": "2026-04-12T14:35:10Z"
    },
    "output_hash": "sha256:ghi789jkl012",
    "output_length_tokens": 2156,
    "guardrails_applied": [
      "dlp_scan_passed",
      "hallucination_check_passed",
      "legal_disclaimer_required"
    ]
  },
  "metadata": {
    "retention_policy": "gdpr_purpose_limited_6_months",
    "distribution_authorized": ["legal_team", "cfo"],
    "external_sharing_allowed": false
  }
}
```

---

## Log Retention Policies

Audit logs are retained according to regulation and event type:

| Regulation | Event Type | Minimum Retention | Rationale |
|-----------|-----------|----------|-----------|
| **GDPR** | All processing logs | Purpose-limited (6 months default) | Data minimization + purpose limitation |
| **GDPR** | Access logs (data subject requests) | 3 years | Audit trail for regulatory inspection |
| **SOC 2** | All security events | 1 year | Industry standard for compliance |
| **SOC 2** | Authentication/authorization | 1 year | User identity verification |
| **HIPAA** | All PHI access logs | 6 years | Regulatory requirement |
| **HIPAA** | Audit logs for covered entities | 6 years | eCFR 164.312(b) |
| **PCI-DSS** | Payment card interactions | 1 year minimum | Card industry requirement |
| **Industry Default** | General operational logs | 90 days | Cost-benefit; escalate material events |

**Purge Procedure:**
- Automated, scheduled deletion on retention expiry
- Export to cold storage (glacier/archive) before deletion
- Deletion logged in audit trail itself
- Certification of deletion provided to compliance team quarterly

---

## Audit Report Generation

Generate compliance-ready reports for audits, regulatory inspections, or internal review:

### By Time Period
```
audit-trail report --start 2026-01-01 --end 2026-04-12 --format pdf
```
Output: Summary of all events, with high-level statistics and drill-down sections.

### By Compliance Framework
```
audit-trail report --framework gdpr --output gdpr_audit_2026_q1.json
```
Output: Filtered logs relevant to GDPR (data access, consent, retention, breach detection).

### By Event Type
```
audit-trail report --event-type dlp_scan --severity high --output dlp_incidents_2026.csv
```
Output: Spreadsheet of all DLP incidents for review by security team.

### By Actor
```
audit-trail report --user-id usr_abc123 --output user_activity_abc123.json
```
Output: All events triggered by a specific user (access review, deprovisioning).

### By System
```
audit-trail report --system guardrails --action blocked --output blocked_events_2026_q1.csv
```
Output: All guardrail blocks for quality review and tuning.

---

## Integration with SIEM / GRC Tools

Log files are exported in formats compatible with major platforms:

- **JSON-lines**: Native Splunk, ELK Stack, Datadog ingestion
- **CSV**: Excel, Tableau, Salesforce Analytics Cloud
- **Syslog**: Forwarding to centralized logging (rsyslog, syslog-ng)
- **API streaming**: Real-time webhook delivery to GRC platforms (AuditBoard, Workiva, etc.)

**Example Splunk query:**
```
sourcetype=sentinel_audit event_type=guardrail_decision action=block
| stats count by guardrail_name, severity
| timechart count by guardrail_name
```

---

## Immutability & Tampering Detection

Audit logs support immutability controls:

- **Optional write-once storage**: WORM (Write-Once Read-Many) filesystem or cloud storage
- **Hash chaining**: Each event includes hash of previous event (blockchain-style)
- **Cryptographic signing**: Optional HMAC-SHA256 signature for log batches
- **Log integrity validation**: Tool to verify log chain integrity and detect tampering

Example hash chain:
```json
{
  "event_id": "evt-2026-04-12-0005",
  "previous_event_hash": "sha256:d0g5f3b...",
  "event_hash": "sha256:e1h6g4c...",
  "signature": "hmac_sha256:f2i7h5d..."
}
```

---

## Export & Compliance Delivery

### For Internal Audits
1. Generate report filtered by time range + event types
2. Anonymize user names if needed (PII protection)
3. Deliver as PDF with executive summary + detailed logs
4. Include control effectiveness assessment

### For Regulatory Inspections
1. Export all logs for requested period
2. Provide data dictionary explaining log schema
3. Certify completeness and integrity
4. Supply log retention policy documentation

### For Customer Data Requests (GDPR Article 15)
1. Extract all logs involving data subject's data
2. Redact other users' PII
3. Deliver in human-readable format (PDF or CSV)
4. Track fulfillment in audit trail (meta-audit)

---

## Dashboard & Monitoring

Real-time audit trail dashboard displays:
- **Event volume trends** (guardrails, DLP scans, approvals)
- **Blocked vs. allowed ratio** (guardrail effectiveness)
- **Time-to-approval metrics** (4-eyes workflow SLA tracking)
- **Top guardrail triggers** (policy violations detected)
- **Incident spike detection** (anomaly alerts)
- **User activity heat map** (access patterns)

---

## Integration Points

- **guardrails skill**: Automatic log capture on every block/allow decision
- **dlp skill**: DLP scan results auto-logged
- **policy-drafter skill**: Policy changes logged with version
- **vendor-ai-risk skill**: Vendor assessment decisions logged
- **config/org-config.yaml**: Pulls `org.id`, `org.jurisdiction`, retention policies

---

## Best Practices

✓ Centralize all audit logs in one immutable repository  
✓ Export and archive to cold storage monthly  
✓ Test log integrity and recovery procedures quarterly  
✓ Review high-severity logs within 24 hours  
✓ Document log retention policies in compliance manual  
✓ Train staff on log access controls and need-to-know  
✓ Correlate logs across systems to detect coordinated abuse  
✓ Use logs to improve guardrail tuning and policy effectiveness  

---

**Prompt Guidance for LLM:**

When generating audit reports, ask:
- What time period should the report cover?
- Which regulations/frameworks apply? (GDPR, HIPAA, SOC 2, etc.)
- What is the audience? (Internal audit, regulator, customer, legal)
- Should PII/sensitive data be redacted?
- What format is required? (PDF, CSV, JSON, Syslog stream)
- Any specific event types or actors of interest?

Then synthesize logs into a clear, actionable narrative with statistics, anomalies, and recommendations.
