import { api } from "../axios";
import { LEADERBOARD_ROUTES } from "./leaderboard.constants";
import { LeaderboardResponse } from "./leaderboard.types";

export const leaderboardApi = {
  getLeaderboard: async (): Promise<LeaderboardResponse> => {
    const { data } = await api.get<LeaderboardResponse>(
      LEADERBOARD_ROUTES.GET_LEADERBOARD,
    );
    return data;
  },
};
