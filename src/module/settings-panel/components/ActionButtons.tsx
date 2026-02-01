"use client";

import { memo } from "react";
import { Button } from "@/shared/components/Button";
import { DollarBtnIcon } from "@/shared/icons/dollar-btn";
import { WalletBtnIcon } from "@/shared/icons/wallet-btn";
import { cx } from "@/shared/utils/classNames";
import styles from "./ActionButtons.module.scss";

interface ActionButtonsProps {
  canBet: boolean;
  showCashoutButton: boolean;
  isCashoutDisabled: boolean;
  isCashingOut: boolean;
  hideBorder?: boolean;
  onPlaceBet: () => void;
  onCashout: () => void;
}

export const ActionButtons = memo(function ActionButtons({
  canBet,
  showCashoutButton,
  isCashoutDisabled,
  isCashingOut,
  hideBorder = false,
  onPlaceBet,
  onCashout,
}: ActionButtonsProps) {
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
        Place Bet
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
          {isCashingOut ? "Cashing out..." : "Cashout"}
          <span className={styles.actionButtonIcon}>
            <WalletBtnIcon />
          </span>
        </Button>
      )}
    </div>
  );
});
