import { ComponentChildren } from 'preact';
import { useCallback, useEffect, useRef } from 'preact/hooks';
import styles from './PageScroll.module.css';

export interface PageScrollProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  children: ComponentChildren;
}

export function PageScroll({ currentPage, onPageChange, children }: PageScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isProgrammatic = useRef(false);

  const scrollToPage = useCallback((page: number) => {
    const container = containerRef.current;
    if (!container) return;
    const panel = container.children[page];
    if (!(panel instanceof HTMLElement)) return;
    isProgrammatic.current = true;
    panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
    isProgrammatic.current = false;
  }, []);

  const handleScroll = useCallback(() => {
    if (isProgrammatic.current) return;
    const container = containerRef.current;
    if (!container) return;
    const panels = Array.from(container.children);
    let current = 0;
    for (const [index, panel] of panels.entries()) {
      if (!(panel instanceof HTMLElement)) continue;
      const rect = panel.getBoundingClientRect();
      const containerRect = container.getBoundingClientRect();
      const relativeTop = rect.top - containerRect.top;
      if (relativeTop <= 60) {
        current = index;
      } else {
        break;
      }
    }
    onPageChange(current);
  }, [onPageChange]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('scroll', handleScroll, { passive: true });
    return () => container.removeEventListener('scroll', handleScroll);
  }, [handleScroll]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const panel = container.children[currentPage];
    if (!(panel instanceof HTMLElement)) return;
    const rect = panel.getBoundingClientRect();
    const containerRect = container.getBoundingClientRect();
    const relativeTop = rect.top - containerRect.top;
    if (relativeTop < 0 || relativeTop >= containerRect.height) {
      scrollToPage(currentPage);
    }
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
