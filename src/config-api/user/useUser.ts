import { useQuery } from "@tanstack/react-query";
import { userApi } from "./user.api";
import { queryKeys } from "../keys";
import { ApiError } from "../error.types";
import { CurrentUserResponse, UserListResponse } from "./user.types";

export function useCurrentUser() {
  return useQuery<CurrentUserResponse, ApiError>({
    queryKey: queryKeys.user,
    queryFn: () => userApi.getCurrentUser(),
    retry: false,
  });
}

export function useUsers() {
  return useQuery<UserListResponse, ApiError>({
    queryKey: ["users", "list"],
    queryFn: () => userApi.getUsers(),
  });
}
