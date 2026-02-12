"use client";

import { ReactNode } from "react";
import Image from "next/image";
import Link from "next/link";
import styles from "./Auth.module.scss";
import {
  SESSION_MODE,
  SessionMode,
} from "@/config-api/session/session.constants";
import { ROUTES } from "@/shared/constants/routes";
import { useLocale } from "@/providers/LocaleProvider";
import { getTranslations } from "@/i18n";

export function Auth({
  mode,
  children,
}: {
  mode: SessionMode;
  children: ReactNode;
}) {
  const { locale } = useLocale();
  const t = getTranslations(locale);

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <Image
          src="/images/logo/logo-register.svg"
          alt={t.auth.title}
          width={64}
          height={64}
          priority
          className={styles.logo}
        />

        <h1 className={styles.title}>{t.auth.title}</h1>
        <p className={styles.description}>{t.auth.welcomeBack}</p>

        {children}

        <p className={styles.footer}>
          {mode === SESSION_MODE.LOGIN ? (
            <Link href={ROUTES.REGISTER} className={styles.footerLink}>
              {t.auth.noAccount}
            </Link>
          ) : (
            <Link href={ROUTES.LOGIN} className={styles.footerLink}>
              {t.auth.hasAccount}
            </Link>
          )}
        </p>
      </div>
    </div>
  );
}
