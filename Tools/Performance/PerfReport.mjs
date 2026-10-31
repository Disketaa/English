/** Prints a readable performance report and keeps the JSON shape flat. */

function pad(value, width, alignRight = false) {
  const text = String(value);
  if (text.length >= width) return text.slice(0, width);
  return alignRight ? text.padStart(width) : text.padEnd(width);
}

function ms(value) {
  return `${value.toFixed(1)}ms`;
}

function kb(value) {
  return `${(value / 1024).toFixed(0)}KB`;
}

function section(title) {
  console.log(`\n${title}`);
  console.log('-'.repeat(Math.max(24, title.length)));
}

function table(headers, rows) {
  const widths = headers.map((header, index) =>
    Math.max(header.length, ...rows.map((row) => String(row[index] ?? '').length))
  );
  console.log(headers.map((header, index) => pad(header, widths[index])).join('  '));
  for (const row of rows) {
    console.log(row.map((cell, index) => pad(cell, widths[index])).join('  '));
  }
}

/** Print every section of the report. */
export function printReport(report) {
  console.log(`\nPerformance report — ${report.meta.date}`);
  console.log(`Browser: ${report.meta.browser}`);
  console.log(`URL: ${report.meta.url}`);
  console.log(`Cycles: ${report.meta.cycles}   Samples: ${report.meta.samples}`);

  section('Load');
  table(
    ['Metric', 'Value'],
    [
      ['TTFB', ms(report.load.ttfb)],
      ['First paint', ms(report.load.firstPaint)],
      ['First contentful paint', ms(report.load.firstContentfulPaint)],
      ['DOMContentLoaded', ms(report.load.domContentLoaded)],
      ['Load', ms(report.load.load)],
      ['Transferred', kb(report.load.transfer)],
    ]
  );

  section('Page timings');
  table(
    ['Route', 'N', 'settle p95', 'settle p99', 'frame p95', 'drop %', 'long ms', 'renders'],
    report.routes.map((route) => [
      route.route,
      route.count,
      ms(route.settle.p95),
      ms(route.settle.p99),
      ms(route.frames.p95),
      route.droppedPercent.toFixed(1),
      route.longTasks.total.toFixed(0),
      route.renderMax,
    ])
  );

  section('Frame health');
  const frames = report.frames;
  console.log(
    `p50 ${ms(frames.p50)}  p95 ${ms(frames.p95)}  p99 ${ms(frames.p99)}  max ${ms(
      frames.max
    )}  dropped >32ms ${frames.droppedPercent.toFixed(1)}% (${frames.count} frames)`
  );
  if (report.worstRoute) {
    console.log(`Slowest route: ${report.worstRoute} (settle p95 ${ms(report.settle.p95)})`);
  }

  if (report.longTasks.list.length > 0) {
    section('Worst long tasks');
    for (const task of report.longTasks.list.slice(0, 6)) {
      console.log(`  ${ms(task.duration)}  ${task.route}  at ${ms(task.start)}`);
    }
  }

  if (report.loaf.length > 0) {
    section('Worst long animation frames');
    for (const entry of report.loaf) {
      const scripts = entry.scripts
        .slice(0, 2)
        .map((script) => `${script.name} ${ms(script.duration)}`)
        .join(', ');
      console.log(`  ${ms(entry.duration)}  ${entry.route}  ${scripts || 'no script'}`);
    }
  }

  if (report.shifts.length > 0) {
    section('Layout shifts');
    for (const shift of report.shifts) {
      console.log(`  ${shift.value.toFixed(4)}  at ${ms(shift.start)}  ${shift.sources.join(', ')}`);
    }
  }

  section('Memory');
  table(
    ['Cycle', 'Heap', 'Nodes', 'Listeners', 'Live timers'],
    report.cycles.map((cycle) => [
      cycle.index,
      kb(cycle.heap),
      cycle.nodes,
      cycle.listeners,
      cycle.liveTimers,
    ])
  );
  console.log(
    `Growth per cycle: heap ${report.growth.heapKbPerCycle.toFixed(1)}KB, nodes ${report.growth.nodesPerCycle.toFixed(
      1
    )}, listeners ${report.growth.listenersPerCycle.toFixed(1)}`
  );

  if (report.timerSites.length > 0) {
    section('Timers by call site');
    for (const site of report.timerSites) {
      console.log(`  ${String(site.count).padStart(4)}  ${site.site}`);
    }
  }

  if (report.renders.length > 0) {
    section('Top rendered components');
    for (const item of report.renders) {
      console.log(`  ${String(item.count).padStart(5)}  ${item.name}`);
    }
  }

  section('Network');
  console.log(
    `${report.duplicates.length} duplicate URL(s), ${report.failures.length} failure(s)`
  );
  if (report.slowResources.length > 0) {
    console.log('Slowest resources:');
    for (const resource of report.slowResources.slice(0, 5)) {
      console.log(`  ${ms(resource.duration)}  ${resource.route}  ${resource.name}`);
    }
  }
  if (report.duplicates.length > 0) {
    console.log('Duplicates:');
    for (const item of report.duplicates.slice(0, 5)) {
      console.log(`  ${item.count}x  ${item.url}`);
    }
  }
  if (report.failures.length > 0) {
    console.log('Failures:');
    for (const failure of report.failures.slice(0, 5)) {
      console.log(`  ${failure.error}  ${failure.url}`);
    }
  }

  if (report.errors.length > 0) {
    section('Errors');
    for (const error of report.errors.slice(0, 8)) {
      console.log(`  [${error.kind}] ${error.message} ${error.source}`.trim());
    }
  }

  if (report.cpu !== undefined && report.cpu.length > 0) {
    section('CPU self time');
    for (const item of report.cpu) {
      console.log(`  ${ms(item.ms).padStart(10)}  ${item.name}`);
    }
  }

  if (report.coverage !== undefined && report.coverage.length > 0) {
    section('Unused JavaScript');
    for (const item of report.coverage) {
      console.log(`  ${item.unusedPercent.toFixed(1).padStart(5)}%  ${item.url}`);
    }
  }

  section('Budgets');
  for (const budget of report.budgets) {
    const mark = budget.pass ? 'PASS' : 'FAIL';
    console.log(
      `  ${mark}  ${pad(budget.key, 30)} ${String(budget.actual.toFixed(1)).padStart(
        10
      )}  limit ${budget.limit}`
    );
  }
  console.log(`\n${report.passed ? 'All budgets passed.' : 'Budget violations found.'}`);
}
