"use client";

import { memo } from "react";
import { Button } from "@/shared/components/Button";
import { DollarBtnIcon } from "@/shared/icons/dollar-btn";
import { WalletBtnIcon } from "@/shared/icons/wallet-btn";
import { cx } from "@/shared/utils/classNames";
import { getTranslations } from "@/i18n";
import type { Locale } from "@/i18n";
import styles from "./ActionButtons.module.scss";

interface ActionButtonsProps {
  canBet: boolean;
  showCashoutButton: boolean;
  isCashoutDisabled: boolean;
  isCashingOut: boolean;
  hideBorder?: boolean;
  locale: Locale;
  onPlaceBet: () => void;
  onCashout: () => void;
}

export const ActionButtons = memo(function ActionButtons({
  canBet,
  showCashoutButton,
  isCashoutDisabled,
  isCashingOut,
  hideBorder = false,
  locale,
  onPlaceBet,
  onCashout,
}: ActionButtonsProps) {
  const t = getTranslations(locale);
  return (
    <div
      className={cx(
        styles.actionButtonsWrapper,
        hideBorder && styles.actionButtonsWrapperNoBorder,
      )}
    >
      <Button
        stylesVariant="redGradient"
        className={styles.actionButton}
        onClick={onPlaceBet}
        disabled={!canBet}
      >
        {t.settings.placeBet}
        <span className={styles.actionButtonIcon}>
          <DollarBtnIcon />
        </span>
      </Button>
      {showCashoutButton && (
        <Button
          stylesVariant="yellowGradient"
          className={styles.actionButton}
          onClick={onCashout}
          disabled={isCashoutDisabled}
        >
          {isCashingOut ? t.settings.cashingOut : t.settings.cashout}
          <span className={styles.actionButtonIcon}>
            <WalletBtnIcon />
          </span>
        </Button>
      )}
    </div>
  );
});
