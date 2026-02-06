import { ReactNode } from "react";
import { cx } from "@/shared/utils/classNames";
import styles from "./PageWrapper.module.scss";
import { Breadcrumbs } from "./Breadcrumbs";

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
  isHome?: boolean;
}

export const PageWrapper = ({
  children,
  className = "",
  isHome = false,
}: PageWrapperProps) => (
  <div className={cx(styles.pageWrapper, isHome && styles.homePage, className)}>
    <Breadcrumbs />
    {children}
  </div>
);
