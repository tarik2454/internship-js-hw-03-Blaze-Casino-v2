"use client";

import { Section } from "@/shared/components/Section";
import styles from "./Leaderboard.module.scss";
import Image from "next/image";
import { useLeaderboard } from "@/config-api/leaderboard/useLeaderboard";
import { getRankContent } from "./leaderboard.utils";

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
          const rank = getRankContent(player.rank);

          return (
            <li
              key={player.username}
              className={`${styles.leaderboardItem} ${isCurrentUser ? styles.currentUserItem : ""}`}
            >
              <div className={styles.itemFirstPartContent}>
                <div className={styles.itemFirstBlock}>{rank}</div>
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
