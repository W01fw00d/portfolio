# Static App

Eleventy-based static site that renders CV data from the `_data/cv/` directory into a single HTML portfolio page.

## Prerequisites

- Node.js 18+
- npm

## Installation

This package is set up as an npm workspace. Install dependencies from the monorepo root:

```bash
npm install
```

Dependencies (`@11ty/eleventy`, `markdown-it`) are hoisted to the root `node_modules/` but are owned by this package's `package.json`.

## Usage

You can also run commands directly inside this directory:

| Command           | Description                                   |
| ----------------- | --------------------------------------------- |
| `npm run clean`   | Remove the `_site/` output directory          |
| `npm run build`   | Build the site to `_site/`                    |
| `npm run dev`     | Build and start a dev server with live reload |
| `npm run preview` | Serve the built output from `_site/`          |
| `npm test`        | Run all tests                                 |

## How It Works

1. The `_data/cv.js` module reads Markdown files from the `_data/cv/` directory.
2. Each Markdown file is converted to HTML using `markdown-it`.
3. The `layout.njk` template renders the CV sections using the processed data.
4. Eleventy generates a single `index.html` file in `_site/`.

## Configuration

Eleventy configuration is in `.eleventy.js`. Key settings:

- **Input directory:** Default (root of `static-app/`)
- **Output directory:** `_site/` (Eleventy default)
- **Watched directories:** Eleventy automatically watches `_data/` (including `cv/`) and `_includes/`
- **Template formats:** `.njk`, `.html`, `.11ty.js`
- **Static assets:** CSS and JS live in `assets/` and are copied to `_site/assets/` via passthrough copy

Site metadata (base URL) is stored in `_data/site.json`.

## Tests

The project uses **Vitest** and has four test suites in the `test/` directory:

| Test File          | Type                     | What It Tests                                                                                 |
| ------------------ | ------------------------ | --------------------------------------------------------------------------------------------- |
| `cv.test.js`       | Unit tests               | The `_data/cv.js` module — data loading and markdown-to-HTML conversion                       |
| `cv-error.test.js` | Error handling tests     | The `_data/cv.js` module — missing file error handling with mocked `fs` module                |
| `build.test.js`    | Build output tests       | The generated `_site/index.html` — HTML structure, metadata, sections, and accessibility      |
| `content.test.js`  | Content validation tests | Raw markdown files in `_data/cv/` — file existence, naming conventions, and content structure |
