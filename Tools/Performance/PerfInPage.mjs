/** In-page instrumentation installed before the app boots. */

export const PerfInstrumentation = String.raw`
(() => {
  if (window.__perfInstalled) return;
  window.__perfInstalled = true;

  const MaxEntries = 6000;
  const P = {
    frames: [],
    longTasks: [],
    loaf: [],
    shifts: [],
    events: [],
    resources: [],
    errors: [],
    paint: null,
    timers: { created: 0, live: 0, bySite: {} },
  };
  window.__perf = P;

  function push(list, entry) {
    list.push(entry);
    if (list.length > MaxEntries) list.splice(0, list.length - MaxEntries);
  }

  function site() {
    const stack = String(new Error().stack || '');
    const lines = stack.split('\n').slice(2, 5).map((line) => line.trim());
    return lines.join(' > ').replace(/^at\s+/, '').slice(0, 160) || 'unknown';
  }

  const nativeTimeout = window.setTimeout;
  const nativeClearTimeout = window.clearTimeout;
  const nativeInterval = window.setInterval;
  const nativeClearInterval = window.clearInterval;
  const liveTimeouts = new Map();
  const liveIntervals = new Map();

  function syncLive() {
    P.timers.live = liveTimeouts.size + liveIntervals.size;
  }

  function countTimer(origin) {
    P.timers.created += 1;
    P.timers.bySite[origin] = (P.timers.bySite[origin] || 0) + 1;
  }

  window.setTimeout = function (callback, delay) {
    if (typeof callback !== 'function') return nativeTimeout.apply(window, arguments);
    const origin = site();
    const args = Array.prototype.slice.call(arguments, 2);
    countTimer(origin);
    const id = nativeTimeout.call(window, function () {
      liveTimeouts.delete(id);
      syncLive();
      return callback.apply(this, args);
    }, delay);
    liveTimeouts.set(id, origin);
    syncLive();
    return id;
  };

  window.clearTimeout = function (id) {
    liveTimeouts.delete(id);
    syncLive();
    return nativeClearTimeout.call(window, id);
  };

  window.setInterval = function (callback, delay) {
    if (typeof callback !== 'function') return nativeInterval.apply(window, arguments);
    const origin = site();
    const args = Array.prototype.slice.call(arguments, 2);
    countTimer(origin);
    const id = nativeInterval.call(window, function () {
      return callback.apply(this, args);
    }, delay);
    liveIntervals.set(id, origin);
    syncLive();
    return id;
  };

  window.clearInterval = function (id) {
    liveIntervals.delete(id);
    syncLive();
    return nativeClearInterval.call(window, id);
  };

  function watch(type, handler) {
    try {
      const observer = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        for (let i = 0; i < entries.length; i++) handler(entries[i]);
      });
      observer.observe({ type: type, buffered: true });
    } catch (error) {
      // Entry type is not supported by this browser.
    }
  }

  watch('longtask', (entry) => {
    push(P.longTasks, { start: entry.startTime, duration: entry.duration, name: entry.name });
  });

  watch('long-animation-frame', (entry) => {
    const scripts = entry.scripts || [];
    push(P.loaf, {
      start: entry.startTime,
      duration: entry.duration,
      blocking: entry.blockingDuration || 0,
      renderStart: entry.renderStart || 0,
      styleLayout: entry.styleAndLayoutStart || 0,
      scripts: scripts.map((script) => ({
        name: script.name || script.sourceFunctionName || script.sourceURL || 'unknown',
        invoker: script.invoker || '',
        duration: script.duration || 0,
      })),
    });
  });

  watch('layout-shift', (entry) => {
    if (entry.hadRecentInput) return;
    const sources = entry.sources || [];
    push(P.shifts, {
      start: entry.startTime,
      value: entry.value,
      sources: sources.map((source) => (source.node ? source.node.nodeName : 'unknown')),
    });
  });

  watch('event', (entry) => {
    push(P.events, {
      name: entry.name,
      start: entry.startTime,
      duration: entry.duration,
      delay: entry.processingStart - entry.startTime,
      processing: entry.processingEnd - entry.processingStart,
    });
  });

  watch('resource', (entry) => {
    push(P.resources, {
      name: entry.name,
      type: entry.initiatorType,
      start: entry.startTime,
      duration: entry.duration,
      transfer: entry.transferSize || 0,
      decoded: entry.decodedBodySize || 0,
    });
  });

  watch('paint', (entry) => {
    P.paint = P.paint || {};
    P.paint[entry.name] = entry.startTime;
  });

  window.addEventListener('error', (event) => {
    push(P.errors, {
      kind: 'error',
      message: String(event.message),
      source: String(event.filename || ''),
    });
  });

  window.addEventListener('unhandledrejection', (event) => {
    push(P.errors, { kind: 'rejection', message: String(event.reason) });
  });

  let lastFrame = performance.now();
  function frame(now) {
    const delta = now - lastFrame;
    lastFrame = now;
    if (P.frames.length < MaxEntries) P.frames.push(delta);
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);

  P.settle = function (quiet, timeout) {
    const quietMs = quiet || 48;
    const timeoutMs = timeout || 4000;
    return new Promise((resolve) => {
      const started = performance.now();
      let lastMutation = started;
      let finished = false;
      const observer = new MutationObserver(() => {
        lastMutation = performance.now();
      });
      observer.observe(document.documentElement, {
        subtree: true,
        childList: true,
        attributes: true,
        characterData: true,
      });
      function finish() {
        if (finished) return;
        finished = true;
        observer.disconnect();
        requestAnimationFrame(() => {
          requestAnimationFrame(() => {
            resolve({ ms: performance.now() - started, timedOut: performance.now() - started >= timeoutMs });
          });
        });
      }
      function poll() {
        const now = performance.now();
        if (now - lastMutation >= quietMs || now - started >= timeoutMs) finish();
        else nativeTimeout.call(window, poll, 8);
      }
      nativeTimeout.call(window, poll, 8);
    });
  };

  P.reset = function () {
    P.frames.length = 0;
    P.longTasks.length = 0;
    P.loaf.length = 0;
    P.shifts.length = 0;
    P.events.length = 0;
    P.resources.length = 0;
    P.errors.length = 0;
    if (window.__perfProbe) window.__perfProbe.reset();
    return true;
  };

  P.snapshot = function () {
    const navigation = performance.getEntriesByType('navigation')[0];
    const probe = window.__perfProbe;
    return {
      now: performance.now(),
      frames: P.frames.slice(),
      longTasks: P.longTasks.slice(),
      loaf: P.loaf.slice(),
      shifts: P.shifts.slice(),
      events: P.events.slice(),
      resources: P.resources.slice(),
      errors: P.errors.slice(),
      paint: P.paint,
      timers: {
        created: P.timers.created,
        live: P.timers.live,
        bySite: Object.assign({}, P.timers.bySite),
      },
      navigation: navigation
        ? {
            ttfb: navigation.responseStart,
            domContentLoaded: navigation.domContentLoadedEventEnd,
            load: navigation.loadEventEnd,
            transfer: navigation.transferSize || 0,
          }
        : null,
      dom: {
        nodes: document.getElementsByTagName('*').length,
        scripts: document.scripts.length,
        styles: document.styleSheets.length,
      },
      renders: probe ? probe.snapshot() : null,
    };
  };
})();
`;
