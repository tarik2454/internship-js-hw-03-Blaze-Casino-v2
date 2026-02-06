"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import { ROUTE_META } from "@/shared/constants/routes";
import { Container } from "./Container";
import styles from "./Breadcrumbs.module.scss";
import { ArrowLeftIcon } from "../icons/arrow-left";

type BreadcrumbItem = {
  label: string;
  href: string;
  isCurrent: boolean;
};

type Props = {
  dynamicLabels?: Record<string, string | undefined>;
};

export function Breadcrumbs({ dynamicLabels }: Props) {
  const pathname = usePathname();

  const items = useMemo(() => {
    const result: BreadcrumbItem[] = [];
    const segments = pathname.split("/").filter(Boolean);

    result.push({
      label: ROUTE_META["/"]?.label || "Home",
      href: "/",
      isCurrent: pathname === "/",
    });

    segments.forEach((segment, index) => {
      const currentPath = "/" + segments.slice(0, index + 1).join("/");
      const isLast = index === segments.length - 1;

      let meta = ROUTE_META[currentPath];
      let label = segment;

      if (!meta) {
        const parentPath = "/" + segments.slice(0, index).join("/");
        const pattern = parentPath ? `${parentPath}/[id]` : "/[id]";
        meta = ROUTE_META[pattern];
      }

      if (meta) {
        if (meta.dynamic) {
          label = dynamicLabels?.["[id]"] || meta.label;
        } else {
          label = meta.label;
        }
      } else {
        label = segment.charAt(0).toUpperCase() + segment.slice(1);
      }

      result.push({
        label,
        href: currentPath,
        isCurrent: isLast,
      });
    });

    return result;
  }, [pathname, dynamicLabels]);

  if (items.length <= 1) return null;

  return (
    <div className={styles.wrapper}>
      <Container>
        <nav aria-label="Breadcrumb" className={styles.breadcrumbs}>
          <ul className={styles.list}>
            {items.map((item, index) => (
              <li key={item.href} className={styles.item}>
                {index === 0 && <ArrowLeftIcon />}
                {index > 0 && <span className={styles.separator}>/</span>}
                {item.isCurrent ? (
                  <span aria-current="page">{item.label}</span>
                ) : (
                  <Link href={item.href}>{item.label}</Link>
                )}
              </li>
            ))}
          </ul>
        </nav>
      </Container>
    </div>
  );
}
