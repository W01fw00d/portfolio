---
description: Design compromises and trade-offs in the static-app architecture.
---

# Compromises

## CV Data Inside `_data/`

The `cv/` Markdown vault is placed inside `_data/` (as `_data/cv/`) instead of at the monorepo root. This is a compromise to ensure reliable hot reloading during development.

**The problem:** When `cv/` was at the monorepo root (outside `static-app/`), Eleventy's internal file watcher didn't detect changes to template files like `layout.njk` when we used `addWatchTarget("../cv")` to monitor the external directory. Multiple workarounds were attempted:

- Adding explicit `addWatchTarget` calls for `_includes/` and `_data/` — the external watch target still interfered with the template watcher.
- Using glob patterns (`../cv/**/*.md`) instead of directory paths — didn't resolve the conflict.
- Removing the custom `input` directory setting — the watcher conflict persisted as long as an external directory was being watched.

**The solution:** Moving `cv/` inside `_data/` eliminates the need for any custom `addWatchTarget` configuration. Eleventy automatically watches everything under `_data/`, including nested directories. This ensures both template changes (e.g., `layout.njk`) and data changes (e.g., any `.md` file in `cv/`) trigger live reload reliably.

**Trade-off:** The `cv/` directory is no longer a standalone vault at the monorepo root. If other packages in the monorepo need to read the CV data, they must reference `static-app/_data/cv/` instead of `cv/`.
