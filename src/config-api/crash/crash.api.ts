import { api } from "../axios";
import { CRASH_ROUTES } from "./crash.constants";
import { CrashHistoryResponse } from "./crash.types";

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
};
