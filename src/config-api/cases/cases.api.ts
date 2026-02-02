import { api } from "../axios";
import { createAuthConfig } from "../api.utils";
import {
  CaseOpeningResponse,
  CaseResponse,
  CaseUserHistoryResponse,
  CasesResponse,
} from "./cases.types";
import { CASES_ROUTES } from "./cases.constants";

export const casesApi = {
  getCases: async (token?: string): Promise<CasesResponse> => {
    const { data } = await api.get<CasesResponse>(
      CASES_ROUTES.GET_CASES,
      createAuthConfig(token),
    );
    return data;
  },

  getCase: async (id: string, token?: string): Promise<CaseResponse> => {
    const url = CASES_ROUTES.GET_CASE.replace(":id", id);

    const { data } = await api.get<CaseResponse>(url, createAuthConfig(token));
    return data;
  },

  postOpenCase: async (
    id: string,
    body: {
      clientSeed?: string;
    },
    token?: string,
  ): Promise<CaseOpeningResponse> => {
    const url = CASES_ROUTES.POST_OPEN_CASE.replace(":id", id);

    const { data } = await api.post<CaseOpeningResponse>(
      url,
      body,
      createAuthConfig(token),
    );
    return data;
  },

  getUserHistory: async (
    limit: number = 10,
    offset: number = 0,
    token?: string,
  ): Promise<CaseUserHistoryResponse> => {
    const { data } = await api.get<CaseUserHistoryResponse>(
      CASES_ROUTES.GET_USER_HISTORY,
      createAuthConfig(token, { params: { limit, offset } }),
    );
    return data;
  },
};
