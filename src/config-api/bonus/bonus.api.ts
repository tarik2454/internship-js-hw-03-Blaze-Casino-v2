import { BONUS_ROUTES } from "./bonus.constants";
import { BonusStatusResponse, ClaimBonusResponse } from "./bonus.types";
import { api } from "../axios";
import { createAuthConfig } from "../api.utils";

export const bonusApi = {
  getBonusStatus: async (token?: string): Promise<BonusStatusResponse> => {
    const { data } = await api.get<BonusStatusResponse>(
      BONUS_ROUTES.GET_BONUS,
      createAuthConfig(token),
    );
    return data;
  },

  postClaimBonus: async (token?: string): Promise<ClaimBonusResponse> => {
    const { data } = await api.post<ClaimBonusResponse>(
      BONUS_ROUTES.CLAIM_BONUS,
      {},
      createAuthConfig(token),
    );
    return data;
  },
};
