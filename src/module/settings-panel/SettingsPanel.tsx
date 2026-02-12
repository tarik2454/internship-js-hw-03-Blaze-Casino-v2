"use client";

import { cx } from "@/shared/utils/classNames";
import { SettingsPanelProps, StatItem } from "./types";
import { BetAmountInput } from "./components/BetAmountInput";
import { AutoCashoutInput } from "./components/AutoCashoutInput";
import { PlinkoOptions } from "./components/PlinkoOptions";
import { MinesOptions } from "./components/MinesOptions";
import { BetStats } from "./components/BetStats";
import { ActionButtons } from "./components/ActionButtons";
import { useSettingsPanel } from "./hooks/useSettingsPanel";
import { useLocale } from "@/providers/LocaleProvider";
import styles from "./SettingsPanel.module.scss";
export function SettingsPanel({
  title,
  canBet,
  inputsDisabled = false,
  showAutoCashout = true,
  showCashoutButton = true,
  showPlinkoOptions = false,
  showMinesOptions = false,
  isCashoutDisabled = true,
  stats,
  computeStats,
  children,
  onPlaceBet,
  onCashout,
  riskLevel,
  linesCount,
  ballsCount,
  gridSize,
  mineAmount,
  onRiskChange,
  onLinesChange,
  onBallsChange,
  onGridSizeChange,
  onMineAmountChange,
}: SettingsPanelProps) {
  const { locale } = useLocale();
  const {
    amount,
    autoCashout,
    isAuto,
    isCashingOut,
    riskLevel: currentRisk,
    linesCount: currentLines,
    ballsCount: currentBalls,
    gridSize: currentGridSize,
    mineAmount: currentMineAmount,
    handleAmountChange,
    handleHalf,
    handleDouble,
    handleMax,
    handleAutoToggle,
    handleAutoCashoutChange,
    handlePlaceBet,
    handleCashout,
    setRiskLevel,
    setLinesCount,
    setBallsCount,
    setGridSize,
    setMineAmount,
  } = useSettingsPanel({
    showPlinkoOptions,
    showMinesOptions,
    onPlaceBet,
    onCashout,
    riskLevel,
    linesCount,
    ballsCount,
    gridSize,
    mineAmount,
    onRiskChange,
    onLinesChange,
    onBallsChange,
    onGridSizeChange,
    onMineAmountChange,
  });

  return (
    <aside className={styles.settingsPanelWrapper}>
      <p className={styles.settingsPanelTitle}>{title}</p>

      <div className={styles.settingsPanel}>
        <BetAmountInput
          amount={amount}
          disabled={inputsDisabled}
          locale={locale}
          onAmountChange={handleAmountChange}
          onHalf={handleHalf}
          onDouble={handleDouble}
          onMax={handleMax}
        />

        {showAutoCashout && (
          <AutoCashoutInput
            autoCashout={autoCashout}
            isAuto={isAuto}
            disabled={inputsDisabled}
            locale={locale}
            onAutoToggle={handleAutoToggle}
            onAutoCashoutChange={handleAutoCashoutChange}
          />
        )}

        {showPlinkoOptions && (
          <PlinkoOptions
            ballsCount={currentBalls}
            riskLevel={currentRisk}
            linesCount={currentLines}
            onRiskChange={setRiskLevel}
            onLinesChange={setLinesCount}
            onBallsChange={setBallsCount}
            disabled={inputsDisabled}
            locale={locale}
          />
        )}

        {showMinesOptions && (
          <MinesOptions
            mineAmount={currentMineAmount}
            onMineAmountChange={setMineAmount}
            gridSize={currentGridSize}
            onGridSizeChange={setGridSize}
            disabled={inputsDisabled}
            locale={locale}
          />
        )}
      </div>

      <ActionButtons
        canBet={canBet}
        showCashoutButton={showCashoutButton}
        isCashoutDisabled={isCashoutDisabled}
        isCashingOut={isCashingOut}
        hideBorder={showPlinkoOptions}
        locale={locale}
        onPlaceBet={handlePlaceBet}
        onCashout={handleCashout}
      />

      {(stats || computeStats) && (
        <BetStats stats={computeStats ? computeStats(amount) : stats!} />
      )}
      {children}
    </aside>
  );
}

export type { SettingsPanelProps, StatItem };
export type {
  RiskLevel,
  LinesCount,
  BallsCount,
} from "@/config-api/plinko/plinko.types";
