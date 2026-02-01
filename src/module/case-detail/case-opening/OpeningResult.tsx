"use client";

import { CaseDetailItem } from "../CaseDetailItem";
import styles from "./OpeningResult.module.scss";
import { CaseOpeningResponse } from "@/config-api/cases/cases.types";
import { CaseOpeningActions } from "./CaseOpeningActions";

export function OpeningResult({
  openingResult,
  setIsOpenResult,
}: {
  setIsOpenResult: (isOpenResult: boolean) => void;
  openingResult: CaseOpeningResponse;
}) {
  const { id, name, value, rarity, image } = openingResult.item;

  return (
    <div className={styles.openingResult}>
      <CaseDetailItem
        item={{
          id,
          name,
          value,
          rarity,
          chance: 0,
          imageUrl: image,
        }}
        classNameWrapper={styles.caseDetailItem}
        classNameName={styles.caseDetailItemName}
        classNameImage={styles.caseDetailItemImage}
        classNameValue={styles.caseDetailItemValue}
        classNameCircle={styles.caseDetailItemCircle}
      />

      <CaseOpeningActions
        itemValue={openingResult.itemValue}
        sellPrice={value}
        onTryAgain={() => setIsOpenResult(false)}
      />
    </div>
  );
}
