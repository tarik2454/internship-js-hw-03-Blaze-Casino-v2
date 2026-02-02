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

export interface MinesActiveGame {
  _id?: string;
  gameId: string;
  amount: number;
  minesCount: number;
  gridSize: number;
  totalTiles?: number;
  serverSeedHash: string;
  multipliers: number[];
  /** Open safe tile indices (backend may send as revealedPositions) */
  revealedTiles?: number[];
  revealedPositions?: number[];
  currentMultiplier?: number;
  currentValue?: number;
  betAmount?: number;
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
