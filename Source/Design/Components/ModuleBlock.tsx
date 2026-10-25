import { useEffect, useRef, useState } from 'preact/hooks';
import styles from './ModuleBlock.module.css';

import bg1 from '../Graphics/Backgrounds/Abstract1.svg';
import bg2 from '../Graphics/Backgrounds/Abstract2.svg';
import bg3 from '../Graphics/Backgrounds/Abstract3.svg';
import bg4 from '../Graphics/Backgrounds/Abstract4.svg';
import bg5 from '../Graphics/Backgrounds/Abstract5.svg';
import bg6 from '../Graphics/Backgrounds/Abstract6.svg';
import bg7 from '../Graphics/Backgrounds/Abstract7.svg';
import bg8 from '../Graphics/Backgrounds/Abstract8.svg';
import bg9 from '../Graphics/Backgrounds/Abstract9.svg';
import bg10 from '../Graphics/Backgrounds/Abstract10.svg';

const BACKGROUNDS = [bg1, bg2, bg3, bg4, bg5, bg6, bg7, bg8, bg9, bg10];

/** Deterministic hash of a string → non-negative integer. */
function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

/** Pick a background deterministically from a seed string (e.g. lesson id). */
function seededBackground(seed: string): string {
  return BACKGROUNDS[hashString(seed) % BACKGROUNDS.length];
}

export interface ModuleBlockProps {
  title: string;
  subtitle: string;
  moduleNumber?: number;
  locked?: boolean;
  onClick?: () => void;
  /** Seed for background selection; defaults to title. */
  seed?: string;
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
  seed,
}: ModuleBlockProps) {
  const background = seededBackground(seed ?? title);
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
      <div class={styles.Backdrop} aria-hidden="true">
        {background && <img src={background} class={styles.BackdropImage} alt="" />}
      </div>
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
