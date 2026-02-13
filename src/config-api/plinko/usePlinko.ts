import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "../error.types";
import { queryKeyFactories } from "../keys";
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

export function usePlinkoDrop() {
  const queryClient = useQueryClient();

  return useMutation<PlinkoDropResponse, ApiError, PlinkoDropRequest>({
    mutationFn: (body: PlinkoDropRequest) => plinkoApi.postBet(body),
    onSuccess: (response, variables) => {
      const newHistoryItem: PlinkoDrop = {
        _id: response.drops[0]?.dropId ?? "",
        betAmount: response.totalBet,
        ballsCount: variables.balls,
        riskLevel: variables.risk,
        linesCount: variables.lines,
        totalWin: response.totalWin,
        avgMultiplier:
          response.totalBet === 0
            ? "0.00"
            : (response.totalWin / response.totalBet).toFixed(2),
        status: response.totalWin >= response.totalBet ? "won" : "lost",
        createdAt: new Date().toISOString(),
      };

      queryClient.setQueryData<PlinkoUserHistoryResponse>(
        queryKeyFactories.plinko.userHistory(),
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
