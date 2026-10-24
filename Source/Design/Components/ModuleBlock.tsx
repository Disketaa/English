import { useState } from 'preact/hooks';
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
  const [rippleKey, setRippleKey] = useState(0);

  const handleClick = () => {
    setRippleKey((k) => k + 1);
  };

  return (
    <article
      class={`${styles.Root} ${locked ? styles.Locked : ''}`}
      onClick={handleClick}
    >
      <div class={styles.Content}>
        <h2 class={styles.Title}>
          {title}
          {!locked && <span class={styles.NotificationDot} />}
        </h2>
        <p class={styles.Subtitle}>{subtitle}</p>
      </div>
      <div class={styles.BigNumber}>№{moduleNumber}</div>
      {!locked && rippleKey > 0 && (
        <div key={rippleKey} class={styles.Ripple} />
      )}
    </article>
  );
}
