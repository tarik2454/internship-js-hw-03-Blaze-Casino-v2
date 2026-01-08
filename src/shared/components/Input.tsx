import { HTMLInputTypeAttribute, useId } from "react";
import { cx } from "@/utils/classNames";
import styles from "./Input.module.scss";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type: HTMLInputTypeAttribute;
  labelClassName?: string;
  inputClassName?: string;
}

export function Input({
  label,
  labelClassName = "",
  inputClassName = "",
  type = "text",
  ...props
}: InputProps) {
  const id = useId();

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={id} className={cx(styles.label, labelClassName)}>
          {label}
        </label>
      )}

      <input
        id={id}
        type={type}
        className={cx(styles.input, inputClassName)}
        {...props}
      />
    </div>
  );
}
