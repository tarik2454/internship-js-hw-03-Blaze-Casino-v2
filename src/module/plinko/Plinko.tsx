"use client";

import { useEffect, useCallback, useMemo } from "react";
import { Section } from "@/shared/components/Section";
import { Container } from "@/shared/components/Container";
import { SettingsPanel } from "@/module/settings-panel/SettingsPanel";
import { BetAmountInput } from "@/module/settings-panel/components/BetAmountInput";
import { PlinkoOptions } from "@/module/settings-panel/components/PlinkoOptions";
import { ActionButtons } from "@/module/settings-panel/components/ActionButtons";
import { useBetForm } from "@/module/settings-panel/hooks/useBetForm";
import { usePlinkoGame } from "./usePlinkoGame";
import { useLocale } from "@/providers/LocaleProvider";
import { getTranslations } from "@/i18n";
import { useSound } from "@/shared/hooks/useSound";
import styles from "./Plinko.module.scss";

export function Plinko() {
  const { locale } = useLocale();
  const t = useMemo(() => getTranslations(locale), [locale]);
  const {
    canvasRef,
    isGameActive,
    riskLevel,
    linesCount,
    ballsCount,
    setRiskLevel,
    setLinesCount,
    setBallsCount,
    handlePlaceBet,
  } = usePlinkoGame(t);

  const bet = useBetForm({ maxBetAmount: 100 });
  const { playSound, stopSound } = useSound();

  useEffect(() => {
    if (isGameActive) {
      playSound("playing");
    } else {
      stopSound("playing");
    }
  }, [isGameActive, playSound, stopSound]);

  useEffect(() => {
    return () => stopSound("playing");
  }, [stopSound]);

  const onPlaceBet = useCallback(() => {
    playSound("startGame");
    handlePlaceBet(bet.amount);
  }, [bet.amount, handlePlaceBet, playSound]);

  return (
    <Section>
      <Container>
        <div className={styles.plinkoWrapper}>
          <div className={styles.plinkoArea}>
            <canvas
              ref={canvasRef}
              width={1000}
              height={1000}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>

          <SettingsPanel
            title={t.plinko.configuration}
            options={
              <>
                <BetAmountInput
                  amount={bet.amount}
                  disabled={isGameActive}
                  locale={locale}
                  maxBetAmount={100}
                  onAmountChange={bet.handleAmountChange}
                  onHalf={bet.handleHalf}
                  onDouble={bet.handleDouble}
                  onMax={bet.handleMax}
                />
                <PlinkoOptions
                  riskLevel={riskLevel}
                  linesCount={linesCount}
                  ballsCount={ballsCount}
                  onRiskChange={setRiskLevel}
                  onLinesChange={setLinesCount}
                  onBallsChange={setBallsCount}
                  disabled={isGameActive}
                  locale={locale}
                />
              </>
            }
          >
            <ActionButtons
              canBet={!isGameActive}
              hideBorder={true}
              locale={locale}
              onPlaceBet={onPlaceBet}
            />
          </SettingsPanel>
        </div>
      </Container>
    </Section>
  );
}
