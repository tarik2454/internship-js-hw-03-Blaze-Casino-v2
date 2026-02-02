"use client";

import { useMemo } from "react";
import Image from "next/image";
import { cx } from "@/shared/utils/classNames";
import styles from "./Mines.module.scss";

type MinesGridSize = 5 | 6 | 7 | 8;

interface MinesGridProps {
  gridSize: MinesGridSize;
  revealedTiles: number[];
  /** Position where mine was hit (game over); show bomb on this tile */
  hitMinePosition: number | null;
  /** All mine positions to show after game over */
  allMinePositions?: number[];
  onReveal: (position: number) => void;
  disabled: boolean;
}

export function MinesGrid({
  gridSize,
  revealedTiles,
  hitMinePosition,
  allMinePositions = [],
  onReveal,
  disabled,
}: MinesGridProps) {
  const totalTiles = gridSize * gridSize;
  const revealedSet = useMemo(() => new Set(revealedTiles), [revealedTiles]);
  const minePositionsSet = useMemo(
    () => new Set(allMinePositions),
    [allMinePositions],
  );

  return (
    <div
      className={styles.minesGrid}
      style={{ "--grid-size": gridSize } as React.CSSProperties}
    >
      {Array.from({ length: totalTiles }, (_, index) => {
        const isRevealed = revealedSet.has(index);
        const isHitMine = index === hitMinePosition;
        const isMinePosition = minePositionsSet.has(index);
        const showCoin = isRevealed && !isHitMine && !isMinePosition;
        const showBomb =
          isHitMine || (isMinePosition && hitMinePosition !== null);

        return (
          <button
            key={index}
            type="button"
            className={cx(
              styles.mineTile,
              isRevealed && styles.mineTileRevealed,
              showCoin && styles.mineTileSafe,
              showBomb && styles.mineTileMine,
            )}
            onClick={() => !disabled && !isRevealed && onReveal(index)}
            disabled={disabled || isRevealed}
            aria-label={
              showBomb ? "Mine" : showCoin ? "Safe" : `Tile ${index + 1}`
            }
          >
            {showCoin && (
              <Image
                src="/images/common/dollar.svg"
                alt=""
                width={24}
                height={24}
                className={styles.mineTileIcon}
              />
            )}
            {showBomb && (
              <Image
                src="/images/mines/bomb.svg"
                alt=""
                width={24}
                height={24}
                className={styles.mineTileIcon}
              />
            )}
          </button>
        );
      })}
    </div>
  );
}
