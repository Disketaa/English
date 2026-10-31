/** Automatic scenario runner. The app publishes its route list under `?perf`
 * (`window.__perfRoutes`), built from the lesson registry. Every lesson page is therefore
 * sampled without editing this file when content is added. On each route the runner also
 * performs generic interactions: it clicks visible buttons one at a time, re-discovers the DOM
 * after each click, and skips navigation-away targets. This exercises state updates, reveals,
 * choices and test submits on any component without per-component wiring. To cover a brand-new
 * top-level screen, add its route to `buildRoutes()` in `Source/App/Perf/PerfProbe.ts`;
 * components inside it are already counted. */

const MaxInteractions = 24;

/** All visible, enabled clickable targets, with a stable key. */
function discoverTargets() {
  const targets = [];
  const seen = new Set();
  for (const element of document.querySelectorAll(
    'button, a, [role="button"], [role="link"]'
  )) {
    if (element.disabled) continue;
    const rect = element.getBoundingClientRect();
    if (rect.width === 0 || rect.height === 0) continue;
    const text = (element.textContent || '').trim();
    if (text === '') continue;
    const href = element.getAttribute('href') || '';
    const key = `${element.tagName}|${text}|${href}`;
    if (seen.has(key)) continue;
    seen.add(key);
    targets.push({ key: key, href: href });
  }
  return targets;
}

/** Click the target with the given key; returns false when it vanished. */
function clickTarget(key) {
  const element = Array.from(
    document.querySelectorAll('button, a, [role="button"], [role="link"]')
  ).find((item) => {
    if (item.disabled) return false;
    const text = (item.textContent || '').trim();
    const href = item.getAttribute('href') || '';
    return `${item.tagName}|${text}|${href}` === key;
  });
  if (!element) return false;
  element.click();
  return true;
}

function pageSignature() {
  const prompt = document.querySelector('[class*="Prompt"]');
  return `${prompt ? prompt.textContent : ''}|${location.hash}`;
}

async function signature(session) {
  return session.evaluate(`(${pageSignature.toString()})()`);
}

/** Walk the current route with generic, bounded interactions. */
async function interact(session, route, cycle) {
  const navigationKeys = new Set();
  const clicked = new Set();
  let current = await signature(session);
  let actions = 0;

  for (let step = 0; step < MaxInteractions; step++) {
    const targets = await session.evaluate(`(${discoverTargets.toString()})()`);
    const target = targets.find(
      (item) => !navigationKeys.has(item.key) && !clicked.has(item.key)
    );
    if (target === undefined) break;

    const hit = await session.evaluate(
      `(${clickTarget.toString()})(${JSON.stringify(target.key)})`
    );
    if (!hit) {
      clicked.add(target.key);
      continue;
    }

    await session.settle();
    actions += 1;
    const hash = await session.evaluate('location.hash');

    if (hash !== route.hash) {
      navigationKeys.add(target.key);
      await session.evaluate(`location.hash = ${JSON.stringify(route.hash)}`);
      await session.settle();
      continue;
    }

    const next = await signature(session);
    if (next !== current) {
      clicked.clear();
      current = next;
    }
    clicked.add(target.key);
  }

  if (actions > 0) await session.sample(`${route.name} · interactions`, cycle);
}

/** One crawl cycle: visit every published route and interact with it. */
export async function runCycle(session, cycle) {
  const routes = await session.evaluate(
    `window.__perfRoutes || [{ name: 'Home', hash: '#/' }]`
  );
  for (const route of routes) {
    await session.evaluate(`location.hash = ${JSON.stringify(route.hash)}`);
    await session.settle();
    await session.sample(route.name, cycle);
    await interact(session, route, cycle);
  }
}
