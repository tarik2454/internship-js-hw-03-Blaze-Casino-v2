import { useMutation } from "@tanstack/react-query";
import { authApi } from "../auth.api";
import { LoginSchemaDto } from "../auth.schema";
import { queryKeys } from "@/shared/api/keys";
import { ApiError } from "@/shared/api/error.types";
import { LoginResponse } from "../auth.types";

export function useLogin() {
  return useMutation<LoginResponse, ApiError, LoginSchemaDto>({
    mutationKey: queryKeys.auth.login,
    mutationFn: (data: LoginSchemaDto) => authApi.login(data),
  });
}
