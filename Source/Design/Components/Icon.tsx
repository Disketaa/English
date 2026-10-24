import styles from "./Icon.module.css";

export interface IconProps {
  name: string;
  alt?: string;
}

export function Icon({ name, alt = "" }: IconProps) {
  return (
    <img
      src={`/Source/Design/Graphic/${name}.png`}
      alt={alt}
      class={styles.Root}
    />
  );
}
