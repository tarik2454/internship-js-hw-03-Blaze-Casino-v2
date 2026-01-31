"use client";

import { memo } from "react";
import { cx } from "@/shared/utils/classNames";
import { getRarityClasses } from "@/module/cases/cases.utils";
import { CaseItem } from "@/config-api/cases/cases.types";
import styles from "./CaseDetailItem.module.scss";

interface CaseDetailItemProps {
  item: CaseItem;
  classNameWrapper?: string;
  classNameName?: string;
  classNameImage?: string;
  classNameValue?: string;
  classNameCircle?: string;
}

export const CaseDetailItem = memo(function CaseDetailItem({
  item,
  classNameWrapper,
  classNameName,
  classNameImage,
  classNameValue,
  classNameCircle,
}: CaseDetailItemProps) {
  const rarity = item.rarity.toLowerCase();

  return (
    <li
      className={cx(
        styles.itemCard,
        getRarityClasses(rarity, styles),
        classNameWrapper,
      )}
    >
      <h3 className={cx(styles.itemName, classNameName)}>{item.name}</h3>
      <div className={cx(styles.itemImage, classNameImage)}>
        {item.imageUrl}
      </div>

      <div className={cx(styles.itemValue, classNameValue)}>${item.value}</div>

      <div
        className={cx(
          styles.itemCircle,
          getRarityClasses(rarity, styles),
          classNameCircle,
        )}
      />
    </li>
  );
});
