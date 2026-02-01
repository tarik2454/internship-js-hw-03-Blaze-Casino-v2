"use client";

import { useState } from "react";
import { CaseDetailItem } from "../CaseDetailItem";
import styles from "./OpeningResult.module.scss";
import { CaseOpeningResponse } from "@/config-api/cases/cases.types";
import { Button } from "@/shared/components/Button";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config-api/keys";
import { CurrentUserResponse } from "@/config-api/user/user.types";
import { useUpdateCurrentUser } from "@/config-api/user/useUser";
import { POPUP_TYPE, usePopup } from "@/app/providers/PopupProvider";

export function OpeningResult({
  openingResult,
  setIsOpenResult,
}: {
  setIsOpenResult: (isOpenResult: boolean) => void;
  openingResult: CaseOpeningResponse;
}) {
  const [sold, setSold] = useState(false);
  const { mutate: updateUser } = useUpdateCurrentUser();
  const { showPopup } = usePopup();
  const queryClient = useQueryClient();

  const { id, name, value, rarity, image } = openingResult.item;

  const handleSell = () => {
    const old = queryClient.getQueryData<CurrentUserResponse>(queryKeys.user);
    if (!old || sold) return;

    updateUser(
      { balance: old.balance + openingResult.itemValue },
      {
        onSuccess: (data) => {
          queryClient.setQueryData(queryKeys.user, data);
          setSold(true);
        },
        onError: (error) => {
          showPopup({
            message: error.message,
            type: POPUP_TYPE.ERROR,
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
          Sell for {value}$
        </Button>
        <Button
          stylesVariant="redGradient"
          className={styles.actionButton}
          onClick={handleTryAgain}
        >
          Try again
        </Button>
      </div>
    </div>
  );
}
