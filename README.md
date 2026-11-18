# Portfolio

A static portfolio website displaying my CV and professional information.

## About

This project is a personal portfolio website built with [Eleventy (11ty)](https://www.11ty.dev/), a fast and simple static site generator. The CV data is stored in Markdown for easy editing, and the site is rendered as plain HTML/CSS/JS with zero client-side JavaScript.

## Getting Started

### Prerequisites

- **Node.js** (LTS recommended)

### Install dependencies

```bash
npm install
```

### Development Server (Hot Reload)

Starts a local development server with automatic rebuilds when you edit CV Markdown or static app files.

```bash
npm run dev
```

Opens the site at `http://localhost:8080`. The server watches `cv/` and `static-app/` for changes and automatically rebuilds the site, so you can see your edits immediately by refreshing the browser.

### Build

Compiles the CV Markdown files and Nunjucks template to a static HTML page in `_site/`.

```bash
npm run build
```

Eleventy reads the Nunjucks layout template, loads CV content from Markdown files via a data file, converts Markdown to HTML, and copies static assets (styles, scripts, favicon) to `_site/`.

### Preview

Serves the previously built site locally for review (no auto-reload).

```bash
npm run preview
```

Opens the site at `http://localhost:3000` (or the next available port).

## Project Structure

See [docs/project-structure.md](docs/project-structure.md) for the current directory layout.

## Project Plan

See [docs/agents/plans/portfolio-cv-and-website.md](docs/agents/plans/portfolio-cv-and-website.md) for the project plan and requirements.

## Trade-offs

See [docs/trade-offs.md](../docs/trade-offs.md) for details on architectural decisions.

## Contributors

See [CONTRIBUTORS.md](CONTRIBUTORS.md) for the list of people and agents who contributed to this project.
