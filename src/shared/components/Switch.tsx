import styles from "./Switch.module.scss";
import { cx } from "@/shared/utils/classNames";

interface SwitchProps {
  className?: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
  disabled?: boolean;
}

export function Switch({
  className,
  checked,
  onChange,
  disabled,
}: SwitchProps) {
  return (
    <label className={cx(styles.switch, className)}>
      <input
        type="checkbox"
        checked={checked}
        disabled={disabled}
        onChange={(e) => onChange(e.target.checked)}
        className={styles.switchInput}
      />
      <span className={styles.switchSlider} />
    </label>
  );
}
