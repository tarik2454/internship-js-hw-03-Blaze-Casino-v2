"use client";

import { memo } from "react";
import { Button } from "@/shared/components/Button";
import type {
  RiskLevel,
  LinesCount,
  BallsCount,
} from "@/config-api/plinko/plinko.types";
import {
  PLINKO_RISK_LEVELS,
  PLINKO_LINES,
  PLINKO_BALLS,
} from "@/module/plinko/plinko.constants";
import styles from "./PlinkoOptions.module.scss";
import { cx } from "@/shared/utils/classNames";

interface PlinkoOptionsProps {
  riskLevel: RiskLevel;
  linesCount: LinesCount;
  ballsCount: BallsCount;
  onRiskChange: (risk: RiskLevel) => void;
  onLinesChange: (lines: LinesCount) => void;
  onBallsChange: (balls: BallsCount) => void;
  disabled: boolean;
}

export const PlinkoOptions = memo(function PlinkoOptions({
  ballsCount,
  riskLevel,
  linesCount,
  onRiskChange,
  onLinesChange,
  onBallsChange,
  disabled,
}: PlinkoOptionsProps) {
  return (
    <div className={styles.plinkoOptions}>
      <div className={styles.optionGroup}>
        <label className={styles.optionLabel}>Risk</label>
        <div className={styles.optionButtons}>
          {PLINKO_RISK_LEVELS.map((risk) => (
            <Button
              key={risk}
              className={cx(
                styles.optionButton,
                riskLevel === risk && styles.optionButtonActive,
              )}
              onClick={() => onRiskChange(risk)}
              disabled={disabled}
            >
              {risk.charAt(0).toUpperCase() + risk.slice(1)}
            </Button>
          ))}
        </div>
      </div>

      <div className={styles.optionGroup}>
        <label className={styles.optionLabel}>Balls</label>
        <div className={styles.optionButtons}>
          {PLINKO_BALLS.map((balls) => (
            <Button
              key={balls}
              className={cx(
                styles.optionButton,
                ballsCount === balls && styles.optionButtonActive,
              )}
              onClick={() => onBallsChange(balls)}
              disabled={disabled}
            >
              {balls}
            </Button>
          ))}
        </div>
      </div>

      <div className={styles.optionGroup}>
        <label className={styles.optionLabel}>Row</label>
        <div className={styles.optionButtons}>
          {PLINKO_LINES.map((lines) => (
            <Button
              key={lines}
              className={cx(
                styles.optionButton,
                linesCount === lines && styles.optionButtonActive,
              )}
              onClick={() => onLinesChange(lines)}
              disabled={disabled}
            >
              {lines}
            </Button>
          ))}
        </div>
      </div>
    </div>
  );
});
