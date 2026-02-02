import { useMutation, useQuery } from "@tanstack/react-query";
import { ApiError } from "../error.types";
import { queryKeyFactories } from "../keys";
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
  });
}
