import { ComponentChildren } from 'preact';
import { useCallback, useEffect, useRef } from 'preact/hooks';
import styles from './PageScroll.module.css';

export interface PageScrollProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  children: ComponentChildren;
}

/** A page becomes current once its top passes this offset. */
const PageOffset = 60;

export function PageScroll({ currentPage, onPageChange, children }: PageScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isProgrammatic = useRef(false);
  const scrollTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const scrolledPage = useRef(currentPage === 0 ? 0 : -1);

  const scrollToPage = useCallback((page: number) => {
    const panel = containerRef.current?.children[page];
    if (!(panel instanceof HTMLElement)) return;
    isProgrammatic.current = true;
    scrolledPage.current = page;
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    if (scrollTimer.current) clearTimeout(scrollTimer.current);
    scrollTimer.current = setTimeout(() => {
      isProgrammatic.current = false;
      scrollTimer.current = null;
    }, 450);
  }, []);

  const handleScroll = useCallback(() => {
    if (isProgrammatic.current) return;
    const panels = Array.from(containerRef.current?.children ?? []);
    let current = 0;
    for (const [index, panel] of panels.entries()) {
      if (!(panel instanceof HTMLElement)) continue;
      if (panel.getBoundingClientRect().top <= PageOffset) {
        current = index;
      } else {
        break;
      }
    }
    const atBottom =
      window.scrollY + window.innerHeight >= document.documentElement.scrollHeight - PageOffset;
    if (atBottom) current = panels.length - 1;
    if (current === scrolledPage.current) return;
    scrolledPage.current = current;
    onPageChange(current);
  }, [onPageChange]);

  useEffect(() => {
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (scrollTimer.current) clearTimeout(scrollTimer.current);
    };
  }, [handleScroll]);

  useEffect(() => {
    if (currentPage === scrolledPage.current) return;
    scrollToPage(currentPage);
  }, [currentPage, scrollToPage]);

  const pageNodes = Array.isArray(children) ? children : [children];
  return (
    <div class={styles.Root} ref={containerRef}>
      {pageNodes.map((node, index) => (
        <section key={index} class={styles.PagePanel}>
          {node}
        </section>
      ))}
    </div>
  );
}
