// Header.tsx
"use client";

import { Container } from "@/shared/components/Container";
import Image from "next/image";
import styles from "./Header.module.scss";
import { NavToggle } from "@/shared/icons/nav-toggle";
import { useState } from "react";
import { ToggleMenu } from "./toggle-menu/ToggleMenu";

export function Header() {
  const [menuVisibility, setMenuVisibility] = useState<"hidden" | "visible">(
    "hidden",
  );

  const toggleMenu = () => {
    setMenuVisibility((prev) => (prev === "hidden" ? "visible" : "hidden"));
  };

  const closeMenu = () => setMenuVisibility("hidden");

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.headerContent}>
          <div className={styles.headerLeft}>
            <div className={styles.headerLeftLogo}>
              <Image
                src="/images/logo/logo-register.svg"
                alt="Blaze Casino"
                width={100}
                height={100}
              />
            </div>
            <button onClick={toggleMenu}>
              <NavToggle />
            </button>
          </div>
        </div>
      </Container>

      <ToggleMenu
        menuVisibility={menuVisibility}
        toggleMenu={toggleMenu}
        closeMenu={closeMenu}
      />
    </header>
  );
}
