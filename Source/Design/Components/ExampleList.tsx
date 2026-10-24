import styles from './ExampleList.module.css';

export interface ExampleListProps {
  items: string[];
}

export function ExampleList({ items }: ExampleListProps) {
  return (
    <ul class={styles.Root}>
      {items.map((item) => (
        <li key={item} class={styles.Item}>
          {item}
        </li>
      ))}
    </ul>
  );
}
