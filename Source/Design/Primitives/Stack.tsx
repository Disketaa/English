import { ComponentChildren } from "preact";
import styles from "./Stack.module.css";

export interface StackProps {
  gap?: "Xs" | "Sm" | "Md" | "Lg" | "Xl";
  children: ComponentChildren;
}

export function Stack({ gap = "Md", children }: StackProps) {
  const gapVar = `--Space-${gap}`;
  return (
    <div class={styles.Root} style={{ gap: `var(${gapVar})` }}>
      {children}
    </div>
  );
}
