import { ComponentChildren } from 'preact';
import styles from './Highlight.module.css';

export interface HighlightProps {
  children: ComponentChildren;
}

export function Highlight({ children }: HighlightProps) {
  const isEmpty = typeof children === 'string' && children.trim() === '.';
  return (
    <span class={styles.Root} style={isEmpty ? { color: 'transparent' } : undefined}>
      {children}
    </span>
  );
}
