"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeyFactories } from "@/config-api/keys";
import { Container } from "@/shared/components/Container";
import { Section } from "@/shared/components/Section";
import { SettingsPanel, StatItem } from "@/module/settings-panel/SettingsPanel";
import { usePopup, POPUP_TYPE } from "@/providers/PopupProvider";
import styles from "./Crash.module.scss";
import { useCrashSocket } from "@/config-api/crash/ws/useCrashSocket";
import { useCrashBet } from "@/config-api/crash/useCrash";
import { useCrashCashout } from "@/config-api/crash/useCrash";
import { CrashGameDisplay } from "./components/CrashGameDisplay";

export function Crash() {
  const queryClient = useQueryClient();
  const { showPopup } = usePopup();

  const { multiplier, elapsed, canBet, crashPoint, betId, gameState } =
    useCrashSocket();

  const [lastBetAmount, setLastBetAmount] = useState<number>(0);
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
  const activeBetId = isAutoCashedOut ? undefined : betId;

  const { mutate: placeBet } = useCrashBet();
  const { mutate: cashoutMutation } = useCrashCashout();

  const activeMultiplier = useMemo(() => {
    if (currentGameState === "crashed") return 0;
    if (!betId && currentGameState === "running") return 1.0;
    return multiplier;
  }, [multiplier, currentGameState, betId]);

  const computeStats = useCallback(
    (amount: number): StatItem[] => [
      {
        label: "Current Multiplier",
        value: activeMultiplier,
        formatValue: (v) => `${Number(v).toFixed(2)}X`,
      },
      {
        label: "Potential Win",
        value: amount * activeMultiplier,
        formatValue: (v) => `${Number(v).toFixed(2)}$`,
      },
    ],
    [activeMultiplier],
  );

  const handleCashout = useCallback(() => {
    if (!betId) return;
    setIsAutoCashedOut(true);
    cashoutMutation(betId, {
      onSuccess: (data) => {
        setGameResult({ multiplier: data.multiplier, isWin: true });
        showPopup({
          message: `You won ${data.winAmount.toFixed(2)}$`,
          type: POPUP_TYPE.SUCCESS,
          position: "topCenter",
          resultAmount: data.winAmount - lastBetAmount,
        });
      },
    });
  }, [betId, cashoutMutation, showPopup]);

  const handlePlaceBet = useCallback(
    (data: { amount: number; autoCashout?: number }) => {
      setGameResult(null);
      placeBet(data, {
        onSuccess: (response) => {
          setLastBetAmount(response.amount);
          setActiveAutoCashout(data.autoCashout);
          setIsAutoCashedOut(false);
        },
      });
    },
    [placeBet],
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
      const winAmount = lastBetAmount * activeAutoCashout;
      showPopup({
        message: `You won ${winAmount.toFixed(2)}$`,
        type: POPUP_TYPE.SUCCESS,
        position: "topCenter",
        resultAmount: lastBetAmount * (activeAutoCashout - 1),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeyFactories.user.current(),
      });
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
    lastBetAmount,
    showPopup,
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
      showPopup({
        message: `You lost ${lastBetAmount.toFixed(2)}$`,
        type: POPUP_TYPE.ERROR,
        position: "topCenter",
        resultAmount: -lastBetAmount,
      });
    }
  }, [crashPoint, betId, isAutoCashedOut, lastBetAmount, showPopup]);

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
              title="Crash Configuration"
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
    </>
  );
}
