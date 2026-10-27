import { useEffect, useState } from 'preact/hooks';

export type Route = { name: 'Home' } | { name: 'Lesson'; lessonId: string; page: number };

const lessonPrefix = '#/lesson/';

export function parseRoute(hash: string): Route {
  if (!hash.startsWith(lessonPrefix)) return { name: 'Home' };
  const [lessonId, pagePart] = hash.slice(lessonPrefix.length).split('/');
  if (lessonId === undefined || lessonId === '') return { name: 'Home' };
  const pageNumber = Number.parseInt(pagePart ?? '', 10);
  const page = Number.isFinite(pageNumber) && pageNumber > 0 ? pageNumber - 1 : 0;
  return { name: 'Lesson', lessonId, page };
}

export function lessonUrl(lessonId: string, page: number): string {
  return `${lessonPrefix}${lessonId}/${page + 1}`;
}

export function homeUrl(): string {
  return '#/';
}

const routeListeners = new Set<() => void>();

/** Update the URL without fragment navigation: assigning `location.hash` cancels Chromium's
 * middle-click autoscroll whenever scrolling changes the page. */
export function navigate(hash: string): void {
  if (window.location.hash === hash) return;
  window.history.pushState(null, '', hash);
  for (const listener of routeListeners) listener();
}

export function useRoute(): Route {
  const [route, setRoute] = useState<Route>(() => parseRoute(window.location.hash));

  useEffect(() => {
    const handleChange = () => setRoute(parseRoute(window.location.hash));
    routeListeners.add(handleChange);
    window.addEventListener('hashchange', handleChange);
    return () => {
      routeListeners.delete(handleChange);
      window.removeEventListener('hashchange', handleChange);
    };
  }, []);

  return route;
}
