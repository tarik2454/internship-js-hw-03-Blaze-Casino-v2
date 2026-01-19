import { api } from "@/config-api/axios";
import { LoginResponse, RegisterResponse } from "./session.types";
import { LoginSchemaDto, RegisterSchemaDto } from "@/module/auth/auth.schema";
import { SESSION_ROUTES } from "./session.constants";
import { deleteCookie, setCookie } from "@/config-api/cookies";

export const sessionApi = {
  login: async (dto: LoginSchemaDto): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>(SESSION_ROUTES.LOGIN, dto);

    if (data.accessToken) {
      setCookie("accessToken", data.accessToken);
    }
    if (data.refreshToken) {
      setCookie("refreshToken", data.refreshToken);
    }

    return data;
  },

  register: async (dto: RegisterSchemaDto): Promise<RegisterResponse> => {
    const { data } = await api.post<RegisterResponse>(
      SESSION_ROUTES.REGISTER,
      dto,
    );
    return data;
  },

  logout: async (): Promise<void> => {
    await api.post(SESSION_ROUTES.LOGOUT);
    deleteCookie("accessToken");
    deleteCookie("refreshToken");
  },
};
