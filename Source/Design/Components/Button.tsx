import { ComponentChildren } from 'preact';
import styles from './Button.module.css';

export type ButtonVariant = 'Primary' | 'Secondary';

export interface ButtonProps {
  variant?: ButtonVariant;
  disabled?: boolean;
  onClick?: () => void;
  children: ComponentChildren;
}

export function Button({
  variant = 'Primary',
  disabled = false,
  onClick,
  children,
}: ButtonProps) {
  return (
    <button
      class={`${styles.Root} ${styles[`Variant${variant}`]}`}
      onClick={onClick}
      disabled={disabled}
      type="button"
    >
      {children}
    </button>
  );
}
