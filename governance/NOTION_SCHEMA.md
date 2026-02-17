# NOTION_SCHEMA.md (v1.0) — Studio Operating System

**Status:** Ratified  
**Goal:** Single pane of glass for repo state, audits, readiness, DEMO/REAL maps.

## 1) Active Repo Dashboard (Database)
Fields:
- Repo Name (title)
- Tier (select: tier:1-core, tier:2-system, tier:3-feature, tier:4-experimental, tier:archive)
- CI Status (select: green / yellow / red)
- Last Commit (text or URL)
- Open sev:0 (number)
- Open sev:1 (number)
- Branch Protection (checkbox)
- Demo Eligible (checkbox)
- Real Eligible (checkbox)
- Readiness Score (number)
- Notes (rich text)

## 2) Audit Log (Database)
Fields:
- Date (date)
- Action Type (select: label change / merge / config update / purge / waiver / policy change)
- Repo (relation to Active Repo Dashboard)
- Reference Link (url)
- Approved By (person/text)
- Notes (rich text)
- DR # (text)
- Severity (select: sev:0..sev:4 if applicable)

Rule:
- Every exception/waiver must be logged here.

## 3) Severity Tracking Board (Database or View)
Grouped by:
- sev:0-critical
- sev:1-high
- sev:2-medium
- sev:3-low
- sev:4-noise

Fields:
- Issue/PR Title
- Repo (relation)
- Severity (select)
- Tier (rollup)
- Assigned (person)
- Days Open (formula)
- Watchtower Flag (checkbox)
- Link (url)

## 4) DEMO Map (Database)
Fields:
- Repo (relation)
- Branch (text)
- Demo Environment (text)
- Demo Status (select)
- Last Demo Date (date)
- Owner (person/text)
- Blocking Issues (relation to Severity Tracking)

## 5) REAL Map (Database)
Fields:
- Repo (relation)
- Production Branch (text)
- Release Tag (text)
- CI Health (select)
- Required Approvals (multi-select)
- Readiness Score (rollup/number)

## 6) Build Readiness Board (View + Scoring)
Score defined in `BUILD_READINESS_RULES.md`.

## 7) Repo Purge List (Database)
Fields:
- Repo (text or relation)
- Last Activity (date/text)
- Tier (select)
- Decision (select: archive / merge / delete / keep)
- Owner (person/text)
- Decision Date (date)
- Archive Location (text)

## 8) Vision Splash IP Page (Page)
Contains:
- Canon mission
- Repo definitions
- Governance rules (links)
- Watchtower policy link
- Label system reference

End.

