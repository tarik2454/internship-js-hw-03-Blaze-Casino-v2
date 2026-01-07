import { ReactNode } from "react";
import { Container } from "@/shared/components/Container";
import Image from "next/image";
import Link from "next/link";
import styles from "./AuthContent.module.scss";

interface AuthContentProps {
  mode: "login" | "register";
  children: ReactNode;
}

export function AuthContent({ mode, children }: AuthContentProps) {
  return (
    <Container>
      <div className={styles.content}>
        <Image
          src="/images/logo/logo-register.svg"
          alt="Blaze Casino"
          width={64}
          height={64}
          priority
          className={styles.logo}
        />

        <h1 className={styles.title}>Blaze Casino</h1>
        <p className={styles.description}>Welcome back!</p>

        {children}

        <p className={styles.footer}>
          {mode === "login" ? (
            <Link href="/auth/register">
              Don&apos;t have an account? Register
            </Link>
          ) : (
            <Link href="/auth/login">Already have an account? Login</Link>
          )}
          <br />
          <span className={styles.footerText}>
            Your account data is stored locally in your browser
          </span>
        </p>
      </div>
    </Container>
  );
}
