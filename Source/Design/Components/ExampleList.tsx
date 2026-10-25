import { useState } from 'preact/hooks';
import { Reveal } from '../Primitives/Reveal';
import { highlightNodes } from '../Primitives/Text';
import styles from './ExampleList.module.css';

export interface ExampleListProps {
  items: string[];
  /** Reveal order of the first item; the rest continue from it. */
  startIndex?: number;
}

export function ExampleList({ items, startIndex = 0 }: ExampleListProps) {
  return (
    <ul class={styles.Root}>
      {items.map((item, index) => {
        const [source, translation] = item.split(' — ');
        return (
          <ExampleItem
            key={item}
            source={source ?? item}
            translation={translation}
            index={startIndex + index}
          />
        );
      })}
    </ul>
  );
}

interface ExampleItemProps {
  source: string;
  translation?: string;
  index: number;
}

function ExampleItem({ source, translation, index }: ExampleItemProps) {
  const [revealed, setRevealed] = useState(false);
  return (
    <Reveal as="li" index={index} class={styles.Item}>
      <button
        class={styles.Toggle}
        type="button"
        onClick={() => setRevealed((value) => !value)}
      >
        <span class={styles.Source}>{highlightNodes(source)}</span>
        <span class={`${styles.Translation} ${revealed ? styles.Revealed : ''}`}>
          {revealed && translation ? highlightNodes(translation) : 'Нажмите, чтобы увидеть перевод'}
        </span>
      </button>
    </Reveal>
  );
}
