"use client";

import { useState } from "react";
import AuthForm from "../../module/auth-page/AuthForm";
import styles from "./page.module.scss";
import { Container } from "@/shared/components/Container";
import Image from "next/image";
import Button from "@/shared/components/Button";

type Mode = "login" | "register";

export default function AuthPage() {
  const [mode, setMode] = useState<Mode>("login");

  const handleSwitch = () => {
    setMode((prev) => (prev === "login" ? "register" : "login"));
  };

  const handleSubmit = (data: {
    username?: string;
    email: string;
    password: string;
  }) => {
    console.log(mode, data);
  };

  return (
    <div className={styles.page}>
      <Container>
        <h1>Blaze Casino</h1>
        <p>Welcome back!</p>

        <Image
          src="/images/logo/logo-register.svg"
          alt="Blaze Casino"
          width={64}
          height={64}
          priority
          className={styles.logo}
        />

        <AuthForm mode={mode} onSubmit={handleSubmit} />

        <Button type="submit">{mode === "login" ? "Login" : "Register"}</Button>

        <p>
          {mode === "login" ? (
            <Button onClick={handleSwitch}>
              Don&apos;t have an account? Register
            </Button>
          ) : (
            <Button onClick={handleSwitch}>
              Already have an account? Login
            </Button>
          )}
          <br />
          <span>Your account data is stored locally in your browser</span>
        </p>
      </Container>
    </div>
  );
}
