"use client";

import { useState, useMemo } from "react";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import Image from "next/image";
import { Switch } from "@/shared/components/Switch";
import { DollarBtnIcon } from "@/shared/icons/dollar-btn";
import { WalletBtnIcon } from "@/shared/icons/wallet-btn";
import { useCurrentUser } from "@/config-api/user/useUser";
import styles from "./SettingsPanel.module.scss";

interface SettingsPanelProps {
  canBet: boolean;
  gameState: "waiting" | "running" | "crashed" | undefined;
  betId: string | undefined;
  multiplier: number;
  onPlaceBet: (data: { amount: number; autoCashout?: number }) => void;
  onCashout: () => void;
}

export function SettingsPanel({
  canBet,
  gameState,
  betId,
  multiplier,
  onPlaceBet,
  onCashout,
}: SettingsPanelProps) {
  const { data: user } = useCurrentUser();
  const [amount, setAmount] = useState<number>(10);
  const [autoCashout, setAutoCashout] = useState<string>("2.00");
  const [isAuto, setIsAuto] = useState(false);
  const [isCashingOut, setIsCashingOut] = useState(false);

  const activeMultiplier = useMemo(() => {
    if (gameState === "crashed") return 0;
    if (!betId && gameState === "running") return 1.0;
    return multiplier;
  }, [multiplier, gameState, betId]);

  const potentialWin = useMemo(() => {
    return (amount * activeMultiplier).toFixed(2);
  }, [amount, activeMultiplier]);

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseFloat(e.target.value);
    setAmount(isNaN(value) ? 0 : value);
  };

  const handleHalf = () => setAmount((prev) => Math.max(0.1, prev / 2));
  const handleDouble = () => setAmount((prev) => prev * 2);
  const handleMax = () => {
    if (user?.balance) {
      setAmount(user.balance);
    }
  };

  const handleAutoToggle = (checked: boolean) => {
    setIsAuto(checked);
    if (checked && !autoCashout) {
      setAutoCashout("2.00");
    }
  };

  const handlePlaceBet = () => {
    const parsedAutoCashout = parseFloat(autoCashout.replace(",", "."));
    onPlaceBet({
      amount,
      autoCashout:
        isAuto && !isNaN(parsedAutoCashout) ? parsedAutoCashout : undefined,
    });
  };

  const handleCashout = async () => {
    setIsCashingOut(true);
    try {
      await onCashout();
    } finally {
      setIsCashingOut(false);
    }
  };

  const inputsDisabled = !!betId;

  return (
    <aside className={styles.settingsPanelWrapper}>
      <p className={styles.settingsPanelTitle}>Crash Configuration</p>
      <div className={styles.settingsPanel}>
        <div className={styles.inputWrapper}>
          <Input
            label="Bet Amount"
            type="number"
            placeholder="10.000"
            labelClassName={styles.label}
            inputClassName={styles.inputBetAmount}
            stylesVariant="gameInput"
            value={amount}
            onChange={handleAmountChange}
            disabled={inputsDisabled}
            min={0.1}
            max={10000}
            step={0.1}
          />

          <div className={styles.betButtonsWrapper}>
            <Button
              className={styles.betButton}
              onClick={handleHalf}
              disabled={inputsDisabled}
            >
              1/2
            </Button>
            <Button
              className={styles.betButton}
              onClick={handleDouble}
              disabled={inputsDisabled}
            >
              x2
            </Button>
            <Button
              className={styles.betButton}
              onClick={handleMax}
              disabled={inputsDisabled}
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

        <div className={styles.inputWrapper}>
          <Input
            label="Auto Cashout (optional)"
            type="text"
            inputMode="decimal"
            placeholder="e.g 2.00"
            labelClassName={styles.label}
            inputClassName={styles.inputAutoCashout}
            stylesVariant="gameInput"
            value={autoCashout}
            onChange={(e) => setAutoCashout(e.target.value)}
            disabled={!isAuto || inputsDisabled}
          />

          <Switch
            checked={isAuto}
            onChange={handleAutoToggle}
            disabled={inputsDisabled}
            className={styles.switchCashout}
          />
        </div>
      </div>

      <div className={styles.actionButtonsWrapper}>
        <Button
          stylesVariant="redGradient"
          className={styles.actionButton}
          onClick={handlePlaceBet}
          disabled={!canBet}
        >
          Place Bet
          <span className={styles.actionButtonIcon}>
            <DollarBtnIcon />
          </span>
        </Button>
        <Button
          stylesVariant="yellowGradient"
          className={styles.actionButton}
          onClick={handleCashout}
          disabled={gameState !== "running" || !betId || isCashingOut}
        >
          {isCashingOut ? "Cashing out..." : "Cashout"}
          <span className={styles.actionButtonIcon}>
            <WalletBtnIcon />
          </span>
        </Button>
      </div>

      <div className={styles.resultsWrapper}>
        <p className={styles.resultItem}>
          Current Multiplier:
          <span className={styles.resultValue}>
            {activeMultiplier.toFixed(2)}X
          </span>
        </p>
        <p className={styles.resultItem}>
          Potential Win:
          <span className={styles.resultValue}>{potentialWin}$</span>
        </p>
      </div>
    </aside>
  );
}
