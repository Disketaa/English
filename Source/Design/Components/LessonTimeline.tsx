import { LessonPage } from '../../Core/Types';
import { Strings } from '../../Core/Strings';
import { useCallback } from 'preact/hooks';
import styles from './LessonTimeline.module.css';

export interface LessonTimelineProps {
  pages: LessonPage[];
  currentPage: number;
  reachedPage: number;
  onPageClick: (page: number) => void;
}

export function LessonTimeline({
  pages,
  currentPage,
  reachedPage,
  onPageClick,
}: LessonTimelineProps) {
  const handleClick = useCallback(
    (page: number) => () => {
      onPageClick(page);
    },
    [onPageClick]
  );

  return (
    <nav class={styles.Root} aria-label={Strings.lessonTimelineLabel}>
      {pages.map((page, index) => {
        const isCurrent = index === currentPage;
        const isReached = index <= reachedPage;
        return (
          <button
            key={index}
            class={`${styles.Item} ${isCurrent ? styles.ItemCurrent : ''} ${isReached ? styles.ItemReached : styles.ItemFuture}`}
            onClick={handleClick(index)}
            disabled={!isReached && index > 0}
            aria-current={isCurrent ? 'true' : undefined}
          >
            <span class={styles.Number}>{index + 1}</span>
            <span class={styles.Name}>{page.nav}</span>
          </button>
        );
      })}
    </nav>
  );
}
