import styles from "./ModuleBlock.module.css";
import { Icon } from "./Icon";

export interface ModuleBlockProps {
  title: string;
  subtitle: string;
  progressLabel?: string;
}

export function ModuleBlock({ title, subtitle, progressLabel = "45'" }: ModuleBlockProps) {
  return (
    <article class={styles.Root}>
      <div class={styles.Content}>
        <h2 class={styles.Title}>{title}</h2>
        <p class={styles.Subtitle}>{subtitle}</p>
      </div>
      <div class={styles.RightSide}>
        <Icon name="Notebook" alt="Notebook" />
        <div class={styles.IconRing} aria-label="Progress">
          {progressLabel}
        </div>
      </div>
    </article>
  );
}
