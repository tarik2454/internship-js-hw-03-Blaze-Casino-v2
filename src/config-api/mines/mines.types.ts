export interface MinesStartRequest {
  amount: number;
  minesCount: number;
  clientSeed?: string;
}

export interface MinesStartResponse {
  gameId: string;
  amount: number;
  minesCount: number;
  serverSeedHash: string;
  multipliers: number[];
}

export interface MinesRevealRequest {
  gameId: string;
  position: number;
}

export interface MinesRevealResponse {
  position: number;
  isMine: boolean;
  currentMultiplier: number;
  currentValue: number;
  revealedTiles: number[];
  safeTilesLeft: number;
}

export interface MinesCashoutRequest {
  gameId: string;
}

export interface MinesCashoutResponse {
  winAmount: number;
  multiplier: number;
  serverSeed: string;
  minePositions: number[];
}

export interface MinesActiveGame {
  gameId: string;
  amount: number;
  minesCount: number;
  serverSeedHash: string;
  multipliers: number[];
  revealedTiles?: number[];
  currentMultiplier?: number;
  currentValue?: number;
}

export interface MinesActiveResponse {
  game: MinesActiveGame | null;
}

export interface MinesHistoryItem {
  gameId: string;
  amount: number;
  minesCount: number;
  winAmount?: number;
  multiplier?: number;
  status: "won" | "lost";
  minePositions?: number[];
  createdAt: string;
}

export interface MinesHistoryResponse {
  games: MinesHistoryItem[];
}
