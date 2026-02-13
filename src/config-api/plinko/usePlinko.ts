import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiError } from "../error.types";
import { queryKeyFactories } from "../keys";
import { plinkoApi } from "./plinko.api";
import {
  LinesCount,
  PlinkoDropRequest,
  PlinkoDropResponse,
  PlinkoMultipliersResponse,
  RiskLevel,
} from "./plinko.types";

export function usePlinkoDrop() {
  return useMutation<PlinkoDropResponse, ApiError, PlinkoDropRequest>({
    mutationFn: (body: PlinkoDropRequest) => plinkoApi.postBet(body),
  });
}

export function usePlinkoMultipliers(risk: RiskLevel, lines: LinesCount) {
  return useQuery<PlinkoMultipliersResponse, ApiError>({
    queryKey: queryKeyFactories.plinko.multipliers(risk, lines),
    queryFn: () => plinkoApi.getMultipliers(risk, lines),
  });
}
