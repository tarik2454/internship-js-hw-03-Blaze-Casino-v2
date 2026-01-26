import { api } from "../axios";
import { PLINKO_ROUTES } from "./plinko.constants";
import { PlinkoUserHistoryResponse } from "./plinko.types";

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
};
