import { api } from "@/shared/api/axios";
import { LoginResponse, RegisterResponse } from "./auth.types";
import { LoginSchemaDto, RegisterSchemaDto } from "./auth.schema";

export const authApi = {
  login: async (dto: LoginSchemaDto): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>("/auth/login", dto);

    if (data.accessToken) {
      localStorage.setItem("accessToken", data.accessToken);
    }
    return data;
  },

  register: async (dto: RegisterSchemaDto): Promise<RegisterResponse> => {
    const { data } = await api.post<RegisterResponse>("/auth/register", dto);
    return data;
  },
};
