# Portfolio

A static portfolio website displaying my CV and professional information.

## About

This project is a personal portfolio website built with static HTML/CSS/JS, showcasing my resume, skills, and professional background. The CV data is stored in Markdown for easy editing.

## Getting Started

### Prerequisites

- **Node.js** (LTS recommended)

### Install dependencies

```bash
npm install
```

### Development Server (Hot Reload)

Starts a local development server with automatic rebuilds when you edit Markdown or asset files.

```bash
npm run dev
```

Opens the site at `http://localhost:3000`. The server watches `cv/` and `static-app/` for changes and automatically rebuilds the site, so you can see your edits immediately by refreshing the browser.

### Build

Compiles the Markdown CV files in `cv/` to a static HTML page in `dist/`.

```bash
npm run build
```

The build script (`static-app/build-scripts/build.mjs`) reads the HTML template from `static-app/index.html`, fills in the CV content converted from Markdown using the `marked` library, and copies static assets (styles, scripts, favicon) from `static-app/` to `dist/`.

### Preview

Serves the previously built site locally for review (no auto-reload).

```bash
npm run preview
```

Opens the site at `http://localhost:3000` (or the next available port).

## Project Structure

```
├── cv/              # CV data in Markdown format
│   ├── experience/  # Individual work experience entries
│   ├── personal.md
│   ├── summary.md
│   ├── skills.md
│   ├── education.md
│   └── languages.md
├── dist/            # Generated output (not committed)
├── static-app/      # Static app source
│   ├── build-scripts/  # Build and dev server scripts
│   ├── index.html      # HTML template with content markers
│   ├── styles.css
│   ├── script.js
│   └── favicon.svg
└── package.json     # Project configuration and scripts
```

Edit the Markdown files in `cv/` to update the content, or edit the HTML template, styles, and scripts in `static-app/` to change the layout and appearance. Then run `npm run build` to regenerate the site.

## Project Plan

See [docs/agents/plans/portfolio-cv-and-website.md](docs/agents/plans/portfolio-cv-and-website.md) for the project plan and requirements.

## Contributors

See [CONTRIBUTORS.md](CONTRIBUTORS.md) for the list of people and agents who contributed to this project.
