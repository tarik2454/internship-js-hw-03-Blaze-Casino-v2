"use client";

import Image from "next/image";
import styles from "./Loader.module.scss";

export const Loader = () => {
  return (
    <div className={styles.container}>
      <div className={styles.content}>
        <div className={styles.logoWrapper}>
          <Image
            src="/images/logo/logo-register.svg"
            alt="Blaze Casino"
            fill={true}
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
