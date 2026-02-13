import { HTMLInputTypeAttribute, useId } from "react";
import { cx } from "@/shared/utils/classNames";
import styles from "./Input.module.scss";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  type: HTMLInputTypeAttribute;
  labelClassName?: string;
  inputClassName?: string;
  inputWrapperClassName?: string;
  error?: string;
  stylesVariant?: keyof typeof variantClassesMap;
}

const variantClassesMap = {
  authInput: styles.authInput,
  gameInput: styles.gameInput,
};

export function Input({
  label,
  labelClassName = "",
  inputClassName = "",
  inputWrapperClassName = "",
  type = "text",
  stylesVariant,
  error,
  ...props
}: InputProps) {
  const id = useId();
  const errorId = `${id}-error`;

  return (
    <div className={styles.wrapper}>
      {label && (
        <label htmlFor={id} className={cx(styles.label, labelClassName)}>
          {label}
        </label>
      )}

      <div className={cx(styles.inputWrapper, inputWrapperClassName)}>
        <input
          id={id}
          type={type}
          className={cx(
            styles.input,
            stylesVariant && variantClassesMap[stylesVariant],
            inputClassName,
          )}
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
          {...props}
        />
        {error && (
          <span id={errorId} className={styles.error}>
            {error}
          </span>
        )}
      </div>
    </div>
  );
}
