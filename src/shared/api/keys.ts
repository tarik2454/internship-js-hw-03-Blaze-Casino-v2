export const queryKeys = {
  user: ["user"] as const,
  balance: ["balance"] as const,
  games: ["games"] as const,
  auth: {
    all: ["auth"] as const,
    login: ["auth", "login"] as const,
    register: ["auth", "register"] as const,
  },
} as const;

// Factory functions for dynamic keys (for future use)
export const queryKeyFactories = {
  user: {
    detail: (id: string) => [...queryKeys.user, id] as const,
  },
  games: {
    detail: (id: string) => [...queryKeys.games, id] as const,
    history: (userId: string) =>
      [...queryKeys.games, "history", userId] as const,
  },
};
