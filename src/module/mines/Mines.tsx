"use client";

import { useState, useCallback, useEffect } from "react";
import { Section } from "@/shared/components/Section";
import styles from "./Mines.module.scss";
import { Container } from "@/shared/components/Container";
import { SettingsPanel, StatItem } from "../settings-panel/SettingsPanel";
import { MinesGrid } from "./components/MinesGrid";
import { DEFAULT_MINES_GRID_SIZE, type MinesGridSize } from "./mines.constants";
import {
  useMinesStart,
  useMinesReveal,
  useMinesCashout,
  useMinesActive,
} from "@/config-api/mines/useMines";
import { usePopup, POPUP_TYPE } from "@/providers/PopupProvider";
import { useLocale } from "@/providers/LocaleProvider";
import { getTranslations } from "@/i18n";

export function Mines() {
  const { locale } = useLocale();
  const t = getTranslations(locale);
  const [hitMinePosition, setHitMinePosition] = useState<number | null>(null);
  const [allMinePositions, setAllMinePositions] = useState<number[]>([]);
  const [gridSize, setGridSize] = useState<MinesGridSize>(
    DEFAULT_MINES_GRID_SIZE,
  );

  const { showPopup } = usePopup();

  const { data: activeData, isSuccess, isFetching } = useMinesActive();

  const rawGame = isSuccess && !isFetching ? activeData?.game : null;
  const gameId = rawGame?._id;
  const hasValidActiveGame =
    typeof gameId === "string" && gameId.length > 0 && rawGame != null;
  const activeGame = hasValidActiveGame ? rawGame : null;

  const { mutate: startGame } = useMinesStart();
  const { mutate: revealTile, isPending: isRevealing } = useMinesReveal();
  const { mutate: cashoutGame } = useMinesCashout();

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

  const handlePlaceBet = useCallback(
    (data: {
      amount: number;
      gridSize?: MinesGridSize;
      mineAmount?: number;
    }) => {
      setHitMinePosition(null);
      setAllMinePositions([]);
      startGame({
        amount: data.amount,
        minesCount: data.mineAmount ?? 3,
        gridSize: data.gridSize ?? DEFAULT_MINES_GRID_SIZE,
      });
    },
    [startGame],
  );

  const handleReveal = useCallback(
    (position: number) => {
      if (!activeGame?._id) return;
      revealTile(
        { gameId: activeGame._id, position },
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
                resultAmount: -(activeGame?.betAmount ?? 0),
              });
            }
          },
        },
      );
    },
    [activeGame?._id, revealTile, showPopup],
  );

  const handleCashout = useCallback(() => {
    if (!activeGame?._id) return;
    cashoutGame(
      { gameId: activeGame._id },
      {
        onSuccess: (res) => {
          if (res.minePositions) {
            setAllMinePositions(res.minePositions);
          }
          showPopup({
            message: `${t.mines.youWon} ${res.winAmount.toFixed(2)}$`,
            type: POPUP_TYPE.SUCCESS,
            position: "topCenter",
            resultAmount: res.winAmount - (activeGame?.betAmount ?? 0),
          });
          setHitMinePosition(null);
        },
      },
    );
  }, [activeGame?._id, cashoutGame, showPopup]);

  const isCashoutDisabled = !activeGame || isGameOver;

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
            canBet={!activeGame || isGameOver}
            inputsDisabled={!!activeGame && !isGameOver}
            showAutoCashout={false}
            showCashoutButton={true}
            showMinesOptions={true}
            gridSize={gridSize}
            onGridSizeChange={setGridSize}
            computeStats={computeStats}
            onPlaceBet={handlePlaceBet}
            onCashout={handleCashout}
            isCashoutDisabled={isCashoutDisabled}
          />
        </div>
      </Container>
    </Section>
  );
}
