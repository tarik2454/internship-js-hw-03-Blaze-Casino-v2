import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { ApiError } from "../error.types";
import { queryKeyFactories, queryKeys } from "../keys";
import { plinkoApi } from "./plinko.api";
import {
  LinesCount,
  PlinkoDropRequest,
  PlinkoDropResponse,
  PlinkoMultipliersResponse,
  PlinkoUserHistoryResponse,
  PlinkoRecentHistoryResponse,
  RiskLevel,
} from "./plinko.types";

export function usePlinkoDrop() {
  const queryClient = useQueryClient();

  return useMutation<PlinkoDropResponse, ApiError, PlinkoDropRequest>({
    mutationFn: (payload: PlinkoDropRequest) => plinkoApi.postBet(payload),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.plinko,
      });
    },
  });
}

export function usePlinkoMultipliers(risk: RiskLevel, lines: LinesCount) {
  return useQuery<PlinkoMultipliersResponse, ApiError>({
    queryKey: queryKeyFactories.plinko.multipliers(risk, lines),
    queryFn: () => plinkoApi.getMultipliers(risk, lines),
  });
}

export function usePlinkoHistory(limit: number = 10, offset: number = 0) {
  return useQuery<PlinkoUserHistoryResponse, ApiError>({
    queryKey: queryKeyFactories.plinko.userHistory(limit, offset),
    queryFn: () => plinkoApi.getUserHistory(limit, offset),
  });
}

export function usePlinkoRecent() {
  return useQuery<PlinkoRecentHistoryResponse, ApiError>({
    queryKey: queryKeyFactories.plinko.recent(),
    queryFn: () => plinkoApi.getRecentGames(),
  });
}
