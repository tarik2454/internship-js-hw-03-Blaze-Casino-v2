import { useMutation } from "@tanstack/react-query";
import { sessionApi } from "./session.api";
import { LoginSchemaDto, RegisterSchemaDto } from "../auth/auth.schema";
import { queryKeys } from "@/config-api/keys";
import { ApiError } from "@/config-api/error.types";
import { LoginResponse, RegisterResponse } from "./session.types";

export function useLogin() {
  return useMutation<LoginResponse, ApiError, LoginSchemaDto>({
    mutationKey: queryKeys.auth.login,
    mutationFn: (data: LoginSchemaDto) => sessionApi.login(data),
  });
}

export function useRegister() {
  return useMutation<RegisterResponse, ApiError, RegisterSchemaDto>({
    mutationKey: queryKeys.auth.register,
    mutationFn: (data: RegisterSchemaDto) => sessionApi.register(data),
  });
}

export function useLogout() {
  return useMutation<void, ApiError>({
    mutationKey: queryKeys.auth.logout,
    mutationFn: () => sessionApi.logout(),
  });
}
