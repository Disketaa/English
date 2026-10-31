/** CLI entry: runs the browser performance test and writes a JSON report. */

import { mkdirSync, writeFileSync } from 'node:fs';
import { join } from 'node:path';
import { Budgets, Config } from './PerfConfig.mjs';
import { launchBrowser } from './PerfCdp.mjs';
import { startServer } from './PerfServer.mjs';
import { PerfSession } from './PerfSession.mjs';
import { runCycle } from './PerfScenarios.mjs';
import { buildReport } from './PerfStats.mjs';
import { printReport } from './PerfReport.mjs';

const Help = `Usage: node Tools/Performance/PerfRun.mjs [options]

  --url <url>         Test an already running app instead of starting Vite
  --port <number>     Vite dev port (default ${Config.port})
  --cycles <number>   Full flows used for leak detection (default ${Config.cycles})
  --strict            Exit with code 1 when a budget fails
  --budget k=v        Override one budget (repeatable)
  --profile           Record a CPU profile
  --coverage          Measure unused JavaScript
  --no-save           Print only, do not write report files
  --help              Show this text
`;

function parseArgs(argv) {
  const options = {
    url: '',
    port: Config.port,
    cycles: Config.cycles,
    strict: false,
    profile: false,
    coverage: false,
    save: true,
    budgets: {},
  };
  for (let index = 0; index < argv.length; index++) {
    const arg = argv[index];
    if (arg === '--help' || arg === '-h') {
      process.stdout.write(Help);
      process.exit(0);
    } else if (arg === '--url') {
      options.url = argv[++index] ?? '';
    } else if (arg === '--port') {
      options.port = Number(argv[++index]);
    } else if (arg === '--cycles') {
      options.cycles = Math.max(2, Number(argv[++index]));
    } else if (arg === '--strict') {
      options.strict = true;
    } else if (arg === '--profile') {
      options.profile = true;
    } else if (arg === '--coverage') {
      options.coverage = true;
    } else if (arg === '--no-save') {
      options.save = false;
    } else if (arg === '--budget') {
      const pair = String(argv[++index] ?? '').split('=');
      if (pair.length === 2 && pair[0] in Budgets) {
        options.budgets[pair[0]] = Number(pair[1]);
      } else {
        throw new Error(`Bad --budget value: ${argv[index]}`);
      }
    } else {
      throw new Error(`Unknown option: ${arg}`);
    }
  }
  return options;
}

function stamp() {
  return new Date().toISOString().replace(/[:.]/g, '-');
}

function aggregateProfile(profile) {
  const nodes = new Map(profile.nodes.map((node) => [node.id, node]));
  const totals = new Map();
  for (let index = 0; index < profile.samples.length; index++) {
    const node = nodes.get(profile.samples[index]);
    if (node === undefined) continue;
    const frame = node.callFrame;
    if (frame.functionName === '' && frame.url === '') continue;
    const key = `${frame.functionName || '(anonymous)'} @ ${frame.url || 'unknown'}:${
      frame.lineNumber + 1
    }`;
    totals.set(key, (totals.get(key) ?? 0) + (profile.timeDeltas[index] ?? 0));
  }
  return [...totals.entries()]
    .map(([name, micros]) => ({ name: name, ms: micros / 1000 }))
    .sort((a, b) => b.ms - a.ms)
    .slice(0, 15);
}

function mergeRanges(ranges, keep) {
  const intervals = ranges
    .filter((range) => keep(range))
    .map((range) => [range.startOffset, range.endOffset])
    .sort((a, b) => a[0] - b[0]);
  let total = 0;
  let start = -1;
  let end = -1;
  for (const [from, to] of intervals) {
    if (start < 0) {
      start = from;
      end = to;
    } else if (from <= end) {
      end = Math.max(end, to);
    } else {
      total += end - start;
      start = from;
      end = to;
    }
  }
  if (start >= 0) total += end - start;
  return total;
}

function aggregateCoverage(result) {
  const rows = [];
  for (const script of result.result) {
    const ranges = script.functions.flatMap((fn) => fn.ranges);
    const total = mergeRanges(ranges, () => true);
    const used = mergeRanges(ranges, (range) => range.count > 0);
    if (total === 0) continue;
    rows.push({
      url: script.url || 'inline',
      total: total,
      used: used,
      unusedPercent: ((total - used) / total) * 100,
    });
  }
  return rows.sort((a, b) => b.unusedPercent - a.unusedPercent).slice(0, 10);
}

function writeArtifacts(report, png) {
  mkdirSync(Config.reportDir, { recursive: true });
  const name = `PerfReport-${stamp()}`;
  const jsonPath = join(Config.reportDir, `${name}.json`);
  writeFileSync(jsonPath, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
  writeFileSync(join(Config.reportDir, 'PerfReport.latest.json'), `${JSON.stringify(report, null, 2)}\n`);
  let pngPath = '';
  if (png !== '') {
    pngPath = join(Config.reportDir, `${name}.png`);
    writeFileSync(pngPath, Buffer.from(png, 'base64'));
    writeFileSync(join(Config.reportDir, 'PerfReport.latest.png'), Buffer.from(png, 'base64'));
  }
  return { json: jsonPath, png: pngPath };
}

async function main() {
  const options = parseArgs(process.argv.slice(2));
  Object.assign(Budgets, options.budgets);

  let server;
  let browser;
  let client;
  try {
    if (options.url === '') {
      server = await startServer(options.port);
    } else {
      server = { url: options.url, stop() {} };
    }
    const base = server.url.replace(/\/$/, '');
    const startUrl = `${base}/?perf=1#/`;

    const launched = await launchBrowser();
    browser = launched;
    client = launched.client;
    const session = new PerfSession(client, base);
    await session.start();

    if (options.profile) {
      await client.send('Profiler.enable');
      await client.send('Profiler.setSamplingInterval', { interval: 200 });
      await client.send('Profiler.start');
    }
    if (options.coverage) {
      await client.send('Profiler.enable');
      await client.send('Profiler.startPreciseCoverage', {
        callCount: true,
        detailed: true,
      });
    }

    await session.navigate(startUrl);

    for (let cycle = 1; cycle <= options.cycles; cycle++) {
      process.stdout.write(`Cycle ${cycle}/${options.cycles}\n`);
      await runCycle(session, cycle);
      await session.finishCycle(cycle, `cycle ${cycle}`);
    }

    let profile;
    let coverage;
    if (options.coverage) {
      coverage = await client.send('Profiler.takePreciseCoverage');
      await client.send('Profiler.stopPreciseCoverage');
    }
    if (options.profile || options.coverage) {
      profile = await client.send('Profiler.stop');
    }

    const screenshot = await session.screenshot();
    const report = buildReport(session, {
      date: new Date().toISOString(),
      browser: launched.executable,
      url: startUrl,
      cycles: options.cycles,
      samples: session.samples.length,
      node: process.version,
      platform: `${process.platform} ${process.arch}`,
    });
    if (profile !== undefined) report.cpu = aggregateProfile(profile.profile);
    if (coverage !== undefined) report.coverage = aggregateCoverage(coverage);

    printReport(report);

    if (options.save) {
      const files = writeArtifacts(report, screenshot);
      console.log(`\nJSON: ${files.json}`);
      if (files.png !== '') console.log(`Screenshot: ${files.png}`);
      console.log('Add --strict to fail the command when a budget is exceeded.');
    }

    if (options.strict && !report.passed) process.exitCode = 1;
  } finally {
    if (browser !== undefined) browser.close();
    if (server !== undefined) server.stop();
  }
}

main().catch((error) => {
  console.error(`\nPerformance run failed: ${error instanceof Error ? error.message : error}`);
  process.exitCode = 1;
});
