import { api } from "../axios";
import { createAuthConfig } from "../api.utils";
import { LEADERBOARD_ROUTES } from "./leaderboard.constants";
import { LeaderboardResponse } from "./leaderboard.types";

export const leaderboardApi = {
  getLeaderboard: async (token?: string): Promise<LeaderboardResponse> => {
    const { data } = await api.get<LeaderboardResponse>(
      LEADERBOARD_ROUTES.GET_LEADERBOARD,
      createAuthConfig(token),
    );
    return data;
  },
};
