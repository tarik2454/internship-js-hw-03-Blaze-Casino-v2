"use client";

import { useState } from "react";
import { Button } from "@/shared/components/Button";
import { useQueryClient } from "@tanstack/react-query";
import { queryKeys } from "@/config-api/keys";
import { CurrentUserResponse } from "@/config-api/user/user.types";
import { useUpdateCurrentUser } from "@/config-api/user/useUser";
import { POPUP_TYPE, usePopup } from "@/app/providers/PopupProvider";
import { cx } from "@/shared/utils/classNames";
import styles from "./CaseOpeningActions.module.scss";

export interface CaseOpeningActionsProps {
  itemValue: number;
  sellPrice: number;
  onTryAgain: () => void;
  revealPrice?: boolean;
  className?: string;
}

export function CaseOpeningActions({
  itemValue,
  sellPrice,
  onTryAgain,
  revealPrice = true,
  className,
}: CaseOpeningActionsProps) {
  const [sold, setSold] = useState(false);
  const { mutate: updateUser } = useUpdateCurrentUser();
  const { showPopup } = usePopup();
  const queryClient = useQueryClient();

  const handleSell = () => {
    const old = queryClient.getQueryData<CurrentUserResponse>(queryKeys.user);
    if (!old || sold) return;

    updateUser(
      { balance: old.balance + itemValue },
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

  return (
    <div className={cx(styles.actionsButtons, className)}>
      <Button
        stylesVariant="yellowGradient"
        className={styles.actionButton}
        onClick={handleSell}
        disabled={sold}
      >
        Sell for {revealPrice ? `${sellPrice}` : "??"}$
      </Button>
      <Button
        stylesVariant="redGradient"
        className={styles.actionButton}
        onClick={onTryAgain}
      >
        Try again
      </Button>
    </div>
  );
}
