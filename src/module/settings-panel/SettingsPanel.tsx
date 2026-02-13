"use client";

import { ReactNode } from "react";
import styles from "./SettingsPanel.module.scss";

interface SettingsPanelProps {
  title: string;
  children: ReactNode;
}

export function SettingsPanel({ title, children }: SettingsPanelProps) {
  return (
    <aside className={styles.settingsPanelWrapper}>
      <p className={styles.settingsPanelTitle}>{title}</p>
      <div className={styles.settingsPanel}>{children}</div>
    </aside>
  );
}
