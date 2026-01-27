import { useMutation, useQueryClient, useQuery } from "@tanstack/react-query";
import { ApiError } from "../error.types";
import { queryKeyFactories, queryKeys } from "../keys";
import { plinkoApi } from "./plinko.api";
import {
  LinesCount,
  PlinkoDropRequest,
  PlinkoDropResponse,
  PlinkoMultipliersResponse,
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
      queryClient.invalidateQueries({
        queryKey: queryKeys.user,
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
