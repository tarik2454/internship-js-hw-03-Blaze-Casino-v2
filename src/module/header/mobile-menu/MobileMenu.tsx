"use client";

import { useEffect } from "react";
import styles from "./MobileMenu.module.scss";
import { cx } from "@/shared/utils/classNames";

interface MobileMenuProps {
  menuVisibility: "hidden" | "visible";
  toggleMenu: () => void;
  closeMenu: () => void;
}

export function MobileMenu({
  menuVisibility,
  toggleMenu,
  closeMenu,
}: MobileMenuProps) {
  useEffect(() => {
    document.documentElement.style.overflow =
      menuVisibility === "visible" ? "hidden" : "auto";

    return () => {
      document.documentElement.style.overflow = "auto";
    };
  }, [menuVisibility]);

  return (
    <>
      <div
        className={cx(styles.overlay, {
          [styles.isVisible]: menuVisibility === "visible",
        })}
        onClick={closeMenu}
      />

      <div
        className={cx(styles.mobileMenuWrapper, {
          [styles.isOpen]: menuVisibility === "visible",
        })}
      >
        <button
          className={styles.closeMenuButton}
          onClick={toggleMenu}
          aria-label="Close menu"
        >
          ×
        </button>

        <div className={styles.mobileMenuContent}>
          <div className={styles.mobileMenuHeader}>
            <h2 className={styles.mobileMenuTitle}></h2>
          </div>
        </div>
      </div>
    </>
  );
}
