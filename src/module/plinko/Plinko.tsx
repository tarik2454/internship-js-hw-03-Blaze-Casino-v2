"use client";

import { useCallback, useState, useRef } from "react";
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

  const { canvasRef, addBall } = usePlinkoCanvas({
    lines: linesCount,
    multipliers,
    onBallFinish: () => {
      setFinishedBallsCount((prev) => {
        const newCount = prev + 1;
        // Обновляем историю только когда все шарики завершились
        if (newCount >= expectedBallsCount && expectedBallsCount > 0) {
          // Оптимистичное обновление истории
          if (lastGameDataRef.current) {
            const { totalBet, totalWin, balls, risk, lines, dropId } =
              lastGameDataRef.current;

            const newHistoryItem: any = {
              _id: dropId,
              betAmount: totalBet,
              ballsCount: balls,
              riskLevel: risk,
              linesCount: lines,
              totalWin: totalWin,
              avgMultiplier: (totalWin / totalBet).toFixed(2),
              createdAt: new Date().toISOString(),
            };

            queryClient.setQueryData<any>(
              queryKeyFactories.plinko.userHistory(10, 0),
              (old: any) => {
                if (!old) return { drops: [newHistoryItem] };
                return {
                  ...old,
                  drops: [newHistoryItem, ...old.drops],
                };
              },
            );

            lastGameDataRef.current = null;
          }

          // Задержка, чтобы сервер успел сохранить данные в БД
          setTimeout(() => {
            // Инвалидируем все запросы истории Plinko (и баланс)
            queryClient.invalidateQueries({
              queryKey: queryKeys.plinko,
              refetchType: "active",
            });
            // Также обновляем баланс после завершения всех шариков
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
          }, 2000);
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

      // Оптимистичное обновление баланса (списание ставки)
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
            // Сохраняем ожидаемый баланс (уже включает выигрыш) для обновления после анимации
            // Но пока не обновляем глобальный стейт, чтобы пользователь видел анимацию

            // Устанавливаем ожидаемое количество шариков
            setExpectedBallsCount(response.drops.length);
            setFinishedBallsCount(0);

            // Сохраняем данные для оптимистичного обновления истории
            // Берем первый dropId как ID игры для истории (или любой уникальный)
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

            // Запускаем шарики
            response.drops.forEach((drop, index) => {
              setTimeout(() => {
                addBall(
                  data.amount,
                  drop.path,
                  drop.multiplier,
                  drop.winAmount,
                  // Передаем newBalance в callback финиша (через замыкание или аргумент,
                  // но addBall принимает только параметры шарика.
                  // Лучше сохранить newBalance в ref или state, если нужно,
                  // но мы можем просто использовать response.newBalance в onBallFinish
                  // Однако onBallFinish определен в usePlinkoCanvas.
                  // Передадим newBalance через ref в компоненте.
                );
              }, index * 200);
            });

            // Сохраняем финальный баланс в ref, чтобы использовать его в onBallFinish
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
