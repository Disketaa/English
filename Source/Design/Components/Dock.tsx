import { ComponentChildren } from 'preact';
import styles from './Dock.module.css';

export interface DockProps {
  label: string;
  children: ComponentChildren;
}

export function Dock({ label, children }: DockProps) {
  return (
    <nav class={styles.Root} aria-label={label}>
      <div class={styles.Glass}>{children}</div>
    </nav>
  );
}
