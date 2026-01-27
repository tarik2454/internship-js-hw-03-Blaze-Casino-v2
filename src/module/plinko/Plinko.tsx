"use client";

import { useCallback, useState } from "react";
import { toast } from "react-toastify";
import { useQueryClient } from "@tanstack/react-query";
import { Section } from "@/shared/components/Section";
import { Container } from "@/shared/components/Container";
import { SettingsPanel } from "@/module/settings-panel/SettingsPanel";
import { queryKeys } from "@/config-api/keys";
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
import styles from "./Plinko.module.scss";

export function Plinko() {
  const queryClient = useQueryClient();
  const [riskLevel, setRiskLevel] = useState<RiskLevel>("medium");
  const [linesCount, setLinesCount] = useState<LinesCount>(16);
  const [ballsCount, setBallsCount] = useState<BallsCount>(1);

  const { mutate: postBet, isPending } = usePlinkoDrop();
  const { data: multipliersData } = usePlinkoMultipliers(riskLevel, linesCount);

  const multipliers = multipliersData?.multipliers || [];

  const { canvasRef, addBall } = usePlinkoCanvas({
    lines: linesCount,
    multipliers,
    onBallFinish: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
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
          },
          onError: (error) => {
            // Rollback optimistic update
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
            canBet={!isPending}
            inputsDisabled={isPending}
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
