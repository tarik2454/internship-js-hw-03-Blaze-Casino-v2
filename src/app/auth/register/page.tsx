"use client";

import { AuthForm } from "@/module/auth/components/AuthForm";
import { AuthContent } from "@/module/auth/components/AuthContent";
import { useRegister } from "@/module/auth/hooks/useRegister";
import { RegisterSchemaDto } from "@/module/auth/auth.schema";
import { useRouter } from "next/navigation";
import { AUTH_ROUTES } from "@/module/auth/auth.routes";
import { AUTH_MODE } from "@/module/auth/auth.constants";
import { usePopup } from "@/app/providers/PopupProvider";

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
        router.push(AUTH_ROUTES.LOGIN);
      },
      onError: (error) => {
        showPopup({
          message: error.message || "Registration failed",
          type: "error",
        });
      },
    });
  };

  return (
    <AuthContent mode={AUTH_MODE.REGISTER}>
      <AuthForm mode={AUTH_MODE.REGISTER} onSubmit={handleSubmit} />
    </AuthContent>
  );
}
