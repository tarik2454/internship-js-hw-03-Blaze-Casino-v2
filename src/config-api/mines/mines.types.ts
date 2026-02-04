//

export type MinesGridSizeApi = 5 | 6 | 7 | 8;

export interface MinesStartRequest {
  amount: number;
  minesCount: number;
  gridSize?: MinesGridSizeApi;
  clientSeed?: string;
}

export interface MinesStartResponse {
  gameId: string;
  amount: number;
  minesCount: number;
  gridSize?: number;
  totalTiles?: number;
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
  gridSize?: number;
  totalTiles?: number;
  minePositions?: number[];
}

export interface MinesCashoutRequest {
  gameId: string;
}

export interface MinesCashoutResponse {
  winAmount: number;
  multiplier: number;
  serverSeed: string;
  minePositions: number[];
  gridSize?: number;
  totalTiles?: number;
}

/** Формат ответа GET /mines/active (поля бэкенда + доп. из reveal) */
export interface MinesActiveGame {
  _id: string;
  userId?: string;
  betAmount: number;
  gridSize: number;
  minesCount: number;
  revealedPositions?: number[];
  serverSeedHash?: string;
  multipliers?: number[];
  /** Обновляется из ответа reveal */
  currentMultiplier?: number;
  currentValue?: number;
}

export interface MinesActiveResponse {
  game: MinesActiveGame | null;
}

/** Формат ответа GET /mines/history (поля бэкенда) */
export interface MinesHistoryItem {
  _id: string;
  userId?: string;
  betAmount: number;
  gridSize?: number;
  minesCount: number;
  minePositions?: number[];
  revealedPositions?: number[];
  status: "won" | "lost" | "cashed_out";
  cashoutMultiplier?: number;
  winAmount?: number;
  serverSeed?: string;
  serverSeedHash?: string;
  clientSeed?: string;
  nonce?: number;
  createdAt: string;
  finishedAt?: string;
}

export interface MinesHistoryResponse {
  games: MinesHistoryItem[];
}
