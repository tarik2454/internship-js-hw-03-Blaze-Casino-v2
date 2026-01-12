import Image from "next/image";
import styles from "./Logo.module.scss";
import { cx } from "../utils/classNames";

export function Logo({ className }: { className?: string }) {
  return (
    <div className={cx(styles.logo, className)}>
      <span>Blaze</span>
      <Image
        src="/images/logo/logo-site.svg"
        alt="Blaze Casino"
        width={40}
        height={17}
      />
      <span>Casino</span>
    </div>
  );
}
