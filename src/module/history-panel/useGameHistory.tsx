"use client";

import { crashApi } from "@/config-api/crash/crash.api";
import { plinkoApi } from "@/config-api/plinko/plinko.api";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { queryKeyFactories } from "@/config-api/keys";
import { ApiError } from "@/config-api/error.types";
import { PlinkoUserHistoryResponse } from "@/config-api/plinko/plinko.types";
import { CrashUserHistoryResponse } from "@/config-api/crash/crash.types";
import { casesApi } from "@/config-api/cases/cases.api";
import { CaseUserHistoryResponse } from "@/config-api/cases/cases.types";
import type { GameType } from "./historyPanel.types";

export type { GameType } from "./historyPanel.types";

export function useGameHistory(limit = 10, offset = 0) {
  const pathname = usePathname();
  let gameType: GameType = "crash";

  if (pathname?.includes("plinko")) {
    gameType = "plinko";
  } else if (pathname?.includes("cases")) {
    gameType = "cases";
  } else if (pathname?.includes("mines")) {
    gameType = "mines";
  }

  const queryKey =
    gameType === "crash"
      ? queryKeyFactories.crash.userHistory(limit, offset)
      : gameType === "cases"
        ? queryKeyFactories.cases.userHistory(limit, offset)
        : queryKeyFactories.plinko.userHistory(limit, offset);

  const { data, refetch } = useQuery<
    | CrashUserHistoryResponse
    | PlinkoUserHistoryResponse
    | CaseUserHistoryResponse,
    ApiError
  >({
    queryKey,
    queryFn: () => {
      switch (gameType) {
        case "crash":
          return crashApi.getUserHistory(limit, offset);
        case "plinko":
          return plinkoApi.getUserHistory(limit, offset);
        case "cases":
          return casesApi.getUserHistory(limit, offset);
        // TODO: Implement history for other games
        case "mines":
          return plinkoApi.getUserHistory(limit, offset);
        default:
          return crashApi.getUserHistory(limit, offset);
      }
    },
    refetchOnWindowFocus: true,
  });

  return { data, refetch, gameType };
}
