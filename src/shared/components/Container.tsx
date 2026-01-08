import React, { ReactNode } from "react";
import { cx } from "@/utils/classNames";
import styles from "./Container.module.scss";

interface ContainerProps {
  children: ReactNode;
  className?: string;
}

export function Container({ children, className = "" }: ContainerProps) {
  return <div className={cx(styles.container, className)}>{children}</div>;
}
