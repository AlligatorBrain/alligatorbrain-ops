# BUILD_READINESS_RULES.md (v1.0) — Scoring + Gates

**Status:** Ratified  
**Purpose:** Objective readiness to gate DEMO and REAL work.

## 1) Score (Start at 100)
Subtract:
- -20 for each open `sev:0-critical`
- -10 for each open `sev:1-high`
- -15 if CI Status = red
- -8 if CI Status = yellow
- -10 if branch protection missing (Tier:1 only)
- -5 if label violations exist (missing severity / non-canonical labels)

Optional adds (later):
+5 for 7-day green streak (Tier:1)
+3 for zero open sev:1 for 7 days

## 2) Readiness Thresholds
- DEMO Eligible: Readiness ≥ 70 AND CI green AND no open sev:0
- REAL Eligible: Readiness ≥ 85 AND CI green AND no open sev:0 AND Tier:1 branch protection enforced

## 3) Enforcement
- Watchtower reports readiness; Notion records it.
- Waivers require Audit Log entry.

End.
