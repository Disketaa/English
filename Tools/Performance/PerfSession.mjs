/** Drives the page over CDP and records one performance sample per route. */

import { Config, Timeouts } from './PerfConfig.mjs';
import { PerfInstrumentation } from './PerfInPage.mjs';

/** Thrown when a command evaluates to an exception inside the page. */
class PageError extends Error {}

function metricMap(result) {
  const map = {};
  for (const metric of result.metrics) map[metric.name] = metric.value;
  return map;
}

export class PerfSession {
  constructor(client, baseUrl) {
    this.client = client;
    this.baseUrl = baseUrl;
    this.samples = [];
    this.cycles = [];
    this.requests = [];
    this.failures = [];
    this.exceptions = [];
    this.consoleErrors = [];
    this.requestUrls = new Map();
    this.routeRequests = [];
    this.routeFailures = [];
    this.started = false;
  }

  async start() {
    if (this.started) return;
    this.started = true;
    await this.client.send('Page.enable');
    await this.client.send('Runtime.enable');
    await this.client.send('Network.enable');
    await this.client.send('Performance.enable');
    await this.client.send('HeapProfiler.enable');
    await this.client.send('Page.addScriptToEvaluateOnNewDocument', {
      source: PerfInstrumentation,
    });

    this.client.on('Network.requestWillBeSent', (params) => {
      this.requestUrls.set(params.requestId, params.request.url);
    });
    this.client.on('Network.responseReceived', (params) => {
      const entry = {
        url: params.response.url,
        status: params.response.status,
        type: params.type,
        bytes: params.response.encodedDataLength ?? 0,
        cache: params.response.fromDiskCache === true,
      };
      this.requests.push(entry);
      this.routeRequests.push(entry);
    });
    this.client.on('Network.loadingFailed', (params) => {
      if (params.canceled === true) return;
      const entry = {
        url: this.requestUrls.get(params.requestId) ?? 'unknown',
        error: params.errorText,
      };
      this.failures.push(entry);
      this.routeFailures.push(entry);
    });
    this.client.on('Runtime.exceptionThrown', (params) => {
      const details = params.exceptionDetails;
      const description = details.exception?.description ?? '';
      this.exceptions.push({
        text: details.text,
        url: details.url ?? '',
        line: details.lineNumber ?? 0,
        description: description.slice(0, 400),
      });
    });
    this.client.on('Runtime.consoleAPICalled', (params) => {
      if (params.type !== 'error' && params.type !== 'assert') return;
      const text = params.args
        .map((arg) => arg.value ?? arg.description ?? '')
        .join(' ')
        .slice(0, 400);
      this.consoleErrors.push(text);
    });
  }

  async evaluate(expression, awaitPromise = false) {
    const result = await this.client.send('Runtime.evaluate', {
      expression: expression,
      awaitPromise: awaitPromise,
      returnByValue: true,
      userGesture: true,
    });
    if (result.exceptionDetails !== undefined) {
      const text = result.exceptionDetails.exception?.description ?? result.exceptionDetails.text;
      throw new PageError(`Page error: ${text}`);
    }
    return result.result.value;
  }

  async navigate(url) {
    const loaded = this.client.waitFor('Page.loadEventFired', Timeouts.navigation);
    await this.client.send('Page.navigate', { url: url });
    await loaded.catch(() => undefined);
    await this.evaluate('document.fonts ? document.fonts.ready.then(() => true) : true', true);
  }

  async settle() {
    const result = await this.evaluate(
      `window.__perf.settle(${Config.settleQuietMs}, ${Config.settleTimeoutMs})`,
      true
    );
    return result;
  }

  async metrics() {
    return metricMap(await this.client.send('Performance.getMetrics'));
  }

  async forceGc() {
    await this.client.send('HeapProfiler.collectGarbage');
  }

  /** Settle, capture the route snapshot, then clear per-route counters. */
  async sample(route, cycle) {
    const settled = await this.settle();
    const page = await this.evaluate('window.__perf.snapshot()');
    const metrics = await this.metrics();
    const sample = {
      route: route,
      cycle: cycle,
      settleMs: settled.ms,
      timedOut: settled.timedOut,
      page: page,
      metrics: metrics,
      requests: this.routeRequests.slice(),
      failures: this.routeFailures.slice(),
    };
    this.samples.push(sample);
    this.routeRequests.length = 0;
    this.routeFailures.length = 0;
    await this.evaluate('window.__perf.reset()');
    return sample;
  }

  /** Close the current cycle with a forced GC and a memory snapshot. */
  async finishCycle(index, label) {
    await this.forceGc();
    const metrics = await this.metrics();
    const page = await this.evaluate('window.__perf.snapshot()');
    this.cycles.push({
      index: index,
      label: label,
      heap: metrics.JSHeapUsedSize ?? 0,
      heapTotal: metrics.JSHeapTotalSize ?? 0,
      nodes: metrics.Nodes ?? 0,
      listeners: metrics.JSEventListeners ?? 0,
      documents: metrics.Documents ?? 0,
      liveTimers: page.timers.live,
      createdTimers: page.timers.created,
      bySite: page.timers.bySite,
      samples: this.samples.filter((sample) => sample.cycle === index).length,
    });
    await this.evaluate('window.__perf.reset()');
  }

  async screenshot() {
    const shot = await this.client.send('Page.captureScreenshot', { format: 'png' });
    return shot.data;
  }
}
