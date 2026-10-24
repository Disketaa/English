import { ComponentChildren } from 'preact';
import styles from './Stack.module.css';

export interface StackProps {
  gap?: 'Xs' | 'Sm' | 'Md' | 'Lg' | 'Xl';
  padded?: boolean;
  children: ComponentChildren;
}

export function Stack({ gap = 'Md', padded = true, children }: StackProps) {
  return (
    <div class={`${styles.Root} ${styles[`Gap${gap}`]} ${padded ? styles.Padded : ''}`}>
      {children}
    </div>
  );
}
