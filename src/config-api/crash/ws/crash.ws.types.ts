export interface GameTickEvent {
  gameId: string;
  multiplier: number;
  elapsed: number;
}

export interface GameCrashEvent {
  gameId: string;
  crashPoint: number;
  serverSeed: string;
  reveal: string;
}

export interface SubscribeGamePayload {
  gameId: string;
}
