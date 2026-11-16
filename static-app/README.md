# Static App

Eleventy-based static site that renders the CV data from the `cv/` vault at the monorepo root into a single HTML portfolio page.

## Monorepo Structure

This repository is a monorepo with two main components:

- **`cv/`** — A vault of Markdown files containing CV data (personal info, experience, skills, education, languages).
- **`static-app/`** — An Eleventy application that reads the `cv/` data and produces a static HTML page.

```
portfolio/
├── package.json        # Monorepo root (npm workspaces)
├── cv/                 # Markdown vault (source data)
│   ├── personal.md
│   ├── summary.md
│   ├── experience/
│   ├── skills.md
│   ├── education.md
│   └── languages.md
└── static-app/         # Eleventy static site (this package)
    ├── package.json    # Dependencies: @11ty/eleventy, markdown-it
    ├── .eleventy.js    # Eleventy configuration
    ├── src/            # Source files
    │   ├── _data/      # Data files (cv.js reads from ../cv/)
    │   ├── _includes/  # Layout templates
    │   ├── index.njk   # Entry page
    │   ├── styles.css
    │   ├── script.js
    │   └── favicon.svg
    └── dist/           # Built output (generated)
```

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

### From the monorepo root (`portfolio/`)

The root `package.json` delegates to this workspace:

| Command | Description |
|---|---|
| `npm run clean` | Remove the `static-app/dist/` output directory |
| `npm run build` | Build the site to `static-app/dist/` |
| `npm run dev` | Build and start a dev server with live reload |
| `npm run preview` | Serve the built output from `static-app/dist/` |

### From `static-app/` directly

You can also run commands directly inside this directory:

| Command | Description |
|---|---|
| `npm run clean` | Remove the `dist/` output directory |
| `npm run build` | Build the site to `dist/` |
| `npm run dev` | Build and start a dev server with live reload |
| `npm run preview` | Serve the built output from `dist/` |

## How It Works

1. The `_data/cv.js` module reads Markdown files from the `cv/` directory at the monorepo root.
2. Each Markdown file is converted to HTML using `markdown-it`.
3. The `layout.njk` template renders the CV sections using the processed data.
4. Eleventy generates a single `index.html` file in `static-app/dist/`.

## Configuration

Eleventy configuration is in `.eleventy.js` (inside `static-app/`). Key settings:

- **Input directory:** `src/`
- **Output directory:** `dist/`
- **Watched directories:** `src/` (templates) and `../cv/` (Markdown data)
- **Template formats:** `.njk`, `.html`, `.11ty.js`

Site metadata (title, description, base URL) is stored in `src/_data/site.json`.
