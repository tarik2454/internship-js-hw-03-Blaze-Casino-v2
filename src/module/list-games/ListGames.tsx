import styles from "./ListGames.module.scss";
import { LIST_GAMES } from "./listGames.constants";

export function ListGames() {
  return (
    <ul className={styles.listGames}>
      {LIST_GAMES.map(({ id, name, description, backgroundImage }) => (
        <li
          key={id}
          className={styles.listGamesItem}
          style={{ backgroundImage: `url(${backgroundImage})` }}
        >
          <div className={styles.listGamesItemContent}>
            <h3>{name}</h3>
            <p>{description}</p>
          </div>
        </li>
      ))}
    </ul>
  );
}
