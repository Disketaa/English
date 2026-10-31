import { options, type VNode } from 'preact';
import { lessons } from '../../Content/Lessons';

/** One route the performance test should visit. */
export interface PerfRoute {
  name: string;
  hash: string;
}

/** One component and how many times it rendered. */
export interface PerfRenderCount {
  name: string;
  count: number;
}

/** Render counters exposed to the performance test. */
export interface PerfRenderSnapshot {
  total: number;
  renders: PerfRenderCount[];
}

declare global {
  interface Window {
    __perfProbe?: {
      reset: () => void;
      snapshot: () => PerfRenderSnapshot;
    };
    __perfRoutes?: PerfRoute[];
  }
}

const counts = new Map<string, number>();
let total = 0;
let installed = false;

function buildRoutes(): PerfRoute[] {
  const routes: PerfRoute[] = [{ name: 'Home', hash: '#/' }];
  for (const lesson of lessons) {
    if (lesson.locked === true) continue;
    lesson.pages.forEach((page, index) => {
      routes.push({
        name: `Lesson: ${lesson.id} · page ${index + 1}`,
        hash: `#/lesson/${lesson.id}/${index + 1}`,
      });
    });
  }
  return routes;
}

function componentName(type: unknown): string {
  if (typeof type === 'string') return type;
  if (typeof type === 'function' && type.name !== '') return type.name;
  return 'Anonymous';
}

function snapshot(): PerfRenderSnapshot {
  const renders: PerfRenderCount[] = [];
  for (const [name, count] of counts) renders.push({ name: name, count: count });
  renders.sort((a, b) => b.count - a.count);
  return { total: total, renders: renders };
}

function reset(): void {
  counts.clear();
  total = 0;
}

/** Count Preact component renders so the perf test can spot render storms. */
export function installPerfProbe(): void {
  if (installed) return;
  installed = true;
  const previous = options.diffed;
  options.diffed = (vnode: VNode) => {
    if (typeof vnode.type === 'function') {
      const name = componentName(vnode.type);
      counts.set(name, (counts.get(name) ?? 0) + 1);
      total += 1;
    }
    if (previous !== undefined) previous(vnode);
  };
  window.__perfProbe = { reset: reset, snapshot: snapshot };
  window.__perfRoutes = buildRoutes();
}
