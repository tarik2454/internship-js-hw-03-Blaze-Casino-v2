"use client";

import { ReactNode } from "react";
import styles from "./SettingsPanel.module.scss";

interface SettingsPanelProps {
  title: string;
  options: ReactNode;
  children?: ReactNode;
}

export function SettingsPanel({
  title,
  options,
  children,
}: SettingsPanelProps) {
  return (
    <aside className={styles.settingsPanelWrapper}>
      <h2 className={styles.settingsPanelTitle}>{title}</h2>
      <div className={styles.settingsPanel}>{options}</div>
      {children}
    </aside>
  );
}
