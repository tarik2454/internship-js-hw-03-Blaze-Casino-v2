import Image from "next/image";
import styles from "./LeaderboardItem.module.scss";
import { ReactNode } from "react";

interface LeaderboardItemProps {
  player: {
    username: string;
    gamesPlayed: number;
    totalWagered: number;
    winRate: number;
  };
  isCurrentUser: boolean;
  rank: ReactNode;
}

export function LeaderboardItem({
  player,
  isCurrentUser,
  rank,
}: LeaderboardItemProps) {
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
        <span className={styles.itemWinRate}>{player.winRate}% win</span>
      </div>
    </li>
  );
}
