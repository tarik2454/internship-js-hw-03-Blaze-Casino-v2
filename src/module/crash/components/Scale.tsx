import { cx } from "@/shared/utils/classNames";
import styles from "./Scale.module.scss";

interface ScaleProps {
  type: "multiplier" | "time";
  levels: number[];
  currentValue: number;
}

export function Scale({ type, levels, currentValue }: ScaleProps) {
  const formatValue = (value: number) => {
    return type === "multiplier" ? `${value.toFixed(1)}x` : `${value}s`;
  };

  const isActive = (level: number) => {
    return currentValue >= level;
  };

  return (
    <div
      className={cx(
        styles.scale,
        type === "multiplier" && styles.multiplier,
        type === "time" && styles.time,
      )}
    >
      {levels.map((level) => (
        <div
          key={level}
          className={cx(styles.scaleItem, isActive(level) && styles.active)}
        >
          {formatValue(level)}
        </div>
      ))}
    </div>
  );
}
