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
  postBet: async (
    body: PlinkoDropRequest,
    token?: string,
  ): Promise<PlinkoDropResponse> => {
    const { data } = await api.post<PlinkoDropResponse>(
      PLINKO_ROUTES.POST_DROP,
      body,
      createAuthConfig(token),
    );
    return data;
  },

  getMultipliers: async (
    risk: RiskLevel,
    lines: LinesCount,
    token?: string,
  ): Promise<PlinkoMultipliersResponse> => {
    const { data } = await api.get<PlinkoMultipliersResponse>(
      PLINKO_ROUTES.GET_MULTIPLIERS,
      createAuthConfig(token, { params: { risk, lines } }),
    );
    return data;
  },

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
};
