# GOVERNANCE.md (v1.0) — Alligator Brain Governance Spine

**Status:** Ratified (Constitutional Baseline)  
**Scope:** Org-wide governance for repos, labels, CI health, readiness gates, and audit trail  
**Effective:** Immediate  
**Non-goals:** Product logic, feature design, UI work, experiments

## 0) The Point
We are building a studio system, not “a pile of repos.” This spine prevents entropy, makes health measurable, and creates investor-grade operational credibility.

---

## 1) Definitions (Non-Negotiable)
- **Canonical labels** are the *only* labels allowed. Freeform labels are removed.
- **Severity** is mandatory on every issue/PR. Exactly one severity label.
- **Tier** expresses structural importance and determines enforcement strictness.
- **Readiness** is an objective score used to gate DEMO/REAL readiness.
- **Watchtower** is an enforcement sensor. It flags; it does not interpret.

---

## 2) Canonical Labels (Org-Wide Lock)
See: `LABEL_SYSTEM.md` (source of truth)

Core rule:
- **No issue/PR without exactly one `sev:*` label.**
- Missing severity is a policy violation.

---

## 3) Tier System (Structural Importance)
See: `LABEL_SYSTEM.md`

Tier affects:
- Branch protection requirements
- CI enforcement strictness
- Readiness thresholds

---

## 4) Merge & Release Gates
### 4.1 Merge Gate (All repos)
A PR may not merge unless:
- It has **exactly one severity label**
- It has **one status label** (as appropriate)
- Tier label exists for the repo (repo-level metadata in Notion)
- CI checks are passing (unless explicitly waived in Audit Log)

### 4.2 DEMO Gate
A repo is **DEMO Eligible** only if:
- CI = GREEN
- No open `sev:0-critical`
- Readiness ≥ **70** (default; adjust later)

### 4.3 REAL Gate
A repo is **REAL Eligible** only if:
- Tier:1 branch protection enforced
- CI = GREEN for 48 hours rolling (policy default)
- No open `sev:0-critical`
- Readiness ≥ **85**
- Required approvals satisfied (Notion / Approval Desk)

---

## 5) Watchtower Policy
Watchtower monitors:
- Workflow health (recent failures)
- PR checks
- Open `sev:0`/`sev:1` counts + age
- Missing required labels
- Branch protection status (Tier:1)

Escalation:
- `sev:0-critical` → immediate escalation
- `sev:1-high` → daily governance digest
- `sev:2+` → batched reporting

See: `WATCHTOWER_POLICY.md`

---

## 6) Notion is the Operating System
Notion is where:
- Repo registry lives (tier, branch protection, demo/real eligibility)
- Audit log lives (decisions, exceptions, waivers)
- Severity boards live (triage + execution)
- DEMO/REAL maps live
- Purge list lives

See: `NOTION_SCHEMA.md`

---

## 7) Audit Trail (Legal/Investor Discipline)
All exceptions require an entry in the Audit Log:
- severity waivers
- branch protection waivers
- CI waivers
- emergency merges

Rule:
- If it isn’t logged, it didn’t happen.

---

## 8) Enforcement Rules (Hard)
- No repo without canonical labels
- No merge without severity
- No Tier:1 repo without branch protection
- No DEMO without GREEN CI
- No REAL without readiness ≥ 85

---

## 9) Drift Discipline (Weekly)
Once per week, we run a Drift Scan:
1) Is Codex assuming more than it should?
2) Are we deferring instead of deciding?
3) Did anything “helpful” become authoritative?

If drift is detected:
- Adjust **one thing only** (single-rule correction)

---

## 10) Two Missing Pieces (Now Included)
### 10.1 Authority Chain
- GOVERNANCE.md is law.
- LABEL_SYSTEM.md defines taxonomy.
- WATCHTOWER_POLICY.md enforces + reports.
- NOTION_SCHEMA.md records state + decisions.
- BUILD_READINESS_RULES.md defines scoring.

### 10.2 Change Control
Any change to this governance system requires:
- A governance issue labeled `gov:law` or `gov:policy`
- A DR reference in Audit Log
- Version bump (v1.0 → v1.1)

End.
