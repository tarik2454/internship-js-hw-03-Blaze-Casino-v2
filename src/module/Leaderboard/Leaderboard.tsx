"use client";

import { Section } from "@/shared/components/Section";
import styles from "./Leaderboard.module.scss";
import Image from "next/image";
import { useLeaderboard } from "@/config-api/leaderboard/useLeaderboard";

export function Leaderboard() {
  const { data } = useLeaderboard();

  return (
    <Section className={styles.leaderboard}>
      <Image
        src="/images/leaderboard/prize.svg"
        alt="Prize"
        width={90}
        height={90}
        className={styles.leaderboardPrize}
      />
      <h2 className={styles.leaderboardTitle}>Leaderboard</h2>
      <p className={styles.leaderboardDescription}>Top players</p>
      <ul className={styles.leaderboardList}>
        <li className={styles.leaderboardItem}>
          <div className={styles.itemFirstPartContent}>
            <div className={styles.itemFirstBlock}>
              <Image
                src="/images/leaderboard/first-place.svg"
                alt="First Place"
                width={32}
                height={32}
              />
            </div>
            <div className={styles.itemSecondBlock}>
              <span className={styles.itemName}>John Doe</span>
              <span className={styles.itemGamesPlayed}>48</span>
            </div>
          </div>
          <div className={styles.itemThirdBlock}>
            <span className={styles.itemTotalWagered}>
              <Image
                src="/images/common/dollar.svg"
                alt="Dollar"
                width={16}
                height={16}
              />
              3800
            </span>
            <span className={styles.itemWinRate}>10% win</span>
          </div>
        </li>
        <li className={styles.leaderboardItem}>
          <div className={styles.itemFirstPartContent}>
            <div className={styles.itemFirstBlock}>
              <Image
                src="/images/leaderboard/second-place.svg"
                alt="Second Place"
                width={32}
                height={32}
              />
            </div>
            <div className={styles.itemSecondBlock}>
              <span className={styles.itemName}>John Doe</span>
              <span className={styles.itemGamesPlayed}>48</span>
            </div>
          </div>
          <div className={styles.itemThirdBlock}>
            <span className={styles.itemTotalWagered}>
              <Image
                src="/images/common/dollar.svg"
                alt="Dollar"
                width={16}
                height={16}
              />
              3800
            </span>
            <span className={styles.itemWinRate}>10% win</span>
          </div>
        </li>
        <li className={styles.leaderboardItem}>
          <div className={styles.itemFirstPartContent}>
            <div className={styles.itemFirstBlock}>
              <Image
                src="/images/leaderboard/third-place.svg"
                alt="Third Place"
                width={32}
                height={32}
              />
            </div>
            <div className={styles.itemSecondBlock}>
              <span className={styles.itemName}>John Doe</span>
              <span className={styles.itemGamesPlayed}>48</span>
            </div>
          </div>
          <div className={styles.itemThirdBlock}>
            <span className={styles.itemTotalWagered}>
              <Image
                src="/images/common/dollar.svg"
                alt="Dollar"
                width={16}
                height={16}
              />
              3800
            </span>
            <span className={styles.itemWinRate}>10% win</span>
          </div>
        </li>
        <li className={styles.leaderboardItem}>
          <div className={styles.itemFirstPartContent}>
            <div className={styles.itemFirstBlock}>4</div>
            <div className={styles.itemSecondBlock}>
              <span className={styles.itemName}>John Doe</span>
              <span className={styles.itemGamesPlayed}>48</span>
            </div>
          </div>
          <div className={styles.itemThirdBlock}>
            <span className={styles.itemTotalWagered}>
              <Image
                src="/images/common/dollar.svg"
                alt="Dollar"
                width={16}
                height={16}
              />
              3800
            </span>
            <span className={styles.itemWinRate}>10% win</span>
          </div>
        </li>
      </ul>
    </Section>
  );
}
