import { Strings } from '../../Core/Strings';
import { Text } from '../Primitives/Text';
import { Button } from './Button';
import styles from './Pagination.module.css';

export interface PaginationProps {
  /** 0-based current page. */
  page: number;
  pageCount: number;
  onPrevious: () => void;
  onNext: () => void;
}

export function Pagination({ page, pageCount, onPrevious, onNext }: PaginationProps) {
  const isLast = page >= pageCount - 1;

  return (
    <nav class={styles.Root} aria-label={Strings.paginationLabel}>
      <Button variant="Secondary" disabled={page === 0} onClick={onPrevious}>
        {Strings.previous}
      </Button>
      <div class={styles.Pages}>
        <div class={styles.Dots} aria-hidden="true">
          {Array.from({ length: pageCount }, (_, index) => (
            <span
              key={index}
              class={`${styles.Dot} ${index === page ? styles.DotActive : ''}`}
            />
          ))}
        </div>
        <Text variant="Caption">
          {page + 1} / {pageCount}
        </Text>
      </div>
      <Button onClick={onNext}>{isLast ? Strings.finish : Strings.next}</Button>
    </nav>
  );
}
