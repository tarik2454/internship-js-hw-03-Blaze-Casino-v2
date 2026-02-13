"use client";

import { useCallback, useState, useRef, useMemo, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeyFactories } from "@/config-api/keys";
import { usePopup, POPUP_TYPE } from "@/providers/PopupProvider";
import type {
  RiskLevel,
  LinesCount,
  BallsCount,
} from "@/config-api/plinko/plinko.types";
import {
  usePlinkoDrop,
  usePlinkoMultipliers,
} from "@/config-api/plinko/usePlinko";
import type { CurrentUserResponse } from "@/config-api/user/user.types";
import { usePlinkoCanvas } from "./usePlinkoCanvas";
import { getTranslations } from "@/i18n";

export function usePlinkoGame(t: ReturnType<typeof getTranslations>) {
  const queryClient = useQueryClient();
  const { showPopup } = usePopup();

  const [riskLevel, setRiskLevel] = useState<RiskLevel>("medium");
  const [linesCount, setLinesCount] = useState<LinesCount>(16);
  const [ballsCount, setBallsCount] = useState<BallsCount>(1);
  const [expectedBallsCount, setExpectedBallsCount] = useState(0);
  const [finishedBallsCount, setFinishedBallsCount] = useState(0);
  const lastGameDataRef = useRef<{
    totalBet: number;
    totalWin: number;
    newBalance: number;
    balls: BallsCount;
    risk: RiskLevel;
    lines: LinesCount;
    dropId: string;
  } | null>(null);
  const timeoutIds = useRef<ReturnType<typeof setTimeout>[]>([]);

  const { mutate: postBet, isPending } = usePlinkoDrop();
  const { data: multipliersData } = usePlinkoMultipliers(riskLevel, linesCount);

  const multipliers = multipliersData?.multipliers || [];

  const isGameActive = useMemo(
    () =>
      isPending ||
      (expectedBallsCount > 0 && finishedBallsCount < expectedBallsCount),
    [isPending, expectedBallsCount, finishedBallsCount],
  );

  useEffect(() => {
    return () => {
      timeoutIds.current.forEach(clearTimeout);
      timeoutIds.current = [];
    };
  }, []);

  const { canvasRef, addBall } = usePlinkoCanvas({
    lines: linesCount,
    multipliers,
    onBallFinish: () => {
      setFinishedBallsCount((prev) => {
        const newCount = prev + 1;

        if (newCount >= expectedBallsCount && expectedBallsCount > 0) {
          const data = lastGameDataRef.current;
          if (data) {
            queryClient.setQueryData<CurrentUserResponse>(
              queryKeyFactories.user.current(),
              (old) => (old ? { ...old, balance: data.newBalance } : old),
            );
            const profit = data.totalWin - data.totalBet;
            showPopup({
              message:
                profit >= 0
                  ? `${t.plinko.youWon} ${data.totalWin.toFixed(2)}$`
                  : t.plinko.youLost,
              type: profit >= 0 ? POPUP_TYPE.SUCCESS : POPUP_TYPE.ERROR,
              position: "topCenter",
              resultAmount: profit,
            });
          }
          lastGameDataRef.current = null;
          setFinishedBallsCount(0);
          setExpectedBallsCount(0);
        }
        return newCount;
      });
    },
  });

  const handlePlaceBet = useCallback(
    (amount: number) => {
      const previousUserData = queryClient.getQueryData<CurrentUserResponse>(
        queryKeyFactories.user.current(),
      );

      if (previousUserData) {
        queryClient.setQueryData<CurrentUserResponse>(
          queryKeyFactories.user.current(),
          (old) => {
            if (!old) return old;
            return {
              ...old,
              balance: old.balance - amount * ballsCount,
            };
          },
        );
      }

      postBet(
        {
          amount,
          balls: ballsCount,
          risk: riskLevel,
          lines: linesCount,
        },
        {
          onSuccess: (response) => {
            setExpectedBallsCount(response.drops.length);
            setFinishedBallsCount(0);

            const firstDropId =
              response.drops[0]?.dropId || `temp-${Date.now()}`;
            lastGameDataRef.current = {
              totalBet: response.totalBet,
              totalWin: response.totalWin,
              newBalance: response.newBalance,
              balls: ballsCount,
              risk: riskLevel,
              lines: linesCount,
              dropId: firstDropId,
            };

            response.drops.forEach((drop, index) => {
              const id = setTimeout(() => {
                addBall(amount, drop.path, drop.multiplier, drop.winAmount);
              }, index * 200);
              timeoutIds.current.push(id);
            });
          },
          onError: (error) => {
            if (previousUserData) {
              queryClient.setQueryData(
                queryKeyFactories.user.current(),
                previousUserData,
              );
            }
            showPopup({
              message: error.message || t.plinko.failedToBet,
              type: POPUP_TYPE.ERROR,
              position: "topCenter",
            });
          },
        },
      );
    },
    [
      postBet,
      riskLevel,
      linesCount,
      ballsCount,
      addBall,
      queryClient,
      showPopup,
      t,
    ],
  );

  return {
    canvasRef,
    isGameActive,
    riskLevel,
    linesCount,
    ballsCount,
    setRiskLevel,
    setLinesCount,
    setBallsCount,
    handlePlaceBet,
  };
}
