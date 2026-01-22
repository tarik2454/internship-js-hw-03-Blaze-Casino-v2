export interface CrashBet {
  betId: string;
  gameId: string;
  amount: number;
  cashoutMultiplier?: number;
  winAmount?: number;
  status: "won" | "lost";
  crashPoint: number;
  createdAt: string;
}

export interface CrashUserHistoryResponse {
  bets: CrashBet[];
}

export interface CrashGlobalGame {
  gameId: string;
  crashPoint: number;
  hash: string;
  seed: string;
}

export interface CrashGlobalHistoryResponse {
  games: CrashGlobalGame[];
}

export interface CrashBetRequest {
  amount: number;
  autoCashout?: number;
}

export interface CrashBetResponse {
  betId: string;
  amount: number;
  gameId: string;
}

export interface CrashCashoutResponse {
  multiplier: number;
  winAmount: number;
}

export interface CrashCurrentResponse {
  gameId: string;
  state: "waiting" | "running" | "crashed";
  multiplier?: number;
  serverSeedHash: string;
  myBet?: {
    betId: string;
    amount: number;
  };
}
