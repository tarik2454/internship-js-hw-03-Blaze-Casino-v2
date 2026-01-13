import { Button } from "@/shared/components/Button";
import styles from "./GamesList.module.scss";
import { LIST_GAMES } from "./Gameslist.constants";
import Link from "next/link";

export function GamesList() {
  return (
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

              <div>
                <div>
                  <h2 className={styles.itemName}>{name}</h2>
                  <p className={styles.itemDescription}>{description}</p>
                </div>

                <Link href={href}>
                  <Button className={styles.itemButton}>
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
