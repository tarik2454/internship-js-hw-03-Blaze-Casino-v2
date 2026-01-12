import styles from "./ListGames.module.scss";

export function ListGames() {
  return (
    <ul className={styles.listGames}>
      <li className={styles.listGamesItem}>game 1</li>
      <li className={styles.listGamesItem}>game 2</li>
      <li className={styles.listGamesItem}>game 3</li>
      <li className={styles.listGamesItem}>game 4</li>
    </ul>
  );
}
