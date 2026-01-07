import { useMutation } from "@tanstack/react-query";
import { authApi } from "../api/auth.api";
import { RegisterResponse, RegisterSchemaDto } from "../schemas/auth.schema";

export const useRegister = () => {
  return useMutation<RegisterResponse, Error, RegisterSchemaDto>({
    mutationKey: ["register"],
    mutationFn: (data: RegisterSchemaDto) => authApi.register(data),
  });
};
