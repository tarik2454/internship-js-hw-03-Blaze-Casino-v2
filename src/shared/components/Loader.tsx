"use client";

import Image from "next/image";
import styles from "./Loader.module.scss";

export const Loader = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logoWrapper}>
          <Image
            src="/evo-gaming-logo.svg"
            alt="Evo Gaming"
            width={272}
            height={83}
            priority
            className={styles.logo}
          />
        </div>
        <div className={styles.loaderTrack}>
          <div className={styles.loaderBar} />
        </div>
      </div>
    </div>
  );
};
