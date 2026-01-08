"use client";

import { AuthContent } from "@/module/auth/components/AuthContent";
import { AuthForm } from "@/module/auth/components/AuthForm";
import { useLogin } from "@/module/auth/hooks/useLogin";
import { LoginSchemaDto } from "@/module/auth/auth.schema";
import { toast } from "react-toastify";

import { useRouter } from "next/navigation";
import { AUTH_MODE } from "@/module/auth/auth.constants";

export default function LoginPage() {
  const { mutate: handleLogin } = useLogin();
  const router = useRouter();

  const handleSubmit = (data: LoginSchemaDto) => {
    handleLogin(data, {
      onSuccess: () => {
        toast.success("Login successful");
        router.push("/");
      },
      onError: (error) => {
        toast.error(error.message || "Login failed");
      },
    });
  };

  return (
    <AuthContent mode={AUTH_MODE.LOGIN}>
      <AuthForm mode={AUTH_MODE.LOGIN} onSubmit={handleSubmit} />
    </AuthContent>
  );
}
