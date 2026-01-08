"use client";

import { AuthContent } from "@/module/auth/components/AuthContent";
import { AuthForm } from "@/module/auth/components/AuthForm";
import { useLogin } from "@/module/auth/hooks/useLogin";
import { LoginSchemaDto } from "@/module/auth/auth.schema";
import { toast } from "react-toastify";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const { mutate: login } = useLogin();
  const router = useRouter();

  const handleSubmit = (data: LoginSchemaDto) => {
    login(data, {
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
    <AuthContent mode="login">
      <AuthForm mode="login" onSubmit={handleSubmit} />
    </AuthContent>
  );
}
