"use client";

import { useState, useMemo, useCallback, memo, ReactNode } from "react";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import Image from "next/image";
import { Switch } from "@/shared/components/Switch";
import { DollarBtnIcon } from "@/shared/icons/dollar-btn";
import { WalletBtnIcon } from "@/shared/icons/wallet-btn";
import { useCurrentUser } from "@/config-api/user/useUser";
import styles from "./SettingsPanel.module.scss";
import { cx } from "@/shared/utils/classNames";

export type RiskLevel = "low" | "medium" | "high" | "extreme";
export type LinesCount = 8 | 10 | 12 | 14 | 16;

interface BetFormProps {
  amount: number;
  autoCashout: string;
  isAuto: boolean;
  inputsDisabled: boolean;
  canBet: boolean;
  showAutoCashout: boolean;
  showCashoutButton: boolean;
  showPlinkoOptions: boolean;
  riskLevel: RiskLevel;
  linesCount: LinesCount;
  onAmountChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onHalf: () => void;
  onDouble: () => void;
  onMax: () => void;
  onAutoToggle: (checked: boolean) => void;
  onAutoCashoutChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onRiskChange: (risk: RiskLevel) => void;
  onLinesChange: (lines: LinesCount) => void;
  onPlaceBet: () => void;
  onCashout: () => void;
  isCashingOut: boolean;
  isCashoutDisabled: boolean;
}

const BetForm = memo(function BetForm({
  amount,
  autoCashout,
  isAuto,
  inputsDisabled,
  canBet,
  showAutoCashout,
  showCashoutButton,
  showPlinkoOptions,
  riskLevel,
  linesCount,
  onAmountChange,
  onHalf,
  onDouble,
  onMax,
  onAutoToggle,
  onAutoCashoutChange,
  onRiskChange,
  onLinesChange,
  onPlaceBet,
  onCashout,
  isCashingOut,
  isCashoutDisabled,
}: BetFormProps) {
  return (
    <>
      <div
        className={cx(
          styles.settingsPanel,
          showPlinkoOptions && styles.settingsPanelWithPlinkoOptions,
        )}
      >
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

        {showAutoCashout && (
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
              disabled={!isAuto || inputsDisabled}
            />

            <Switch
              checked={isAuto}
              onChange={onAutoToggle}
              disabled={inputsDisabled}
              className={styles.switchCashout}
            />
          </div>
        )}

        {showPlinkoOptions && (
          <PlinkoOptions
            riskLevel={riskLevel}
            linesCount={linesCount}
            onRiskChange={onRiskChange}
            onLinesChange={onLinesChange}
            disabled={inputsDisabled}
          />
        )}
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
        {showCashoutButton && (
          <Button
            stylesVariant="yellowGradient"
            className={styles.actionButton}
            onClick={onCashout}
            disabled={isCashoutDisabled}
          >
            {isCashingOut ? "Cashing out..." : "Cashout"}
            <span className={styles.actionButtonIcon}>
              <WalletBtnIcon />
            </span>
          </Button>
        )}
      </div>
    </>
  );
});

export interface StatItem {
  label: string;
  value: string | number;
  formatValue?: (value: string | number) => string;
}

interface BetStatsProps {
  stats: StatItem[];
}

const BetStats = memo(function BetStats({ stats }: BetStatsProps) {
  return (
    <div className={styles.resultsWrapper}>
      {stats.map((stat, index) => (
        <p key={index} className={styles.resultItem}>
          {stat.label}:
          <span className={styles.resultValue}>
            {stat.formatValue ? stat.formatValue(stat.value) : stat.value}
          </span>
        </p>
      ))}
    </div>
  );
});

interface PlinkoOptionsProps {
  riskLevel: RiskLevel;
  linesCount: LinesCount;
  onRiskChange: (risk: RiskLevel) => void;
  onLinesChange: (lines: LinesCount) => void;
  disabled: boolean;
}

const PlinkoOptions = memo(function PlinkoOptions({
  riskLevel,
  linesCount,
  onRiskChange,
  onLinesChange,
  disabled,
}: PlinkoOptionsProps) {
  const riskOptions: RiskLevel[] = ["low", "medium", "high", "extreme"];
  const linesOptions: LinesCount[] = [8, 10, 12, 14, 16];

  return (
    <div className={styles.plinkoOptions}>
      <div className={styles.optionGroup}>
        <label className={styles.optionLabel}>Risk</label>
        <div className={styles.optionButtons}>
          {riskOptions.map((risk) => (
            <Button
              key={risk}
              className={cx(
                styles.optionButton,
                riskLevel === risk && styles.optionButtonActive,
              )}
              onClick={() => onRiskChange(risk)}
              disabled={disabled}
            >
              {risk.charAt(0).toUpperCase() + risk.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className={styles.optionGroup}>
        <label className={styles.optionLabel}>Row</label>
        <div className={styles.optionButtons}>
          {linesOptions.map((lines) => (
            <Button
              key={lines}
              className={cx(
                styles.optionButton,
                linesCount === lines && styles.optionButtonActive,
              )}
              onClick={() => onLinesChange(lines)}
              disabled={disabled}
            >
              {lines}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
});

export interface SettingsPanelProps {
  title: string;
  canBet: boolean;
  inputsDisabled?: boolean;
  showAutoCashout?: boolean;
  showCashoutButton?: boolean;
  showPlinkoOptions?: boolean;
  isCashoutDisabled?: boolean;
  stats?: StatItem[];
  computeStats?: (
    amount: number,
    riskLevel?: RiskLevel,
    linesCount?: LinesCount,
  ) => StatItem[];
  children?: ReactNode;
  onPlaceBet: (data: {
    amount: number;
    autoCashout?: number;
    riskLevel?: RiskLevel;
    linesCount?: LinesCount;
  }) => void;
  onCashout?: () => void;
}

export function SettingsPanel({
  title,
  canBet,
  inputsDisabled = false,
  showAutoCashout = true,
  showCashoutButton = true,
  showPlinkoOptions = false,
  isCashoutDisabled = true,
  stats,
  computeStats,
  children,
  onPlaceBet,
  onCashout,
}: SettingsPanelProps) {
  const { data: user } = useCurrentUser();
  const [amount, setAmount] = useState<number>(10);
  const [autoCashout, setAutoCashout] = useState<string>("2.00");
  const [isAuto, setIsAuto] = useState(false);
  const [isCashingOut, setIsCashingOut] = useState(false);
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("medium");
  const [linesCount, setLinesCount] = useState<LinesCount>(12);

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
      setAmount(Math.min(user.balance, 10000));
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
      ...(showPlinkoOptions && {
        riskLevel,
        linesCount,
      }),
    });
  }, [
    autoCashout,
    amount,
    isAuto,
    onPlaceBet,
    showPlinkoOptions,
    riskLevel,
    linesCount,
  ]);

  const handleCashout = useCallback(async () => {
    if (!onCashout) return;
    setIsCashingOut(true);
    try {
      await onCashout();
    } finally {
      setIsCashingOut(false);
    }
  }, [onCashout]);

  return (
    <aside className={styles.settingsPanelWrapper}>
      <p className={styles.settingsPanelTitle}>{title}</p>

      <BetForm
        amount={amount}
        autoCashout={autoCashout}
        isAuto={isAuto}
        inputsDisabled={inputsDisabled}
        canBet={canBet}
        showAutoCashout={showAutoCashout}
        showCashoutButton={showCashoutButton}
        showPlinkoOptions={showPlinkoOptions}
        riskLevel={riskLevel}
        linesCount={linesCount}
        onAmountChange={handleAmountChange}
        onHalf={handleHalf}
        onDouble={handleDouble}
        onMax={handleMax}
        onAutoToggle={handleAutoToggle}
        onAutoCashoutChange={handleAutoCashoutChange}
        onRiskChange={setRiskLevel}
        onLinesChange={setLinesCount}
        onPlaceBet={handlePlaceBet}
        onCashout={handleCashout}
        isCashingOut={isCashingOut}
        isCashoutDisabled={isCashoutDisabled}
      />

      {(stats || computeStats) && (
        <BetStats
          stats={
            computeStats
              ? computeStats(
                  amount,
                  showPlinkoOptions ? riskLevel : undefined,
                  showPlinkoOptions ? linesCount : undefined,
                )
              : stats!
          }
        />
      )}
      {children}
    </aside>
  );
}
