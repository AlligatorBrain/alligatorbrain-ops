# WATCHTOWER_POLICY.md (v1.0) — Org Intelligence + Enforcement Sensor

**Status:** Ratified  
**Role:** Watchtower detects violations and reports; it does not interpret governance.

## 1) Repo Registry (No Auto-Discovery)
Watchtower operates from a manual registry file:
- `watchtower_repos.yml`

Repo categories:
1) Core Spine (Tier:1)
2) Active System Repos (Tier:2/3)
3) Experimental (Tier:4 — monitored, filtered)

Rule:
- No auto-discovery. Add repos intentionally.

## 2) What Watchtower Monitors
- Workflow status (recent failures)
- Failed runs (last N)
- PR checks (required checks failing)
- Open issues by severity (`sev:0`, `sev:1`)
- Missing severity labels (issues/PRs)
- Branch protection state (Tier:1)
- Label sprawl (non-canonical labels present)

## 3) Red Conditions (CI / Governance)
A repo is RED if any are true:
- Any failed workflow on Tier:1-core
- Any open `sev:0-critical` older than 30 minutes
- PR merged without severity label
- Missing branch protection on Tier:1-core
- Non-canonical labels exist (after grace period)

## 4) Noise Filtering (Exclusions)
Ignore or down-rank:
- Dependabot minor bumps (configurable)
- Docs-only changes (`docs/**`, `README.md`)
- Self-triggered Watchtower workflows
- Label-only PRs (unless governance label changes)

## 5) Escalation Matrix
- `sev:0-critical` → immediate escalation (channel TBD: Slack/Email)
- `sev:1-high` → included in daily governance digest
- `sev:2+` → batched digest

## 6) Standard Report Format (No Paragraphs)
WATCHTOWER REPORT  
Date:  
Core Health: GREEN / YELLOW / RED  

Open Critical:  
Open High:  
CI Failures:  
Label Violations:  
Blocked PRs:  
Build Readiness Score:  

## 7) Future Automation (After 1 Week of Stability)
Once governance is stable and trusted:
- Auto-remove non-canonical labels
- Auto-apply default `status:triage` on new issues
- Auto-open a governance issue when violations recur

Rule:
- Automation may only act inside strict guardrails and must log actions in Notion Audit Log.

End.
