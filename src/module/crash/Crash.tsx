"use client";

import { Container } from "@/shared/components/Container";
import { Section } from "@/shared/components/Section";
import { SettingsPanel } from "@/module/settings-panel/SettingsPanel";
import styles from "./Crash.module.scss";
import { CrashGameDisplay } from "./components/CrashGameDisplay";
import { useLocale } from "@/providers/LocaleProvider";
import { getTranslations } from "@/i18n";
import { useCrashGame } from "./useCrashGame";

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
            onPlaceBet={handlePlaceBet}
            onCashout={handleCashout}
          />
        </div>
      </Container>
    </Section>
  );
}
