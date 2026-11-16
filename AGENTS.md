# Project Instructions

## Shared Skills

Before starting a task, inspect:

`..\agents-skills\.agents\skills`

Use the relevant skills when applicable.

## Agent skills

### Issue tracker

Issues live in GitHub Issues for this repo (uses the `gh` CLI). See `docs/agents/issue-tracker.md`.

### Triage labels

Uses the five default labels: `needs-triage`, `needs-info`, `ready-for-agent`, `ready-for-human`, `wontfix`. See `docs/agents/triage-labels.md`.

### Domain docs

Single-context layout: one `GLOSSARY.md` + `docs/adr/` at the repo root. See `docs/agents/domain.md`.

### Plan files

The source of truth for project plan files is `docs/agents/plans/`. Any AI agent working on this repo should place and reference plans there.
