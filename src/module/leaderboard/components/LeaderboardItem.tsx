import Image from "next/image";
import styles from "./LeaderboardItem.module.scss";
import { ReactNode } from "react";
import { getTranslations } from "@/i18n";
import type { Locale } from "@/i18n";

interface LeaderboardItemProps {
  player: {
    username: string;
    gamesPlayed: number;
    totalWagered: number;
    winRate: number;
  };
  isCurrentUser: boolean;
  rank: ReactNode;
  locale: Locale;
}

export function LeaderboardItem({
  player,
  isCurrentUser,
  rank,
  locale,
}: LeaderboardItemProps) {
  const t = getTranslations(locale);

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
            {player.gamesPlayed} {t.leaderboard.games}
          </span>
        </div>
      </div>
      <div className={styles.itemThirdBlock}>
        <span className={styles.itemTotalWagered}>
          <Image
            src="/images/common/dollar.svg"
            alt={t.accessibility.dollar}
            width={16}
            height={16}
          />
          {Math.round(player.totalWagered)}
        </span>
        <span className={styles.itemWinRate}>{player.winRate}% {t.leaderboard.winRate}</span>
      </div>
    </li>
  );
}
