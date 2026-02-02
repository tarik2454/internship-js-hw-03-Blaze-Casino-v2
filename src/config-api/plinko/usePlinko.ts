import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "../error.types";
import { queryKeys, queryKeyFactories } from "../keys";
import { plinkoApi } from "./plinko.api";
import {
  LinesCount,
  PlinkoDrop,
  PlinkoDropRequest,
  PlinkoDropResponse,
  PlinkoMultipliersResponse,
  PlinkoUserHistoryResponse,
  RiskLevel,
} from "./plinko.types";
import type { CurrentUserResponse } from "../user/user.types";

export function usePlinkoDrop() {
  const queryClient = useQueryClient();

  return useMutation<PlinkoDropResponse, ApiError, PlinkoDropRequest>({
    mutationFn: (body: PlinkoDropRequest) => plinkoApi.postBet(body),
    onSuccess: (response, variables) => {
      queryClient.setQueryData<CurrentUserResponse>(queryKeys.user, (old) =>
        old ? { ...old, balance: response.newBalance } : old,
      );

      const newHistoryItem: PlinkoDrop = {
        _id: response.drops[0]?.dropId ?? "",
        betAmount: response.totalBet,
        ballsCount: variables.balls,
        riskLevel: variables.risk,
        linesCount: variables.lines,
        totalWin: response.totalWin,
        avgMultiplier: (response.totalWin / response.totalBet).toFixed(2),
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<PlinkoUserHistoryResponse>(
        queryKeyFactories.plinko.userHistory(10, 0),
        (old) => ({
          ...old,
          drops: [newHistoryItem, ...(old?.drops ?? [])],
        }),
      );
    },
  });
}

export function usePlinkoMultipliers(risk: RiskLevel, lines: LinesCount) {
  return useQuery<PlinkoMultipliersResponse, ApiError>({
    queryKey: queryKeyFactories.plinko.multipliers(risk, lines),
    queryFn: () => plinkoApi.getMultipliers(risk, lines),
  });
}
