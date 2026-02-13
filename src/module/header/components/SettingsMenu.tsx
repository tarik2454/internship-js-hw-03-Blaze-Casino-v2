"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { Locale } from "@/providers/LocaleProvider";
import styles from "./SettingsMenu.module.scss";
import Image from "next/image";
import { Button } from "@/shared/components/Button";
import { Switch } from "@/shared/components/Switch";
import { useTheme } from "@/providers/ThemeProvider";
import { useSoundContext } from "@/providers/SoundProvider";
import { VolumeIcon, VolumeMutedIcon } from "@/shared/icons/volume";
import { getTranslations } from "@/i18n";

interface SettingsMenuProps {
  currentLocale: Locale;
  onSelect: (locale: Locale) => void;
  onClose: () => void;
  triggerRef?: RefObject<HTMLButtonElement | null>;
}

const languages: { code: Locale; labelKey: "english" | "ukrainian"; icon: string }[] = [
  { code: "en", labelKey: "english", icon: "/images/localization/sh.svg" },
  { code: "uk", labelKey: "ukrainian", icon: "/images/localization/ua.svg" },
];

export function SettingsMenu({
  currentLocale,
  onSelect,
  onClose,
  triggerRef,
}: SettingsMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);
  const { theme, toggleTheme } = useTheme();
  const { isMuted, volume, toggleMute, setVolume } = useSoundContext();
  const t = getTranslations(currentLocale);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Node;
      const isOutsideMenu =
        menuRef.current && !menuRef.current.contains(target);
      const isOutsideTrigger =
        !triggerRef?.current || !triggerRef.current.contains(target);

      if (isOutsideMenu && isOutsideTrigger) {
        onClose();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose, triggerRef]);

  return (
    <div ref={menuRef} className={styles.menu}>
      <div className={styles.themeSwitch}>
        <Switch
          checked={theme === "light"}
          onChange={toggleTheme}
          className={styles.themeSwitchInput}
        />
        <span className={styles.themeSwitchLabel}>
          {theme === "light" ? (
            <Image
              src="/images/header/sun.png"
              alt={t.accessibility.lightTheme}
              width={18}
              height={18}
            />
          ) : (
            <Image
              src="/images/header/moon.png"
              alt={t.accessibility.darkTheme}
              width={18}
              height={18}
            />
          )}
        </span>
      </div>

      <div className={styles.volumeControl}>
        <Button className={styles.volumeButton} onClick={toggleMute}>
          {isMuted ? <VolumeMutedIcon /> : <VolumeIcon />}
        </Button>
        <input
          type="range"
          min={0}
          max={1}
          step={0.05}
          value={isMuted ? 0 : volume}
          onChange={(e) => {
            const val = parseFloat(e.target.value);
            if (isMuted && val > 0) toggleMute();
            setVolume(val);
          }}
          className={styles.volumeSlider}
        />
      </div>

      <div className={styles.language}>
        {languages.map(({ code, labelKey, icon }) => {
          const label = t.language[labelKey];
          return (
            <Button
              key={code}
              className={`${styles.languageOption} ${
                currentLocale === code ? styles.active : ""
              }`}
              onClick={() => onSelect(code)}
            >
              <div className={styles.languageOption}>
                <Image src={icon} alt={label} width={18} height={10} />
                {label}
              </div>

              {currentLocale === code && (
                <span className={styles.checkmark}>✓</span>
              )}
            </Button>
          );
        })}
      </div>
    </div>
  );
}
