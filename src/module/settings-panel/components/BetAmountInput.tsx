"use client";

import { memo } from "react";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import Image from "next/image";
import styles from "./BetAmountInput.module.scss";

interface BetAmountInputProps {
  amount: number;
  disabled: boolean;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onHalf: () => void;
  onDouble: () => void;
  onMax: () => void;
}

export const BetAmountInput = memo(function BetAmountInput({
  amount,
  disabled,
  onAmountChange,
  onHalf,
  onDouble,
  onMax,
}: BetAmountInputProps) {
  return (
    <div className={styles.inputWrapperBetAmount}>
      <Input
        label="Bet Amount"
        type="number"
        placeholder="10.000"
        labelClassName={styles.label}
        inputClassName={styles.inputBetAmount}
        stylesVariant="gameInput"
        value={amount}
        onChange={onAmountChange}
        disabled={disabled}
        min={0.1}
        max={10000}
        step={0.1}
      />

      <div className={styles.betButtonsWrapper}>
        <Button
          className={styles.betButton}
          onClick={onHalf}
          disabled={disabled}
        >
          1/2
        </Button>
        <Button
          className={styles.betButton}
          onClick={onDouble}
          disabled={disabled}
        >
          x2
        </Button>
        <Button
          className={styles.betButton}
          onClick={onMax}
          disabled={disabled}
        >
          Max
        </Button>
      </div>

      <Image
        src="/images/common/dollar.svg"
        alt="Dollar"
        width={24}
        height={24}
        className={styles.dollarIcon}
      />
    </div>
  );
});
