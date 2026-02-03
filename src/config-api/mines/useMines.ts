//

import { queryKeyFactories, queryKeys } from "../keys";
import { minesApi } from "./mines.api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ApiError } from "../error.types";
import {
  MinesStartRequest,
  MinesStartResponse,
  MinesRevealRequest,
  MinesRevealResponse,
  MinesCashoutRequest,
  MinesCashoutResponse,
  MinesActiveResponse,
} from "./mines.types";

export function useMinesStart() {
  const queryClient = useQueryClient();

  return useMutation<MinesStartResponse, ApiError, MinesStartRequest>({
    mutationFn: (body) => minesApi.postStart(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactories.mines.active(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
      queryClient.invalidateQueries({
        queryKey: queryKeyFactories.mines.userHistory(10, 0),
      });
    },
  });
}

export function useMinesReveal() {
  const queryClient = useQueryClient();

  return useMutation<MinesRevealResponse, ApiError, MinesRevealRequest>({
    mutationFn: (body) => minesApi.postReveal(body),
    onSuccess: (data) => {
      if (data.isMine) {
        queryClient.invalidateQueries({
          queryKey: queryKeyFactories.mines.active(),
        });
        queryClient.invalidateQueries({ queryKey: queryKeys.user });
        queryClient.invalidateQueries({
          queryKey: queryKeyFactories.mines.userHistory(10, 0),
        });
      } else {
        queryClient.setQueryData<MinesActiveResponse>(
          queryKeyFactories.mines.active(),
          (old) => {
            if (!old?.game) return old;
            const nextRevealed =
              data.revealedTiles ??
              [...(old.game.revealedPositions ?? []), data.position].filter(
                (p, i, arr) => arr.indexOf(p) === i,
              );
            return {
              ...old,
              game: {
                ...old.game,
                revealedPositions: nextRevealed,
                currentMultiplier: data.currentMultiplier,
                currentValue: data.currentValue,
              },
            };
          },
        );
        queryClient.invalidateQueries({ queryKey: queryKeys.user });
      }
    },
  });
}

export function useMinesCashout() {
  const queryClient = useQueryClient();

  return useMutation<MinesCashoutResponse, ApiError, MinesCashoutRequest>({
    mutationFn: (body) => minesApi.postCashout(body),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeyFactories.mines.active(),
      });
      queryClient.invalidateQueries({ queryKey: queryKeys.user });
      queryClient.invalidateQueries({
        queryKey: queryKeyFactories.mines.userHistory(10, 0),
      });
    },
  });
}

export function useMinesActive() {
  return useQuery<MinesActiveResponse, ApiError>({
    queryKey: queryKeyFactories.mines.active(),
    queryFn: () => minesApi.getActive(),
  });
}
