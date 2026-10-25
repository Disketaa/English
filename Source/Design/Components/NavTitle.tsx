import styles from './NavTitle.module.css';

export interface NavTitleProps {
  title: string;
  seed?: string;
  index?: number;
}

export function NavTitle({ title, index }: NavTitleProps) {
  return (
    <div class={styles.Root}>
      <div class={styles.Backdrop} aria-hidden="true" />
      {index !== undefined && <div class={styles.BigNumber}>№{index}</div>}
      <h2 class={styles.Title}>{title}</h2>
    </div>
  );
}
