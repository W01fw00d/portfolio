---
sessionId: session-261117-192924-1nyk
---

# Revert Test Files to JavaScript

The Eleventy-integration files (`.eleventy.js`, `_data/cv.js`, `_data/markdown.js`) are settled as plain JavaScript. The remaining question is whether the 4 test files and `vitest.config.ts` should stay in TypeScript or revert to JavaScript.

### Current State

- **4 test files** (~526 lines total): `cv.test.ts`, `cv-error.test.ts`, `build.test.ts`, `content.test.ts`
- **1 config file** (11 lines): `vitest.config.ts`
- **No `tsconfig.json`** — Vitest handles TypeScript compilation in-memory, no separate build step
- **No `@types/node` installed** — Vitest provides implicit Node.js types in test context
- **TypeScript features used:**
  - `typeof import("../_data/cv.js").default` — infers the import type from the JS file
  - `ReturnType<typeof vi.spyOn>` — infers the return type of a Vitest helper
  - `(err as NodeJS.ErrnoException).code = "ENOENT"` — type assertion for error casting
  - `defineConfig()` in vitest config — provides autocomplete for config options

### What TypeScript Gives You in Tests

**1. Type inference from the tested module**

`cv.test.ts` uses `let cv: typeof import("../_data/cv.js").default` to get the exact shape of the CV module. If a property is renamed in `cv.js` (e.g., `jobTitle` → `title`), the test still compiles but accessing `cv.jobTitle` would produce a runtime `undefined` instead of a string. TypeScript doesn't actually catch this since `cv.js` is plain JS and exports `any` — the type is `any`, not a structured interface. So this is a _perception_ of safety, not actual safety.

**2. IDE autocomplete for Vitest APIs**

`defineConfig()` in `vitest.config.ts` provides autocomplete for test options. `vi.spyOn()`, `vi.doMock()`, etc. have inline documentation. This is a genuine IDE benefit, but it's minor — the Vitest API is small and stable.

**3. Type assertions for error mocking**

`cv-error.test.ts` uses `(err as NodeJS.ErrnoException).code = "ENOENT"` to cast an error object. In plain JS, this is just `err.code = "ENOENT"` — no type assertion needed. The TypeScript version adds syntax noise for no runtime benefit.

**4. Self-documenting intent**

Type annotations like `let consoleErrorSpy: ReturnType<typeof vi.spyOn>` document what a variable is. But the variable name `consoleErrorSpy` and the assignment `vi.spyOn(console, "error")` already make this clear.

### What TypeScript Costs You in Tests

**1. No actual type safety against the tested code**

Since `cv.js` is plain JavaScript with `export default { ... }`, importing it in TypeScript gives an `any` type. The tests have _no_ type checking against the actual module under test. The TypeScript annotations are only on the test side (Vitest types), not on the contract between test and module.

**2. Cognitive dissonance**

The project has TypeScript in tests but not in the source code they test. A developer sees `.ts` files and expects type safety, but the actual module being tested is untyped JS. This creates a false sense of security.

**3. `as` casts that add noise**

`(err as NodeJS.ErrnoException).code = "ENOENT"` is more verbose than `err.code = "ENOENT"`. In a test file, where clarity and brevity matter, these casts are pure noise.

**4. No `tsconfig.json` means unconfigured TypeScript**

Without a `tsconfig.json`, Vitest uses its own internal TypeScript compilation with default settings. This means no control over strictness, target, or module resolution. If you want to add strict checks later, you need to create a config file — but then you're back to maintaining TS tooling.

**5. Dependency on Vitest's TypeScript handling**

Vitest bundles `esbuild` for TypeScript stripping. This works, but it's a transpilation step (not type checking). If Vitest changes its TypeScript handling in a future version, tests could break. With plain JS, there's no such dependency.

### The Verdict

**For this specific project, reverting tests to JavaScript is the cleaner choice.**

| Factor                                 | TypeScript                              | JavaScript                   |
| -------------------------------------- | --------------------------------------- | ---------------------------- |
| Actual type safety against tested code | None — `cv.js` exports `any`            | N/A — consistent with source |
| IDE benefits                           | Autocomplete for Vitest API (minor)     | Basic JS autocomplete        |
| Code clarity                           | `as` casts add noise                    | Direct, no casts             |
| Consistency                            | Mixed: TS tests, JS source              | Uniform: all JS              |
| Tooling                                | Relies on Vitest's internal TS handling | No tooling needed            |
| Maintenance                            | Vitest's TS handling could change       | Stable                       |
| Lines of code                          | ~526 (with type annotations)            | ~520 (slightly less)         |

**Key insight:** The TypeScript in tests provides _Vitest API types_ but _no type safety for the actual code under test_. Since the source is plain JS, the import type is `any`. The type annotations are on test internals (spy types, config options), not on the contract being tested. This is TypeScript as IDE sugar, not as a safety mechanism.

**Recommendation: Revert to JavaScript.** The tests are straightforward assertions — `expect().toBe()`, `expect().toContain()`, `expect().toThrow()`. They don't benefit from types. Reverting eliminates the cognitive dissonance of having typed tests for untyped code, removes the `as` cast noise, and makes the entire project uniformly JavaScript.

### What Reverting Entails

1. Rename `vitest.config.ts` → `vitest.config.js`
2. Rename `test/*.ts` → `test/*.js` (4 files)
3. Remove type annotations: `let cv: typeof import(...)` → `let cv`
4. Remove `as` casts: `(err as NodeJS.ErrnoException)` → `err`
5. Remove `ReturnType<>` annotations: `ReturnType<typeof vi.spyOn>` → remove
6. No dependency changes needed — Vitest works with JS natively
7. Update `docs/compromises.md` to document this decision
8. Update `docs/project-structure.md` to reflect `.js` extensions

### Execution Steps

### ✓ Step 1: Convert test files and vitest config to JavaScript

Convert all 5 TypeScript files to plain JavaScript.

- Convert `vitest.config.ts` → `vitest.config.js` (remove `defineConfig` wrapper, keep plain object).
- Convert `test/cv.test.ts` → `test/cv.test.js` (remove `typeof import()` and `ReturnType<>` annotations).
- Convert `test/cv-error.test.ts` → `test/cv-error.test.js` (remove `as NodeJS.ErrnoException` casts and parameter types).
- Convert `test/build.test.ts` → `test/build.test.js` (remove type annotation and non-null assertions).
- Convert `test/content.test.ts` → `test/content.test.js` (remove non-null assertions).
- Delete the `.ts` versions of these files.
- Run `npm run test` to validate all tests pass.

### ✓ Step 2: Update documentation

Update project documentation to reflect the all-JavaScript decision.

- Append a section to `docs/compromises.md` explaining why test files use plain JavaScript.
- Update `docs/project-structure.md` to change `.ts` extensions back to `.js` for test files and vitest config.
