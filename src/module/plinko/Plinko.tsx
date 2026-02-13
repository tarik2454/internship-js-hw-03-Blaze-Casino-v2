"use client";

import { useCallback, useEffect, useState, useRef, useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { Section } from "@/shared/components/Section";
import { Container } from "@/shared/components/Container";
import { SettingsPanel } from "@/module/settings-panel/SettingsPanel";
import { BetAmountInput } from "@/module/settings-panel/components/BetAmountInput";
import { PlinkoOptions } from "@/module/settings-panel/components/PlinkoOptions";
import { ActionButtons } from "@/module/settings-panel/components/ActionButtons";
import { useBetForm } from "@/module/settings-panel/hooks/useBetForm";
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
import { useSound } from "@/shared/hooks/useSound";
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
    newBalance: number;
    balls: BallsCount;
    risk: RiskLevel;
    lines: LinesCount;
    dropId: string;
  } | null>(null);

  const bet = useBetForm({ maxBetAmount: 100 });

  const { mutate: postBet, isPending } = usePlinkoDrop();
  const { data: multipliersData } = usePlinkoMultipliers(riskLevel, linesCount);

  const multipliers = multipliersData?.multipliers || [];

  const isGameActive = useMemo(
    () =>
      isPending ||
      (expectedBallsCount > 0 && finishedBallsCount < expectedBallsCount),
    [isPending, expectedBallsCount, finishedBallsCount],
  );

  const { playSound, stopSound } = useSound();

  useEffect(() => {
    if (isGameActive) {
      playSound("playing");
    } else {
      stopSound("playing");
    }
  }, [isGameActive, playSound, stopSound]);

  useEffect(() => {
    return () => stopSound("playing");
  }, [stopSound]);

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

  const onPlaceBet = useCallback(() => {
    playSound("startGame");

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
            balance: old.balance - bet.amount * ballsCount,
          };
        },
      );
    }

    postBet(
      {
        amount: bet.amount,
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
            setTimeout(() => {
              addBall(
                bet.amount,
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
  }, [
    postBet,
    riskLevel,
    linesCount,
    ballsCount,
    bet.amount,
    addBall,
    queryClient,
    playSound,
    showPopup,
    t,
  ]);

  const noop = useCallback(() => {}, []);

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
            options={
              <>
                <BetAmountInput
                  amount={bet.amount}
                  disabled={isGameActive}
                  locale={locale}
                  maxBetAmount={100}
                  onAmountChange={bet.handleAmountChange}
                  onHalf={bet.handleHalf}
                  onDouble={bet.handleDouble}
                  onMax={bet.handleMax}
                />
                <PlinkoOptions
                  riskLevel={riskLevel}
                  linesCount={linesCount}
                  ballsCount={ballsCount}
                  onRiskChange={setRiskLevel}
                  onLinesChange={setLinesCount}
                  onBallsChange={setBallsCount}
                  disabled={isGameActive}
                  locale={locale}
                />
              </>
            }
          >
            <ActionButtons
              canBet={!isGameActive}
              showCashoutButton={false}
              isCashoutDisabled={true}
              isCashingOut={false}
              hideBorder={true}
              locale={locale}
              onPlaceBet={onPlaceBet}
              onCashout={noop}
            />
          </SettingsPanel>
        </div>
      </Container>
    </Section>
  );
}
