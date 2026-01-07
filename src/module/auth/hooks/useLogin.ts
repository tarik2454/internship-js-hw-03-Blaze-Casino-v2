import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { LoginResponse, LoginSchemaDto } from "../schemas/auth.schema";
import { queryKeys } from "@/shared/api/keys";
import { ApiError } from "@/shared/api/error.types";

export function useLogin() {
  return useMutation<LoginResponse, ApiError, LoginSchemaDto>({
    mutationKey: queryKeys.auth.login,
    mutationFn: (data: LoginSchemaDto) => authApi.login(data),
  });
}
