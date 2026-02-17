# LABEL_SYSTEM.md (v1.0) — Canonical Labels (Org-Wide)

**Status:** Ratified  
**Scope:** Labels allowed across all repos

## 1) Severity (Mandatory — Exactly One)
- `sev:0-critical` — production broken / demo blocked / security incident
- `sev:1-high` — core flow impaired / major regression
- `sev:2-medium` — important but not blocking
- `sev:3-low` — non-urgent
- `sev:4-noise` — log-only / informational

Rules:
- Exactly one severity label per issue/PR
- Missing severity = policy violation

## 2) Tier (Repo Classification)
- `tier:1-core` — ab-core, directors-console, governance/ops, infra
- `tier:2-system` — bridges, registry, ledger, deployment infra
- `tier:3-feature` — feature modules
- `tier:4-experimental` — sandbox / labs
- `tier:archive` — legacy / inactive

Rules:
- Tier is defined for repos in Notion Repo Registry.
- Issues/PRs may include tier if cross-repo or ambiguous; otherwise repo tier governs.

## 3) Status (Work State)
- `status:triage`
- `status:ready`
- `status:in-progress`
- `status:blocked`
- `status:review`
- `status:merged`
- `status:deferred`

Rule:
- Use exactly one status label while active.

## 4) Governance Tags (Authority & Control)
- `gov:policy`
- `gov:law`
- `gov:taxonomy`
- `gov:infra`
- `gov:security`

Rule:
- Anything touching enforcement, monitoring, readiness, or label rules must carry a `gov:*` label.

## 5) Domain Tags (Optional)
- `domain:watchtower`
- `domain:notion`
- `domain:ci`
- `domain:demo`
- `domain:release`

Rule:
- Domain tags are allowed but optional. No new domains without governance change.

## 6) Canonical Rule
No freeform labels.
If it isn’t here, it gets removed.

End.
