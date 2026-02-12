"use client";

import { useEffect } from "react";
import { Container } from "@/shared/components/Container";
import { Section } from "@/shared/components/Section";
import { SettingsPanel } from "@/module/settings-panel/SettingsPanel";
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
            canBet={canBet}
            inputsDisabled={!!activeBetId}
            isCashoutDisabled={currentGameState !== "running" || !activeBetId}
            computeStats={computeStats}
            onPlaceBet={(data) => {
              playSound("startGame");
              handlePlaceBet(data);
            }}
            onCashout={() => {
              playSound("cashout");
              handleCashout();
            }}
          />
        </div>
      </Container>
    </Section>
  );
}
