import { ComponentChildren } from 'preact';
import { useCallback, useEffect, useRef } from 'preact/hooks';
import styles from './PageScroll.module.css';

export interface PageScrollProps {
  currentPage: number;
  onPageChange: (page: number) => void;
  children: ComponentChildren;
}

/** Pixels scrolled per wheel delta unit. */
const wheelSensitivity = 0.6;

export function PageScroll({ currentPage, onPageChange, children }: PageScrollProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const isProgrammatic = useRef(false);

  const getContainer = (): HTMLDivElement | null => containerRef.current;

  const scrollToPage = useCallback((page: number) => {
    const scrollEl = getContainer();
    if (!scrollEl) return;
    const itemWidth = scrollEl.clientWidth;
    if (itemWidth === 0) return;
    isProgrammatic.current = true;
    scrollEl.scrollTo({ left: page * itemWidth, behavior: 'smooth' });
    isProgrammatic.current = false;
  }, []);

  const handleScroll = useCallback(() => {
    if (isProgrammatic.current) return;
    const scrollEl = getContainer();
    if (!scrollEl) return;
    const itemWidth = scrollEl.clientWidth;
    if (itemWidth === 0) return;
    const pageCount = scrollEl.children.length;
    const page = Math.round(scrollEl.scrollLeft / itemWidth);
    if (page >= 0 && page < pageCount) {
      onPageChange(page);
    }
  }, [onPageChange]);

  const handleWheel = useCallback((event: WheelEvent) => {
    const wheelEl = getContainer();
    if (!wheelEl) return;
    // Vertical wheel → horizontal scroll; prevent page-level vertical scroll.
    event.preventDefault();
    wheelEl.scrollBy({ left: event.deltaY * wheelSensitivity, behavior: 'smooth' });
  }, []);

  useEffect(() => {
    const scrollEl = getContainer();
    if (!scrollEl) return;
    scrollEl.addEventListener('scroll', handleScroll, { passive: true });
    scrollEl.addEventListener('wheel', handleWheel, { passive: false });
    return () => {
      scrollEl.removeEventListener('scroll', handleScroll);
      scrollEl.removeEventListener('wheel', handleWheel);
    };
  }, [handleScroll, handleWheel]);

  useEffect(() => {
    const pageEl = getContainer();
    if (!pageEl) return;
    const itemWidth = pageEl.clientWidth;
    if (itemWidth === 0) return;
    const targetScroll = currentPage * itemWidth;
    if (Math.abs(pageEl.scrollLeft - targetScroll) > 2) {
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
