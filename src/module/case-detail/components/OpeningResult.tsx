"use client";

import { useState } from "react";
import { CaseDetailItem } from "../CaseDetailItem";
import styles from "./OpeningResult.module.scss";
import { CaseOpeningResponse } from "@/config-api/cases/cases.types";
import { Button } from "@/shared/components/Button";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeyFactories } from "@/config-api/keys";
import { CurrentUserResponse } from "@/config-api/user/user.types";
import { useUpdateCurrentUser } from "@/config-api/user/useUser";
import { usePopup, POPUP_TYPE } from "@/providers/PopupProvider";
import { getTranslations } from "@/i18n";
import type { Locale } from "@/i18n";

export function OpeningResult({
  openingResult,
  setIsOpenResult,
  locale,
}: {
  setIsOpenResult: (isOpenResult: boolean) => void;
  openingResult: CaseOpeningResponse;
  locale: Locale;
}) {
  const t = getTranslations(locale);
  const [sold, setSold] = useState(false);
  const { mutate: updateUser } = useUpdateCurrentUser();
  const queryClient = useQueryClient();
  const { showPopup } = usePopup();

  const { id, name, value, rarity, image } = openingResult.item;

  const handleSell = () => {
    const old = queryClient.getQueryData<CurrentUserResponse>(
      queryKeyFactories.user.current(),
    );
    if (!old || sold) return;

    updateUser(
      { balance: old.balance + openingResult.itemValue },
      {
        onSuccess: () => {
          setSold(true);
          const netProfit = openingResult.itemValue - openingResult.casePrice;
          showPopup({
            message: `${t.cases.soldFor} ${openingResult.itemValue.toFixed(2)}$`,
            type: netProfit >= 0 ? POPUP_TYPE.SUCCESS : POPUP_TYPE.ERROR,
            position: "topCenter",
            resultAmount: netProfit,
          });
        },
      },
    );
  };

  const handleTryAgain = () => {
    setIsOpenResult(false);
  };

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
        hideValue
      />

      <div className={styles.actionsButtons}>
        <Button
          stylesVariant="yellowGradient"
          className={styles.actionButton}
          onClick={handleSell}
          disabled={sold}
        >
          {t.cases.sellFor} {value}$
        </Button>
        <Button
          stylesVariant="redGradient"
          className={styles.actionButton}
          onClick={handleTryAgain}
        >
          {t.cases.tryAgain}
        </Button>
      </div>
    </div>
  );
}
