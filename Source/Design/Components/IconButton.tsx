import { ComponentChildren } from 'preact';
import styles from './IconButton.module.css';

export type IconButtonVariant = 'Glass' | 'Primary';

export interface IconButtonProps {
  label: string;
  variant?: IconButtonVariant;
  disabled?: boolean;
  onClick?: () => void;
  children: ComponentChildren;
}

export function IconButton({
  label,
  variant = 'Glass',
  disabled = false,
  onClick,
  children,
}: IconButtonProps) {
  return (
    <button
      class={`${styles.Root} ${styles[`Variant${variant}`]}`}
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
