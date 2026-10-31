# Performance test

Browser performance harness for the English app. It walks the real UI — home,
every lesson page, the test flow — measures what each step costs, and reports
slow pages, render storms, leaks, layout shifts and bad network calls.

No extra dependencies: it talks to an installed Chrome or Edge over the Chrome
DevTools Protocol (Node 22+ provides `fetch` and `WebSocket`).

## Run

```powershell
npm run perf            # report only
npm run perf:strict     # exit 1 when a budget fails
npm run perf:profile    # + CPU profile and unused-JS coverage
```

Useful flags (forwarded to `PerfRun.mjs`):

```powershell
node Tools/Performance/PerfRun.mjs --cycles 5
node Tools/Performance/PerfRun.mjs --url http://localhost:5173
node Tools/Performance/PerfRun.mjs --budget settleP95Ms=600 --budget nodeGrowthPerCycle=200
node Tools/Performance/PerfRun.mjs --no-save
```

`--url` reuses an already running dev server. Otherwise the tool starts Vite on
port `5199` and shuts it down afterwards. Reports and a screenshot are written
to `Tools/Performance/Reports/` (gitignored).

The browser is the first match from `PerfConfig.mjs`. Set `PERF_BROWSER` to a
Chromium executable to force one.

## What is measured

| Area | Source | What it catches |
|---|---|---|
| Page timing | `MutationObserver` + two rAFs | Slow route/page transitions |
| Frame health | `requestAnimationFrame` deltas | Dropped frames, jank, p95/p99 |
| Long tasks | `PerformanceObserver` `longtask` | Blocking main-thread work |
| LoAF | `PerformanceObserver` `long-animation-frame` | Slow renders and their scripts |
| Layout shifts | `PerformanceObserver` `layout-shift` | Content jumping after paint |
| Memory | CDP `Performance.getMetrics` + forced GC | Heap/node/listener growth per cycle |
| Timers | Patched `setTimeout`/`setInterval` | Leaked or runaway timers by call site |
| Re-renders | Preact `options.diffed` probe | Components rendering far too often |
| Network | CDP `Network` + resource timing | Slow calls, duplicates, HTTP failures |
| Errors | Runtime exceptions + page errors | Crashes and console errors |

Render counts need the app probe, which only installs when the URL has `?perf`.
The harness opens `/?perf=1#/`; normal users never load the probe path.

## Budgets

Defaults live in `PerfConfig.mjs` (`Budgets`). They are deliberately forgiving
so a normal laptop passes; tighten them once the baseline is known. Every
budget can be overridden per run with `--budget name=value`.

The exit code is `0` even on violations unless `--strict` is passed, so
`npm run perf` stays usable as an investigation tool.

## Leak detection

Each cycle repeats: home → open lesson → every page → reveal examples → answer
all test questions → result → home. Between cycles the tool forces GC and
records heap, DOM nodes, event listeners and live timers. Growth is reported
per cycle; the budgets flag heap, node and live-timer growth.

## Adding content vs. adding a screen

Content is automatic. `PerfProbe.ts` publishes `window.__perfRoutes` from the
lesson registry, so a new lesson or page is sampled on the next run without
touching the performance tool. Component render counts are also automatic:
`options.diffed` names every component, so new components appear in the report
by themselves.

Only a brand-new **top-level screen** (not a lesson page) needs one line in
`buildRoutes()` inside `Source/App/Perf/PerfProbe.ts`. Everything inside that
screen is still measured without further changes.

## Interactions

`PerfScenarios.mjs` does not hardcode button labels. On every route it clicks
visible buttons one at a time, re-discovers the DOM after each click, and skips
navigation-away targets. That exercises reveals, favourites, test choices and
submits on any component. The per-route sample plus one `· interactions` sample
capture the resulting renders, long tasks and network calls.

## Files

```
Tools/Performance/
  PerfRun.mjs        CLI and orchestration
  PerfConfig.mjs     ports, browser lookup, budgets
  PerfCdp.mjs        dependency-free CDP client + browser launcher
  PerfServer.mjs     starts/stops Vite
  PerfInPage.mjs     instrumentation injected before the app boots
  PerfSession.mjs    navigation, sampling, network capture
  PerfScenarios.mjs  the user flows that are walked
  PerfStats.mjs      aggregation, leak math, budget checks
  PerfReport.mjs     console report
```
