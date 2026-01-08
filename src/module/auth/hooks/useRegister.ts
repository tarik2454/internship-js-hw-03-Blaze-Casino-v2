import { useMutation } from "@tanstack/react-query";
import { authApi } from "../auth.api";
import { RegisterSchemaDto } from "../auth.schema";
import { queryKeys } from "@/shared/api/keys";
import { ApiError } from "@/shared/api/error.types";
import { RegisterResponse } from "../auth.types";

export const useRegister = () => {
  return useMutation<RegisterResponse, ApiError, RegisterSchemaDto>({
    mutationKey: queryKeys.auth.register,
    mutationFn: (data: RegisterSchemaDto) => authApi.register(data),
  });
};
