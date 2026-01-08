"use client";

import { AuthForm } from "@/module/auth/components/AuthForm";
import { AuthContent } from "@/module/auth/components/AuthContent";
import { useRegister } from "@/module/auth/hooks/useRegister";
import { RegisterSchemaDto } from "@/module/auth/auth.schema";
import { toast } from "react-toastify";

import { useRouter } from "next/navigation";

export default function RegisterPage() {
  const { mutate: register } = useRegister();
  const router = useRouter();

  const handleSubmit = (data: RegisterSchemaDto) => {
    register(data, {
      onSuccess: () => {
        toast.success("Registration successful. Please login.");
        router.push("/auth/login");
      },
      onError: (error) => {
        toast.error(error.message || "Registration failed");
      },
    });
  };

  return (
    <AuthContent mode="register">
      <AuthForm mode="register" onSubmit={handleSubmit} />
    </AuthContent>
  );
}
