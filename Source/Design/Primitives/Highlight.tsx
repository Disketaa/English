import { ComponentChildren } from 'preact';
import styles from './Highlight.module.css';

export interface HighlightProps {
  children: ComponentChildren;
}

export function Highlight({ children }: HighlightProps) {
  return <span class={styles.Root}>{children}</span>;
}
