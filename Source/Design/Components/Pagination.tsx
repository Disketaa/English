import { Strings } from '../../Core/Strings';
import { Glyph } from './Glyph';
import { IconButton } from './IconButton';
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
    <>
      <IconButton label={Strings.previous} disabled={page === 0} onClick={onPrevious}>
        <Glyph name="ArrowLeft" />
      </IconButton>

      <div class={styles.Dots} aria-hidden="true">
        {Array.from({ length: pageCount }, (_, index) => (
          <span key={index} class={`${styles.Dot} ${index === page ? styles.DotActive : ''}`} />
        ))}
      </div>

      <span class={styles.Counter}>
        {page + 1} / {pageCount}
      </span>

      <IconButton
        variant="Primary"
        label={isLast ? Strings.finish : Strings.next}
        onClick={onNext}
      >
        <Glyph name={isLast ? 'Check' : 'ArrowRight'} />
      </IconButton>
    </>
  );
}
