"use client";

import styles from "./MobileMenu.module.scss";
import { cx } from "@/shared/utils/classNames";
import { Logo } from "@/shared/components/Logo";
import { LogoutIcon } from "@/shared/icons/logout";
import { Button } from "@/shared/components/Button";
import { InvertoryIcon } from "@/shared/icons/invertory";
import { SettingsIcon } from "@/shared/icons/settings";
import { useLockBodyScroll } from "@/shared/hooks/useLockBodyScroll";

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
          aria-label="Close menu"
        >
          ×
        </button>

        <div>
          <div className={styles.mobileMenuHeader}>
            <Logo className={styles.mobileMenuLogo} />
          </div>

          <div className={styles.mobileMenuButtons}>
            <Button className={styles.mobileMenuButton}>
              <InvertoryIcon /> Invertory
            </Button>
            <Button className={styles.mobileMenuButton}>
              <SettingsIcon /> Settings
            </Button>
          </div>
        </div>

        <Button
          className={styles.logoutButton}
          stylesVariant="yellowGradient"
          onClick={handleLogout}
        >
          Logout <LogoutIcon />
        </Button>
      </div>
    </>
  );
}
