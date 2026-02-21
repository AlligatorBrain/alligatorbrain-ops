# AB Software Factory Charter v0.1
**Status:** LAW (active)  
**Scope:** Alligator Brain System (AB) repos + workflows  
**Owner:** Navigator (Human)  
**Enforced by:** Watchtower (Drift Control), Repo Policies, CI gates  
**Last updated:** 2026-02-20

---

## 1) Purpose
Build AB as a **software factory**: specs + scenarios produce software reliably, with governance that prevents drift, hallucinated authority, and demo contamination.

---

## 2) Authority Hierarchy (Non-Negotiable)
1. **Law** (Charters, Ontology, Policy Canon)  
2. **Decision Records (DRs)** (signed human decisions)  
3. **Specifications** (what to build)  
4. **Scenarios** (Public + Holdout)  
5. **Code** (implementation)  
6. **Chat / Notes / Draft Output** (never authoritative)

**Rule:** Code is never the source of truth. Generated output is never authoritative until promoted through evidence + a DR when required.

---

## 3) Roles
### Navigator (Human)
- Writes intent + specs.
- Approves Law changes.
- Signs Decision Records (DRs).
- Evaluates outcomes.
- Owns accountability.

### Codex (AI Implementation Agent)
- Produces audits and maps.
- Drafts specs and code when authorized.
- Generates **scenario seeds**.
- **Never self-authorizes.**  
- **Never promotes drafts to Law.**

### Watchtower (Drift Control)
- Enforces authority hierarchy.
- Detects drift (assumptions, deferrals, “helpful” → authoritative).
- Requires a single corrective adjustment when drift is detected.

---

## 4) Human Decision Gate (Critical Logic Protection) ✅
No autonomous system may modify the following without a **signed Decision Record (DR)**:

- **Ontology / Core Model / Entity Definitions**
- **Financial logic** (waterfalls, ROI, recoupment order)
- **Rights logic** (Chain of Title, licenses, windows, avails)
- **Insurance logic** (E&O structures, alternatives)
- **Governance rules** (this charter, policy canon)
- **Tiering / branch protections / release rules**
- **Scenario harness rules** (what counts as pass/fail)

If uncertain, **default to DR required**.

---

## 5) DEMO vs REAL Isolation Clause ✅
DEMO surfaces exist to communicate the story and earn trust. REAL exists to be durable.

**Hard rule:**  
- DEMO may **mock** and **simulate**.  
- DEMO may **not redefine ontology**.  
- DEMO may not become the source of truth for REAL behavior.

**Separation requirements:**
- Demo-only data, UI, and flows must be explicitly labeled **DEMO_ONLY**.
- Any shared schemas must originate from **Ontology/Specs**, not UI.
- No demo shortcut may silently bleed into REAL implementation.

---

## 6) Audit Output Standard (Now Required)
Every repo audit must output:

1. Architecture summary  
2. Risk flags  
3. Red flags  
4. Cleanup candidates  
5. Illusion detection (looks finished but isn’t)  
6. **Scenario Seeds (NEW)**
   - **3–10 behavior scenarios** implied by the code
   - **1–3 holdout scenarios** stored outside the repo (truth-gating later)

---

## 7) Scenarios: Public vs Holdout
### Public Scenarios (In-repo)
- Used in CI to prevent regressions.
- Must represent stable, agreed behavior.

### Holdout Scenarios (Out-of-repo)
- Stored separately so the builder **cannot game them**.
- Used for truth-gating autonomy and validating “works in reality.”

**Rule:** Holdouts are evaluated by humans/Watchtower, not optimized against.

---

## 8) Evidence: What Counts
Evidence is required to promote anything upward in the hierarchy.

Accepted evidence:
- Passing scenario runs (public + holdout where applicable)
- CI logs, build artifacts, checksums
- Repro steps + before/after outputs
- Screenshots/video of deterministic behavior
- Security or dependency scan results
- DR links referencing the above artifacts

Not evidence:
- “It seems right”
- “Model said”
- “Demo looked good”
- Unverified notes

---

## 9) Drift Scan (Watchtower) — Daily/Per-Session
At minimum, answer:

1) **Is Codex assuming more than it should?**  
2) **Am I deferring instead of deciding?**  
3) **Did anything “helpful” become authoritative?**

If **no** → continue.  
If **a little** → adjust **one thing only** (single correction rule).

---

## 10) File Layout (Canonical)
- `governance/charters/` → active charters (LAW)
- `governance/dr/` → Decision Records
- `specs/` → product + system specifications
- `scenarios/public/` → in-repo scenario suite
- `scenarios/holdout/` → **out-of-repo** truth gates (separate store)
- `evidence/` → evidence bundles linked from DRs/specs

---

## 11) Operating Rule
We do not “go faster by guessing.”
We go faster by:
- tightening specs,
- raising scenario coverage,
- protecting Law with DR gates,
- and keeping DEMO isolated from REAL.

**This Charter is enforceable.**
