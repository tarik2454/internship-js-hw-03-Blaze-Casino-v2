import { CaseDetailItem } from "./CaseDetailItem";
import styles from "./OpeningResult.module.scss";
import { CaseOpeningResponse } from "@/config-api/cases/cases.types";
import { Button } from "@/shared/components/Button";

export function OpeningResult({
  openingResult,
}: {
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

      <div className={styles.actionsButtons}>
        <Button stylesVariant="redGradient" className={styles.actionButton}>
          Sell for {`${value}`}$
        </Button>

        <Button stylesVariant="yellowGradient" className={styles.actionButton}>
          Try again
        </Button>
      </div>
    </div>
  );
}
