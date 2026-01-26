import { useQuery } from "@tanstack/react-query";
import { ApiError } from "../error.types";
import { queryKeyFactories } from "../keys";
import { plinkoApi } from "./plinko.api";
import { PlinkoUserHistoryResponse } from "./plinko.types";

export function usePlinkoUserHistory(limit: number = 10, offset: number = 0) {
  return useQuery<PlinkoUserHistoryResponse, ApiError>({
    queryKey: queryKeyFactories.plinko.userHistory(limit, offset),
    queryFn: () => plinkoApi.getUserHistory(limit, offset),
  });
}
