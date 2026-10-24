import { ComponentChildren } from 'preact';
import styles from './Reveal.module.css';

export interface RevealProps {
  /** Zero-based position in the reveal order; drives both delay and travel. */
  index: number;
  as?: 'div' | 'li';
  class?: string;
  children: ComponentChildren;
}

export function Reveal({ index, as = 'div', class: className, children }: RevealProps) {
  const Tag = as;
  const own = styles.Root;
  return (
    <Tag
      class={className === undefined ? own : `${own} ${className}`}
      style={{ '--Reveal-Index': String(index) }}
    >
      {children}
    </Tag>
  );
}
