import styles from './NavTitle.module.css';

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

function hashString(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = (h * 31 + s.charCodeAt(i)) >>> 0;
  }
  return h;
}

function seededBackground(seed: string): string {
  return BACKGROUNDS[hashString(seed) % BACKGROUNDS.length];
}

export interface NavTitleProps {
  title: string;
  seed?: string;
  index?: number;
}

export function NavTitle({ title, seed, index }: NavTitleProps) {
  const background = seededBackground(seed ?? title);
  return (
    <div class={styles.Root}>
      <div class={styles.Backdrop} aria-hidden="true">
        {background && <img src={background} class={styles.BackdropImage} alt="" />}
      </div>
      {index !== undefined && <div class={styles.BigNumber}>№{index}</div>}
      <h2 class={styles.Title}>{title}</h2>
    </div>
  );
}
