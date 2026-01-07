"use client";

import AuthForm from "@/module/auth-page/AuthForm";

export default function RegisterPage() {
  const handleSubmit = (data: {
    username?: string;
    email: string;
    password: string;
  }) => {
    console.log(data);
  };

  return (
    <div>
      <AuthForm mode="register" onSubmit={handleSubmit} />
    </div>
  );
}
