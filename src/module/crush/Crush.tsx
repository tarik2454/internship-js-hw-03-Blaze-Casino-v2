"use client";

import { Container } from "@/shared/components/Container";
import { Section } from "@/shared/components/Section";
import styles from "./Crush.module.scss";
import { useCrashSocket } from "@/config-api/crash/ws/useCrashSocket";
import { useCrashBet } from "@/config-api/crash/useCrash";
import { useCrashCashout } from "@/config-api/crash/useCrash";
import { cx } from "@/shared/utils/classNames";
import { SettingsPanel } from "./SettingsPanel";

export function Crush() {
  const { multiplier, canBet, crashPoint, gameId, betId, gameState } =
    useCrashSocket();

  const displayMultiplier = multiplier.toFixed(2);

  const { mutate: placeBet } = useCrashBet();
  const { mutate: cashout } = useCrashCashout();

  return (
    <>
      <Section className={styles.crushSection}>
        <Container>
          <div className={styles.crushWrapper}>
            <div
              className={cx(
                styles.crushArea,
                gameState === "running" && styles.isRunning,
                gameState === "crashed" && crashPoint && styles.crashed,
              )}
            >
              <p className={styles.crushAreaValue}>
                {crashPoint ? crashPoint.toFixed(2) : displayMultiplier}X
              </p>
              {gameState === "waiting" && (
                <p className={styles.crushAreaDescription}>
                  Waiting for bets...
                </p>
              )}
              {gameState === "crashed" && crashPoint && (
                <p className={styles.crushAreaDescription}>Crashed!</p>
              )}
            </div>

            <SettingsPanel
              canBet={canBet}
              gameState={gameState}
              betId={betId}
              onPlaceBet={() => placeBet({ amount: 10, autoCashout: 2 })}
              onCashout={() => betId && cashout(betId)}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
