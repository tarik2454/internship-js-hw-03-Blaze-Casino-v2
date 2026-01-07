"use client";

import { FormEvent, useState } from "react";
import { Input } from "@/shared/components/Input";
import styles from "./AuthForm.module.scss";

interface AuthFormProps {
  mode: "login" | "register";
  onSubmit: (data: {
    email: string;
    password: string;
    username?: string;
  }) => void;
}

export default function AuthForm({ mode, onSubmit }: AuthFormProps) {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    onSubmit({
      email,
      password,
      username,
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <h1>{mode === "login" ? "Login" : "Register"}</h1>

      {mode === "register" && (
        <Input
          label="Username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          type="text"
          placeholder="Enter username"
          stylesVariant="authInput"
          labelClassName={styles.label}
        />
      )}

      <Input
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        stylesVariant="authInput"
        placeholder="Enter email"
        labelClassName={styles.label}
      />

      <Input
        label="Password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        stylesVariant="authInput"
        placeholder="Enter password"
        labelClassName={styles.label}
      />
    </form>
  );
}
