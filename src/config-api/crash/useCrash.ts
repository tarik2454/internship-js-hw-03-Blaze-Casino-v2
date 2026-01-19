import { queryKeyFactories } from "../keys";
import { crashApi } from "./crash.api";
import { useQuery } from "@tanstack/react-query";
import { ApiError } from "../error.types";
import { CrashHistoryResponse } from "./crash.types";

export function useCrash() {
  return useQuery<CrashHistoryResponse, ApiError>({
    queryKey: queryKeyFactories.crash.history(10, 0),
    queryFn: () => crashApi.getHistory(10, 0),
  });
}
