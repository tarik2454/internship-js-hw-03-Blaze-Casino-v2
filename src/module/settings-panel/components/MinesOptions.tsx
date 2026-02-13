"use client";

import { memo } from "react";
import { Button } from "@/shared/components/Button";
import { Input } from "@/shared/components/Input";
import { cx } from "@/shared/utils/classNames";
import {
  MINES_GRID_SIZES,
  MINES_MINE_AMOUNTS,
  type MinesGridSize,
  type MinesMineAmount,
} from "@/module/mines/mines.constants";
import { getTranslations } from "@/i18n";
import type { Locale } from "@/i18n";
import styles from "./MinesOptions.module.scss";

interface MinesOptionsProps {
  mineAmount: MinesMineAmount;
  onMineAmountChange: (amount: MinesMineAmount) => void;
  gridSize: MinesGridSize;
  onGridSizeChange: (size: MinesGridSize) => void;
  disabled?: boolean;
  locale: Locale;
}

export const MinesOptions = memo(function MinesOptions({
  mineAmount,
  onMineAmountChange,
  gridSize,
  onGridSizeChange,
  disabled = false,
  locale,
}: MinesOptionsProps) {
  const t = getTranslations(locale);

  return (
    <div className={styles.minesOptions}>
      <div className={styles.mineAmountWrapper}>
        <Input
          label={t.mines.mineAmount}
          type="text"
          readOnly
          labelClassName={styles.optionLabel}
          inputClassName={styles.mineAmountInput}
          stylesVariant="gameInput"
          value={String(mineAmount)}
          disabled={disabled}
        />
        <div className={styles.mineAmountButtons}>
          {MINES_MINE_AMOUNTS.map((amount) => (
            <Button
              key={amount}
              className={styles.mineAmountButton}
              onClick={() => onMineAmountChange(amount)}
              disabled={disabled}
            >
              {amount}
            </Button>
          ))}
        </div>
      </div>

      <div>
        <label className={styles.optionGridLabel}>{t.mines.gridSize}</label>
        <div className={styles.optionButtons}>
          {MINES_GRID_SIZES.map((size) => (
            <Button
              key={size}
              className={cx(
                styles.optionButton,
                gridSize === size && styles.optionButtonActive,
              )}
              onClick={() => onGridSizeChange(size)}
              disabled={disabled}
            >
              {size}x{size}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
});
