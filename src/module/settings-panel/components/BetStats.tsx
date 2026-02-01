"use client";

import { memo } from "react";
import { StatItem } from "../types";
import styles from "./BetStats.module.scss";

interface BetStatsProps {
  stats: StatItem[];
}

export const BetStats = memo(function BetStats({ stats }: BetStatsProps) {
  return (
    <div className={styles.resultsWrapper}>
      {stats.map((stat, index) => (
        <p key={index} className={styles.resultItem}>
          {stat.label}:
          <span className={styles.resultValue}>
            {stat.formatValue ? stat.formatValue(stat.value) : stat.value}
          </span>
        </p>
      ))}
    </div>
  );
});
