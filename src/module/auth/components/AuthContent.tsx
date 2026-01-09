import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./AuthContent.module.scss";
import { SessionMode } from "@/module/session/session.constants";
import { SESSION_MODE } from "@/module/session/session.constants";
import { ROUTES } from "@/shared/constants/routes";

export function AuthContent({
  mode,
  children,
}: {
  mode: SessionMode;
  children: ReactNode;
}) {
  return (
    <div className={styles.container}>
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
          {mode === SESSION_MODE.LOGIN ? (
            <Link href={ROUTES.REGISTER} className={styles.footerLink}>
              Don&apos;t have an account? Register
            </Link>
          ) : (
            <Link href={ROUTES.LOGIN} className={styles.footerLink}>
              Already have an account? Login
            </Link>
          )}

          <span className={styles.footerText}>
            Your account data is stored locally in your browser
          </span>
        </p>
      </div>
    </div>
  );
}
