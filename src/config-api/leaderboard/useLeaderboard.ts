import { useQuery } from "@tanstack/react-query";
import { leaderboardApi } from "./leaderboard.api";
import { queryKeyFactories } from "../keys";
import { ApiError } from "../error.types";
import { LeaderboardResponse } from "./leaderboard.types";

export function useLeaderboard() {
  return useQuery<LeaderboardResponse, ApiError>({
    queryKey: queryKeyFactories.leaderboard.all,
    queryFn: () => leaderboardApi.getLeaderboard(),
  });
}
