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
import { useLeaderboard } from "@/config-api/leaderboard/useLeaderboard";
import { Logo } from "@/shared/components/Logo";
import { useCurrentUser } from "@/config-api/user/useUser";
import Link from "next/link";

export function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const { showPopup } = usePopup();
  const router = useRouter();
  const { mutate: logoutMutation } = useLogout();
  const { data: leaderboardData } = useLeaderboard();
  const { data: userData } = useCurrentUser();

  const currentUserAvatar =
    userData?.avatarURL || leaderboardData?.currentUser?.avatarURL;

  const handleToggleMenu = () => {
    setIsVisible(!isVisible);
  };

  const closeMenu = () => setIsVisible(false);

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
            <Link href={ROUTES.HOME} className={styles.headerLogo}>
              <Logo />
            </Link>

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

                  <span>
                    {userData?.balance !== undefined
                      ? userData.balance
                          .toLocaleString("en-US")
                          .replace(/,/g, ".")
                      : "0"}
                  </span>
                </div>
                {currentUserAvatar ? (
                  <Image
                    src={currentUserAvatar}
                    alt="User Avatar"
                    width={40}
                    height={40}
                    className={styles.userAvatar}
                  />
                ) : (
                  <Image
                    src="/images/header/user.svg"
                    alt="User Avatar"
                    width={32}
                    height={32}
                  />
                )}
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
        isVisible={isVisible}
        toggleMenu={handleToggleMenu}
        closeMenu={closeMenu}
        handleLogout={handleLogout}
      />
    </>
  );
}
