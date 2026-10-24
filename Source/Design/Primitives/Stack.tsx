import { ComponentChildren } from 'preact';
import styles from './Stack.module.css';

export interface StackProps {
  gap?: 'Xs' | 'Sm' | 'Md' | 'Lg' | 'Xl';
  children: ComponentChildren;
}

export function Stack({ gap = 'Md', children }: StackProps) {
  return <div class={`${styles.Root} ${styles[`Gap${gap}`]}`}>{children}</div>;
}
