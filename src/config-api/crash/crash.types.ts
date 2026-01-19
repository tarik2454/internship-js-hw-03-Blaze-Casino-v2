export interface CrashHistoryResponse {
  bets: CrashBet[];
}

export interface CrashBet {
  betId: string;
  gameId: string;
  amount: number;
  cashoutMultiplier: number;
  winAmount: number;
  status: "won" | "lost";
  crashPoint: number;
  createdAt: string;
}
