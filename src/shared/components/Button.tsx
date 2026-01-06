import { cx } from "@/utils/classNames";
import { MouseEventHandler, ReactNode } from "react";
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

export default function Button({
  ariaLabel = "",
  children,
  className = "",
  disabled = false,
  type = "button",
  stylesVariant,
  onClick,
  ...props
}: ButtonProps) {
  return (
    <button
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
}
