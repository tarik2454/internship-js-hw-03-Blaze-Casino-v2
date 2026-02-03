"use client";

import { AuthForm } from "@/module/auth/components/AuthForm";
import { Auth } from "@/module/auth/Auth";
import { useRegister } from "@/config-api/session/useSession";
import { RegisterSchemaDto } from "@/module/auth/auth.schema";
import { useRouter } from "next/navigation";
import { usePopup } from "@/providers/PopupProvider";
import { SESSION_MODE } from "@/config-api/session/session.constants";
import { ROUTES } from "@/shared/constants/routes";

export default function RegisterPage() {
  const { mutate: handleRegister } = useRegister();
  const router = useRouter();
  const { showPopup } = usePopup();

  const handleSubmit = (data: RegisterSchemaDto) => {
    handleRegister(data, {
      onSuccess: () => {
        showPopup({
          message: "Registration successful. Please login.",
          type: "success",
        });
        router.push(ROUTES.LOGIN);
      },
    });
  };

  return (
    <Auth mode={SESSION_MODE.REGISTER}>
      <AuthForm mode={SESSION_MODE.REGISTER} onSubmit={handleSubmit} />
    </Auth>
  );
}
