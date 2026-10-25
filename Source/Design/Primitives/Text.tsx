import { ComponentChildren } from 'preact';
import { Highlight } from './Highlight';
import styles from './Text.module.css';

export type TextVariant = 'Title' | 'Subtitle' | 'Body' | 'Caption';

export interface TextProps {
  variant?: TextVariant;
  children: ComponentChildren;
}

function parseHighlights(
  text: string,
  lineIndex: number
): Array<string | ReturnType<typeof Highlight>> {
  const nodes: Array<string | ReturnType<typeof Highlight>> = [];
  const regex = new RegExp('\\*\\*([^*]*)\\*\\*|\\*([^*]*)\\*|_([^_]*)_', 'g');
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }
    if (match[1] !== undefined) {
      nodes.push(<Highlight key={`${lineIndex}-${match.index}`}>{match[1]}</Highlight>);
    } else if (match[2] !== undefined) {
      nodes.push(<em key={`${lineIndex}-${match.index}`}>{match[2]}</em>);
    } else if (match[3] !== undefined) {
      nodes.push(
        <span key={`${lineIndex}-${match.index}`} class={styles.Underline}>
          {match[3]}
        </span>
      );
    }
    lastIndex = regex.lastIndex;
  }
  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }
  return nodes;
}

/** Split a text string into plain strings and <Highlight> elements using *markdown* markers. */
export function highlightNodes(text: string): Array<unknown> {
  const nodes: Array<unknown> = [];
  const lines = text.split('\n');
  lines.forEach((line, li) => {
    nodes.push(...parseHighlights(line, li));
    if (li < lines.length - 1) nodes.push(<br key={`br-${li}`} />);
  });
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
