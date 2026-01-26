"use client";

import { useCallback, useMemo } from "react";
import { Section } from "@/shared/components/Section";
import { Container } from "@/shared/components/Container";
import {
  SettingsPanel,
  RiskLevel,
  LinesCount,
  StatItem,
} from "@/shared/components/SettingsPanel";
import styles from "./Plinko.module.scss";

// Базовая логика для вычисления multiplier на основе riskLevel и linesCount
// TODO: Заменить на реальный API запрос к GET_MULTIPLIERS
const getMultiplier = (riskLevel: RiskLevel, linesCount: LinesCount): number => {
  const riskMultipliers: Record<RiskLevel, number> = {
    low: 0.5,
    medium: 1.0,
    high: 1.5,
    extreme: 2.0,
  };

  const linesMultipliers: Record<LinesCount, number> = {
    8: 0.8,
    10: 1.0,
    12: 1.2,
    14: 1.4,
    16: 1.6,
  };

  return riskMultipliers[riskLevel] * linesMultipliers[linesCount];
};

export function Plinko() {
  // Используем значения по умолчанию для вычисления stats
  const defaultRiskLevel: RiskLevel = "medium";
  const defaultLinesCount: LinesCount = 12;

  const computeStats = useCallback(
    (amount: number, riskLevel: RiskLevel, linesCount: LinesCount): StatItem[] => {
      const multiplier = getMultiplier(riskLevel, linesCount);
      return [
        {
          label: "Current Multiplier",
          value: multiplier,
          formatValue: (v) => `${Number(v).toFixed(2)}X`,
        },
        {
          label: "Potential Win",
          value: amount * multiplier,
          formatValue: (v) => `${Number(v).toFixed(2)}$`,
        },
      ];
    },
    [],
  );

  const handlePlaceBet = useCallback(
    (data: {
      amount: number;
      autoCashout?: number;
      riskLevel?: RiskLevel;
      linesCount?: LinesCount;
    }) => {
      // TODO: Implement Plinko bet logic
      console.log("Plinko bet:", data);
    },
    [],
  );

  // Создаем функцию computeStats, которая будет получать актуальные значения из SettingsPanel
  const computeStatsWrapper = useCallback(
    (
      amount: number,
      riskLevel?: RiskLevel,
      linesCount?: LinesCount,
    ): StatItem[] => {
      // Используем переданные значения или значения по умолчанию
      return computeStats(
        amount,
        riskLevel || defaultRiskLevel,
        linesCount || defaultLinesCount,
      );
    },
    [computeStats],
  );

  return (
    <Section>
      <Container>
        <div className={styles.plinkoWrapper}>
          <div className={styles.plinkoArea}>Plinko Game</div>

          <SettingsPanel
            title="Plinko Configuration"
            canBet={true}
            showAutoCashout={false}
            showCashoutButton={false}
            showPlinkoOptions={true}
            computeStats={computeStatsWrapper}
            onPlaceBet={handlePlaceBet}
          />
        </div>
      </Container>
    </Section>
  );
}
