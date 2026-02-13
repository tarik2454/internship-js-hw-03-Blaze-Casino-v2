"use client";

import { useEffect, useCallback } from "react";
import { Container } from "@/shared/components/Container";
import { Section } from "@/shared/components/Section";
import { SettingsPanel } from "@/module/settings-panel/SettingsPanel";
import { BetAmountInput } from "@/module/settings-panel/components/BetAmountInput";
import { AutoCashoutInput } from "@/module/settings-panel/components/AutoCashoutInput";
import { ActionButtons } from "@/module/settings-panel/components/ActionButtons";
import { BetStats } from "@/module/settings-panel/components/BetStats";
import { useBetForm } from "@/module/settings-panel/hooks/useBetForm";
import styles from "./Crash.module.scss";
import { CrashGameDisplay } from "./components/CrashGameDisplay";
import { useLocale } from "@/providers/LocaleProvider";
import { getTranslations } from "@/i18n";
import { useCrashGame } from "./useCrashGame";
import { useSound } from "@/shared/hooks/useSound";

export function Crash() {
  const { locale } = useLocale();
  const t = getTranslations(locale);
  const {
    multiplier,
    elapsed,
    canBet,
    currentGameState,
    activeBetId,
    gameResult,
    isFirstLoad,
    computeStats,
    handlePlaceBet,
    handleCashout,
  } = useCrashGame(t);

  const bet = useBetForm({ maxBetAmount: 10000 });
  const { playSound, stopSound } = useSound();

  useEffect(() => {
    if (activeBetId && currentGameState === "running") {
      playSound("playing");
    } else {
      stopSound("playing");
    }
  }, [activeBetId, currentGameState, playSound, stopSound]);

  useEffect(() => {
    return () => stopSound("playing");
  }, [stopSound]);

  const onPlaceBet = useCallback(() => {
    playSound("startGame");
    handlePlaceBet({
      amount: bet.amount,
      autoCashout: bet.parsedAutoCashout,
    });
  }, [bet.amount, bet.parsedAutoCashout, handlePlaceBet, playSound]);

  const onCashout = useCallback(() => {
    playSound("cashout");
    bet.wrapCashout(() => handleCashout());
  }, [bet.wrapCashout, handleCashout, playSound]);

  const inputsDisabled = !!activeBetId;

  return (
    <Section className={styles.crashSection}>
      <Container>
        <div className={styles.crashWrapper}>
          <CrashGameDisplay
            gameState={currentGameState}
            multiplier={multiplier}
            elapsed={elapsed}
            gameResult={gameResult}
            isFirstLoad={isFirstLoad}
            locale={locale}
          />

          <SettingsPanel
            title={t.crash.configuration}
            options={
              <>
                <BetAmountInput
                  amount={bet.amount}
                  disabled={inputsDisabled}
                  locale={locale}
                  onAmountChange={bet.handleAmountChange}
                  onHalf={bet.handleHalf}
                  onDouble={bet.handleDouble}
                  onMax={bet.handleMax}
                />
                <AutoCashoutInput
                  autoCashout={bet.autoCashout}
                  isAuto={bet.isAuto}
                  disabled={inputsDisabled}
                  locale={locale}
                  onAutoToggle={bet.handleAutoToggle}
                  onAutoCashoutChange={bet.handleAutoCashoutChange}
                />
              </>
            }
          >
            <ActionButtons
              canBet={canBet}
              showCashoutButton={true}
              isCashoutDisabled={
                currentGameState !== "running" || !activeBetId
              }
              isCashingOut={bet.isCashingOut}
              locale={locale}
              onPlaceBet={onPlaceBet}
              onCashout={onCashout}
            />
            <BetStats stats={computeStats(bet.amount)} />
          </SettingsPanel>
        </div>
      </Container>
    </Section>
  );
}
