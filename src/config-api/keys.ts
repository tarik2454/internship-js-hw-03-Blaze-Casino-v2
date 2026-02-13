import type { LinesCount, RiskLevel } from "@/config-api/plinko/plinko.types";

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
  cases: ["cases"],
  mines: ["mines"],
  bonus: ["bonus"],
};

export const queryKeyFactories = {
  user: {
    current: () => queryKeys.user,
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
  cases: {
    userHistory: (limit: number = 10, offset: number = 0) => [
      ...queryKeys.cases,
      "user-history",
      limit,
      offset,
    ],
    all: () => [...queryKeys.cases],
    detail: (id: string) => [...queryKeys.cases, "detail", id],
  },
  mines: {
    userHistory: (limit: number = 10, offset: number = 0) => [
      ...queryKeys.mines,
      "user-history",
      limit,
      offset,
    ],
    active: () => [...queryKeys.mines, "active"],
  },
  bonus: {
    status: () => [...queryKeys.bonus, "status"],
    claim: () => [...queryKeys.bonus, "claim"],
  },
};
