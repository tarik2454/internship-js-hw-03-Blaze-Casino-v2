export const LEADERBOARD_ROUTES = {
  GET_LEADERBOARD: "/api/leaderboard?period=all",
} as const;

export type LeaderboardRoutes =
  (typeof LEADERBOARD_ROUTES)[keyof typeof LEADERBOARD_ROUTES];
