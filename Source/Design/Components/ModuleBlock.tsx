import { useEffect, useRef, useState } from 'preact/hooks';
import styles from './ModuleBlock.module.css';

export interface ModuleBlockProps {
  title: string;
  subtitle: string;
  moduleNumber?: number;
  locked?: boolean;
  onClick?: () => void;
}

interface RippleState {
  /** Bumped per press; remounts the ripple nodes so their animations restart. */
  key: number;
  /** Press position as a percentage of the card, used as the bloom origin. */
  x: number;
  y: number;
}

const CENTER: RippleState = { key: 0, x: 50, y: 50 };

/** A tap shorter than this still shows the full press depth before releasing. */
const minPressMs = 150;

export function ModuleBlock({
  title,
  subtitle,
  moduleNumber = 1,
  locked = false,
  onClick,
}: ModuleBlockProps) {
  const [ripple, setRipple] = useState<RippleState>(CENTER);
  const [pressed, setPressed] = useState(false);
  const pressStartedAt = useRef(0);
  const releaseTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(releaseTimer.current), []);

  const beginPress = () => {
    window.clearTimeout(releaseTimer.current);
    pressStartedAt.current = performance.now();
    setPressed(true);
  };

  const endPress = () => {
    const elapsed = performance.now() - pressStartedAt.current;
    window.clearTimeout(releaseTimer.current);
    releaseTimer.current = window.setTimeout(
      () => setPressed(false),
      Math.max(0, minPressMs - elapsed)
    );
  };

  return (
    <article
      class={`${styles.Root} ${locked ? styles.Locked : ''} ${pressed ? styles.Pressed : ''}`}
      onPointerDown={(event) => {
        if (locked || event.button !== 0) return;

        beginPress();

        const rect = event.currentTarget.getBoundingClientRect();
        const isInside =
          rect.width > 0 &&
          rect.height > 0 &&
          event.clientX >= rect.left &&
          event.clientX <= rect.right &&
          event.clientY >= rect.top &&
          event.clientY <= rect.bottom;

        setRipple((prev) => ({
          key: prev.key + 1,
          x: isInside ? ((event.clientX - rect.left) / rect.width) * 100 : 50,
          y: isInside ? ((event.clientY - rect.top) / rect.height) * 100 : 50,
        }));
      }}
      onPointerUp={endPress}
      onPointerCancel={endPress}
      onPointerLeave={endPress}
      onClick={onClick}
    >
      <div class={styles.Backdrop} aria-hidden="true" />
      <div class={styles.FadeWrapper}>
        <div class={styles.Content}>
          <h2 class={styles.Title}>
            {title}
            {!locked && <span class={styles.NotificationDot} />}
          </h2>
          <p class={styles.Subtitle}>{subtitle}</p>
        </div>
        <div class={styles.BigNumber}>№{moduleNumber}</div>
      </div>
      {!locked && ripple.key > 0 && (
        <span key={ripple.key} class={styles.RippleLayer} aria-hidden="true">
          <span class={styles.Ripple} style={{ left: `${ripple.x}%`, top: `${ripple.y}%` }} />
        </span>
      )}
    </article>
  );
}
