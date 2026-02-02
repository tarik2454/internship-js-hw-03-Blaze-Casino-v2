import { api } from "../axios";
import { createAuthConfig } from "../api.utils";
import { PLINKO_ROUTES } from "./plinko.constants";
import {
  PlinkoDropRequest,
  PlinkoDropResponse,
  PlinkoUserHistoryResponse,
  PlinkoMultipliersResponse,
  RiskLevel,
  LinesCount,
} from "./plinko.types";

export const plinkoApi = {
  getUserHistory: async (
    limit: number = 10,
    offset: number = 0,
    token?: string,
  ): Promise<PlinkoUserHistoryResponse> => {
    const { data } = await api.get<PlinkoUserHistoryResponse>(
      PLINKO_ROUTES.GET_USER_HISTORY,
      createAuthConfig(token, { params: { limit, offset } }),
    );
    return data;
  },

  postBet: async (payload: PlinkoDropRequest): Promise<PlinkoDropResponse> => {
    const { data } = await api.post<PlinkoDropResponse>(
      PLINKO_ROUTES.POST_DROP,
      payload,
    );
    return data;
  },

  getMultipliers: async (
    risk: RiskLevel,
    lines: LinesCount,
  ): Promise<PlinkoMultipliersResponse> => {
    const { data } = await api.get<PlinkoMultipliersResponse>(
      PLINKO_ROUTES.GET_MULTIPLIERS,
      { params: { risk, lines } },
    );
    return data;
  },
};
