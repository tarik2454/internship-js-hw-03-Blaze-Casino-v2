import { ReactNode } from "react";
import { cx } from "@/utils/classNames";
import styles from "./PageWrapper.module.scss";

interface PageWrapperProps {
  children: ReactNode;
  className?: string;
}

export const PageWrapper = ({ children, className = "" }: PageWrapperProps) => (
  <div className={cx(styles.pageWrapper, className)}>{children}</div>
);
