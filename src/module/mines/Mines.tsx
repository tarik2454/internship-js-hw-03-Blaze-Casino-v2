"use client";

import { useState, useCallback } from "react";
import { Section } from "@/shared/components/Section";
import styles from "./Mines.module.scss";
import { Container } from "@/shared/components/Container";
import { SettingsPanel, StatItem } from "../settings-panel/SettingsPanel";
import {
  DEFAULT_MINES_GRID_SIZE,
  type MinesGridSize,
} from "./mines.constants";

export function Mines() {
  const [gridSize, setGridSize] = useState<MinesGridSize>(DEFAULT_MINES_GRID_SIZE);
  const [currentMultiplier, setCurrentMultiplier] = useState(0);
  const [winAmount, setWinAmount] = useState(0);

  const computeStats = useCallback(
    (amount: number): StatItem[] => [
      {
        label: "Current Multiplier",
        value: currentMultiplier,
        formatValue: (v) => `${Number(v).toFixed(2)}X`,
      },
      {
        label: "Win Amount",
        value: winAmount > 0 ? winAmount : amount * currentMultiplier,
        formatValue: (v) => `${Number(v).toFixed(2)}$`,
      },
    ],
    [currentMultiplier, winAmount],
  );

  return (
    <Section>
      <Container>
        <div className={styles.minesWrapper}>
          <div className={styles.minesArea}></div>

          <SettingsPanel
            title="Mines Configuration"
            canBet={true}
            inputsDisabled={false}
            showAutoCashout={false}
            showCashoutButton={true}
            showMinesOptions={true}
            gridSize={gridSize}
            onGridSizeChange={setGridSize}
            computeStats={computeStats}
            onPlaceBet={() => {}}
            onCashout={() => {}}
          />
        </div>
      </Container>
    </Section>
  );
}
