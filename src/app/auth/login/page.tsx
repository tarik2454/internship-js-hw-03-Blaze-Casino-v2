"use client";

import { AuthContent } from "@/module/auth/components/AuthContent";
import { AuthForm } from "@/module/auth/components/AuthForm";
import { useLogin } from "@/module/session/useSession";
import { LoginSchemaDto } from "@/module/auth/auth.schema";
import { useRouter } from "next/navigation";
import { SESSION_MODE } from "@/module/session/session.constants";
import { usePopup } from "@/app/providers/PopupProvider";

export default function LoginPage() {
  const { mutate: handleLogin } = useLogin();
  const router = useRouter();
  const { showPopup } = usePopup();

  const handleSubmit = (data: LoginSchemaDto) => {
    handleLogin(data, {
      onSuccess: () => {
        showPopup({
          message: "Login successful",
          type: "success",
        });
        router.push("/");
      },
      onError: (error) => {
        console.log(error);
        showPopup({
          message: error?.message || "Login failed",
          type: "error",
        });
      },
    });
  };

  return (
    <AuthContent mode={SESSION_MODE.LOGIN}>
      <AuthForm mode={SESSION_MODE.LOGIN} onSubmit={handleSubmit} />
    </AuthContent>
  );
}
