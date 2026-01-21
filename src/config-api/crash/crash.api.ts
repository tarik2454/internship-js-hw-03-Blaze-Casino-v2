import { api } from "../axios";
import { CRASH_ROUTES } from "./crash.constants";
import {
  CrashBetResponse,
  CrashHistoryResponse,
  CrashBetRequest,
  CrashCashoutResponse,
  CrashCurrentResponse,
} from "./crash.types";

export const crashApi = {
  getHistory: async (
    limit: number = 10,
    offset: number = 0,
    token?: string,
  ): Promise<CrashHistoryResponse> => {
    const config = {
      params: { limit, offset },
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    };

    const { data } = await api.get<CrashHistoryResponse>(
      CRASH_ROUTES.GET_HISTORY,
      config,
    );
    return data;
  },

  postBet: async (
    dto: CrashBetRequest,
    token?: string,
  ): Promise<CrashBetResponse> => {
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};

    const { data } = await api.post<CrashBetResponse>(
      CRASH_ROUTES.POST_BET,
      dto,
      config,
    );
    return data;
  },

  postCashout: async (
    betId: string,
    token?: string,
  ): Promise<CrashCashoutResponse> => {
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};

    const { data } = await api.post<CrashCashoutResponse>(
      CRASH_ROUTES.POST_CASHOUT,
      { betId },
      config,
    );
    return data;
  },

  getCurrent: async (token?: string): Promise<CrashCurrentResponse> => {
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};

    const { data } = await api.get<CrashCurrentResponse>(
      CRASH_ROUTES.GET_CURRENT,
      config,
    );
    return data;
  },
};
