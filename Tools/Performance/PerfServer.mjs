/** Starts and stops the Vite dev server used by the performance test. */

import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { Config } from './PerfConfig.mjs';

function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/** Poll the dev server until it answers or the deadline passes. */
export async function waitForServer(url, timeout = 30000) {
  const started = Date.now();
  while (Date.now() - started < timeout) {
    try {
      const response = await fetch(url, { signal: AbortSignal.timeout(2000) });
      if (response.ok) return;
    } catch {
      // Server still booting.
    }
    await delay(200);
  }
  throw new Error(`Vite dev server did not answer at ${url}`);
}

/** Spawn `npm run dev` on a fixed port and wait for the first response. */
export async function startServer(port = Config.port, host = Config.host) {
  const viteBin = join(Config.root, 'node_modules', 'vite', 'bin', 'vite.js');
  const viteArgs = ['--port', String(port), '--strictPort', '--host', host];
  const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
  const child = existsSync(viteBin)
    ? spawn(process.execPath, [viteBin, ...viteArgs], {
        cwd: Config.root,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, BROWSER: 'none' },
      })
    : spawn(npm, ['run', 'dev', '--', ...viteArgs], {
        cwd: Config.root,
        stdio: ['ignore', 'pipe', 'pipe'],
        env: { ...process.env, BROWSER: 'none' },
        shell: true,
      });

  const log = [];
  const capture = (chunk) => {
    log.push(String(chunk));
    if (log.length > 200) log.shift();
  };
  child.stdout.on('data', capture);
  child.stderr.on('data', capture);

  const url = `http://${host}:${port}/`;
  try {
    await waitForServer(url);
  } catch (error) {
    stopChild(child);
    throw new Error(`${error.message}\n${log.join('')}`, { cause: error });
  }

  return {
    url,
    log,
    stop() {
      stopChild(child);
    },
  };
}

function stopChild(child) {
  if (child.killed || child.exitCode !== null) return;
  if (process.platform === 'win32') {
    spawn('taskkill', ['/pid', String(child.pid), '/T', '/F'], { stdio: 'ignore' });
  } else {
    child.kill('SIGTERM');
  }
}
