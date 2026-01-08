"use client";

import { AuthForm } from "@/module/auth/components/AuthForm";
import { AuthContent } from "@/module/auth/components/AuthContent";
import { useRegister } from "@/module/auth/hooks/useRegister";
import { RegisterSchemaDto } from "@/module/auth/auth.schema";
import { toast } from "react-toastify";
import { useRouter } from "next/navigation";
import { AUTH_ROUTES } from "@/module/auth/auth.routes";
import { AUTH_MODE } from "@/module/auth/auth.constants";

export default function RegisterPage() {
  const { mutate: handleRegister } = useRegister();
  const router = useRouter();

  const handleSubmit = (data: RegisterSchemaDto) => {
    handleRegister(data, {
      onSuccess: () => {
        toast.success("Registration successful. Please login.");
        router.push(AUTH_ROUTES.LOGIN);
      },
      onError: (error) => {
        toast.error(error.message || "Registration failed");
      },
    });
  };

  return (
    <AuthContent mode={AUTH_MODE.REGISTER}>
      <AuthForm mode={AUTH_MODE.REGISTER} onSubmit={handleSubmit} />
    </AuthContent>
  );
}
