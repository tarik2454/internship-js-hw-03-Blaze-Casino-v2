// ToggleMenu.tsx
"use client";

import { useEffect } from "react";
import styles from "./ToggleMenu.module.scss";
import { cx } from "@/shared/utils/classNames";

interface ToggleMenuProps {
  menuVisibility: "hidden" | "visible";
  toggleMenu: () => void;
  closeMenu: () => void;
}

export function ToggleMenu({
  menuVisibility,
  toggleMenu,
  closeMenu,
}: ToggleMenuProps) {
  // Блокируем скролл при открытом меню
  useEffect(() => {
    document.documentElement.style.overflow =
      menuVisibility === "visible" ? "hidden" : "auto";

    return () => {
      document.documentElement.style.overflow = "auto";
    };
  }, [menuVisibility]);

  return (
    <>
      {/* Overlay */}
      <div
        className={cx(styles.overlay, {
          [styles.visible]: menuVisibility === "visible",
        })}
        onClick={closeMenu}
      />

      {/* Side menu */}
      <div
        className={cx(styles.toggleMenu, {
          [styles.open]: menuVisibility === "visible",
        })}
      >
        <button
          className={styles.toggleMenuButton}
          onClick={toggleMenu}
          aria-label="Close menu"
        >
          ×
        </button>

        <div className={styles.toggleMenuContent}>
          <div className={styles.toggleMenuHeader}>
            <h2 className={styles.toggleMenuTitle}>Menu</h2>
          </div>
          {/* Здесь можно добавить пункты меню */}
        </div>
      </div>
    </>
  );
}
