"use client";

import { useState, useEffect, useMemo, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys, queryKeyFactories } from "@/config-api/keys";
import { Container } from "@/shared/components/Container";
import { Section } from "@/shared/components/Section";
import styles from "./Crash.module.scss";
import { useCrashSocket } from "@/config-api/crash/ws/useCrashSocket";
import { useCrashBet } from "@/config-api/crash/useCrash";
import { useCrashCashout } from "@/config-api/crash/useCrash";
import { cx } from "@/shared/utils/classNames";
import { SettingsPanel } from "./SettingsPanel";
import { getMultiplierLevels, getTimeLevels } from "./crash.utils";

export function Crash() {
  const queryClient = useQueryClient();
  const {
    multiplier,
    elapsed,
    canBet,
    crashPoint,
    gameId,
    betId,
    betAmount,
    gameState,
  } = useCrashSocket();

  const [activeAutoCashout, setActiveAutoCashout] = useState<
    number | undefined
  >(undefined);
  const [isAutoCashedOut, setIsAutoCashedOut] = useState(false);
  const [isFirstLoad, setIsFirstLoad] = useState(true);
  const [gameResult, setGameResult] = useState<{
    multiplier: number;
    isWin: boolean;
  } | null>(null);

  const displayMultiplier = multiplier.toFixed(2);
  const elapsedSeconds = Math.floor(elapsed / 1000);

  // Определяем актуальное состояние игры
  const currentGameState = crashPoint ? "crashed" : gameState;

  // Отладка состояния
  console.log("State:", {
    currentGameState,
    gameResult,
    isFirstLoad,
    crashPoint,
    betId,
    gameState,
  });

  // Стабилизируем animationDelay через useMemo, чтобы избежать дергания
  // Округляем до 50ms для плавности
  const animationDelay = useMemo(() => {
    if (currentGameState === "running" && multiplier >= 1.0) {
      const roundedElapsed = Math.floor(elapsed / 50) * 50; // Округляем до 50ms
      return `-${roundedElapsed}ms`;
    }
    return "0ms";
  }, [elapsed, currentGameState, multiplier]);

  // Динамические уровни шкал
  const multiplierLevels = useMemo(
    () => getMultiplierLevels(multiplier),
    [multiplier],
  );
  const timeLevels = useMemo(
    () => getTimeLevels(elapsedSeconds),
    [elapsedSeconds],
  );

  const { mutate: placeBet } = useCrashBet();
  const { mutate: cashoutMutation } = useCrashCashout();

  // Обработчик кешаута
  const handleCashout = () => {
    if (!betId) return;
    setIsAutoCashedOut(true); // Помечаем сразу, чтобы краш не перезаписал результат
    cashoutMutation(betId, {
      onSuccess: (data) => {
        setGameResult({ multiplier: data.multiplier, isWin: true });
      },
    });
  };

  // Обработчик ставки с сохранением autoCashout
  const handlePlaceBet = (data: { amount: number; autoCashout?: number }) => {
    // Сбрасываем результат предыдущей игры при новой ставке
    setGameResult(null);
    placeBet(data, {
      onSuccess: () => {
        setActiveAutoCashout(data.autoCashout);
        setIsAutoCashedOut(false);
      },
    });
  };

  // Эффект для проверки авто-кешаута на клиенте
  useEffect(() => {
    if (
      betId &&
      activeAutoCashout &&
      multiplier >= activeAutoCashout &&
      !isAutoCashedOut &&
      currentGameState === "running"
    ) {
      setIsAutoCashedOut(true);
      setGameResult({ multiplier: activeAutoCashout, isWin: true });
      // Инвалидируем баланс пользователя
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
      // Обновляем текущую игру
      queryClient.invalidateQueries({
        queryKey: queryKeyFactories.crash.getCurrent(),
      });
    }
  }, [
    multiplier,
    activeAutoCashout,
    betId,
    isAutoCashedOut,
    currentGameState,
    queryClient,
  ]);

  // Отслеживание первого захода на страницу
  // Сбрасываем isFirstLoad после первого изменения состояния или после первой игры
  useEffect(() => {
    if (isFirstLoad && (currentGameState === "running" || gameResult)) {
      setIsFirstLoad(false);
    }
  }, [currentGameState, isFirstLoad, gameResult]);

  // Сброс состояния при начале новой игры
  useEffect(() => {
    if (currentGameState === "waiting") {
      setIsAutoCashedOut(false);
    }
  }, [currentGameState]);

  // Сохранение результата при краше (проигрыш)
  useEffect(() => {
    console.log("Crash effect:", { crashPoint, betId, isAutoCashedOut });
    if (crashPoint && betId && !isAutoCashedOut) {
      console.log("Setting gameResult LOSS:", crashPoint);
      setGameResult({ multiplier: crashPoint, isWin: false });
    }
  }, [crashPoint, betId, isAutoCashedOut]);

  return (
    <>
      <Section className={styles.crashSection}>
        <Container>
          <div className={styles.crashWrapper}>
            <div
              className={cx(
                styles.crashArea,
                currentGameState === "running" &&
                  !gameResult &&
                  styles.isRunning,
                (currentGameState === "crashed" ||
                  gameResult?.isWin === false) &&
                  styles.crashed,
              )}
            >
              {/* Ракета вынесена из centerArea для независимого позиционирования */}
              {currentGameState === "running" &&
                !gameResult &&
                multiplier >= 1.0 && (
                  <div
                    className={styles.rocket}
                    style={{
                      animationDelay: animationDelay,
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

              {/* Центральная область с текстом */}
              <div className={styles.centerArea}>
                <p
                  className={cx(
                    styles.crashAreaValue,
                    gameResult?.isWin && styles.win,
                    gameResult?.isWin === false && styles.lose,
                  )}
                >
                  {gameResult
                    ? gameResult.multiplier.toFixed(2)
                    : displayMultiplier}
                  X
                </p>
                {currentGameState === "waiting" && isFirstLoad && (
                  <p className={styles.crashAreaDescription}>
                    Waiting for bets...
                  </p>
                )}
                {gameResult && (
                  <p className={styles.crashAreaDescription}>
                    {gameResult.isWin ? "Cashed out!" : "Crashed!"}
                  </p>
                )}
              </div>

              {/* Шкала множителей слева */}
              {currentGameState === "running" && !gameResult && (
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

              {/* Шкала времени снизу */}
              {currentGameState === "running" && !gameResult && (
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
              gameState={currentGameState}
              betId={isAutoCashedOut ? undefined : betId}
              multiplier={multiplier}
              onPlaceBet={handlePlaceBet}
              onCashout={handleCashout}
            />
          </div>
        </Container>
      </Section>
    </>
  );
}
