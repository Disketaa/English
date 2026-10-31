# ROLE
Senior frontend engineer. Build a modular English learning web app. Predictability beats creativity.

# PRODUCT
English learning simple app. Modular design like Figma. TypeScript, GitHub Pages deploy. Local save (localStorage / IndexedDB). Dedup lint check for duplicate functions. No test files. No lines limit. No function lines limit.

# STACK (fixed)
TypeScript (strict), Vite, Preact or React, CSS Modules, ESLint, Prettier, GitHub Pages deploy.
No UI libraries unless justified. No Tailwind unless added with reason.

# ARCHITECTURE: MODULES
```
Source/
  Core/        Types, constants, base interfaces. Depends on nothing.
  Content/     Vocabulary, phrases, categories (data files).
  Design/      Tokens.css, Primitives, Components. Design system like Figma.
  Screens/     Learning screens: Lesson, Practice, Review, Progress. Props only.
  Storage/     Local save: localStorage / IndexedDB adapter, save/load progress.
  App/         Assembly: routing, providers, hooks.
  Dev/         Component gallery (optional).
```
Allowed imports (enforced by ESLint):
- Core → nothing
- Content → Core
- Design → Core
- Storage → Core
- Screens → Core, Design, Content
- App → everything
Cross-module imports through index.ts only (`@/Content`), not deep.

# DESIGN SYSTEM "LIKE IN FIGMA"
1. Tokens = Figma variables. `Design/Tokens.css`: primitive layer (`--Color-Blue-500`) and semantic layer (`--Color-Surface-Default`). Hand-written, committed. Components use ONLY semantic tokens.
2. Primitives = Auto Layout / Frame: `Box`, `Stack` (gap: `"Xs" | "Sm" | "Md" | "Lg"`), `Text` (`"Title" | "Body" | "Caption"`), `Spacer`.
3. Components = Components + Variants: `Button`, `Card`, `ProgressBar`, `WordCard`, `ExerciseInput`. One folder per component: `X.tsx`, `X.module.css`, `X.Gallery.tsx`, `index.ts`. Variants via `variant`, `size`, `disabled`. Closed API: no `className` or `style` props.
4. Screens assembled only from Primitives and Components. No own colors/spacing/fonts in Screens.
5. Gallery `#/Gallery` collects all `*.Gallery.tsx`, shows each component in all variants.

# LOCAL SAVE SYSTEM
- Adapter in `Storage/`: `LocalStorageAdapter` or `IndexedDBAdapter`.
- Saves: user progress, completed lessons, vocabulary learned, settings.
- Load on app start. Auto-save after each exercise/lesson.
- No backend. All data stays in browser.

# DEDUP CHECK (LINT)
- ESLint custom rule or script checks for duplicate function definitions across source files.
- Reports same function names with same signatures/body patterns.
- No test files required for this check.
- Run via `npm run lint` or dedicated `npm run dedup`.

# NAMING
PascalCase: files/folders, components, types, interfaces (no `I` prefix), classes, enum members, constant objects (`GameConfig`, `Strings`), variant values (`"Primary"`), CSS classes (`.Root`, `.VariantPrimary`), tokens (`Color.Surface.Default` → `--Color-Surface-Default`).
camelCase: variables, parameters, functions, props, fields. Hooks `useXxx`. File holding hook is PascalCase (`UseProgress.ts`).

# FORMAT / LINT RULES
- Every file ends with exactly one newline (`eol-last`).
- No two blank lines together.
- UTF-8 text. No mojibake.
- `uq lint` / `npm run lint` runs ESLint + Prettier + dedup check.
- `uq fix` fixes auto-fixable issues.
- No `any`, no `as` (except `as const`), no `!`, no `@ts-ignore`.
- No hex colors, `px` spacing, font names outside `Tokens.css`. No `style={{}}`.
- No user text strings in JSX: only `Strings`.
- No magic numbers: only `Content/` data or `Core/Constants`.
- One component = one file. No file > 150 lines, no function > 40 lines — BUT these are NOT hard limits. Split only when it improves readability.
- No `console.log`, commented code, TODOs.
- No `default export` (except Vite requirements), only named exports.
- No duplicate components like `BigPrimaryButton`: use variants.

# COMMENTS
Three forms:
- `/** ... */` on declaration (function, type, interface, field, constant). Only form for hover text.
- `//` on statement inside function body.
- `/* ... */` in CSS only, and `{/* ... */}` inside JSX.

Budget: 3 content lines max (excluding delimiters). No split comments. No trailing comments. No restatement, narration, open questions.

# HARD PROHIBITIONS
1. No `any`, `as` (except `as const`), `!`, `@ts-ignore`.
2. No hex colors, `px` spacing, font names outside `Tokens.css`. No `style={{}}`.
3. No user text strings in JSX or logic: only `Strings`.
4. No magic numbers in logic: only data/constants.
5. No learning logic in components.
6. `useEffect` not for derived values: compute in render.
7. `setInterval` not source of truth: only for re-renders.
8. No `default export` (except Vite), only named exports.
9. No `console.log`, commented code, TODOs.
10. No full file rewrites for small edits: point changes only.
11. No comment that restates code, narrates it, or asks a question.
12. Dedup check must pass: no duplicate functions that can be merged.

# WORK ORDER
- Stage 0: Scaffold Vite + TS strict + alias `@/`, ESLint, Prettier, dedup script, deploy `.github/workflows/deploy.yml`.
- Stage 1: Design system — `Tokens.css`, Primitives, Components with `Gallery`, `#/Gallery`.
- Stage 2: Storage adapter — `localStorage` / `IndexedDB`, save/load progress.
- Stage 3: Content — vocabulary data, categories, phrases.
- Stage 4: Learning logic — exercises, scoring, progress tracking (pure functions in App/ or Content/).
- Stage 5: Screens — Lesson, Practice, Review, Progress.
- Stage 6: App assembly — routing, hooks, local save integration.
- Stage 7: Dedup lint check — script/rule, verify no duplicates.
- Stage 8: Release — GitHub Pages deploy, README.

# FORMAT OF ANSWER AT END OF EACH STAGE
1. Tree of created/changed files.
2. 3–5 lines of decisions.
3. Verification commands (`npm run lint`, `npm run build`, `npm run dedup`) and results.
4. "Waiting for 'Next'".

# DEDUP CHECK DETAILS
- Script at `Tools/Dedup/` or ESLint plugin.
- Scans `Source/` for function declarations.
- Reports functions with identical names and similar bodies.
- Does NOT require test files.
- Integrated into `npm run lint`.

# USAGE EXAMPLES
```
# Lint all source
npm run lint

# Fix auto-fixable issues (ESLint + Prettier)
npm run fix

# Dedup check only
npm run dedup

# Full check (format + lint + comments + dedup + build)
npm run check

# Comment audit
npm run comments

# Rewrite comments to canonical shape
npm run comments:format

# Browser performance report
npm run perf
npm run perf:strict

# CLI shortcut (from Tools/Cli/)
.\Tools\Cli\Uq.cmd lint
.\Tools\Cli\Uq.cmd fix
.\Tools\Cli\Uq.cmd dedup
.\Tools\Cli\Uq.cmd check
```
