"use client";

import { memo } from "react";
import { Input } from "@/shared/components/Input";
import { Switch } from "@/shared/components/Switch";
import { getTranslations } from "@/i18n";
import type { Locale } from "@/i18n";
import styles from "./AutoCashoutInput.module.scss";

interface AutoCashoutInputProps {
  autoCashout: string;
  isAuto: boolean;
  disabled: boolean;
  locale: Locale;
  onAutoToggle: (checked: boolean) => void;
  onAutoCashoutChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export const AutoCashoutInput = memo(function AutoCashoutInput({
  autoCashout,
  isAuto,
  disabled,
  locale,
  onAutoToggle,
  onAutoCashoutChange,
}: AutoCashoutInputProps) {
  const t = getTranslations(locale);

  return (
    <div className={styles.inputWrapperAutoCashout}>
      <Input
        label={t.settings.autoCashout}
        type="text"
        inputMode="decimal"
        placeholder={t.settings.autoCashoutPlaceholder}
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
