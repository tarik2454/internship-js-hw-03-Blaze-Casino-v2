"use client";

import { Container } from "@/shared/components/Container";
import Link from "next/link";
import Image from "next/image";
import { ReactNode } from "react";
import { usePathname } from "next/navigation";

interface AuthPageLayoutProps {
  children: ReactNode;
}
export default function AuthLayout({ children }: AuthPageLayoutProps) {
  const pathname = usePathname();
  const mode = pathname?.includes("register") ? "register" : "login";

  return (
    <Container>
      <h1>Blaze Casino</h1>
      <p>{mode === "login" ? "Welcome back!" : "Create your account"}</p>

      <Image
        src="/images/logo/logo-register.svg"
        alt="Blaze Casino"
        width={64}
        height={64}
        priority
      />

      {children}

      <p>
        {mode === "login" ? (
          <Link href="/auth/register">
            Don&apos;t have an account? Register
          </Link>
        ) : (
          <Link href="/auth/login">Already have an account? Login</Link>
        )}
        <br />
        <span>Your account data is stored locally in your browser</span>
      </p>
    </Container>
  );
}
