"use client";

import { useState, useCallback, useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
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
import { queryKeyFactories } from "@/config-api/keys";
import { usePopup, POPUP_TYPE } from "@/app/providers/PopupProvider";

export function Mines() {
  const { showPopup } = usePopup();
  const queryClient = useQueryClient();
  const [gridSize, setGridSize] = useState<MinesGridSize>(
    DEFAULT_MINES_GRID_SIZE,
  );
  const [hitMinePosition, setHitMinePosition] = useState<number | null>(null);
  const [allMinePositions, setAllMinePositions] = useState<number[]>([]);

  const { data: activeData, isSuccess, isFetching } = useMinesActive();

  useEffect(() => {
    queryClient.removeQueries({ queryKey: queryKeyFactories.mines.active() });
  }, [queryClient]);

  const rawGame = isSuccess && !isFetching ? activeData?.game : null;
  const gameId = rawGame?._id;
  const hasValidActiveGame =
    typeof gameId === "string" && gameId.length > 0 && rawGame != null;
  const activeGame = hasValidActiveGame ? rawGame : null;

  const { mutateAsync: startGame, isPending: isStarting } = useMinesStart();
  const { mutateAsync: revealTile, isPending: isRevealing } = useMinesReveal();
  const { mutateAsync: cashoutGame, isPending: isCashingOut } =
    useMinesCashout();

  const revealedTiles = activeGame?.revealedPositions ?? [];
  const gameGridSize = (activeGame?.gridSize ?? gridSize) as MinesGridSize;
  const totalTiles = gameGridSize * gameGridSize;
  const isGameOver = hitMinePosition !== null;
  const hasActiveGame = !!activeGame && !isGameOver;

  const currentMultiplier = activeGame?.currentMultiplier ?? 0;
  const currentValue = activeGame?.currentValue ?? 0;

  const computeStats = useCallback(
    (amount: number): StatItem[] => [
      {
        label: "Current Multiplier",
        value: currentMultiplier,
        formatValue: (v) => `${Number(v).toFixed(2)}X`,
      },
      {
        label: "Win Amount",
        value: currentValue > 0 ? currentValue : amount * currentMultiplier,
        formatValue: (v) => `${Number(v).toFixed(2)}$`,
      },
    ],
    [currentMultiplier, currentValue],
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
      }).catch((err) => {
        showPopup({
          message: err?.message ?? "Failed to start game",
          type: POPUP_TYPE.ERROR,
        });
      });
    },
    [startGame, showPopup],
  );

  const handleReveal = useCallback(
    (position: number) => {
      if (!activeGame?._id) return;
      revealTile({ gameId: activeGame._id, position })
        .then((res) => {
          if (res.isMine) {
            setHitMinePosition(position);
            if (res.minePositions) {
              setAllMinePositions(res.minePositions);
            }
            showPopup({
              message: "You hit a mine! Game over.",
              type: POPUP_TYPE.ERROR,
            });
          }
        })
        .catch((err) => {
          showPopup({
            message: err?.message ?? "Failed to reveal tile",
            type: POPUP_TYPE.ERROR,
          });
        });
    },
    [activeGame?._id, revealTile, showPopup],
  );

  const handleCashout = useCallback(() => {
    if (!activeGame?._id) return;
    cashoutGame({ gameId: activeGame._id })
      .then((res) => {
        if (res.minePositions) {
          setAllMinePositions(res.minePositions);
        }
        showPopup({
          message: `You won ${res.winAmount.toFixed(2)}$`,
          type: POPUP_TYPE.SUCCESS,
        });
        setHitMinePosition(null);
      })
      .catch((err) => {
        showPopup({
          message: err?.message ?? "Cashout failed",
          type: POPUP_TYPE.ERROR,
        });
      });
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
            />
          </div>

          <SettingsPanel
            title="Mines Configuration"
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
