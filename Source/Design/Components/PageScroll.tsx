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
    const itemWidth = container.clientWidth;
    if (itemWidth === 0) return;
    isProgrammatic.current = true;
    container.scrollTo({ left: page * itemWidth, behavior: 'smooth' });
    isProgrammatic.current = false;
  }, []);

  const handleScroll = useCallback(() => {
    if (isProgrammatic.current) return;
    const container = containerRef.current;
    if (!container) return;
    const itemWidth = container.clientWidth;
    if (itemWidth === 0) return;
    const pageCount = container.children.length;
    const page = Math.round(container.scrollLeft / itemWidth);
    if (page >= 0 && page < pageCount) {
      onPageChange(page);
    }
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
    const itemWidth = container.clientWidth;
    if (itemWidth === 0) return;
    const targetScroll = currentPage * itemWidth;
    if (Math.abs(container.scrollLeft - targetScroll) > 2) {
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
