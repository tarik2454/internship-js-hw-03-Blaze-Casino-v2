import { queryKeyFactories, queryKeys } from "../keys";
import { crashApi } from "./crash.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "../error.types";
import {
  CrashBetRequest,
  CrashBetResponse,
  CrashCashoutResponse,
  CrashCurrentResponse,
  CrashUserHistoryResponse,
} from "./crash.types";

export function useCrashUserHistory(limit: number = 10, offset: number = 0) {
  return useQuery<CrashUserHistoryResponse, ApiError>({
    queryKey: queryKeyFactories.crash.userHistory(limit, offset),
    queryFn: () => crashApi.getUserHistory(limit, offset),
  });
}

export function useCrashBet() {
  const queryClient = useQueryClient();

  return useMutation<CrashBetResponse, ApiError, CrashBetRequest>({
    mutationFn: (betData: CrashBetRequest) => crashApi.postBet(betData),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactories.crash.userHistory(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeyFactories.crash.getCurrent(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.user,
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
        queryKey: queryKeyFactories.crash.userHistory(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeyFactories.crash.getCurrent(),
      });
      queryClient.invalidateQueries({
        queryKey: queryKeys.user,
      });
    },
  });
}
