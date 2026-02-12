"use client";

import { useCallback, useState, useRef, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Section } from "@/shared/components/Section";
import { Container } from "@/shared/components/Container";
import { SettingsPanel } from "@/module/settings-panel/SettingsPanel";
import { usePopup, POPUP_TYPE } from "@/providers/PopupProvider";
import { queryKeyFactories } from "@/config-api/keys";
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
import { useLocale } from "@/providers/LocaleProvider";
import { getTranslations } from "@/i18n";
import styles from "./Plinko.module.scss";

export function Plinko() {
  const { locale } = useLocale();
  const t = getTranslations(locale);
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
          const data = lastGameDataRef.current;
          if (data) {
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
        queryKeyFactories.user.current(),
      );

      if (previousUserData) {
        queryClient.setQueryData<CurrentUserResponse>(
          queryKeyFactories.user.current(),
          (old) => {
            if (!old) return old;
            return {
              ...old,
              balance: old.balance - data.amount * currentBalls,
            };
          },
        );
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
            title={t.plinko.configuration}
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
