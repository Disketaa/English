/** Shared settings for the browser performance test. */

import { join } from 'node:path';
import { tmpdir } from 'node:os';

const root = join(import.meta.dirname, '..', '..');

/** Chrome and Edge locations, first match wins. */
export const BrowserCandidates = [
  process.env.PERF_BROWSER,
  'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  'C:\\Program Files (x86)\\Google\\Chrome\\Application\\chrome.exe',
  join(process.env.LOCALAPPDATA ?? '', 'Google', 'Chrome', 'Application', 'chrome.exe'),
  'C:\\Program Files\\Microsoft\\Edge\\Application\\msedge.exe',
  'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
  '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
  '/usr/bin/google-chrome',
  '/usr/bin/chromium',
  '/usr/bin/chromium-browser',
].filter(Boolean);

export const Config = {
  root: root,
  port: 5199,
  host: '127.0.0.1',
  settleQuietMs: 48,
  settleTimeoutMs: 4000,
  /** Full home -> lesson -> test cycles used for leak detection. */
  cycles: 3,
  /** Samples kept per scenario in the JSON report. */
  maxSamples: 400,
  reportDir: join(root, 'Tools', 'Performance', 'Reports'),
  tempDir: join(tmpdir(), 'english-perf'),
};

/** Limits that flag a regression. Override with `--budget key=value`. */
export const Budgets = {
  settleP95Ms: 400,
  settleP99Ms: 800,
  frameP95Ms: 32,
  frameP99Ms: 80,
  droppedFramePercent: 15,
  longTaskMaxMs: 300,
  longTaskTotalMs: 4000,
  layoutShift: 0.2,
  liveTimers: 120,
  heapGrowthKbPerCycle: 1024,
  nodeGrowthPerCycle: 500,
  maxComponentRendersPerRoute: 1500,
  networkFailures: 0,
  consoleErrors: 0,
  duplicateRequests: 3,
};

/** Requests that are expected to repeat between page loads. */
export const DuplicateExempt = [/fonts\.googleapis\.com/, /fonts\.gstatic\.com/, /\/@vite\//];

/** Only data requests count as duplicate calls; static assets repeat naturally. */
export const DuplicateTypes = new Set(['XHR', 'Fetch', 'EventSource', 'Ping']);

/** Failed requests that are noise rather than app regressions. */
export const FailureExempt = [/\/favicon\.ico$/];

/** CDP connection and command timeouts, in milliseconds. */
export const Timeouts = {
  browserStart: 20000,
  command: 30000,
  navigation: 30000,
};
