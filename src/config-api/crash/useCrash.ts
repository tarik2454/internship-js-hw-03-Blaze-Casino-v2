import { queryKeyFactories } from "../keys";
import { crashApi } from "./crash.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "../error.types";
import {
  CrashBetRequest,
  CrashBetResponse,
  CrashCashoutResponse,
  CrashCurrentResponse,
  CrashHistoryResponse,
} from "./crash.types";

export function useCrashHistory() {
  return useQuery<CrashHistoryResponse, ApiError>({
    queryKey: queryKeyFactories.crash.history(10, 0),
    queryFn: () => crashApi.getHistory(10, 0),
  });
}

export function useCrashBet() {
  const queryClient = useQueryClient();

  return useMutation<CrashBetResponse, ApiError, CrashBetRequest>({
    mutationFn: (betData: CrashBetRequest) => crashApi.postBet(betData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactories.crash.history(),
      });
      // Обновить текущую игру (это обновит betId и состояние)
      queryClient.invalidateQueries({
        queryKey: queryKeyFactories.crash.getCurrent(),
      });
    },
  });
}

export function useCrashCurrent() {
  return useQuery<CrashCurrentResponse, ApiError>({
    queryKey: queryKeyFactories.crash.getCurrent(),
    queryFn: () => crashApi.getCurrent(),
  });
}

export function useCrashCashout() {
  const queryClient = useQueryClient();

  return useMutation<CrashCashoutResponse, ApiError, string>({
    mutationFn: (betId: string) => crashApi.postCashout(betId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactories.crash.history(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeyFactories.crash.getCurrent(),
      });
    },
  });
}
