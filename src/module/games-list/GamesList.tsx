import { Button } from "@/shared/components/Button";
import styles from "./GamesList.module.scss";
import { LIST_GAMES } from "./Gameslist.constants";
import Link from "next/link";
import { Section } from "@/shared/components/Section";

export function GamesList() {
  return (
    <Section className={styles.gamesListSection}>
      <ul className={styles.gamesList}>
        {LIST_GAMES.map(
          ({ id, name, description, backgroundImage, tag, href }) => (
            <li
              key={id}
              className={styles.gameItem}
              style={{ backgroundImage: `url(${backgroundImage})` }}
            >
              <div className={styles.itemContent}>
                <span className={styles.itemTag}>{tag}</span>

                <div className={styles.itemDetails}>
                  <div className={styles.itemDetailsContent}>
                    <h2 className={styles.itemName}>{name}</h2>
                    <p className={styles.itemDescription}>{description}</p>
                  </div>

                  <Link href={href} className={styles.itemLink}>
                    <Button
                      stylesVariant="redGradient"
                      className={styles.itemButton}
                    >
                      Free play
                    </Button>
                  </Link>
                </div>
              </div>
            </li>
          ),
        )}
      </ul>
    </Section>
  );
}
