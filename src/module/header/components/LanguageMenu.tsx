"use client";

import { useEffect, useRef, type RefObject } from "react";
import type { Locale } from "@/providers/LocaleProvider";
import styles from "./LanguageMenu.module.scss";
import Image from "next/image";
import { Button } from "@/shared/components/Button";

interface LanguageMenuProps {
  currentLocale: Locale;
  onSelect: (locale: Locale) => void;
  onClose: () => void;
  triggerRef?: RefObject<HTMLButtonElement | null>;
}

const languages: { code: Locale; label: string; icon: string }[] = [
  { code: "en", label: "English", icon: "/images/localization/sh.svg" },
  { code: "uk", label: "Українська", icon: "/images/localization/ua.svg" },
];

export function LanguageMenu({
  currentLocale,
  onSelect,
  onClose,
  triggerRef,
}: LanguageMenuProps) {
  const menuRef = useRef<HTMLDivElement>(null);

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
    <div className={styles.languageMenu} ref={menuRef}>
      {languages.map(({ code, label, icon }) => (
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
      ))}
    </div>
  );
}
