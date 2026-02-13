import { ReactNode } from "react";
import type {
  RiskLevel,
  LinesCount,
  BallsCount,
} from "@/config-api/plinko/plinko.types";
import type {
  MinesGridSize,
  MinesMineAmount,
} from "@/module/mines/mines.constants";

export interface StatItem {
  label: string;
  value: string | number;
  formatValue?: (value: string | number) => string;
}

export {
  MINES_GRID_SIZES,
  DEFAULT_MINES_GRID_SIZE,
  DEFAULT_MINES_MINE_AMOUNT,
} from "@/module/mines/mines.constants";
export type {
  MinesGridSize,
  MinesMineAmount,
} from "@/module/mines/mines.constants";

export interface SettingsPanelProps {
  title: string;
  canBet: boolean;
  inputsDisabled?: boolean;
  showAutoCashout?: boolean;
  showCashoutButton?: boolean;
  showPlinkoOptions?: boolean;
  showMinesOptions?: boolean;
  riskLevel?: RiskLevel;
  linesCount?: LinesCount;
  ballsCount?: BallsCount;
  gridSize?: MinesGridSize;
  mineAmount?: MinesMineAmount;
  onRiskChange?: (risk: RiskLevel) => void;
  onLinesChange?: (lines: LinesCount) => void;
  onBallsChange?: (balls: BallsCount) => void;
  onGridSizeChange?: (size: MinesGridSize) => void;
  onMineAmountChange?: (amount: MinesMineAmount) => void;
  maxBetAmount?: number;
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
    gridSize?: MinesGridSize;
    mineAmount?: MinesMineAmount;
  }) => void;
  onCashout?: () => void;
}

export type { RiskLevel, LinesCount, BallsCount };
