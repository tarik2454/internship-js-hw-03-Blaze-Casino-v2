"use client";

import { useBonus, useClaimBonus } from "@/config-api/bonus/useBonus";
import { queryKeyFactories } from "@/config-api/keys";
import type { CurrentUserResponse } from "@/config-api/user/user.types";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";
import { Button } from "@/shared/components/Button";
import { Container } from "@/shared/components/Container";
import { Section } from "@/shared/components/Section";
import {
  formatBonusDate,
  formatCountdownShort,
  getCountdownSeconds,
} from "./bonus.utils";
import styles from "./Bonus.module.scss";

export default function Bonus() {
  const queryClient = useQueryClient();
  const [tick, setTick] = useState(0);
  const { data: bonusStatus, isLoading, refetch } = useBonus();
  const { mutate: claimBonus, isPending: isClaiming } = useClaimBonus();

  const nextClaimAt = bonusStatus?.nextClaimAt;
  const hasRefetchedWhenReached = useRef(false);

  useEffect(() => {
    if (!nextClaimAt) return;
    const id = setInterval(() => setTick((t) => t + 1), 1000);
    return () => clearInterval(id);
  }, [nextClaimAt]);

  useEffect(() => {
    if (!nextClaimAt) return;
    const remaining = getCountdownSeconds(nextClaimAt);
    if (remaining === null && !hasRefetchedWhenReached.current) {
      hasRefetchedWhenReached.current = true;
      refetch();
    }
    if (remaining !== null) hasRefetchedWhenReached.current = false;
  }, [nextClaimAt, tick, refetch]);

  const handleClaim = () => {
    claimBonus(undefined, {
      onSuccess: (data) => {
        queryClient.setQueryData<CurrentUserResponse>(
          queryKeyFactories.user.current(),
          (old) =>
            old != null && data.balance != null
              ? { ...old, balance: data.balance }
              : old,
        );
        queryClient.invalidateQueries({
          queryKey: queryKeyFactories.bonus.status(),
        });
      },
    });
  };

  if (isLoading || !bonusStatus) {
    return (
      <Section>
        <Container>
          <div className={styles.bonusWrapper}>Loading...</div>
        </Container>
      </Section>
    );
  }

  const { amount, baseAmount, wagerBonus, gamesBonus } = bonusStatus;
  const countdownSeconds = nextClaimAt
    ? getCountdownSeconds(nextClaimAt)
    : null;
  const isAvailable = amount > 0 && countdownSeconds === null;
  const countdownShort =
    countdownSeconds != null ? formatCountdownShort(countdownSeconds) : null;

  return (
    <Section>
      <Container>
        <div className={styles.bonusWrapper}>
          <h2 className={styles.bonusTitle}>Minute Bonus</h2>

          <div className={styles.bonusCard}>
            <div className={styles.bonusAmountBlock}>
              <span className={styles.bonusAmountValue}>
                ${amount.toFixed(2)}
              </span>
              <span className={styles.bonusAmountLabel}>Bonus Amount</span>
              {countdownShort != null ? (
                <span className={styles.bonusNextIn}>
                  Next bonus in: <strong>{countdownShort}</strong>
                </span>
              ) : isAvailable ? (
                <span className={styles.bonusAvailable}>Available now!</span>
              ) : null}
            </div>

            <div className={styles.bonusSeparator} />

            <div className={styles.bonusBreakdown}>
              <div className={styles.bonusBreakdownItem}>
                <span className={styles.bonusBreakdownLabel}>Base Amount</span>
                <span className={styles.bonusBreakdownValue}>
                  ${baseAmount.toFixed(2)}
                </span>
              </div>
              <div className={styles.bonusBreakdownItem}>
                <span className={styles.bonusBreakdownLabel}>Wager Bonus</span>
                <span className={styles.bonusBreakdownValue}>
                  ${wagerBonus.toFixed(2)}
                </span>
              </div>
              <div className={styles.bonusBreakdownItem}>
                <span className={styles.bonusBreakdownLabel}>Games Bonus</span>
                <span className={styles.bonusBreakdownValue}>
                  ${gamesBonus.toFixed(2)}
                </span>
              </div>
            </div>

            <div className={styles.bonusSeparator} />

            <div className={styles.bonusNextClaim}>
              <span className={styles.bonusNextClaimLabel}>Next Claim At</span>
              <span className={styles.bonusNextClaimValue}>
                {nextClaimAt ? formatBonusDate(nextClaimAt) : ""}
              </span>
            </div>
          </div>

          <Button
            stylesVariant="redGradient"
            className={styles.claimButton}
            onClick={handleClaim}
            disabled={!isAvailable || isClaiming}
          >
            Claim Bonus{countdownShort != null ? ` (${countdownShort})` : ""}
          </Button>
        </div>
      </Container>
    </Section>
  );
}
