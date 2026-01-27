export type RiskLevel = "low" | "medium" | "high" | "extreme";
export type LinesCount = 8 | 10 | 12 | 14 | 16;
export type BallsCount = 1 | 2 | 5 | 10;

export interface PlinkoDrop {
  _id: string;
  betAmount: number;
  ballsCount: BallsCount;
  riskLevel: RiskLevel;
  linesCount: LinesCount;
  totalWin: number;
  avgMultiplier: string;
  createdAt: string;
}

export interface PlinkoUserHistoryResponse {
  drops: PlinkoDrop[];
}

export interface PlinkoDropRequest {
  amount: number;
  balls: BallsCount;
  risk: RiskLevel;
  lines: LinesCount;
}

export interface PlinkoDropResult {
  dropId: string;
  path: number[];
  slotIndex: number;
  multiplier: number;
  winAmount: number;
  serverSeed: string;
  clientSeed: string;
  nonce: number;
}

export interface PlinkoDropResponse {
  drops: PlinkoDropResult[];
  totalBet: number;
  totalWin: number;
  newBalance: number;
}

export interface PlinkoMultipliersResponse {
  multipliers: number[];
}
