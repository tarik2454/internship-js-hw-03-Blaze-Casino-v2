"use client";

import { Section } from "@/shared/components/Section";
import styles from "./Leaderboard.module.scss";
import Image from "next/image";
import { useLeaderboard } from "@/config-api/leaderboard/useLeaderboard";
import { getRankContent } from "./leaderboard.utils";
import { LeaderboardItem } from "./components/LeaderboardItem";

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
            <LeaderboardItem
              key={player.username}
              player={player}
              isCurrentUser={isCurrentUser}
              rank={rank}
            />
          );
        })}
      </ul>
    </Section>
  );
}
