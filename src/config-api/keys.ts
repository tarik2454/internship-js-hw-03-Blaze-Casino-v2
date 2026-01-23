export const queryKeys = {
  user: ["user"],
  balance: ["balance"],
  games: ["games"],
  auth: {
    all: ["auth"],
    login: ["auth", "login"],
    register: ["auth", "register"],
    logout: ["auth", "logout"],
  },
  leaderboard: ["leaderboard"],
  crash: ["crash"],
};

export const queryKeyFactories = {
  user: {
    detail: (id: string) => [...queryKeys.user, id],
  },
  games: {
    detail: (id: string) => [...queryKeys.games, id],
    history: (userId: string) => [...queryKeys.games, "history", userId],
  },
  leaderboard: {
    all: ["leaderboard"],
  },
  crash: {
    userHistory: (limit: number = 10, offset: number = 0) => [
      ...queryKeys.crash,
      "user-history",
      limit,
      offset,
    ],
    getCurrent: () => [...queryKeys.crash, "current"],
  },
};
