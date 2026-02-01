cat > README.md <<'EOF'
# alligatorbrain-ops

Personal Ops system (Notion replacement) for:
- Daily Ops (Morning + Evening)
- Personal life + errands
- Finances + bill reminders
- Ashley house/admin
- Build execution support (Director’s Console + Real Build)

## Repo notes
- This repo is intentionally separate from `directors-console` to avoid scope contamination.
- Drops from agents/tools go in `docs/drops/` (raw) and get summarized into canonical docs under `docs/`.

## Key docs
- Agent rules: `docs/agent/README.md`
- Ashley ops categories: `docs/ops/ASHLEY_OPS_CATEGORIES.md`
- Bills schema: `docs/schema/BILLS_SCHEMA.md`
- Raw drops: `docs/drops/`
EOF
