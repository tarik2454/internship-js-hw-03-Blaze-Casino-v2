export interface PlinkoDrop {
  _id: string;
  betAmount: number;
  ballsCount: number;
  riskLevel: "low" | "medium" | "high";
  linesCount: number;
  totalWin: number;
  avgMultiplier: string;
  createdAt: string;
}

export interface PlinkoUserHistoryResponse {
  drops: PlinkoDrop[];
}
