import styles from './ModuleBlock.module.css';

export interface ModuleBlockProps {
  title: string;
  subtitle: string;
  moduleNumber?: number;
  locked?: boolean;
}

export function ModuleBlock({
  title,
  subtitle,
  moduleNumber = 1,
  locked = false,
}: ModuleBlockProps) {
  return (
    <article class={`${styles.Root} ${locked ? styles.Locked : ''}`}>
      <div class={styles.Content}>
        <h2 class={styles.Title}>
          {title}
          {!locked && <span class={styles.NotificationDot} />}
        </h2>
        <p class={styles.Subtitle}>{subtitle}</p>
      </div>
      <div class={styles.BigNumber}>№{moduleNumber}</div>
    </article>
  );
}
