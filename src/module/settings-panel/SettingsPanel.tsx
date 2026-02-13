"use client";

import { ReactNode } from "react";
import styles from "./SettingsPanel.module.scss";

interface SettingsPanelProps {
  title: string;
  options: ReactNode;
  children?: ReactNode;
}

export function SettingsPanel({ title, options, children }: SettingsPanelProps) {
  return (
    <aside className={styles.settingsPanelWrapper}>
      <p className={styles.settingsPanelTitle}>{title}</p>
      <div className={styles.settingsPanel}>{options}</div>
      {children}
    </aside>
  );
}
