"use client";

import { Auth } from "@/module/auth/Auth";
import { AuthForm } from "@/module/auth/components/AuthForm";
import { useLogin } from "@/config-api/session/useSession";
import { LoginSchemaDto } from "@/module/auth/auth.schema";
import { useRouter } from "next/navigation";
import { SESSION_MODE } from "@/config-api/session/session.constants";
import { usePopup } from "@/app/providers/PopupProvider";
import { ROUTES } from "@/shared/constants/routes";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config-api/keys";

export default function LoginPage() {
  const { mutate: handleLogin } = useLogin();
  const router = useRouter();
  const { showPopup } = usePopup();
  const queryClient = useQueryClient();

  const handleSubmit = (data: LoginSchemaDto) => {
    handleLogin(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({ queryKey: queryKeys.user });
        showPopup({
          message: "Login successful",
          type: "success",
        });
        router.push(ROUTES.HOME);
      },
      onError: (error) => {
        showPopup({
          message: error?.message || "Login failed",
          type: "error",
        });
      },
    });
  };

  return (
    <Auth mode={SESSION_MODE.LOGIN}>
      <AuthForm mode={SESSION_MODE.LOGIN} onSubmit={handleSubmit} />
    </Auth>
  );
}
