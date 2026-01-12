"use client";

import { Container } from "@/shared/components/Container";
import Image from "next/image";
import styles from "./Header.module.scss";
import { NavToggleIcon } from "@/shared/icons/nav-toggle";
import { useState } from "react";
import { MobileMenu } from "./mobile-menu/MobileMenu";
import { Button } from "@/shared/components/Button";
import { SettingProfileIcon } from "@/shared/icons/setting-profile";
import { LogoutIcon } from "@/shared/icons/logout";
import { useLogout } from "@/config-api/session/useSession";
import { usePopup } from "@/app/providers/PopupProvider";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/shared/constants/routes";

export function Header() {
  const [menuVisibility, setMenuVisibility] = useState<"hidden" | "visible">(
    "hidden",
  );
  const { mutate: logoutMutation } = useLogout();
  const { showPopup } = usePopup();
  const router = useRouter();

  const handleToggleMenu = () => {
    setMenuVisibility((prev) => (prev === "hidden" ? "visible" : "hidden"));
  };

  const closeMenu = () => setMenuVisibility("hidden");

  const handleLogout = () => {
    logoutMutation(undefined, {
      onSuccess: () => {
        showPopup({ message: "Logout successful", type: "success" });
        router.push(ROUTES.LOGIN);
      },
      onError: (error) => {
        showPopup({
          message: error.message || "Logout failed",
          type: "error",
        });
      },
    });
  };

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

            <Button
              className={styles.toggleMenuButton}
              onClick={handleToggleMenu}
            >
              <NavToggleIcon />
            </Button>

            <div className={styles.userInfo}>
              <div className={styles.userInfoContent}>
                <div className={styles.balance}>
                  <Image
                    src="/images/common/dollar.svg"
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
              </div>

              <div className={styles.groupButtons}>
                <Button className={styles.profileButton}>
                  <SettingProfileIcon />
                </Button>
                <Button
                  className={styles.logoutButton}
                  stylesVariant="yellowGradient"
                  onClick={handleLogout}
                >
                  Logout <LogoutIcon />
                </Button>
              </div>
            </div>
          </div>
        </Container>
      </header>

      <MobileMenu
        menuVisibility={menuVisibility}
        toggleMenu={handleToggleMenu}
        closeMenu={closeMenu}
      />
    </>
  );
}
