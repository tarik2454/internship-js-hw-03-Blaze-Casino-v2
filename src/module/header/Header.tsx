// Header.tsx
"use client";

import { Container } from "@/shared/components/Container";
import Image from "next/image";
import styles from "./Header.module.scss";
import { NavToggleIcon } from "@/shared/icons/nav-toggle";
import { useState } from "react";
import { MobileMenu } from "./mobile-menu/MobileMenu";
import { Button } from "@/shared/components/Button";

export function Header() {
  const [menuVisibility, setMenuVisibility] = useState<"hidden" | "visible">(
    "hidden",
  );

  const toggleMenu = () => {
    setMenuVisibility((prev) => (prev === "hidden" ? "visible" : "hidden"));
  };

  const closeMenu = () => setMenuVisibility("hidden");

  return (
    <>
      <header className={styles.header}>
        <Container>
          <div className={styles.headerContent}>
            <div className={styles.headerLogo}>
              <span>Blaze</span>
              <Image
                src="/images/logo/logo-site.svg"
                alt="Blaze Casino"
                width={40}
                height={17}
              />
              <span>Casino</span>
            </div>

            <Button className={styles.toggleMenuButton} onClick={toggleMenu}>
              <NavToggleIcon />
            </Button>

            <div className={styles.balance}>
              <Image
                src="/images/header/dollar.svg"
                alt="Dollar"
                width={24}
                height={24}
              />
              <span>10.000</span>
            </div>

            <Image
              src="/images/header/user.svg"
              alt="User"
              width={32}
              height={32}
            />

            <div className={styles.groupButtons}>
              <Button className={styles.profileButton}>Profile</Button>
              <Button
                className={styles.logoutButton}
                stylesVariant="yellowGradient"
              >
                Logout
              </Button>
            </div>
          </div>
        </Container>
      </header>

      <MobileMenu
        menuVisibility={menuVisibility}
        toggleMenu={toggleMenu}
        closeMenu={closeMenu}
      />
    </>
  );
}
