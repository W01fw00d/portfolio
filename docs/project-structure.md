---
description: Current directory structure of the portfolio monorepo.
---

# Project Structure

```
portfolio/
├── package.json            # Monorepo root (delegates scripts to static-app/)
├── static-app/             # Eleventy static site
│   ├── package.json        # Dependencies: @11ty/eleventy, markdown-it, vitest
│   ├── vitest.config.js    # Vitest configuration
│   ├── .eleventy.js        # Eleventy configuration
│   ├── index.njk           # Entry page
│   ├── README.md           # Usage and test documentation
│   ├── _data/              # Eleventy data directory (automatically watched)
│   │   ├── cv.js           # Reads and processes Markdown files from cv/
│   │   ├── site.json       # Site metadata (base URL)
│   │   └── cv/             # Markdown vault (source data)
│   │       ├── name.md
│   │       ├── jobTitle.md
│   │       ├── jobSubtitle.md
│   │       ├── location.md
│   │       ├── urls.md
│   │       ├── summary.md
│   │       ├── skills.md
│   │       ├── education.md
│   │       ├── languages.md
│   │       └── experience/
│   │           ├── 01-stuart.md
│   │           ├── 02-rakuten.md
│   │           ├── 03-habitissimo.md
│   │           └── 04-edreams.md
│   ├── _includes/          # Layout templates
│   │   └── layout.njk
│   ├── assets/             # Static assets (CSS, JS, favicon)
│   │   ├── styles.css
│   │   ├── script.js
│   │   └── favicon.svg
│   ├── test/               # Test suites (Vitest)
│   │   ├── cv.test.js      # Unit tests for cv.js data module
│   │   ├── build.test.js   # Build output tests for generated HTML
│   │   ├── content.test.js # Content validation tests for markdown files
│   │   └── cv-error.test.js # Error handling tests for cv.js
│   └── _site/              # Built output (generated, Eleventy default)
└── docs/                   # Documentation
    ├── trade-offs.md
    └── project-structure.md
```

The `cv/` directory lives inside `static-app/_data/` so Eleventy automatically watches it for changes — no custom `addWatchTarget` configuration is needed. See [docs/trade-offs.md](trade-offs.md) for why this layout was chosen.

Edit the Markdown files in `static-app/_data/cv/` to update the content, or edit the Nunjucks layout, styles, and scripts in `static-app/` to change the layout and appearance. Then run `npm run build` to regenerate the site.
