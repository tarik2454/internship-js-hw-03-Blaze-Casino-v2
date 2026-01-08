import { useMutation } from "@tanstack/react-query";
import { authApi } from "../auth.api";
import { RegisterResponse, RegisterSchemaDto } from "../auth.schema";
import { queryKeys } from "@/shared/api/keys";
import { ApiError } from "@/shared/api/error.types";

export const useRegister = () => {
  return useMutation<RegisterResponse, ApiError, RegisterSchemaDto>({
    mutationKey: queryKeys.auth.register,
    mutationFn: (data: RegisterSchemaDto) => authApi.register(data),
  });
};
