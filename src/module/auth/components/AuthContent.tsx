import { ReactNode } from "react";
import { Container } from "@/shared/components/Container";
import Image from "next/image";
import Link from "next/link";
import styles from "./AuthContent.module.scss";
import { AUTH_MODE, AUTH_ROUTES, AuthMode } from "@/module/auth/auth.constants";

export function AuthContent({
  mode,
  children,
}: {
  mode: AuthMode;
  children: ReactNode;
}) {
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
          {mode === AUTH_MODE.LOGIN ? (
            <Link href={AUTH_ROUTES.REGISTER} className={styles.footerLink}>
              Don&apos;t have an account? Register
            </Link>
          ) : (
            <Link href={AUTH_ROUTES.LOGIN} className={styles.footerLink}>
              Already have an account? Login
            </Link>
          )}

          <span className={styles.footerText}>
            Your account data is stored locally in your browser
          </span>
        </p>
      </div>
    </Container>
  );
}
