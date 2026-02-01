"use client";

import { memo } from "react";
import { Input } from "@/shared/components/Input";
import { Switch } from "@/shared/components/Switch";
import styles from "./AutoCashoutInput.module.scss";

interface AutoCashoutInputProps {
  autoCashout: string;
  isAuto: boolean;
  disabled: boolean;
  onAutoToggle: (checked: boolean) => void;
  onAutoCashoutChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AutoCashoutInput = memo(function AutoCashoutInput({
  autoCashout,
  isAuto,
  disabled,
  onAutoToggle,
  onAutoCashoutChange,
}: AutoCashoutInputProps) {
  return (
    <div className={styles.inputWrapperAutoCashout}>
      <Input
        label="Auto Cashout (optional)"
        type="text"
        inputMode="decimal"
        placeholder="e.g 2.00"
        labelClassName={styles.label}
        inputClassName={styles.inputAutoCashout}
        stylesVariant="gameInput"
        value={autoCashout}
        onChange={onAutoCashoutChange}
        disabled={!isAuto || disabled}
      />

      <Switch
        checked={isAuto}
        onChange={onAutoToggle}
        disabled={disabled}
        className={styles.switchCashout}
      />
    </div>
  );
});
