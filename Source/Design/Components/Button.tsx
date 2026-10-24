import { ComponentChildren } from 'preact';
import styles from './Button.module.css';

export type ButtonVariant = 'Primary';

export interface ButtonProps {
  variant?: ButtonVariant;
  onClick?: () => void;
  children: ComponentChildren;
}

export function Button({ variant = 'Primary', onClick, children }: ButtonProps) {
  return (
    <button
      class={`${styles.Root} ${styles[`Variant${variant}`]}`}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
