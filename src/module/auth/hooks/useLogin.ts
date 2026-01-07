import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { LoginResponse, LoginSchemaDto } from "../schemas/auth.schema";

export function useLogin() {
  return useMutation<LoginResponse, Error, LoginSchemaDto>({
    mutationKey: ["login"],
    mutationFn: (data: LoginSchemaDto) => authApi.login(data),
  });
}
