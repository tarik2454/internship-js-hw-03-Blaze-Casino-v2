import { Button } from "@/shared/components/Button";
import styles from "./ListGames.module.scss";
import { LIST_GAMES } from "./listGames.constants";
import Link from "next/link";

export function ListGames() {
  return (
    <ul className={styles.listGames}>
      {LIST_GAMES.map(
        ({ id, name, description, backgroundImage, tag, href }) => (
          <li
            key={id}
            className={styles.listGamesItem}
            style={{ backgroundImage: `url(${backgroundImage})` }}
          >
            <div className={styles.listGamesItemContent}>
              <span className={styles.listGamesItemTag}>{tag}</span>

              <div className={styles.listGamesItemInfoWrapper}>
                <div className={styles.listGamesItemInfo}>
                  <h3>{name}</h3>
                  <p>{description}</p>
                </div>

                <Link href={href}>
                  <Button className={styles.listGamesItemButton}>
                    <span>Play</span>
                  </Button>
                </Link>
              </div>
            </div>
          </li>
        ),
      )}
    </ul>
  );
}
