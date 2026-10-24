import { ComponentChildren, RefObject } from 'preact';
import { useCallback, useEffect, useRef } from 'preact/hooks';
import styles from './PageScroll.module.css';

export interface PageScrollProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  children: ComponentChildren;
  /** External scroll container (e.g. the lesson main area). Scrolls that instead of self. */
  scrollContainerRef?: RefObject<HTMLDivElement>;
}

export function PageScroll({
  currentPage,
  onPageChange,
  children,
  scrollContainerRef,
}: PageScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isProgrammatic = useRef(false);

  const scrollEl = () => scrollContainerRef.current ?? containerRef.current;

  const scrollToPage = useCallback(
    (page: number) => {
      const panel = scrollEl()?.children[page];
      if (!(panel instanceof HTMLElement)) return;
      isProgrammatic.current = true;
      panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
      isProgrammatic.current = false;
    },
    [scrollContainerRef]
  );

  const handleScroll = useCallback(() => {
    if (isProgrammatic.current) return;
    const el = scrollEl();
    if (!el) return;
    const panels = Array.from(el.children);
    let current = 0;
    for (const [index, panel] of panels.entries()) {
      if (!(panel instanceof HTMLElement)) continue;
      const rect = panel.getBoundingClientRect();
      const elRect = el.getBoundingClientRect();
      const relativeTop = rect.top - elRect.top;
      if (relativeTop <= 60) {
        current = index;
      } else {
        break;
      }
    }
    onPageChange(current);
  }, [onPageChange, scrollContainerRef]);

  useEffect(() => {
    const el = scrollEl();
    if (!el) return;
    el.addEventListener('scroll', handleScroll, { passive: true });
    return () => el.removeEventListener('scroll', handleScroll);
  }, [handleScroll, scrollContainerRef]);

  useEffect(() => {
    const el = scrollEl();
    if (!el) return;
    const panel = el.children[currentPage];
    if (!(panel instanceof HTMLElement)) return;
    const rect = panel.getBoundingClientRect();
    const elRect = el.getBoundingClientRect();
    const relativeTop = rect.top - elRect.top;
    if (relativeTop < 0 || relativeTop >= elRect.height) {
      scrollToPage(currentPage);
    }
  }, [currentPage, scrollToPage, scrollContainerRef]);

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
