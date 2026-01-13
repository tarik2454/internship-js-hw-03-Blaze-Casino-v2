import { api } from "../axios";
import { LEADERBOARD_ROUTES } from "./leaderboard.constants";
import { LeaderboardResponse } from "./leaderboard.types";

export const leaderboardApi = {
  getLeaderboard: async (token?: string): Promise<LeaderboardResponse> => {
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};

    const { data } = await api.get<LeaderboardResponse>(
      LEADERBOARD_ROUTES.GET_LEADERBOARD,
      config,
    );
    return data;
  },
};
