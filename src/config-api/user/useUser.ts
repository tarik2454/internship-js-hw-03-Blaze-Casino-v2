import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { userApi } from "./user.api";
import { queryKeyFactories } from "../keys";
import { ApiError } from "../error.types";
import {
  CurrentUserResponse,
  UpdateUserRequest,
  UpdateUserResponse,
  UserListResponse,
} from "./user.types";

export function useCurrentUser() {
  return useQuery<CurrentUserResponse, ApiError>({
    queryKey: queryKeyFactories.user.current(),
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

export function useUpdateCurrentUser() {
  const queryClient = useQueryClient();

  return useMutation<UpdateUserResponse, ApiError, UpdateUserRequest>({
    mutationFn: (dto) => userApi.updateCurrentUser(dto),
    onSuccess: (data) => {
      queryClient.setQueryData(queryKeyFactories.user.current(), data);
    },
  });
}
