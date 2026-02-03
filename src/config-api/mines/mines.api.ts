//

import { api } from "../axios";
import { createAuthConfig } from "../api.utils";
import {
  MinesStartRequest,
  MinesStartResponse,
  MinesRevealRequest,
  MinesRevealResponse,
  MinesCashoutRequest,
  MinesCashoutResponse,
  MinesActiveResponse,
  MinesHistoryResponse,
} from "./mines.types";
import { MINES_ROUTES } from "./mines.constants";

export const minesApi = {
  postStart: async (
    body: MinesStartRequest,
    token?: string,
  ): Promise<MinesStartResponse> => {
    const { data } = await api.post<MinesStartResponse>(
      MINES_ROUTES.POST_START,
      body,
      createAuthConfig(token),
    );
    return data;
  },

  postReveal: async (
    body: MinesRevealRequest,
    token?: string,
  ): Promise<MinesRevealResponse> => {
    const { data } = await api.post<MinesRevealResponse>(
      MINES_ROUTES.POST_REVEAL,
      body,
      createAuthConfig(token),
    );
    return data;
  },

  postCashout: async (
    body: MinesCashoutRequest,
    token?: string,
  ): Promise<MinesCashoutResponse> => {
    const { data } = await api.post<MinesCashoutResponse>(
      MINES_ROUTES.POST_CASHOUT,
      body,
      createAuthConfig(token),
    );
    return data;
  },

  getActive: async (token?: string): Promise<MinesActiveResponse> => {
    const { data } = await api.get<MinesActiveResponse>(
      MINES_ROUTES.GET_ACTIVE,
      createAuthConfig(token),
    );
    return data;
  },

  getHistory: async (
    limit: number = 10,
    offset: number = 0,
    token?: string,
  ): Promise<MinesHistoryResponse> => {
    const { data } = await api.get<MinesHistoryResponse>(
      MINES_ROUTES.GET_HISTORY,
      createAuthConfig(token, { params: { limit, offset } }),
    );
    return data;
  },
};
