"use client";

import { useState, useCallback, useEffect, useMemo } from "react";
import { Section } from "@/shared/components/Section";
import { Container } from "@/shared/components/Container";
import { SettingsPanel } from "@/module/settings-panel/SettingsPanel";
import { BetAmountInput } from "@/module/settings-panel/components/BetAmountInput";
import { MinesOptions } from "@/module/settings-panel/components/MinesOptions";
import { ActionButtons } from "@/module/settings-panel/components/ActionButtons";
import { BetStats } from "@/module/settings-panel/components/BetStats";
import { useBetForm } from "@/module/settings-panel/hooks/useBetForm";
import { StatItem } from "@/module/settings-panel/types";
import { MinesGrid } from "./components/MinesGrid";
import {
  DEFAULT_MINES_GRID_SIZE,
  DEFAULT_MINES_MINE_AMOUNT,
  type MinesGridSize,
  type MinesMineAmount,
} from "./mines.constants";
import {
  useMinesStart,
  useMinesReveal,
  useMinesCashout,
  useMinesActive,
} from "@/config-api/mines/useMines";
import { usePopup, POPUP_TYPE } from "@/providers/PopupProvider";
import { useLocale } from "@/providers/LocaleProvider";
import { getTranslations } from "@/i18n";
import { useSound } from "@/shared/hooks/useSound";
import styles from "./Mines.module.scss";

export function Mines() {
  const { locale } = useLocale();
  const t = useMemo(() => getTranslations(locale), [locale]);
  const [hitMinePosition, setHitMinePosition] = useState<number | null>(null);
  const [allMinePositions, setAllMinePositions] = useState<number[]>([]);
  const [gridSize, setGridSize] = useState<MinesGridSize>(
    DEFAULT_MINES_GRID_SIZE,
  );
  const [mineAmount, setMineAmount] = useState<MinesMineAmount>(
    DEFAULT_MINES_MINE_AMOUNT,
  );

  const { showPopup } = usePopup();
  const { playSound, stopSound } = useSound();
  const bet = useBetForm({ maxBetAmount: 10000 });

  const { data: activeData, isSuccess, isFetching } = useMinesActive();

  const rawGame = isSuccess && !isFetching ? activeData?.game : null;
  const gameId = rawGame?._id;
  const hasValidActiveGame =
    typeof gameId === "string" && gameId.length > 0 && rawGame != null;
  const activeGame = hasValidActiveGame ? rawGame : null;

  const { mutate: startGame } = useMinesStart();
  const { mutate: revealTile, isPending: isRevealing } = useMinesReveal();
  const { mutateAsync: cashoutGame } = useMinesCashout();

  const revealedTiles = activeGame?.revealedPositions ?? [];
  const gameGridSize = (activeGame?.gridSize ?? gridSize) as MinesGridSize;
  const isGameOver = hitMinePosition !== null;

  const currentMultiplier = activeGame?.currentMultiplier ?? 0;
  const currentValue = activeGame?.currentValue ?? 0;

  const computeStats = useCallback(
    (amount: number): StatItem[] => [
      {
        label: t.mines.currentMultiplier,
        value: currentMultiplier,
        formatValue: (v) => `${Number(v).toFixed(2)}X`,
      },
      {
        label: t.mines.winAmount,
        value: currentValue > 0 ? currentValue : amount * currentMultiplier,
        formatValue: (v) => `${Number(v).toFixed(2)}$`,
      },
    ],
    [currentMultiplier, currentValue, t],
  );

  const handlePlaceBet = useCallback(() => {
    playSound("startGame");
    setHitMinePosition(null);
    setAllMinePositions([]);
    startGame({
      amount: bet.amount,
      minesCount: mineAmount,
      gridSize: gridSize,
    });
  }, [startGame, playSound, bet.amount, mineAmount, gridSize]);

  const activeGameId = activeGame?._id;
  const activeBetAmount = activeGame?.betAmount ?? 0;

  const handleReveal = useCallback(
    (position: number) => {
      if (!activeGameId) return;
      revealTile(
        { gameId: activeGameId, position },
        {
          onSuccess: (res) => {
            if (res.isMine) {
              setHitMinePosition(position);
              if (res.minePositions) {
                setAllMinePositions(res.minePositions);
              }
              showPopup({
                message: t.mines.hitMine,
                type: POPUP_TYPE.ERROR,
                position: "topCenter",
                resultAmount: -activeBetAmount,
              });
            }
          },
        },
      );
    },
    [activeGameId, activeBetAmount, revealTile, showPopup, t],
  );

  const handleCashout = useCallback(() => {
    if (!activeGameId) return;
    playSound("cashout");
    bet.startCashout();
    cashoutGame(
      { gameId: activeGameId },
      {
        onSuccess: (res) => {
          if (res.minePositions) {
            setAllMinePositions(res.minePositions);
          }
          showPopup({
            message: `${t.mines.youWon} ${res.winAmount.toFixed(2)}$`,
            type: POPUP_TYPE.SUCCESS,
            position: "topCenter",
            resultAmount: res.winAmount - activeBetAmount,
          });
          setHitMinePosition(null);
        },
      },
    )
      .catch(() => {})
      .finally(() => bet.endCashout());
  }, [activeGameId, activeBetAmount, cashoutGame, showPopup, playSound, t, bet]);

  const minesStats = useMemo(
    () => computeStats(bet.amount),
    [computeStats, bet.amount],
  );
  const isCashoutDisabled =
    !activeGame || isGameOver || revealedTiles.length === 0;
  const inputsDisabled = !!activeGame && !isGameOver;

  const isPlaying = !!activeGameId && !isGameOver;

  useEffect(() => {
    if (isPlaying) {
      playSound("playing");
    } else {
      stopSound("playing");
    }
  }, [isPlaying, playSound, stopSound]);

  useEffect(() => {
    return () => stopSound("playing");
  }, [stopSound]);

  return (
    <Section>
      <Container>
        <div className={styles.minesWrapper}>
          <div className={styles.minesArea}>
            <MinesGrid
              gridSize={gameGridSize}
              revealedTiles={revealedTiles}
              hitMinePosition={hitMinePosition}
              allMinePositions={allMinePositions}
              onReveal={handleReveal}
              disabled={!activeGame || isGameOver || isRevealing}
              locale={locale}
            />
          </div>

          <SettingsPanel
            title={t.mines.configuration}
            options={
              <>
                <BetAmountInput
                  amount={bet.amount}
                  disabled={inputsDisabled}
                  locale={locale}
                  onAmountChange={bet.handleAmountChange}
                  onHalf={bet.handleHalf}
                  onDouble={bet.handleDouble}
                  onMax={bet.handleMax}
                />
                <MinesOptions
                  mineAmount={mineAmount}
                  onMineAmountChange={setMineAmount}
                  gridSize={gridSize}
                  onGridSizeChange={setGridSize}
                  disabled={inputsDisabled}
                  locale={locale}
                />
              </>
            }
          >
            <ActionButtons
              canBet={!activeGame || isGameOver}
              showCashoutButton={true}
              isCashoutDisabled={isCashoutDisabled}
              isCashingOut={bet.isCashingOut}
              locale={locale}
              onPlaceBet={handlePlaceBet}
              onCashout={handleCashout}
            />
            <BetStats stats={minesStats} />
          </SettingsPanel>
        </div>
      </Container>
    </Section>
  );
}
