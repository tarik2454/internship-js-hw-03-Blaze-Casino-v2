import { ReactNode } from "react";
import type {
  RiskLevel,
  LinesCount,
  BallsCount,
} from "@/config-api/plinko/plinko.types";

export interface StatItem {
  label: string;
  value: string | number;
  formatValue?: (value: string | number) => string;
}

export interface SettingsPanelProps {
  title: string;
  canBet: boolean;
  inputsDisabled?: boolean;
  showAutoCashout?: boolean;
  showCashoutButton?: boolean;
  showPlinkoOptions?: boolean;
  riskLevel?: RiskLevel;
  linesCount?: LinesCount;
  ballsCount?: BallsCount;
  onRiskChange?: (risk: RiskLevel) => void;
  onLinesChange?: (lines: LinesCount) => void;
  onBallsChange?: (balls: BallsCount) => void;
  isCashoutDisabled?: boolean;
  stats?: StatItem[];
  computeStats?: (
    amount: number,
    riskLevel?: RiskLevel,
    linesCount?: LinesCount,
  ) => StatItem[];
  children?: ReactNode;
  onPlaceBet: (data: {
    amount: number;
    autoCashout?: number;
    riskLevel?: RiskLevel;
    linesCount?: LinesCount;
    ballsCount?: BallsCount;
  }) => void;
  onCashout?: () => void;
}

export type { RiskLevel, LinesCount, BallsCount };
