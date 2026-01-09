"use client";

import { AuthForm } from "@/module/auth/components/AuthForm";
import { AuthContent } from "@/module/auth/components/AuthContent";
import { useRegister } from "@/module/session/useSession";
import { RegisterSchemaDto } from "@/module/auth/auth.schema";
import { useRouter } from "next/navigation";
import { usePopup } from "@/app/providers/PopupProvider";
import {
  SESSION_MODE,
  SESSION_ROUTES,
} from "@/module/session/session.constants";

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
        router.push(SESSION_ROUTES.LOGIN);
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
    <AuthContent mode={SESSION_MODE.REGISTER}>
      <AuthForm mode={SESSION_MODE.REGISTER} onSubmit={handleSubmit} />
    </AuthContent>
  );
}
