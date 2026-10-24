import styles from './Glyph.module.css';

export type GlyphName = 'ArrowLeft' | 'ArrowRight' | 'Check' | 'Star' | 'StarFilled';

export interface GlyphProps {
  name: GlyphName;
}

/** Iconoir (MIT) paths, saved under Design/Graphics/Glyphs: arrow, check, star-solid. */
const GlyphPaths: Record<GlyphName, string> = {
  ArrowLeft: 'M21 12L3 12M3 12L11.5 3.5M3 12L11.5 20.5',
  ArrowRight: 'M3 12L21 12M21 12L12.5 3.5M21 12L12.5 20.5',
  Check: 'M5 13L9 17L19 7',
  Star: 'M8.58737 8.23597L11.1849 3.00376C11.5183 2.33208 12.4817 2.33208 12.8151 3.00376L15.4126 8.23597L21.2215 9.08017C21.9668 9.18848 22.2638 10.0994 21.7243 10.6219L17.5217 14.6918L18.5135 20.4414C18.6409 21.1798 17.8614 21.7428 17.1945 21.3941L12 18.678L6.80547 21.3941C6.1386 21.7428 5.35909 21.1798 5.48645 20.4414L6.47825 14.6918L2.27575 10.6219C1.73617 10.0994 2.03322 9.18848 2.77852 9.08017L8.58737 8.23597Z',
  StarFilled:
    'M8.58737 8.23597L11.1849 3.00376C11.5183 2.33208 12.4817 2.33208 12.8151 3.00376L15.4126 8.23597L21.2215 9.08017C21.9668 9.18848 22.2638 10.0994 21.7243 10.6219L17.5217 14.6918L18.5135 20.4414C18.6409 21.1798 17.8614 21.7428 17.1945 21.3941L12 18.678L6.80547 21.3941C6.1386 21.7428 5.35909 21.1798 5.48645 20.4414L6.47825 14.6918L2.27575 10.6219C1.73617 10.0994 2.03322 9.18848 2.77852 9.08017L8.58737 8.23597Z',
};

export function Glyph({ name }: GlyphProps) {
  const isFilled = name === 'StarFilled';

  return (
    <svg
      class={styles.Root}
      viewBox="0 0 24 24"
      aria-hidden="true"
      focusable="false"
      fill={isFilled ? 'currentColor' : 'none'}
      stroke={isFilled ? 'none' : 'currentColor'}
    >
      <path d={GlyphPaths[name]} stroke-linecap="round" stroke-linejoin="round" />
    </svg>
  );
}
