import { LinesCount, RiskLevel } from "@/module/settings-panel/types";

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
  plinko: ["plinko"],
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
  plinko: {
    userHistory: (limit: number = 10, offset: number = 0) => [
      ...queryKeys.plinko,
      "user-history",
      limit,
      offset,
    ],
    multipliers: (risk: RiskLevel, lines: LinesCount) => [
      ...queryKeys.plinko,
      "multipliers",
      risk,
      lines,
    ],
    recent: () => [...queryKeys.plinko, "recent"],
  },
};
