import { useState } from 'preact/hooks';
import { Reveal } from '../Primitives/Reveal';
import { highlightNodes } from '../Primitives/Text';
import styles from './ExampleList.module.css';

const storageKey = 'english.revealed.v1';

function loadRevealed(): Record<string, boolean> {
  try {
    const raw = window.localStorage.getItem(storageKey);
    if (raw === null) return {};
    const parsed: unknown = JSON.parse(raw);
    if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) return {};
    const result: Record<string, boolean> = {};
    for (const [key, value] of Object.entries(parsed)) {
      if (value === true) result[key] = true;
    }
    return result;
  } catch {
    return {};
  }
}

function saveRevealed(map: Record<string, boolean>): void {
  try {
    window.localStorage.setItem(storageKey, JSON.stringify(map));
  } catch {
    // ignore
  }
}

export interface ExampleListProps {
  items: string[];
  /** Reveal order of the first item; the rest continue from it. */
  startIndex?: number;
  /** Lesson id used to scope persisted reveal state. */
  lessonId?: string;
  /** Page index used to scope persisted reveal state. */
  pageIndex?: number;
}

export function ExampleList({
  items,
  startIndex = 0,
  lessonId,
  pageIndex = 0,
}: ExampleListProps) {
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
            storageId={`${lessonId ?? 'lesson'}:${pageIndex}:${startIndex + index}`}
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
  storageId: string;
}

function ExampleItem({ source, translation, index, storageId }: ExampleItemProps) {
  const [revealed, setRevealed] = useState<boolean>(() => {
    const map = loadRevealed();
    return map[storageId] === true;
  });

  function toggle() {
    setRevealed((value) => {
      const next = !value;
      const map = loadRevealed();
      map[storageId] = next;
      saveRevealed(map);
      return next;
    });
  }

  return (
    <Reveal as="li" index={index} class={styles.Item}>
      <button class={styles.Toggle} type="button" onClick={toggle}>
        <span class={styles.Source}>{highlightNodes(source)}</span>
        <span class={`${styles.Translation} ${revealed ? styles.Revealed : ''}`}>
          {revealed && translation
            ? highlightNodes(translation)
            : 'Нажмите, чтобы увидеть перевод'}
        </span>
      </button>
    </Reveal>
  );
}
