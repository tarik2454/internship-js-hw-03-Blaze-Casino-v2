"use client";

import AuthForm from "@/module/auth-page/AuthForm";

export default function LoginPage() {
  const handleSubmit = (data: {
    username?: string;
    email: string;
    password: string;
  }) => {
    console.log(data);
  };

  return (
    <div>
      <AuthForm mode="login" onSubmit={handleSubmit} />
    </div>
  );
}
