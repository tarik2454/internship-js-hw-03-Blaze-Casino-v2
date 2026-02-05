"use client";

import { Container } from "@/shared/components/Container";
import Image from "next/image";
import styles from "./Header.module.scss";
import { NavToggleIcon } from "@/shared/icons/nav-toggle";
import { useRef, useState } from "react";
import { MobileMenu } from "./components/MobileMenu";
import { Button } from "@/shared/components/Button";
import { LogoutIcon } from "@/shared/icons/logout";
import { useLogout } from "@/config-api/session/useSession";
import { usePopup } from "@/providers/PopupProvider";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/shared/constants/routes";
import { useLeaderboard } from "@/config-api/leaderboard/useLeaderboard";
import { Logo } from "@/shared/components/Logo";
import { useCurrentUser } from "@/config-api/user/useUser";
import Link from "next/link";
import { useLocale, type Locale } from "@/providers/LocaleProvider";
import { SettingsIcon } from "@/shared/icons/settings";
import { LanguageMenu } from "./components/LanguageMenu";

export function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  const { showPopup } = usePopup();
  const router = useRouter();
  const { mutate: logoutMutation } = useLogout();
  const { data: leaderboardData } = useLeaderboard();
  const { data: userData } = useCurrentUser();
  const { locale, setLocale } = useLocale();

  const settingsButtonRef = useRef<HTMLButtonElement>(null);

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
    });
  };

  const handleToggleLanguageMenu = () => {
    setIsLanguageMenuOpen((prev) => !prev);
  };

  const handleSelectLanguage = (lang: Locale) => {
    setLocale(lang);
    setIsLanguageMenuOpen(false);
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
                <Link href={ROUTES.PROFILE} className={styles.profileLink}>
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
                </Link>
              </div>

              <div className={styles.groupButtons}>
                <div className={styles.settingsWrapper}>
                  <Button
                    ref={settingsButtonRef}
                    className={styles.settingsButton}
                    onClick={handleToggleLanguageMenu}
                  >
                    <SettingsIcon />
                  </Button>
                  {isLanguageMenuOpen && (
                    <LanguageMenu
                      currentLocale={locale}
                      onSelect={handleSelectLanguage}
                      onClose={() => setIsLanguageMenuOpen(false)}
                      triggerRef={settingsButtonRef}
                    />
                  )}
                </div>

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
