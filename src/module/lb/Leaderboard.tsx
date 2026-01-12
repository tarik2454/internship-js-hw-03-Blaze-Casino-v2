"use client";

import { Section } from "@/shared/components/Section";
import styles from "./Leaderboard.module.scss";
import Image from "next/image";
import { useLeaderboard } from "@/config-api/leaderboard/useLeaderboard";

export function Leaderboard() {
  const { data, isError, error } = useLeaderboard();

  if (isError) {
    return <div>Error: {error.message}</div>;
  }

  return (
    <Section className={styles.leaderboard}>
      <Image
        src="/images/leaderboard/prize.svg"
        alt="Prize"
        width={80}
        height={80}
        className={styles.leaderboardPrize}
      />
      <h2 className={styles.leaderboardTitle}>Leaderboard</h2>
      <p className={styles.leaderboardDescription}>Top players</p>
      <ul className={styles.leaderboardList}>
        {data?.players.map((player) => {
          const isCurrentUser = player.username === data.currentUser?.username;
          let rankContent;

          if (player.rank === 1) {
            rankContent = (
              <Image
                src="/images/leaderboard/first-place.svg"
                alt="First Place"
                width={32}
                height={32}
              />
            );
          } else if (player.rank === 2) {
            rankContent = (
              <Image
                src="/images/leaderboard/second-place.svg"
                alt="Second Place"
                width={32}
                height={32}
              />
            );
          } else if (player.rank === 3) {
            rankContent = (
              <Image
                src="/images/leaderboard/third-place.svg"
                alt="Third Place"
                width={32}
                height={32}
              />
            );
          } else {
            rankContent = player.rank;
          }

          return (
            <li
              key={player.username}
              className={`${styles.leaderboardItem} ${isCurrentUser ? styles.currentUserItem : ""}`}
            >
              <div className={styles.itemFirstPartContent}>
                <div className={styles.itemFirstBlock}>{rankContent}</div>
                <div className={styles.itemSecondBlock}>
                  <span className={styles.itemName}>{player.username}</span>
                  <span className={styles.itemGamesPlayed}>
                    {player.gamesPlayed} games
                  </span>
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
                  {player.totalWagered}
                </span>
                <span className={styles.itemWinRate}>
                  {player.winRate}% win
                </span>
              </div>
            </li>
          );
        })}
      </ul>
    </Section>
  );
}
