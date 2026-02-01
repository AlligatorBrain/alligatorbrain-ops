# Notion Replacement Spec (v0.1) — alligatorbrain-ops

Status: Draft (seed)
Owner: Rick
Repo: alligatorbrain-ops
Scope: Local-first personal ops + household ops + build support

## Objective
Replace Notion with a lightweight, structured “Ops OS” that:
- Runs Daily Ops (morning/evening)
- Tracks finances + bills with reminders
- Manages Ashley house/admin responsibilities
- Supports build execution (Director’s Console + Real Build) without polluting those repos
- Stays simple, auditable, and easy to extend with Codex MAX later

## Non-Goals (for v0.1)
- No multi-user permissions system
- No full accounting system (we track bills, payments, receipts; not double-entry)
- No complex integrations on day one (bank sync, vendor APIs, etc.)
- No “second brain” features beyond what supports execution

## Guiding Principles
- Local-first, repo-based truth (markdown + simple data files)
- Human-readable + agent-ingestible structure
- Minimal ceremony: capture → review → execute → evidence
- Separate “raw drops” from “canonical” docs

## Top-Level Modules
### 1) Daily Ops (Morning + Evening)
Purpose: run the day and close the day.
Artifacts:
- docs/daily/MORNING_ROUTINE.md
- docs/daily/EVENING_ROUTINE.md
- docs/daily/DAILY_LOG/YYYY-MM-DD.md

Core fields in daily log:
- Top 3 outcomes
- Appointments / constraints
- Bills due soon
- Errands
- Build focus block(s)
- Evidence / receipts / notes

### 2) Bills + Finance Ops
Purpose: track recurring bills + reminders.
Canonical schema:
- docs/schema/BILLS_SCHEMA.md (already created)

Planned artifacts:
- docs/bills/BILLS.md (human list)
- data/bills.json (optional later; agent-friendly)
- docs/bills/RECEIPTS/YYYY/MM/<vendor>-<date>.md (links/files)

Reminder rules (baseline):
- T-7: heads-up
- T-2: confirm funds + autopay status
- T day: confirm paid + note receipt

### 3) Ashley Ops (House/Admin)
Purpose: keep her house and finances stable while she’s away.
Canonical categories:
- docs/ops/ASHLEY_OPS_CATEGORIES.md (already created)

Planned artifacts:
- docs/ops/ASHLEY_BILLS.md (vendors + due days)
- docs/ops/ASHLEY_MAINTENANCE_LOG.md
- docs/ops/ASHLEY_TRIP_NOTES.md (if needed)
- docs/ops/ASHLEY_WEEKLY_REVIEW.md

### 4) Personal Life + Admin
Purpose: errands, health admin, home projects, scheduling.
Artifacts:
- docs/personal/ERRANDS.md
- docs/personal/APPOINTMENTS.md
- docs/personal/HOUSE_PROJECTS.md

### 5) Build Execution Support (Read-Only Pointers)
Purpose: support Director’s Console + Real Build without duplicating those repos.
Artifacts:
- docs/build/BUILD_INDEX.md (links out to repos, PRs, tags, call sheets)
- docs/build/DECISIONS_INDEX.md (DR pointers only)
- docs/build/RESEARCH_DROPS_INDEX.md (links to docs/drops)

## Repo Structure (Proposed)
- docs/
  - agent/ (rules for agents)
  - ops/ (Ashley + household ops)
  - schema/ (data models)
  - daily/ (routines + daily logs)
  - bills/ (bills, receipts index)
  - personal/ (errands/admin)
  - build/ (pointers + summaries)
  - drops/ (raw outputs, imports, paste dumps)
- data/ (optional later: structured json/csv)
- attachments/ (optional later: PDFs, images)

## Drops vs Canon
- docs/drops/ = raw, unedited, time-stamped captures (Copilot, notes, imports)
- docs/** (non-drops) = canonical, curated, stable docs

Rule: never “build on” a drop directly — convert it into canon first.

## Constraints
- Keep it lightweight: markdown first
- Avoid secrets in repo (no credentials; reference “where stored” only)
- No destructive automation; humans approve changes
- Agents run Audit/Suggest Only unless explicitly asked

## Validation (v0.1)
- Can run daily from docs/daily routines + daily logs
- Bills can be listed with due rules + reminder cadence
- Ashley ops has clear vendor list + maintenance log placeholders
- Drops are stored and indexed without becoming the product
- Repo stays clean (gitignore covers OS junk + node/build output)

## Next Actions
1) Create docs/daily/MORNING_ROUTINE.md + EVENING_ROUTINE.md (short, actionable)
2) Create docs/bills/BILLS.md (fill vendors + due days as you gather them)
3) Create docs/ops/ASHLEY_BILLS.md (vendors + accounts + due days)
4) Create docs/build/BUILD_INDEX.md (pointers to directors-console + tier1-ui + tags)
5) Later with Pro/Codex MAX: generate a minimal local app/UI (Atlas-style) that reads/writes these artifacts safely
