import { api } from "../axios";
import { PLINKO_ROUTES } from "./plinko.constants";
import {
  PlinkoDropRequest,
  PlinkoDropResponse,
  PlinkoUserHistoryResponse,
  PlinkoRecentHistoryResponse, // Added import
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
    const config = {
      params: { limit, offset },
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    };

    const { data } = await api.get<PlinkoUserHistoryResponse>(
      PLINKO_ROUTES.GET_USER_HISTORY,
      config,
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

  getRecentGames: async (): Promise<PlinkoRecentHistoryResponse> => {
    const { data } = await api.get<PlinkoRecentHistoryResponse>(
      PLINKO_ROUTES.GET_RECENT,
    );
    return data;
  },
};
