"use client";

import { useCallback, useState } from "react";
import { Section } from "@/shared/components/Section";
import { Container } from "@/shared/components/Container";
import { SettingsPanel } from "@/module/settings-panel/SettingsPanel";
import type {
  RiskLevel,
  LinesCount,
  BallsCount,
} from "@/config-api/plinko/plinko.types";
import {
  usePlinkoDrop,
  usePlinkoMultipliers,
} from "@/config-api/plinko/usePlinko";
import styles from "./Plinko.module.scss";

export function Plinko() {
  const { mutate: postBet, isPending } = usePlinkoDrop();

  const [riskLevel, setRiskLevel] = useState<RiskLevel>("medium");
  const [linesCount, setLinesCount] = useState<LinesCount>(12);
  const [ballsCount, setBallsCount] = useState<BallsCount>(1);

  const { data: multipliersData } = usePlinkoMultipliers(riskLevel, linesCount);
  const multipliers = multipliersData?.multipliers || [];

  console.log(multipliers);

  const handlePlaceBet = useCallback(
    async (data: {
      amount: number;
      riskLevel?: RiskLevel;
      linesCount?: LinesCount;
      ballsCount?: BallsCount;
    }) => {
      postBet({
        amount: data.amount,
        balls: data.ballsCount || 1,
        risk: (data.riskLevel || riskLevel) as "low" | "medium" | "high",
        lines: data.linesCount || linesCount,
      });
    },
    [postBet, riskLevel, linesCount],
  );

  return (
    <Section>
      <Container>
        <div className={styles.plinkoWrapper}>
          <div className={styles.plinkoArea}>
            <div>Area</div>
            <ul className={styles.multipliersList}>
              {multipliers.map((multiplier, index) => (
                <li
                  key={`${multiplier}-${index}`}
                  className={styles.multiplierItem}
                >
                  {multiplier}
                </li>
              ))}
            </ul>
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
