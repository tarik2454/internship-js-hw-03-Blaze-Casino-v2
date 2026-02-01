"use client";

import { useCallback, useState, useRef, useMemo } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { Section } from "@/shared/components/Section";
import { Container } from "@/shared/components/Container";
import { SettingsPanel } from "@/module/settings-panel/SettingsPanel";
import { queryKeys, queryKeyFactories } from "@/config-api/keys";
import type {
  RiskLevel,
  LinesCount,
  BallsCount,
  PlinkoDrop,
  PlinkoUserHistoryResponse,
} from "@/config-api/plinko/plinko.types";
import {
  usePlinkoDrop,
  usePlinkoMultipliers,
} from "@/config-api/plinko/usePlinko";
import type { CurrentUserResponse } from "@/config-api/user/user.types";
import { usePlinkoCanvas } from "./usePlinkoCanvas";
import styles from "./Plinko.module.scss";

export function Plinko() {
  const queryClient = useQueryClient();
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("medium");
  const [linesCount, setLinesCount] = useState<LinesCount>(16);
  const [ballsCount, setBallsCount] = useState<BallsCount>(1);
  const [expectedBallsCount, setExpectedBallsCount] = useState(0);
  const [finishedBallsCount, setFinishedBallsCount] = useState(0);
  const finalBalanceRef = useRef<number | null>(null);
  const lastGameDataRef = useRef<{
    totalBet: number;
    totalWin: number;
    balls: BallsCount;
    risk: RiskLevel;
    lines: LinesCount;
    dropId: string;
  } | null>(null);

  const { mutate: postBet, isPending } = usePlinkoDrop();
  const { data: multipliersData } = usePlinkoMultipliers(riskLevel, linesCount);

  const multipliers = multipliersData?.multipliers || [];

  const isGameActive = useMemo(
    () =>
      isPending ||
      (expectedBallsCount > 0 && finishedBallsCount < expectedBallsCount),
    [isPending, expectedBallsCount, finishedBallsCount],
  );

  const { canvasRef, addBall } = usePlinkoCanvas({
    lines: linesCount,
    multipliers,
    onBallFinish: () => {
      setFinishedBallsCount((prev) => {
        const newCount = prev + 1;

        if (newCount >= expectedBallsCount && expectedBallsCount > 0) {
          if (lastGameDataRef.current) {
            const { totalBet, totalWin, balls, risk, lines, dropId } =
              lastGameDataRef.current;

            const newHistoryItem: PlinkoDrop = {
              _id: dropId,
              betAmount: totalBet,
              ballsCount: balls,
              riskLevel: risk,
              linesCount: lines,
              totalWin: totalWin,
              avgMultiplier: (totalWin / totalBet).toFixed(2),
              createdAt: new Date().toISOString(),
            };

            queryClient.setQueryData<PlinkoUserHistoryResponse>(
              queryKeyFactories.plinko.userHistory(10, 0),
              (old) => {
                if (!old) return { drops: [newHistoryItem] };
                return {
                  ...old,
                  drops: [newHistoryItem, ...old.drops],
                };
              },
            );

            lastGameDataRef.current = null;
          }

          setTimeout(() => {
            queryClient.invalidateQueries({
              queryKey: queryKeys.plinko,
              refetchType: "active",
            });
            if (finalBalanceRef.current !== null) {
              const finalBal = finalBalanceRef.current;
              queryClient.setQueryData<CurrentUserResponse>(
                queryKeys.user,
                (old) => {
                  if (!old) return old;
                  return { ...old, balance: finalBal };
                },
              );
              finalBalanceRef.current = null;
            }
            queryClient.invalidateQueries({
              queryKey: queryKeys.user,
              refetchType: "active",
            });
          }, 1000);
          setFinishedBallsCount(0);
          setExpectedBallsCount(0);
        }
        return newCount;
      });
    },
  });

  const handlePlaceBet = useCallback(
    async (data: {
      amount: number;
      riskLevel?: RiskLevel;
      linesCount?: LinesCount;
      ballsCount?: BallsCount;
    }) => {
      const currentRisk = (data.riskLevel || riskLevel) as RiskLevel;
      const currentLines = data.linesCount || linesCount;
      const currentBalls = data.ballsCount || ballsCount;

      const previousUserData = queryClient.getQueryData<CurrentUserResponse>(
        queryKeys.user,
      );

      if (previousUserData) {
        queryClient.setQueryData<CurrentUserResponse>(queryKeys.user, (old) => {
          if (!old) return old;
          return {
            ...old,
            balance: old.balance - data.amount * currentBalls,
          };
        });
      }

      postBet(
        {
          amount: data.amount,
          balls: currentBalls,
          risk: currentRisk,
          lines: currentLines,
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
              balls: currentBalls,
              risk: currentRisk,
              lines: currentLines,
              dropId: firstDropId,
            };

            response.drops.forEach((drop, index) => {
              setTimeout(() => {
                addBall(
                  data.amount,
                  drop.path,
                  drop.multiplier,
                  drop.winAmount,
                );
              }, index * 200);
            });

            finalBalanceRef.current = response.newBalance;
          },
          onError: (error) => {
            if (previousUserData) {
              queryClient.setQueryData(queryKeys.user, previousUserData);
            }
            toast.error(error.message || "Failed to place bet");
          },
        },
      );
    },
    [postBet, riskLevel, linesCount, ballsCount, addBall, queryClient],
  );

  return (
    <Section>
      <Container>
        <div className={styles.plinkoWrapper}>
          <div className={styles.plinkoArea}>
            <canvas
              ref={canvasRef}
              width={1000}
              height={1000}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
            />
          </div>

          <SettingsPanel
            title="Plinko Configuration"
            canBet={!isGameActive}
            inputsDisabled={isGameActive}
            showAutoCashout={false}
            showCashoutButton={false}
            showPlinkoOptions={true}
            onPlaceBet={handlePlaceBet}
            riskLevel={riskLevel}
            linesCount={linesCount}
            ballsCount={ballsCount}
            onRiskChange={setRiskLevel}
            onLinesChange={setLinesCount}
            onBallsChange={setBallsCount}
          />
        </div>
      </Container>
    </Section>
  );
}
