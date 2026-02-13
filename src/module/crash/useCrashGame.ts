"use client";

import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeyFactories, queryKeys } from "@/config-api/keys";
import { StatItem } from "@/module/settings-panel/types";
import { usePopup, POPUP_TYPE } from "@/providers/PopupProvider";
import { useCrashSocket } from "@/config-api/crash/ws/useCrashSocket";
import { useCrashBet, useCrashCashout } from "@/config-api/crash/useCrash";
import { getTranslations } from "@/i18n";

export function useCrashGame(t: ReturnType<typeof getTranslations>) {
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
  const lastInvalidatedRef = useRef<string | null>(null);

  const currentGameState = crashPoint ? "crashed" : gameState;
  const activeBetId = isAutoCashedOut ? undefined : betId;

  const { mutate: placeBet } = useCrashBet();
  const { mutateAsync: cashoutMutation } = useCrashCashout();

  const activeMultiplier = useMemo(() => {
    if (currentGameState === "crashed") return 0;
    if (!betId && currentGameState === "running") return 1.0;
    return multiplier;
  }, [multiplier, currentGameState, betId]);

  const computeStats = useCallback(
    (amount: number): StatItem[] => [
      {
        label: t.crash.currentMultiplier,
        value: activeMultiplier,
        formatValue: (v) => `${Number(v).toFixed(2)}X`,
      },
      {
        label: t.crash.potentialWin,
        value: amount * activeMultiplier,
        formatValue: (v) => `${Number(v).toFixed(2)}$`,
      },
    ],
    [activeMultiplier, t],
  );

  const handleCashout = useCallback(async () => {
    if (!betId) return;
    setIsAutoCashedOut(true);
    await cashoutMutation(betId, {
      onSuccess: (data) => {
        setGameResult({ multiplier: data.multiplier, isWin: true });
        showPopup({
          message: `${t.crash.youWon} ${data.winAmount.toFixed(2)}$`,
          type: POPUP_TYPE.SUCCESS,
          position: "topCenter",
          resultAmount: data.winAmount - lastBetAmount,
        });
      },
      onError: () => {
        setIsAutoCashedOut(false);
        showPopup({
          message: t.crash.cashoutError,
          type: POPUP_TYPE.ERROR,
          position: "topCenter",
        });
      },
    });
  }, [betId, cashoutMutation, showPopup, lastBetAmount, t]);

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
      currentGameState === "running" &&
      lastInvalidatedRef.current !== betId
    ) {
      lastInvalidatedRef.current = betId;
      requestAnimationFrame(() => {
        setIsAutoCashedOut(true);
        setGameResult({ multiplier: activeAutoCashout, isWin: true });
        const winAmount = lastBetAmount * activeAutoCashout;
        showPopup({
          message: `${t.crash.youWon} ${winAmount.toFixed(2)}$`,
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
        queryClient.invalidateQueries({
          queryKey: [...queryKeys.crash, "user-history"],
        });
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
    t,
  ]);

  useEffect(() => {
    if (isFirstLoad && (currentGameState === "running" || gameResult)) {
      requestAnimationFrame(() => setIsFirstLoad(false));
    }
  }, [currentGameState, isFirstLoad, gameResult]);

  useEffect(() => {
    if (currentGameState === "waiting") {
      requestAnimationFrame(() => setIsAutoCashedOut(false));
    }
  }, [currentGameState]);

  useEffect(() => {
    if (
      crashPoint &&
      betId &&
      !isAutoCashedOut &&
      lastInvalidatedRef.current !== betId
    ) {
      lastInvalidatedRef.current = betId;
      requestAnimationFrame(() => {
        setGameResult({ multiplier: crashPoint, isWin: false });
        showPopup({
          message: `${t.crash.youLost} ${lastBetAmount.toFixed(2)}$`,
          type: POPUP_TYPE.ERROR,
          position: "topCenter",
          resultAmount: -lastBetAmount,
        });
        queryClient.invalidateQueries({
          queryKey: queryKeyFactories.user.current(),
        });
        queryClient.invalidateQueries({
          queryKey: [...queryKeys.crash, "user-history"],
        });
        queryClient.invalidateQueries({
          queryKey: queryKeyFactories.crash.getCurrent(),
        });
      });
    }
  }, [
    crashPoint,
    betId,
    isAutoCashedOut,
    lastBetAmount,
    showPopup,
    t,
    queryClient,
  ]);

  // Clear lastInvalidatedRef when game starts / next betting phase
  useEffect(() => {
    if (currentGameState === "waiting") {
      lastInvalidatedRef.current = null;
    }
  }, [currentGameState]);

  return {
    multiplier,
    elapsed,
    canBet,
    currentGameState,
    activeBetId,
    activeMultiplier,
    gameResult,
    isFirstLoad,
    computeStats,
    handlePlaceBet,
    handleCashout,
  };
}
