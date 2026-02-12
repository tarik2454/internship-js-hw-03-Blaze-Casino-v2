"use client";

import { Section } from "@/shared/components/Section";
import { Container } from "@/shared/components/Container";
import { useCurrentUser } from "@/config-api/user/useUser";
import Image from "next/image";
import { useLocale } from "@/providers/LocaleProvider";
import { getTranslations } from "@/i18n";
import styles from "./Profile.module.scss";

export default function Profile() {
  const { locale } = useLocale();
  const t = getTranslations(locale);
  const { data: currentUser } = useCurrentUser();

  const totalWon = currentUser?.totalWon ?? 0;
  const totalLoss = currentUser?.totalWagered
    ? currentUser?.totalWagered - (currentUser?.totalWon ?? 0)
    : 0;
  const total = totalWon + totalLoss;
  const winPercent = total > 0 ? (totalWon / total) * 100 : 0;
  const lossPercent = total > 0 ? (totalLoss / total) * 100 : 0;

  return (
    <Section className={styles.profileSection}>
      <Container>
        <div className={styles.profileWrapper}>
          <div className={styles.profileHeader}>
            <Image
              src={currentUser?.avatarURL ?? ""}
              alt={t.accessibility.userAvatar}
              width={96}
              height={96}
              className={styles.profileAvatar}
            />
            <h2 className={styles.profileUsername}>{currentUser?.username}</h2>
          </div>

          <div className={styles.profileInfo}>
            <p className={styles.profileInfoItem}>
              {t.profile.totalGame}
              <span className={styles.profileInfoItemValue}>
                {currentUser?.gamesPlayed}
              </span>
            </p>
            <p className={styles.profileInfoItem}>
              {t.profile.win}
              <span className={styles.profileInfoItemValue}>
                {`${winPercent.toFixed()}%`}
              </span>
            </p>
            <p className={styles.profileInfoItem}>
              {t.profile.loss}
              <span className={styles.profileInfoItemValue}>
                {`${lossPercent.toFixed()}%`}
              </span>
            </p>
            <div className={styles.profileInfoItem}>
              {t.profile.location}
              <span>
                <Image
                  src="/images/profile/ro.svg"
                  alt={t.accessibility.location}
                  width={32}
                  height={23}
                />
              </span>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  );
}
