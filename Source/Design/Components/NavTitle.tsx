import styles from './NavTitle.module.css';

export interface NavTitleProps {
  title: string;
  seed?: string;
  index?: number;
  progress?: { current: number; total: number };
}

export function NavTitle({ title, index, progress }: NavTitleProps) {
  return (
    <div class={styles.Root}>
      <div class={styles.Backdrop} aria-hidden="true" />
      {index !== undefined && <div class={styles.BigNumber}>№{index}</div>}
      <h2 class={styles.Title}>{title}</h2>
      {progress && (
        <div class={styles.Progress}>
          {progress.current} / {progress.total}
        </div>
      )}
    </div>
  );
}
