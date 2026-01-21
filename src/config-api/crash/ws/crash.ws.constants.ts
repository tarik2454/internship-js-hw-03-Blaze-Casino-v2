export const CRASH_SOCKET = {
  NAMESPACE: "/crash",
  EVENTS: {
    // Client → Server
    SUBSCRIBE_GAME: "subscribe:game",
    // Server → Client
    GAME_TICK: "game:tick",
    GAME_CRASH: "game:crash",
  },
} as const;
