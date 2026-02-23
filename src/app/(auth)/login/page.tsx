"use client";

import { Auth } from "@/module/auth/Auth";
import { AuthForm } from "@/module/auth/components/AuthForm";
import { useLogin } from "@/config-api/session/useSession";
import { LoginSchemaDto } from "@/module/auth/auth.schema";
import { useRouter } from "next/navigation";
import { SESSION_MODE } from "@/config-api/session/session.constants";
import { usePopup } from "@/providers/PopupProvider";
import { ROUTES } from "@/shared/constants/routes";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeyFactories } from "@/config-api/keys";
import { useLocale } from "@/providers/LocaleProvider";
import { getTranslations } from "@/i18n";

export default function LoginPage() {
  const { locale } = useLocale();
  const t = getTranslations(locale);
  const { mutate: handleLogin } = useLogin();
  const router = useRouter();
  const { showPopup } = usePopup();
  const queryClient = useQueryClient();

  const handleSubmit = (data: LoginSchemaDto) => {
    handleLogin(data, {
      onSuccess: () => {
        queryClient.invalidateQueries({
          queryKey: queryKeyFactories.user.current(),
        });
        showPopup({
          message: t.auth.loginSuccess,
          type: "success",
        });
        router.push(ROUTES.HOME);
      },
      onError: (error) => {
        showPopup({
          message: error.message || t.auth.loginError,
          type: "error",
        });
      },
    });
  };

  return (
    <Auth mode={SESSION_MODE.LOGIN}>
      <AuthForm
        key={SESSION_MODE.LOGIN}
        mode={SESSION_MODE.LOGIN}
        onSubmit={handleSubmit}
      />
    </Auth>
  );
}
