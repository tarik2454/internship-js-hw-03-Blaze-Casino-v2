import { api } from "../axios";
import { createAuthConfig } from "../api.utils";
import { CRASH_ROUTES } from "./crash.constants";
import {
  CrashBetResponse,
  CrashUserHistoryResponse,
  CrashBetRequest,
  CrashCashoutResponse,
  CrashCurrentResponse,
} from "./crash.types";

export const crashApi = {
  postBet: async (
    body: CrashBetRequest,
    token?: string,
  ): Promise<CrashBetResponse> => {
    const { data } = await api.post<CrashBetResponse>(
      CRASH_ROUTES.POST_BET,
      body,
      createAuthConfig(token),
    );
    return data;
  },

  postCashout: async (
    betId: string,
    token?: string,
  ): Promise<CrashCashoutResponse> => {
    const { data } = await api.post<CrashCashoutResponse>(
      CRASH_ROUTES.POST_CASHOUT,
      { betId },
      createAuthConfig(token),
    );
    return data;
  },

  getCurrent: async (token?: string): Promise<CrashCurrentResponse> => {
    const { data } = await api.get<CrashCurrentResponse>(
      CRASH_ROUTES.GET_CURRENT,
      createAuthConfig(token),
    );
    return data;
  },

  getUserHistory: async (
    limit: number = 10,
    offset: number = 0,
    token?: string,
  ): Promise<CrashUserHistoryResponse> => {
    const { data } = await api.get<CrashUserHistoryResponse>(
      CRASH_ROUTES.GET_USER_HISTORY,
      createAuthConfig(token, { params: { limit, offset } }),
    );
    return data;
  },
};
