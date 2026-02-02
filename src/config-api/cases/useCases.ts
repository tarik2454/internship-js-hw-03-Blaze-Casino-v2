import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "../error.types";
import { queryKeys, queryKeyFactories } from "../keys";
import type { CurrentUserResponse } from "../user/user.types";
import { casesApi } from "./cases.api";
import {
  CaseOpeningResponse,
  CaseResponse,
  CaseUserHistoryResponse,
  CasesResponse,
} from "./cases.types";

export function useCases() {
  return useQuery<CasesResponse, ApiError>({
    queryKey: queryKeyFactories.cases.all(),
    queryFn: () => casesApi.getCases(),
  });
}

export function useCase(id: string) {
  return useQuery<CaseResponse, ApiError>({
    queryKey: queryKeyFactories.cases.detail(id),
    queryFn: () => casesApi.getCase(id),
    enabled: !!id,
  });
}

export function useOpenCase() {
  const queryClient = useQueryClient();

  return useMutation<
    CaseOpeningResponse,
    ApiError,
    {
      id: string;
      clientSeed?: string;
    }
  >({
    mutationFn: ({ id, clientSeed }) =>
      casesApi.postOpenCase(id, { clientSeed }),
    onSuccess: (response) => {
      queryClient.setQueryData<CurrentUserResponse>(queryKeys.user, (old) =>
        old ? { ...old, balance: response.newBalance } : old,
      );
    },
  });
}
