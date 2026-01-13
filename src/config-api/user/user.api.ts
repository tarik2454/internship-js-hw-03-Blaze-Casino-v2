import { api } from "../axios";
import { USER_ROUTES } from "./user.constants";
import { CurrentUserResponse, UserListResponse } from "./user.types";

export const userApi = {
  getCurrentUser: async (token?: string): Promise<CurrentUserResponse> => {
    const config = token
      ? { headers: { Authorization: `Bearer ${token}` } }
      : {};

    const { data } = await api.get<CurrentUserResponse>(
      USER_ROUTES.CURRENT,
      config,
    );
    return data;
  },

  getUsers: async (): Promise<UserListResponse> => {
    const { data } = await api.get<UserListResponse>(USER_ROUTES.ALL);
    return data;
  },
};
