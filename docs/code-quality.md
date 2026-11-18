# Code Quality Strategy

This document summarizes the tooling and processes that enforce code quality in this repository.

## Layers

The strategy uses four layers, from fastest (local) to slowest (remote):

| Layer           | Tool                | When              | What it checks                      |
| --------------- | ------------------- | ----------------- | ----------------------------------- |
| Pre-commit hook | Husky + lint-staged | `git commit`      | Prettier formatting on staged files |
| Local command   | npm scripts         | On demand         | Format check, lint, tests           |
| CI              | GitHub Actions      | Push/PR to `main` | Format check, lint, tests           |
| Tests           | Vitest              | With every run    | Unit + build output tests           |

Each layer is a safety net: the hook catches obvious formatting issues before you commit, local commands let you verify before pushing, and CI is the gatekeeper that blocks bad code from landing on `main`.

## Formatting: Prettier

**Config:** `.prettierrc` (root) + `.prettierignore`

Prettier enforces consistent code style across all file types: `.js`, `.ts`, `.css`, `.json`, `.njk`, `.md`. The `.prettierignore` file excludes `node_modules/`, build output (`dist/`, `_site/`), generated PDFs, and `.git/`.

**Why:** Eliminates style debates and keeps diffs focused on actual logic changes. The pre-commit hook auto-formats staged files, so you never have to run it manually.

**Commands:**

- `npm run format` — formats all files
- `npm run format:check` — checks without modifying (used in CI)

## Linting: ESLint

**Config:** `eslint.config.js` (flat config, ESM)

ESLint checks JavaScript files for code quality issues. Rules are kept minimal: ESLint recommended rules plus `no-unused-vars` as a warning. The config targets ESM modules and acknowledges both browser and Node.js globals.

**Why:** Catches real bugs (unused variables, syntax issues) that formatting alone can't detect. Kept opinion-light to avoid friction.

**Commands:**

- `npm run lint` — checks all `.js` files
- `npm run lint:fix` — auto-fixes what it can

## Pre-commit Hook: Husky + lint-staged

**Config:** `.husky/pre-commit` + `.lintstagedrc`

On every `git commit`, the hook runs Prettier only on staged files via lint-staged. It does not run tests or lint — those are left to CI.

**Why:** Catches formatting issues at commit time with near-zero friction. Running only on staged files keeps it fast. Skipping tests and lint avoids slow commits and environment-dependent failures locally.

The `.husky/_/` directory is auto-generated at install time and tracked in `.gitignore`. Only `.husky/pre-commit` is committed.

## CI: GitHub Actions

**Config:** `.github/workflows/ci.yml`

Runs on push and pull request to `main`. Installs dependencies with `npm ci`, then runs `format:check`, `lint`, and `test` in sequence on Node.js 20.

**Why:** CI is the source of truth — it runs in a clean, consistent environment, unaffected by local setup differences. Protects `main` from code that doesn't pass the project's own checks. Running only on `main` (not all branches) saves CI minutes on a free-tier account while still protecting the integration branch.

## Tests: Vitest

**Config:** `static-app/` uses Vitest; test files live in `static-app/test/`.

Tests cover the core `_data/cv.js` module (unit tests + error handling) and the Eleventy build output (HTML validation).

**Why:** Tests verify that the data layer produces correct output and that the build generates valid HTML. Placed under `test/` (not `_data/`) to prevent Eleventy from auto-loading them.

**Command:** `npm run test` (runs from root, delegates to `static-app/`)

## Design Decisions

- **Prettier only in pre-commit, not tests or lint:** Formatting is fast and auto-fixable, so catching it at commit time is sufficient. Tests and lint are heavier and better left to CI where the environment is consistent.
- **CI on `main` only:** The free tier gives 2,000 Linux minutes/month. Running only on `main` protects the integration branch without wasting minutes on incomplete feature branches.
- **Minimal ESLint rules:** The project is small and personal. Heavy linting rules add friction without proportional benefit for this scale.
- **Monorepo with workspaces:** Root `package.json` delegates to `static-app/` via workspace scripts, keeping tooling centralized while the app remains self-contained.
