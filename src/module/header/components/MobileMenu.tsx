"use client";

import { useRef, useState } from "react";
import styles from "./MobileMenu.module.scss";
import { cx } from "@/shared/utils/classNames";
import { Logo } from "@/shared/components/Logo";
import { LogoutIcon } from "@/shared/icons/logout";
import { Button } from "@/shared/components/Button";
import { InvertoryIcon } from "@/shared/icons/invertory";
import { SettingsIcon } from "@/shared/icons/settings";
import Link from "next/link";
import { useLockBodyScroll } from "@/shared/hooks/useLockBodyScroll";
import { useLocale, type Locale } from "@/providers/LocaleProvider";
import { getTranslations } from "@/i18n";
import { ROUTES } from "@/shared/constants/routes";
import { SettingsMenu } from "./SettingsMenu";

interface MobileMenuProps {
  isVisible: boolean;
  toggleMenu: () => void;
  closeMenu: () => void;
  handleLogout: () => void;
}

export function MobileMenu({
  isVisible,
  toggleMenu,
  closeMenu,
  handleLogout,
}: MobileMenuProps) {
  const { locale, setLocale } = useLocale();
  const t = getTranslations(locale);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const settingsButtonRef = useRef<HTMLButtonElement>(null);
  useLockBodyScroll(isVisible);

  return (
    <>
      <div
        className={cx(styles.overlay, {
          [styles.isVisible]: isVisible,
        })}
        onClick={closeMenu}
      />

      <div
        className={cx(styles.mobileMenuWrapper, {
          [styles.isVisible]: isVisible,
        })}
      >
        <button
          className={styles.closeMenuButton}
          onClick={toggleMenu}
          aria-label={t.accessibility.closeMenu}
        >
          ×
        </button>

        <div>
          <div className={styles.mobileMenuHeader}>
            <Logo className={styles.mobileMenuLogo} />
          </div>

          <div className={styles.mobileMenuButtons}>
            <Link
              href={ROUTES.PROFILE}
              className={styles.mobileMenuLink}
              onClick={closeMenu}
            >
              <InvertoryIcon /> {t.header.profile}
            </Link>

            <div className={styles.settingsWrapper}>
              <Button
                ref={settingsButtonRef}
                className={styles.mobileMenuButton}
                onClick={() => setIsSettingsOpen((prev) => !prev)}
              >
                <SettingsIcon /> {t.header.settings}
              </Button>
              {isSettingsOpen && (
                <SettingsMenu
                  currentLocale={locale}
                  onSelect={(lang: Locale) => {
                    setLocale(lang);
                    setIsSettingsOpen(false);
                  }}
                  onClose={() => setIsSettingsOpen(false)}
                  triggerRef={settingsButtonRef}
                />
              )}
            </div>
          </div>
        </div>

        <Button
          className={styles.logoutButton}
          stylesVariant="yellowGradient"
          onClick={handleLogout}
        >
          {t.header.logout} <LogoutIcon />
        </Button>
      </div>
    </>
  );
}
