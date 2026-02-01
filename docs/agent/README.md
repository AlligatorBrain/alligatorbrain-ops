# Agent Rules — Audit/Suggest Only (Repo Local)

## Mode
**Audit/Suggest Only.**
- You may read files, search, summarize, and propose minimal diffs/patches.
- You may generate QA notes, checklists, runbooks, and DR-style writeups.

## Hard NOs (do not run)
- Do NOT start servers or long-running processes:
  - no `npm run dev`, `next dev`, `vite`, etc.
- Do NOT run destructive or potentially destructive commands:
  - no `rm -rf`, `git reset --hard`, `git clean -fd`, `sudo`, installers, OS changes
- Do NOT change files automatically unless explicitly asked in this repo.

## Allowed commands (safe)
- Read/search: `ls`, `cat`, `sed -n`, `rg`, `find`, `git status`, `git diff`, `git log`
- Verification-only: `node -v`, `npm -v` (no installs), `git show`
- Produce patch text/diffs for human review.

## Output format (preferred)
When proposing work, use:
- Objective
- Findings (F-###)
- Proposed patch (diff)
- Risk
- Validation / Test plan
- Next actions
