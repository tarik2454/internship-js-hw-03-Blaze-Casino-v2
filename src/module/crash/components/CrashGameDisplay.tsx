import { useMemo } from "react";
import Image from "next/image";
import { memo } from "react";
import { cx } from "@/shared/utils/classNames";
import { Scale } from "./Scale";
import { getMultiplierLevels, getTimeLevels } from "../crash.utils";
import styles from "./CrashGameDisplay.module.scss";

interface GameResult {
  multiplier: number;
  isWin: boolean;
}

interface CrashGameDisplayProps {
  gameState: "waiting" | "running" | "crashed" | undefined;
  multiplier: number;
  elapsed: number;
  gameResult: GameResult | null;
  isFirstLoad: boolean;
}

export const CrashGameDisplay = memo(function CrashGameDisplay({
  gameState,
  multiplier,
  elapsed,
  gameResult,
  isFirstLoad,
}: CrashGameDisplayProps) {
  const displayMultiplier = multiplier.toFixed(2);
  const elapsedSeconds = Math.floor(elapsed / 1000);

  const multiplierLevels = useMemo(
    () => getMultiplierLevels(multiplier),
    [multiplier],
  );

  const timeLevels = useMemo(
    () => getTimeLevels(elapsedSeconds),
    [elapsedSeconds],
  );

  return (
    <div
      className={cx(
        styles.crashArea,
        gameState === "running" && !gameResult && styles.isRunning,
        gameResult?.isWin && styles.isWin,
        gameResult?.isWin === false && styles.isLose,
      )}
    >
      {gameState === "running" && !gameResult && (
        <>
          <div className={styles.starsContainer}>
            <div className={cx(styles.starsLayer, styles.layer1)} />
            <div className={cx(styles.starsLayer, styles.layer2)} />
            <div className={cx(styles.starsLayer, styles.layer3)} />
          </div>

          <div className={styles.rocketWrapper}>
            <div className={styles.rocket}>
              <div className={styles.flame}>
                <div className={styles.flameCore} />
              </div>
              <Image
                src="/images/crash/rocket.svg"
                alt="Rocket"
                className={styles.rocketImage}
                fill={true}
              />
            </div>
          </div>

          <div className={styles.planet1}>
            <Image
              src="/images/crash/planet-1.png"
              alt="Planet 1"
              fill={true}
            />
          </div>

          <div className={styles.planet2}>
            <Image
              src="/images/crash/planet-2.png"
              alt="Planet 2"
              fill={true}
            />
          </div>
        </>
      )}

      <div className={styles.centerArea}>
        <div
          className={cx(
            styles.centerAreaContent,
            gameResult?.isWin && styles.isWin,
            gameResult?.isWin === false && styles.isLose,
          )}
        >
          <p
            className={cx(
              styles.crashAreaValue,
              gameResult?.isWin && styles.isWin,
              gameResult?.isWin === false && styles.isLose,
            )}
          >
            {gameResult ? gameResult.multiplier.toFixed(2) : displayMultiplier}X
          </p>
          {gameResult && (
            <p
              className={cx(
                styles.crashAreaDescription,
                gameResult?.isWin && styles.isWin,
                gameResult?.isWin === false && styles.isLose,
              )}
            >
              Current Payout
            </p>
          )}
          {gameState === "waiting" && isFirstLoad && (
            <p className={styles.crashAreaDescription}>Waiting for bets...</p>
          )}
        </div>
      </div>

      {gameState === "running" && !gameResult && (
        <Scale
          type="multiplier"
          levels={multiplierLevels}
          currentValue={multiplier}
        />
      )}

      {gameState === "running" && !gameResult && (
        <Scale type="time" levels={timeLevels} currentValue={elapsedSeconds} />
      )}
    </div>
  );
});
