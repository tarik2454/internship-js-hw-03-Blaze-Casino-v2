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
import { getTranslations } from "@/i18n";
import type { Locale } from "@/i18n";
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
  locale: Locale;
}

export const PlinkoOptions = memo(function PlinkoOptions({
  ballsCount,
  riskLevel,
  linesCount,
  onRiskChange,
  onLinesChange,
  onBallsChange,
  disabled,
  locale,
}: PlinkoOptionsProps) {
  const t = getTranslations(locale);

  return (
    <div className={styles.plinkoOptions}>
      <div className={styles.optionGroup}>
        <label className={styles.optionLabel}>{t.plinko.risk}</label>
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
              {t.history.riskLevels[risk as keyof typeof t.history.riskLevels] ?? risk}
            </Button>
          ))}
        </div>
      </div>

      <div className={styles.optionGroup}>
        <label className={styles.optionLabel}>{t.plinko.balls}</label>
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
        <label className={styles.optionLabel}>{t.plinko.row}</label>
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
