"use client";

import { memo } from "react";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import Image from "next/image";
import { getTranslations } from "@/i18n";
import type { Locale } from "@/i18n";
import styles from "./BetAmountInput.module.scss";

interface BetAmountInputProps {
  amount: number;
  disabled: boolean;
  locale: Locale;
  maxBetAmount?: number;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onHalf: () => void;
  onDouble: () => void;
  onMax: () => void;
}

export const BetAmountInput = memo(function BetAmountInput({
  amount,
  disabled,
  locale,
  maxBetAmount = 10000,
  onAmountChange,
  onHalf,
  onDouble,
  onMax,
}: BetAmountInputProps) {
  const t = getTranslations(locale);

  return (
    <div className={styles.inputWrapperBetAmount}>
      <Input
        label={t.settings.betAmount}
        type="number"
        placeholder={t.settings.betAmountPlaceholder}
        labelClassName={styles.label}
        inputClassName={styles.inputBetAmount}
        stylesVariant="gameInput"
        value={amount}
        onChange={onAmountChange}
        disabled={disabled}
        min={0.1}
        max={maxBetAmount}
        step={0.1}
      />

      <div className={styles.betButtonsWrapper}>
        <Button
          className={styles.betButton}
          onClick={onHalf}
          disabled={disabled}
        >
          {t.settings.half}
        </Button>
        <Button
          className={styles.betButton}
          onClick={onDouble}
          disabled={disabled}
        >
          {t.settings.double}
        </Button>
        <Button
          className={styles.betButton}
          onClick={onMax}
          disabled={disabled}
        >
          {t.settings.max}
        </Button>
      </div>

      <Image
        src="/images/common/dollar.svg"
        alt={t.accessibility.dollar}
        width={24}
        height={24}
        className={styles.dollarIcon}
      />
    </div>
  );
});
