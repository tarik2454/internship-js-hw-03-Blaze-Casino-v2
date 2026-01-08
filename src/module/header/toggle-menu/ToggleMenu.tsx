import { useEffect } from "react";
import styles from "./ToggleMenu.module.scss";

interface ToggleMenuProps {
  visibility: "hidden" | "visible";
  setVisibility: (visibility: "hidden" | "visible") => void;
}

export function ToggleMenu({ visibility, setVisibility }: ToggleMenuProps) {
  useEffect(() => {
    document.body.style.overflow = visibility === "visible" ? "hidden" : "auto";
  }, [visibility]);

  return (
    <div
      className={`${styles.toggleMenu} ${visibility === "visible" ? styles.open : ""}`}
    >
      <button
        className={styles.toggleMenuButton}
        onClick={() => setVisibility("hidden")}
      >
        -
      </button>
      <div className={styles.toggleMenuContent}>
        <div className={styles.toggleMenuHeader}>
          <h2 className={styles.toggleMenuTitle}>Menu</h2>
        </div>
      </div>
    </div>
  );
}
