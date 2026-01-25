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
import { Scale } from "./components/Scale";
import Image from "next/image";

export function Crash() {
  const queryClient = useQueryClient();
  const { multiplier, elapsed, canBet, crashPoint, betId, gameState } =
    useCrashSocket();

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

  const currentGameState = crashPoint ? "crashed" : gameState;

  const animationDelay = useMemo(() => {
    if (currentGameState === "running" && multiplier >= 1.0) {
      const roundedElapsed = Math.floor(elapsed / 100) * 100;
      return `-${roundedElapsed}ms`;
    }
    return "0ms";
  }, [elapsed, currentGameState, multiplier]);

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

  const handleCashout = () => {
    if (!betId) return;
    setIsAutoCashedOut(true);
    cashoutMutation(betId, {
      onSuccess: (data) => {
        setGameResult({ multiplier: data.multiplier, isWin: true });
      },
    });
  };

  const handlePlaceBet = (data: { amount: number; autoCashout?: number }) => {
    setGameResult(null);
    placeBet(data, {
      onSuccess: () => {
        setActiveAutoCashout(data.autoCashout);
        setIsAutoCashedOut(false);
      },
    });
  };

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
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
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

  useEffect(() => {
    if (isFirstLoad && (currentGameState === "running" || gameResult)) {
      setIsFirstLoad(false);
    }
  }, [currentGameState, isFirstLoad, gameResult]);

  useEffect(() => {
    if (currentGameState === "waiting") {
      setIsAutoCashedOut(false);
    }
  }, [currentGameState]);

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
              {currentGameState === "running" &&
                !gameResult &&
                multiplier >= 1.0 && (
                  <>
                    <div
                      className={styles.rocket}
                      style={{
                        animationDelay: animationDelay,
                      }}
                    >
                      <Image
                        src="/images/crash/rocket.svg"
                        alt="Rocket"
                        className={styles.rocketImage}
                        fill={true}
                      />
                    </div>

                    <div
                      className={styles.planet1}
                      style={{
                        animationDelay: animationDelay,
                      }}
                    >
                      <Image
                        src="/images/crash/1.png "
                        alt="Planet 1"
                        fill={true}
                      />
                    </div>

                    <div
                      className={styles.planet2}
                      style={{
                        animationDelay: animationDelay,
                      }}
                    >
                      <Image
                        src="/images/crash/2.png"
                        alt="Planet 2"
                        fill={true}
                      />
                    </div>
                  </>
                )}

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

              {currentGameState === "running" && !gameResult && (
                <Scale
                  type="multiplier"
                  levels={multiplierLevels}
                  currentValue={multiplier}
                />
              )}

              {currentGameState === "running" && !gameResult && (
                <Scale
                  type="time"
                  levels={timeLevels}
                  currentValue={elapsedSeconds}
                />
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
