import { api } from "../axios";
import { CRASH_ROUTES } from "./crash.constants";
import {
  CrashBetResponse,
  CrashUserHistoryResponse,
  CrashBetRequest,
  CrashCashoutResponse,
  CrashCurrentResponse,
} from "./crash.types";

export const crashApi = {
  getUserHistory: async (
    limit: number = 10,
    offset: number = 0,
    token?: string,
  ): Promise<CrashUserHistoryResponse> => {
    const config = {
      params: { limit, offset },
      ...(token ? { headers: { Authorization: `Bearer ${token}` } } : {}),
    };

    const { data } = await api.get<CrashUserHistoryResponse>(
      CRASH_ROUTES.GET_USER_HISTORY,
      config,
    );
    return data;
  },

  postBet: async (
    betData: CrashBetRequest,
    token?: string,
  ): Promise<CrashBetResponse> => {
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};

    const { data } = await api.post<CrashBetResponse>(
      CRASH_ROUTES.POST_BET,
      betData,
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
