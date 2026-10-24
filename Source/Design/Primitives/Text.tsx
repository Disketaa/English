import { ComponentChildren } from 'preact';
import styles from './Text.module.css';

export type TextVariant = 'Title' | 'Subtitle' | 'Body' | 'Caption';

export interface TextProps {
  variant?: TextVariant;
  children: ComponentChildren;
}

export function Text({ variant = 'Body', children }: TextProps) {
  const className = `${styles.Root} ${styles[`Variant${variant}`]}`;

  switch (variant) {
    case 'Title':
      return <h1 class={className}>{children}</h1>;
    case 'Subtitle':
      return <h2 class={className}>{children}</h2>;
    case 'Caption':
      return <span class={className}>{children}</span>;
    default:
      return <p class={className}>{children}</p>;
  }
}
