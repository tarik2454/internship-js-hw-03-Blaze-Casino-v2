import { cx } from "@/shared/utils/classNames";
import { forwardRef, MouseEventHandler, ReactNode } from "react";
import styles from "./Button.module.scss";

interface ButtonProps {
  ariaLabel?: string;
  children: ReactNode;
  className?: string;
  disabled?: boolean;
  type?: "button" | "submit";
  stylesVariant?: keyof typeof variantClassesMap;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}

const variantClassesMap = {
  redGradient: styles.redGradient,
  yellowGradient: styles.yellowGradient,
};

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  function Button(
    {
      ariaLabel = "",
      children,
      className = "",
      disabled = false,
      type = "button",
      stylesVariant,
      onClick,
      ...props
    },
    ref,
  ) {
    return (
      <button
        ref={ref}
        aria-label={ariaLabel}
        type={type}
        className={cx(
          styles.button,
          variantClassesMap[stylesVariant as keyof typeof variantClassesMap],
          className,
        )}
        onClick={onClick}
        disabled={disabled}
        {...props}
      >
        {children}
      </button>
    );
  },
);
