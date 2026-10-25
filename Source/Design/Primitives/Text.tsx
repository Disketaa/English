import { ComponentChildren } from 'preact';
import { Highlight } from './Highlight';
import styles from './Text.module.css';

export type TextVariant = 'Title' | 'Subtitle' | 'Body' | 'Caption';

export interface TextProps {
  variant?: TextVariant;
  children: ComponentChildren;
}

/** Split a text string into plain strings and <Highlight> elements using *markdown* markers. */
export function highlightNodes(text: string): Array<string | ReturnType<typeof Highlight>> {
  const parts = text.split(/\*([^*]+)\*/);
  const nodes: Array<string | ReturnType<typeof Highlight>> = [];
  let plain = '';
  for (let index = 0; index < parts.length; index++) {
    const part = parts[index];
    if (index % 2 === 0) {
      plain += part;
      if (plain !== '') {
        nodes.push(plain);
        plain = '';
      }
      continue;
    }
    nodes.push(<Highlight key={index}>{part}</Highlight>);
  }
  return nodes;
}

export function Text({ variant = 'Body', children }: TextProps) {
  const className = `${styles.Root} ${styles[`Variant${variant}`]}`;
  const nodes =
    typeof children === 'string'
      ? highlightNodes(children)
      : Array.isArray(children)
        ? children
        : [children];

  switch (variant) {
    case 'Title':
      return <h1 class={className}>{nodes}</h1>;
    case 'Subtitle':
      return <h2 class={className}>{nodes}</h2>;
    case 'Caption':
      return <span class={className}>{nodes}</span>;
    default:
      return <p class={className}>{nodes}</p>;
  }
}
