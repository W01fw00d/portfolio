---
description: Design trade-offs in the static-app architecture.
---

# Trade-offs

## CV Data Inside `_data/`

The `cv/` Markdown vault is placed inside `_data/` (as `_data/cv/`) instead of at the monorepo root. This is a trade-off to ensure reliable hot reloading during development.

**The problem:** When `cv/` was at the monorepo root (outside `static-app/`), Eleventy's internal file watcher didn't detect changes to template files like `layout.njk` when we used `addWatchTarget("../cv")` to monitor the external directory. Multiple workarounds were attempted:

- Adding explicit `addWatchTarget` calls for `_includes/` and `_data/` — the external watch target still interfered with the template watcher.
- Using glob patterns (`../cv/**/*.md`) instead of directory paths — didn't resolve the conflict.
- Removing the custom `input` directory setting — the watcher conflict persisted as long as an external directory was being watched.

**The solution:** Moving `cv/` inside `_data/` eliminates the need for any custom `addWatchTarget` configuration. Eleventy automatically watches everything under `_data/`, including nested directories. This ensures both template changes (e.g., `layout.njk`) and data changes (e.g., any `.md` file in `cv/`) trigger live reload reliably.

**Trade-off:** The `cv/` directory is no longer a standalone vault at the monorepo root. If other packages in the monorepo need to read the CV data, they must reference `static-app/_data/cv/` instead of `cv/`.

## Plain JavaScript Throughout

All build-time and test files use plain JavaScript instead of TypeScript.

**The problem with Eleventy:** Eleventy does not natively support TypeScript configuration files or TypeScript data files. To use TypeScript, the build scripts had to rely on Node.js's `--experimental-strip-types` flag and hardcode a path to Eleventy's internal `cmd.cjs` CLI entry point (e.g., `node --experimental-strip-types "../node_modules/@11ty/eleventy/cmd.cjs" --config .eleventy.ts`). This approach is fragile: it depends on an experimental Node.js feature and on Eleventy's internal file structure, which could change without notice.

Additionally, loading TypeScript data files required an `addDataExtension("ts")` hack using dynamic `import()` inside the Eleventy config, and the config file itself had `@ts-ignore` comments because Eleventy ships no type definitions — meaning the core config file had TypeScript syntax without actual type safety.

**The problem with tests:** Even though Vitest supports TypeScript natively, using TypeScript in test files provides no actual type safety when the code under test is plain JavaScript. Importing a `.js` module from TypeScript yields an `any` type — the type annotations are only on test internals (spy types, config options), not on the contract being tested. This creates a false sense of security: developers see `.ts` files and expect type safety, but the actual module being tested is untyped. On top of that, TypeScript adds noise like `as` casts (`(err as NodeJS.ErrnoException).code = "ENOENT"`) that are unnecessary in plain JavaScript.

**The solution:** Keep everything as plain ESM JavaScript. The build script is simply `eleventy`, the dev script is `eleventy --serve`, data files load natively, and tests run without any transpilation layer. The entire project is uniformly JavaScript — no mixed languages, no workarounds, no experimental flags.

**Trade-off:** All build-time and test code lacks type annotations and IDE type checking. However, since this is a small personal portfolio site with straightforward file I/O, markdown rendering, and simple assertions, the practical benefit of types is marginal. The codebase is small enough (~500 lines of build-time code) that refactoring safety and IDE autocomplete provide minimal value compared to the simplicity of plain JavaScript.
