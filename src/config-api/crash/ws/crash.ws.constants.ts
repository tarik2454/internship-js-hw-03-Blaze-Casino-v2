export const CRASH_SOCKET = {
  NAMESPACE: "/crash",
  EVENTS: {
    SUBSCRIBE_GAME: "subscribe:game",
    GAME_TICK: "game:tick",
    GAME_CRASH: "game:crash",
  },
} as const;

export const GAME_STATE = {
  WAITING: "waiting",
  RUNNING: "running",
  CRASHED: "crashed",
} as const;
