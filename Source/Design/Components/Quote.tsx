import { ComponentChildren } from 'preact';
import { highlightNodes } from '../Primitives/Text';
import styles from './Quote.module.css';

export interface QuoteProps {
  children: ComponentChildren;
}

/** Strip leading "> " markers from each line (markdown quote syntax). */
function stripQuoteMarkers(text: string): string {
  return text
    .split('\n')
    .map((line) => line.replace(/^>\s?/, ''))
    .join('\n');
}

export function Quote({ children }: QuoteProps) {
  const content =
    typeof children === 'string' ? highlightNodes(stripQuoteMarkers(children)) : children;
  return <blockquote class={styles.Root}>{content}</blockquote>;
}
