"use client";

import { useState, useMemo, useCallback, memo } from "react";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import Image from "next/image";
import { Switch } from "@/shared/components/Switch";
import { DollarBtnIcon } from "@/shared/icons/dollar-btn";
import { WalletBtnIcon } from "@/shared/icons/wallet-btn";
import { useCurrentUser } from "@/config-api/user/useUser";
import styles from "./SettingsPanel.module.scss";

interface BetFormProps {
  amount: number;
  autoCashout: string;
  isAuto: boolean;
  inputsDisabled: boolean;
  canBet: boolean;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onHalf: () => void;
  onDouble: () => void;
  onMax: () => void;
  onAutoToggle: (checked: boolean) => void;
  onAutoCashoutChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onPlaceBet: () => void;
  onCashout: () => void;
  isCashingOut: boolean;
  gameState: string | undefined;
  betId: string | undefined;
}

const BetForm = memo(function BetForm({
  amount,
  autoCashout,
  isAuto,
  inputsDisabled,
  canBet,
  onAmountChange,
  onHalf,
  onDouble,
  onMax,
  onAutoToggle,
  onAutoCashoutChange,
  onPlaceBet,
  onCashout,
  isCashingOut,
  gameState,
  betId,
}: BetFormProps) {
  return (
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
          onChange={onAmountChange}
          disabled={inputsDisabled}
          min={0.1}
          max={10000}
          step={0.1}
        />

        <div className={styles.betButtonsWrapper}>
          <Button
            className={styles.betButton}
            onClick={onHalf}
            disabled={inputsDisabled}
          >
            1/2
          </Button>
          <Button
            className={styles.betButton}
            onClick={onDouble}
            disabled={inputsDisabled}
          >
            x2
          </Button>
          <Button
            className={styles.betButton}
            onClick={onMax}
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
          onChange={onAutoCashoutChange}
          disabled={!isAuto || inputsDisabled}
        />

        <Switch
          checked={isAuto}
          onChange={onAutoToggle}
          disabled={inputsDisabled}
          className={styles.switchCashout}
        />
      </div>

      <div className={styles.actionButtonsWrapper}>
        <Button
          stylesVariant="redGradient"
          className={styles.actionButton}
          onClick={onPlaceBet}
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
          onClick={onCashout}
          disabled={gameState !== "running" || !betId || isCashingOut}
        >
          {isCashingOut ? "Cashing out..." : "Cashout"}
          <span className={styles.actionButtonIcon}>
            <WalletBtnIcon />
          </span>
        </Button>
      </div>
    </div>
  );
});

interface BetStatsProps {
  activeMultiplier: number;
  potentialWin: string;
}

const BetStats = memo(function BetStats({
  activeMultiplier,
  potentialWin,
}: BetStatsProps) {
  return (
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
  );
});

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

  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      setAmount(isNaN(value) ? 0 : value);
    },
    [],
  );

  const handleHalf = useCallback(
    () => setAmount((prev) => Math.max(0.1, prev / 2)),
    [],
  );
  const handleDouble = useCallback(() => setAmount((prev) => prev * 2), []);
  const handleMax = useCallback(() => {
    if (user?.balance) {
      setAmount(user.balance);
    }
  }, [user]);

  const handleAutoToggle = useCallback((checked: boolean) => {
    setIsAuto(checked);
    if (checked) {
      setAutoCashout((prev) => (!prev ? "2.00" : prev));
    }
  }, []);

  const handleAutoCashoutChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAutoCashout(e.target.value);
    },
    [],
  );

  const handlePlaceBet = useCallback(() => {
    const parsedAutoCashout = parseFloat(autoCashout.replace(",", "."));
    onPlaceBet({
      amount,
      autoCashout:
        isAuto && !isNaN(parsedAutoCashout) ? parsedAutoCashout : undefined,
    });
  }, [autoCashout, amount, isAuto, onPlaceBet]);

  const handleCashout = useCallback(async () => {
    setIsCashingOut(true);
    try {
      await onCashout();
    } finally {
      setIsCashingOut(false);
    }
  }, [onCashout]);

  const inputsDisabled = !!betId;

  return (
    <aside className={styles.settingsPanelWrapper}>
      <p className={styles.settingsPanelTitle}>Crash Configuration</p>

      <BetForm
        amount={amount}
        autoCashout={autoCashout}
        isAuto={isAuto}
        inputsDisabled={inputsDisabled}
        canBet={canBet}
        onAmountChange={handleAmountChange}
        onHalf={handleHalf}
        onDouble={handleDouble}
        onMax={handleMax}
        onAutoToggle={handleAutoToggle}
        onAutoCashoutChange={handleAutoCashoutChange}
        onPlaceBet={handlePlaceBet}
        onCashout={handleCashout}
        isCashingOut={isCashingOut}
        gameState={gameState}
        betId={betId}
      />

      <BetStats
        activeMultiplier={activeMultiplier}
        potentialWin={potentialWin}
      />
    </aside>
  );
}
