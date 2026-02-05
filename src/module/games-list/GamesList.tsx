"use client";

import { Button } from "@/shared/components/Button";
import styles from "./GamesList.module.scss";
import Link from "next/link";
import { Section } from "@/shared/components/Section";
import { GAMES_LIST } from "./games-list.constants";
import { useLocale } from "@/providers/LocaleProvider";
import { getTranslations } from "@/i18n";

export function GamesList() {
  const { locale } = useLocale();
  const t = getTranslations(locale);

  return (
    <Section className={styles.gamesListSection}>
      <ul className={styles.gamesList}>
        {GAMES_LIST.map(({ id, key, backgroundImage, tag, href }) => (
          <li
            key={id}
            className={styles.gameItem}
            style={{ backgroundImage: `url(${backgroundImage})` }}
          >
            <div className={styles.itemContent}>
              <span className={styles.itemTag}>{t.games.tags[tag]}</span>

              <div className={styles.itemDetails}>
                <div className={styles.itemDetailsContent}>
                  <h2 className={styles.itemName}>{t.games[key].name}</h2>
                  <p className={styles.itemDescription}>
                    {t.games[key].description}
                  </p>
                </div>

                <Link href={href} className={styles.itemLink}>
                  <Button
                    stylesVariant="redGradient"
                    className={styles.itemButton}
                  >
                    {t.games.freePlay}
                  </Button>
                </Link>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </Section>
  );
}
