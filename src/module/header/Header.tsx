"use client";

import { Container } from "@/shared/components/Container";
import Image from "next/image";
import styles from "./Header.module.scss";
import { NavToggleIcon } from "@/shared/icons/nav-toggle";
import { useEffect, useRef, useState } from "react";
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
import { SettingsMenu } from "./components/SettingsMenu";
import { getTranslations } from "@/i18n";
import { useSound } from "@/shared/hooks/useSound";

export function Header() {
  const [isVisible, setIsVisible] = useState(false);
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);

  const { showPopup } = usePopup();
  const router = useRouter();

  const { locale, setLocale } = useLocale();
  const t = getTranslations(locale);

  const { mutate: logoutMutation } = useLogout();
  const { data: leaderboardData } = useLeaderboard();
  const { data: userData } = useCurrentUser();

  const settingsButtonRef = useRef<HTMLButtonElement>(null);

  const { playSound } = useSound();
  const prevBalanceRef = useRef<number | undefined>(undefined);

  useEffect(() => {
    if (userData?.balance === undefined) return;
    if (
      prevBalanceRef.current !== undefined &&
      userData.balance > prevBalanceRef.current
    ) {
      playSound("addingMoney");
    }
    prevBalanceRef.current = userData.balance;
  }, [userData?.balance, playSound]);

  const currentUserAvatar =
    userData?.avatarURL || leaderboardData?.currentUser?.avatarURL;

  const handleToggleMenu = () => {
    setIsVisible(!isVisible);
  };

  const closeMenu = () => setIsVisible(false);

  const handleLogout = () => {
    logoutMutation(undefined, {
      onSuccess: () => {
        showPopup({ message: t.header.logoutSuccess, type: "success" });
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
                    alt={t.accessibility.dollar}
                    width={24}
                    height={24}
                  />

                  <span>
                    {userData?.balance !== undefined
                      ? userData.balance
                          .toLocaleString("en-US", { useGrouping: true })
                          .replace(/,/g, ".")
                      : "0"}
                  </span>
                </div>
                <Link href={ROUTES.PROFILE} className={styles.profileLink}>
                  {currentUserAvatar ? (
                    <Image
                      src={currentUserAvatar}
                      alt={t.accessibility.userAvatar}
                      width={40}
                      height={40}
                      className={styles.userAvatar}
                    />
                  ) : (
                    <Image
                      src="/images/header/user.svg"
                      alt={t.accessibility.userAvatar}
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
                    <SettingsMenu
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
                  {t.header.logout} <LogoutIcon />
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
