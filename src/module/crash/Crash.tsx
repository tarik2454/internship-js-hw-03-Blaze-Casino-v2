"use client";

import { useState, useEffect, useCallback } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys, queryKeyFactories } from "@/config-api/keys";
import { Container } from "@/shared/components/Container";
import { Section } from "@/shared/components/Section";
import styles from "./Crash.module.scss";
import { useCrashSocket } from "@/config-api/crash/ws/useCrashSocket";
import { useCrashBet } from "@/config-api/crash/useCrash";
import { useCrashCashout } from "@/config-api/crash/useCrash";
import { usePopup, POPUP_TYPE } from "@/app/providers/PopupProvider";
import { SettingsPanel } from "./SettingsPanel";
import { CrashGameDisplay } from "./components/CrashGameDisplay";

export function Crash() {
  const queryClient = useQueryClient();
  const { showPopup } = usePopup();

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

  const currentGameState = crashPoint ? "crashed" : gameState;

  const { mutate: placeBet } = useCrashBet();
  const { mutate: cashoutMutation } = useCrashCashout();

  const handleCashout = useCallback(() => {
    if (!betId) return;
    setIsAutoCashedOut(true);
    cashoutMutation(betId, {
      onSuccess: (data) => {
        setGameResult({ multiplier: data.multiplier, isWin: true });
      },
    });
  }, [betId, cashoutMutation]);

  const handlePlaceBet = useCallback(
    (data: { amount: number; autoCashout?: number }) => {
      setGameResult(null);
      placeBet(data, {
        onSuccess: () => {
          setActiveAutoCashout(data.autoCashout);
          setIsAutoCashedOut(false);
        },
        onError: (error) => {
          showPopup({
            message: error.message || "Failed to place bet",
            type: POPUP_TYPE.ERROR,
          });
        },
      });
    },
    [placeBet, showPopup],
  );

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
    if (crashPoint && betId && !isAutoCashedOut) {
      setGameResult({ multiplier: crashPoint, isWin: false });
    }
  }, [crashPoint, betId, isAutoCashedOut]);

  return (
    <>
      <Section className={styles.crashSection}>
        <Container>
          <div className={styles.crashWrapper}>
            <CrashGameDisplay
              gameState={currentGameState}
              multiplier={multiplier}
              elapsed={elapsed}
              gameResult={gameResult}
              isFirstLoad={isFirstLoad}
            />

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
