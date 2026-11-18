---
sessionId: session-261117-172638-7yw2
---

# Requirements

### Overview
Add unit tests for `static-app/_data/cv.js` — the core module that reads markdown CV files and converts them to HTML. This is the only JavaScript logic in the project and the primary seam for testing.

### What we're testing
The `cv.js` module exposes the following getters:
- **Simple file readers** (`name`, `jobTitle`, `jobSubtitle`) — read plain text from markdown files.
- **Markdown-to-HTML converters** (`location`, `urls`, `summary`, `skills`, `education`, `languages`) — read markdown and render HTML via `markdown-it`.
- **Directory scanner** (`experience`) — recursively reads all `.md` files in the `experience/` subdirectory.
- **Dynamic value** (`lastUpdated`) — returns the current date in "Month Year" format.
- **Error handling** — all getters log and re-throw when files are missing.

### Test Framework
- **Vitest** — chosen because it's fast, ESM/CommonJS compatible, and works well with Node.js projects without a build step. It's already mentioned in the CV skills list.
- Tests will mock `fs` module (`readFileSync`, `readdirSync`) to avoid depending on the actual file system, making tests fast and deterministic.

### Out of Scope (for now)
- Build verification tests (checking Eleventy output HTML).
- Content validation tests (checking markdown file content).
- Template tests (Nunjucks rendering).

# Technical Design

### Current Implementation
`cv.js` uses Node.js `fs` module to read files and `markdown-it` to convert markdown to HTML. The module structure:
- Helper functions: `readMarkdownFile()`, `markdownToHtml()`, `getMarkdownFiles()`, `readSimpleFile()`.
- Exported getters that call these helpers.
- Pre-processes `www.` URLs to `http://www.` before markdown rendering.

### Key Decisions
- **Mock `fs` module** — Tests will mock `readFileSync` and `readdirSync` to control file content without depending on the actual `cv/` directory. This makes tests fast and isolated.
- **Test at the getter seam** — Each test calls a getter (e.g., `cv.name`) and asserts the returned value, matching the TDD skill's guidance to test public interfaces.
- **No snapshot tests** — We'll use explicit assertions to avoid tautological tests. Expected values will be independent literals.

### Test File Structure
```
static-app/
├── _data/
│   └── cv.js
└── test/
    └── cv.test.js
```

### Test Cases

**1. `lastUpdated` getter**
- Returns current date in "Month Year" format (e.g., "November 2026").
- Matches the pattern `/^[A-Z][a-z]+ \d{4}$/`.

**2. Simple file getters (`name`, `jobTitle`, `jobSubtitle`)**
- Return trimmed content from the corresponding markdown file.
- Throw when the file is missing.

**3. Markdown-to-HTML getters (`location`, `urls`, `summary`, `skills`, `education`, `languages`)**
- Convert markdown to HTML (e.g., `# Title` → `<h1>Title</h1>`).
- Pre-process `www.` URLs to `http://www.` for linkification.
- Throw when the file is missing.

**4. `experience` getter**
- Read all `.md` files in the `experience/` subdirectory.
- Return an array of HTML strings, sorted by relative path.
- Handle nested directories (recursive scanning).
- Throw when a file is missing.

**5. Error handling**
- Missing files produce console error logs and throw.

# Delivery Steps

### ✓ Step 1: Set up Vitest and write cv.js unit tests
Add Vitest to the project and create the test file with all unit tests for cv.js getters.

- Add `vitest` as a devDependency in `static-app/package.json`.
- Add a `test` script: `"test": "vitest run"`.
- Add Vitest config in `static-app/vitest.config.js` (or inline in package.json).
- Create `static-app/test/cv.test.js` with tests for:
  - `lastUpdated` returns "Month Year" format.
  - Simple getters (`name`, `jobTitle`, `jobSubtitle`) return trimmed file content.
  - Markdown getters convert markdown to HTML and preprocess `www.` URLs.
  - `experience` getter reads directory files and returns sorted HTML array.
  - Error handling: missing files throw and log errors.
- Mock `fs` module (`readFileSync`, `readdirSync`) in all tests.
- Run `npm test` to validate all tests pass.

### ✓ Step 2: Add build output tests
Add integration tests that verify the Eleventy build produces valid HTML output.

- Create `static-app/test/build.test.js` with tests for:
  - HTML structure: DOCTYPE, html lang, head/body, header/main/footer, accessibility skip link.
  - Head metadata: title, meta description, Open Graph tags, canonical link, stylesheet, favicon.
  - Header section: name in h1, job subtitle, location, social links.
  - Main content sections: summary, experience (with articles), skills, education, languages.
  - Experience entries: all 4 companies rendered as `<article>` elements.
  - Footer: "Month Year" date format and name.
  - Static assets: JavaScript file reference.
- Run `npm test` to validate all tests pass.

### ✓ Step 3: Add markdown content validation tests
Add tests that validate the raw markdown content files are well-formed and properly structured.

- Create `static-app/test/content.test.js` with tests for:
  - All expected markdown files exist in `cv/` directory.
  - Files are non-empty and contain meaningful content.
  - Simple files (name, jobTitle, jobSubtitle) contain plain text without markdown syntax.
  - `urls.md` contains valid markdown links.
  - `skills.md`, `education.md`, `languages.md` contain heading structures.
  - `summary.md` contains a heading and paragraph content.
  - Experience files follow naming convention (`NN-name.md`).
  - Experience files contain required sections: job title, company, date/location, tech stack, key contributions.
- Run `npm test` to validate all tests pass.