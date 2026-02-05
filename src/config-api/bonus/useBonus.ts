import { useMutation, useQuery } from "@tanstack/react-query";
import { queryKeyFactories } from "../keys";
import { bonusApi } from "./bonus.api";

export function useBonus() {
  return useQuery({
    queryKey: queryKeyFactories.bonus.status(),
    queryFn: () => bonusApi.getBonusStatus(),
  });
}

export function useClaimBonus() {
  return useMutation({
    mutationKey: queryKeyFactories.bonus.claim(),
    mutationFn: () => bonusApi.postClaimBonus(),
  });
}
