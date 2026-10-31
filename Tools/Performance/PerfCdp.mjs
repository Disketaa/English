/** Minimal Chrome DevTools Protocol client and browser launcher, no dependencies. */

import { spawn } from 'node:child_process';
import { existsSync, mkdirSync, mkdtempSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { Config, BrowserCandidates, Timeouts } from './PerfConfig.mjs';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** First installed Chromium browser from the candidate list. */
export function findBrowser() {
  const found = BrowserCandidates.find((path) => existsSync(path));
  if (found === undefined) {
    throw new Error(
      'No Chrome or Edge found. Set PERF_BROWSER to a Chromium executable.'
    );
  }
  return found;
}

async function fetchJson(url, attempts = 100) {
  let lastError;
  for (let i = 0; i < attempts; i++) {
    try {
      const response = await fetch(url);
      if (response.ok) return await response.json();
      lastError = new Error(`${response.status} ${response.statusText}`);
    } catch (error) {
      lastError = error;
    }
    await delay(100);
  }
  throw new Error(`Cannot reach ${url}: ${lastError instanceof Error ? lastError.message : lastError}`);
}

/** One page target over a WebSocket, with promise-based commands. */
export class CdpClient {
  constructor(socket) {
    this.socket = socket;
    this.nextId = 1;
    this.pending = new Map();
    this.listeners = new Map();
    this.closed = false;
    socket.addEventListener('message', (event) => this.handle(event));
    socket.addEventListener('close', () => {
      this.closed = true;
      for (const slot of this.pending.values()) slot.reject(new Error('CDP socket closed'));
      this.pending.clear();
    });
  }

  static async connect(url, timeout = Timeouts.browserStart) {
    const socket = new WebSocket(url);
    await new Promise((resolve, reject) => {
      const timer = setTimeout(() => reject(new Error('CDP connect timed out')), timeout);
      socket.addEventListener(
        'open',
        () => {
          clearTimeout(timer);
          resolve();
        },
        { once: true }
      );
      socket.addEventListener(
        'error',
        () => {
          clearTimeout(timer);
          reject(new Error(`CDP connect failed: ${url}`));
        },
        { once: true }
      );
    });
    return new CdpClient(socket);
  }

  handle(event) {
    const read = typeof event.data === 'string' ? Promise.resolve(event.data) : event.data.text();
    read.then((text) => {
      const message = JSON.parse(text);
      if (message.id !== undefined) {
        const slot = this.pending.get(message.id);
        if (slot === undefined) return;
        this.pending.delete(message.id);
        if (message.error !== undefined) slot.reject(new Error(message.error.message));
        else slot.resolve(message.result);
        return;
      }
      for (const handler of this.listeners.get(message.method) ?? []) {
        handler(message.params);
      }
    });
  }

  send(method, params = {}, timeout = Timeouts.command) {
    if (this.closed) return Promise.reject(new Error(`CDP closed before ${method}`));
    return new Promise((resolve, reject) => {
      const id = this.nextId++;
      const timer = setTimeout(() => {
        this.pending.delete(id);
        reject(new Error(`CDP command timed out: ${method}`));
      }, timeout);
      this.pending.set(id, {
        resolve: (value) => {
          clearTimeout(timer);
          resolve(value);
        },
        reject: (error) => {
          clearTimeout(timer);
          reject(error);
        },
      });
      this.socket.send(JSON.stringify({ id, method, params }));
    });
  }

  on(method, handler) {
    const handlers = this.listeners.get(method) ?? [];
    handlers.push(handler);
    this.listeners.set(method, handlers);
    return () => {
      this.listeners.set(
        method,
        (this.listeners.get(method) ?? []).filter((item) => item !== handler)
      );
    };
  }

  waitFor(method, timeout = Timeouts.navigation) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        off();
        reject(new Error(`Timed out waiting for ${method}`));
      }, timeout);
      const off = this.on(method, (params) => {
        clearTimeout(timer);
        off();
        resolve(params);
      });
    });
  }

  close() {
    this.socket.close();
  }
}

/** Launch a headless Chromium and attach to its first page target. */
export async function launchBrowser() {
  const executable = findBrowser();
  mkdirSync(Config.tempDir, { recursive: true });
  const userDataDir = mkdtempSync(join(Config.tempDir, 'profile-'));
  const args = [
    '--headless=new',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--no-sandbox',
    '--disable-dev-shm-usage',
    '--disable-extensions',
    '--disable-background-networking',
    '--disable-background-timer-throttling',
    '--disable-renderer-backgrounding',
    '--disable-backgrounding-occluded-windows',
    '--disable-sync',
    '--metrics-recording-only',
    '--mute-audio',
    '--hide-scrollbars',
    '--force-device-scale-factor=1',
    '--window-size=1440,960',
    '--remote-debugging-port=0',
    `--user-data-dir=${userDataDir}`,
    'about:blank',
  ];
  const process = spawn(executable, args, { stdio: 'ignore' });

  const activePort = join(userDataDir, 'DevToolsActivePort');
  for (let i = 0; i < Timeouts.browserStart / 100 && !existsSync(activePort); i++) {
    await delay(100);
  }
  if (!existsSync(activePort)) {
    process.kill();
    throw new Error(`Chromium did not open a debugging port: ${executable}`);
  }

  const port = readFileSync(activePort, 'utf8').split(/\r?\n/)[0].trim();
  const targets = await fetchJson(`http://127.0.0.1:${port}/json/list`);
  const page = targets.find((target) => target.type === 'page') ?? targets[0];
  if (page === undefined) {
    process.kill();
    throw new Error('Chromium opened no page target.');
  }

  const client = await CdpClient.connect(page.webSocketDebuggerUrl);
  return {
    client,
    executable,
    close() {
      client.close();
      if (!process.killed) process.kill();
      setTimeout(() => {
        try {
          rmSync(userDataDir, { recursive: true, force: true });
        } catch {
          // Windows keeps profile files locked briefly; the temp dir is disposable.
        }
      }, 500);
    },
  };
}
