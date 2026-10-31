/** Aggregates raw samples into route summaries, leak numbers and budget checks. */

import { Budgets, DuplicateExempt, DuplicateTypes, FailureExempt } from './PerfConfig.mjs';

/** Linear-interpolated percentile from a sorted numeric array. */
export function quantile(sorted, q) {
  if (sorted.length === 0) return 0;
  const position = (sorted.length - 1) * q;
  const base = Math.floor(position);
  const rest = position - base;
  const next = sorted[base + 1];
  return next === undefined ? sorted[base] : sorted[base] + (next - sorted[base]) * rest;
}

export function summarize(values) {
  const clean = values.filter((value) => Number.isFinite(value)).sort((a, b) => a - b);
  if (clean.length === 0) {
    return { count: 0, min: 0, max: 0, avg: 0, p50: 0, p95: 0, p99: 0, total: 0 };
  }
  const total = clean.reduce((sum, value) => sum + value, 0);
  return {
    count: clean.length,
    min: clean[0],
    max: clean[clean.length - 1],
    avg: total / clean.length,
    p50: quantile(clean, 0.5),
    p95: quantile(clean, 0.95),
    p99: quantile(clean, 0.99),
    total: total,
  };
}

function groupBy(items, key) {
  const groups = new Map();
  for (const item of items) {
    const name = key(item);
    const list = groups.get(name) ?? [];
    list.push(item);
    groups.set(name, list);
  }
  return groups;
}

function mergeRenders(samples) {
  const counts = new Map();
  for (const sample of samples) {
    const renders = sample.page.renders?.renders ?? [];
    for (const item of renders) {
      counts.set(item.name, (counts.get(item.name) ?? 0) + item.count);
    }
  }
  return [...counts.entries()]
    .map(([name, count]) => ({ name: name, count: count }))
    .sort((a, b) => b.count - a.count);
}

function isExempt(url) {
  return DuplicateExempt.some((pattern) => pattern.test(url));
}

function duplicateRequests(requests) {
  const counts = new Map();
  for (const request of requests) {
    if (!DuplicateTypes.has(request.type)) continue;
    if (isExempt(request.url)) continue;
    counts.set(request.url, (counts.get(request.url) ?? 0) + 1);
  }
  return [...counts.entries()]
    .filter(([, count]) => count > 1)
    .map(([url, count]) => ({ url: url, count: count }))
    .sort((a, b) => b.count - a.count);
}

function collectErrors(session) {
  const errors = session.exceptions.map((item) => ({
    kind: 'exception',
    message: item.description || item.text,
    source: `${item.url}:${item.line + 1}`,
  }));
  for (const text of session.consoleErrors) {
    errors.push({ kind: 'console', message: text, source: '' });
  }
  for (const sample of session.samples) {
    for (const item of sample.page.errors) {
      errors.push({
        kind: item.kind,
        message: item.message,
        source: item.source || sample.route,
      });
    }
  }
  return errors;
}

function near(actual, limit) {
  return limit === 0 ? actual === 0 : actual <= limit;
}

/** Turn a raw session into the report model consumed by console and JSON output. */
export function buildReport(session, meta) {
  const samples = session.samples;
  const routes = [];
  for (const [route, list] of groupBy(samples, (sample) => sample.route)) {
    const frames = list.flatMap((sample) => sample.page.frames.slice(3));
    const frameStats = summarize(frames);
    const dropped = frames.filter((delta) => delta > 32).length;
    const longTasks = list.flatMap((sample) =>
      sample.page.longTasks.map((task) => ({ route: route, duration: task.duration, start: task.start }))
    );
    const loaf = list.flatMap((sample) =>
      sample.page.loaf.map((entry) => ({ route: route, ...entry }))
    );
    const shifts = list.flatMap((sample) => sample.page.shifts);
    const requests = list.flatMap((sample) => sample.requests);
    const durations = list.flatMap((sample) => sample.page.resources.map((item) => item.duration));
    const settles = list.map((sample) => sample.settleMs);
    const renders = mergeRenders(list);
    routes.push({
      route: route,
      count: list.length,
      settle: summarize(settles),
      frames: frameStats,
      droppedPercent: frames.length === 0 ? 0 : (dropped / frames.length) * 100,
      longTasks: {
        count: longTasks.length,
        total: longTasks.reduce((sum, task) => sum + task.duration, 0),
        max: longTasks.reduce((max, task) => Math.max(max, task.duration), 0),
      },
      loaf: {
        count: loaf.length,
        max: loaf.reduce((max, entry) => Math.max(max, entry.duration), 0),
      },
      shift: shifts.reduce((sum, entry) => sum + entry.value, 0),
      resources: durations.length,
      requests: requests.length,
      duplicateRequests: duplicateRequests(requests),
      renderMax: renders.length === 0 ? 0 : renders[0].count,
      renders: renders.slice(0, 8),
    });
  }

  const frames = samples.flatMap((sample) => sample.page.frames.slice(3));
  const settleValues = samples.map((sample) => sample.settleMs);
  const allTasks = samples.flatMap((sample) =>
    sample.page.longTasks.map((task) => ({ duration: task.duration, route: sample.route, start: task.start }))
  );
  const allLoaf = samples.flatMap((sample) =>
    sample.page.loaf.map((entry) => ({ route: sample.route, ...entry }))
  );
  const allShifts = samples.flatMap((sample) => sample.page.shifts);
  const allRequests = samples.flatMap((sample) => sample.requests);
  const slowResources = samples
    .flatMap((sample) => sample.page.resources.map((item) => ({ route: sample.route, ...item })))
    .sort((a, b) => b.duration - a.duration)
    .slice(0, 10);
  const duplicates = duplicateRequests(allRequests);
  const failures = session.failures.concat(
    allRequests.filter((request) => request.status >= 400).map((request) => ({
      url: request.url,
      error: `HTTP ${request.status}`,
    }))
  );

  const first = samples[0]?.page;
  const load = {
    ttfb: first?.navigation?.ttfb ?? 0,
    domContentLoaded: first?.navigation?.domContentLoaded ?? 0,
    load: first?.navigation?.load ?? 0,
    firstPaint: first?.paint?.['first-paint'] ?? 0,
    firstContentfulPaint: first?.paint?.['first-contentful-paint'] ?? 0,
    transfer: allRequests.reduce((sum, request) => sum + Math.max(0, request.bytes), 0),
  };

  const cycles = session.cycles;
  const baseline = cycles[0];
  const last = cycles[cycles.length - 1];
  const steps = Math.max(1, cycles.length - 1);
  const growth = {
    heapKbPerCycle:
      baseline === undefined || last === undefined
        ? 0
        : (last.heap - baseline.heap) / steps / 1024,
    nodesPerCycle:
      baseline === undefined || last === undefined ? 0 : (last.nodes - baseline.nodes) / steps,
    listenersPerCycle:
      baseline === undefined || last === undefined
        ? 0
        : (last.listeners - baseline.listeners) / steps,
    liveTimers: last?.liveTimers ?? 0,
    createdTimers: last?.createdTimers ?? 0,
  };

  const timerSites = Object.entries(last?.bySite ?? {})
    .map(([site, count]) => ({ site: site, count: count }))
    .sort((a, b) => b.count - a.count);

  const errors = collectErrors(session);
  const frameSummary = summarize(frames);
  const droppedPercent =
    frames.length === 0 ? 0 : (frames.filter((delta) => delta > 32).length / frames.length) * 100;
  const settleSummary = summarize(settleValues);
  const renderTop = mergeRenders(samples);
  const worstRoute = routes.reduce(
    (worst, route) => (route.settle.p95 > (worst?.settle.p95 ?? 0) ? route : worst),
    undefined
  );

  const actuals = {
    settleP95Ms: settleSummary.p95,
    settleP99Ms: settleSummary.p99,
    frameP95Ms: frameSummary.p95,
    frameP99Ms: frameSummary.p99,
    droppedFramePercent: droppedPercent,
    longTaskMaxMs: allTasks.reduce((max, task) => Math.max(max, task.duration), 0),
    longTaskTotalMs: allTasks.reduce((sum, task) => sum + task.duration, 0),
    layoutShift: allShifts.reduce((sum, entry) => sum + entry.value, 0),
    liveTimers: growth.liveTimers,
    heapGrowthKbPerCycle: growth.heapKbPerCycle,
    nodeGrowthPerCycle: growth.nodesPerCycle,
    maxComponentRendersPerRoute: routes.reduce((max, route) => Math.max(max, route.renderMax), 0),
    networkFailures: failures.filter(
      (failure) => !FailureExempt.some((pattern) => pattern.test(failure.url))
    ).length,
    consoleErrors: errors.length,
    duplicateRequests: duplicates.reduce((max, item) => Math.max(max, item.count), 0),
  };

  const budgets = Object.entries(Budgets).map(([key, limit]) => {
    const actual = actuals[key] ?? 0;
    return { key: key, limit: limit, actual: actual, pass: near(actual, limit) };
  });

  return {
    meta: meta,
    load: load,
    routes: routes.sort((a, b) => b.settle.p95 - a.settle.p95),
    frames: { ...frameSummary, droppedPercent: droppedPercent },
    settle: settleSummary,
    longTasks: { list: allTasks.sort((a, b) => b.duration - a.duration).slice(0, 10), total: actuals.longTaskTotalMs },
    loaf: allLoaf.sort((a, b) => b.duration - a.duration).slice(0, 6),
    shifts: allShifts.sort((a, b) => b.value - a.value).slice(0, 6),
    slowResources: slowResources,
    duplicates: duplicates,
    failures: failures,
    errors: errors,
    cycles: cycles,
    growth: growth,
    timerSites: timerSites.slice(0, 10),
    renders: renderTop.slice(0, 15),
    worstRoute: worstRoute?.route ?? '',
    actuals: actuals,
    budgets: budgets,
    passed: budgets.every((budget) => budget.pass),
  };
}
