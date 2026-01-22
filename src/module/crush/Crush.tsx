"use client";

import { Container } from "@/shared/components/Container";
import { Section } from "@/shared/components/Section";
import styles from "./Crush.module.scss";
import { useCrashSocket } from "@/config-api/crash/ws/useCrashSocket";
import { useCrashBet } from "@/config-api/crash/useCrash";
import { useCrashCashout } from "@/config-api/crash/useCrash";
import { cx } from "@/shared/utils/classNames";
import { SettingsPanel } from "./SettingsPanel";

// Генерация уровней множителей с шагом 0.2
const generateMultiplierLevels = (max: number, step: number): number[] => {
  const levels: number[] = [];
  for (let i = 1.0; i <= max; i += step) {
    levels.push(Math.round(i * 10) / 10);
  }
  return levels;
};

// Генерация уровней времени с шагом 3 секунды
const generateTimeLevels = (maxSeconds: number, step: number): number[] => {
  const levels: number[] = [];
  for (let i = 0; i <= maxSeconds; i += step) {
    levels.push(i);
  }
  return levels;
};

// Расчет позиции ракеты (из левого нижнего угла в правый верхний)
const calculateRocketPosition = (
  multiplier: number,
): { left: string; bottom: string } => {
  // Максимальный множитель для расчета (например, 10.0)
  const maxMultiplier = 10.0;
  // При multiplier = 1.0 → 0%, при multiplier = maxMultiplier → 100%
  const normalizedMultiplier = Math.max(0, multiplier - 1.0);
  const percentage = Math.min(
    100,
    Math.max(0, (normalizedMultiplier / (maxMultiplier - 1.0)) * 100),
  );

  // Отступы от краев (в процентах, учитывая размер ракеты ~8% ширины и ~15% высоты)
  const paddingStart = 2; // 2% от края для начала
  const paddingEnd = 10; // 10% от края для конца (чтобы ракета не выходила за границы)

  // Вычисляем позицию по диагонали
  // left: от paddingStart до (100% - paddingEnd)
  // bottom: от paddingStart до (100% - paddingEnd)
  const leftStart = paddingStart;
  const leftEnd = 100 - paddingEnd;
  const bottomStart = paddingStart;
  const bottomEnd = 100 - paddingEnd;

  return {
    left: `${leftStart + (percentage / 100) * (leftEnd - leftStart)}%`,
    bottom: `${bottomStart + (percentage / 100) * (bottomEnd - bottomStart)}%`,
  };
};

export function Crush() {
  const { multiplier, elapsed, canBet, crashPoint, gameId, betId, gameState } =
    useCrashSocket();

  const displayMultiplier = multiplier.toFixed(2);
  const elapsedSeconds = Math.floor(elapsed / 1000);

  // Генерация уровней (множители от 1.0 до 10.0, отображаются снизу вверх)
  const multiplierLevels = generateMultiplierLevels(10.0, 0.2);
  const timeLevels = generateTimeLevels(30, 3);

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
              {/* Ракета вынесена из centerArea для независимого позиционирования */}
              {gameState === "running" && multiplier >= 1.0 && (
                <div
                  className={styles.rocket}
                  style={{
                    ...calculateRocketPosition(multiplier),
                  }}
                >
                  <img
                    src="/images/crash/rocket.svg"
                    alt="Rocket"
                    className={styles.rocketImage}
                    onError={(e) => {
                      console.error("Failed to load rocket image", e);
                    }}
                  />
                </div>
              )}

              {/* Шкала множителей слева */}
              {gameState === "running" && (
                <div className={styles.multiplierScale}>
                  {multiplierLevels.map((level) => (
                    <div
                      key={level}
                      className={cx(
                        styles.scaleItem,
                        multiplier >= level && styles.active,
                      )}
                    >
                      {level.toFixed(1)}x
                    </div>
                  ))}
                </div>
              )}

              {/* Центральная область с текстом */}
              <div className={styles.centerArea}>
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

              {/* Шкала времени снизу */}
              {gameState === "running" && (
                <div className={styles.timeScale}>
                  {timeLevels.map((seconds) => (
                    <div
                      key={seconds}
                      className={cx(
                        styles.scaleItem,
                        elapsedSeconds >= seconds && styles.active,
                      )}
                    >
                      {seconds}s
                    </div>
                  ))}
                </div>
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
