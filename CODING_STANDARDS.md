# Coding Standards

This document codifies the conventions used in this project so that any agent or contributor can follow them consistently.

## Module System

- **ESM only.** All `.js` files use `"type": "module"` (set in `package.json`). Never use `require()` or `module.exports`.
- For `__dirname`/`__filename`, derive them from `import.meta.url`:
  ```js
  import { fileURLToPath } from "url";
  import { dirname } from "path";
  const __filename = fileURLToPath(import.meta.url);
  const __dirname = dirname(__filename);
  ```

## Test Organization

- Test files live in `static-app/test/`, **not** in `_data/` (Eleventy auto-loads `_data/` and would treat tests as data).
- Naming: `*.test.js` (e.g., `cv.test.js`, `build.test.js`).
- Framework: Vitest. Import from `"vitest"`:
  ```js
  import { describe, it, expect, beforeEach, afterEach, vi } from "vitest";
  ```
- Use nested `describe` blocks to group by module, then by feature or getter.
- For tests that need to reload modules, use `vi.resetModules()` in `beforeEach`.
- Build output tests read from `_site/` (the Eleventy output directory). A build must run before these tests.

## Nunjucks Templates

- Templates use `.njk` extension and live in the `static-app/` root (pages) or `_includes/` (layouts/partials).
- Layouts are referenced via front matter:
  ```njk
  ---
  layout: layout.njk
  ---
  ```
- Content from `cv/` markdown files is trusted but auto-escaped by default. Use `| safe` filter to render HTML:
  ```njk
  {# safe: authored MD from cv/ #}
  {{ cv.summary | safe }}
  ```
- Always comment `| safe` with `{# safe: ... #}` to document why the content is trusted.
- Use 2-space indentation in `.njk` files.

## Data Files (`_data/`)

- Files in `_data/` are auto-loaded by Eleventy as global data. Export a default object or value.
- Shared configuration (e.g., `markdown.js`) should be a standalone module imported by other `_data/` files, not a data file itself.
- CV content is stored as markdown files in `_data/cv/` and read by `_data/cv.js` at build time.

## Naming Conventions

- **Files:** kebab-case (e.g., `cv.test.js`, `markdown.js`, `layout.njk`).
- **Directories:** kebab-case (e.g., `_data/`, `_includes/`, `test/`).
- **JavaScript exports:** `export default` for the primary module export; named exports for utilities.
- **CSS classes:** kebab-case (e.g., `skip-to-content`).

## Formatting and Linting

- **Prettier** formats all files. Run `npm run format:fix` or let the pre-commit hook handle staged files.
- **ESLint** checks JavaScript with recommended rules + `no-unused-vars` as warning. Config in `eslint.config.js`.
- CI runs `format`, `lint`, and `test` on every push/PR to `main`.

## Eleventy Configuration

- Config file: `static-app/.eleventy.js`.
- Static assets are passed through explicitly via `addPassthroughCopy()`.
- DOM diffing is disabled (`domDiff: false`) to ensure full reloads on layout changes.
- Template formats: `njk`, `html`, `11ty.js`. Markdown files are not processed as templates.
