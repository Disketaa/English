import { Reveal } from '../Primitives/Reveal';
import styles from './ExampleList.module.css';

export interface ExampleListProps {
  items: string[];
  /** Reveal order of the first item; the rest continue from it. */
  startIndex?: number;
}

export function ExampleList({ items, startIndex = 0 }: ExampleListProps) {
  return (
    <ul class={styles.Root}>
      {items.map((item, index) => (
        <Reveal key={item} as="li" index={startIndex + index} class={styles.Item}>
          {item}
        </Reveal>
      ))}
    </ul>
  );
}
