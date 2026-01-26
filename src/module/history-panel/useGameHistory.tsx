"use client";

import { crashApi } from "@/config-api/crash/crash.api";
import { usePathname } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { queryKeyFactories } from "@/config-api/keys";
import { ApiError } from "@/config-api/error.types";
import { CrashUserHistoryResponse } from "@/config-api/crash/crash.types";

type GameType = "crash" | "case" | "mines" | "plinko";

const PATH_TO_GAME: Record<string, GameType> = {
  "/crash": "crash",
  "/case": "case",
  "/mines": "mines",
  "/plinko": "plinko",
} as const;

export function useGameHistory(limit = 10, offset = 0) {
  const pathname = usePathname();
  const gameType = PATH_TO_GAME[pathname] || "crash";

  return useQuery<CrashUserHistoryResponse, ApiError>({
    queryKey: queryKeyFactories.crash.userHistory(limit, offset),
    queryFn: () => {
      switch (gameType) {
        case "crash":
          return crashApi.getUserHistory(limit, offset);
        case "case":
        // TODO: Implement history for other games
        case "mines":
        case "plinko":
          return crashApi.getUserHistory(limit, offset);
        default:
          return crashApi.getUserHistory(limit, offset);
      }
    },
    refetchOnWindowFocus: true,
  });
}
