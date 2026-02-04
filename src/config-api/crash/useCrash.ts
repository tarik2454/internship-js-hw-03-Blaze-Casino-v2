import { queryKeyFactories, queryKeys } from "../keys";
import { crashApi } from "./crash.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "../error.types";
import {
  CrashBetRequest,
  CrashBetResponse,
  CrashCashoutResponse,
  CrashCurrentResponse,
} from "./crash.types";

export function useCrashBet() {
  const queryClient = useQueryClient();

  return useMutation<CrashBetResponse, ApiError, CrashBetRequest>({
    mutationFn: (body: CrashBetRequest) => crashApi.postBet(body),
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
