"use client";

import { useState, useCallback, useMemo } from "react";
import { useCurrentUser } from "@/config-api/user/useUser";

interface UseBetFormOptions {
  maxBetAmount?: number;
}

export function useBetForm({ maxBetAmount = 10000 }: UseBetFormOptions = {}) {
  const { data: user } = useCurrentUser();
  const [amount, setAmount] = useState<number>(10);
  const [autoCashout, setAutoCashout] = useState<string>("2.00");
  const [isAuto, setIsAuto] = useState(false);
  const [isCashingOut, setIsCashingOut] = useState(false);

  const parsedAutoCashout = useMemo((): number | undefined => {
    if (!isAuto) return undefined;
    const val = parseFloat(autoCashout.replace(",", "."));
    return isNaN(val) ? undefined : val;
  }, [autoCashout, isAuto]);

  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      setAmount(isNaN(value) ? 0 : Math.min(value, maxBetAmount));
    },
    [maxBetAmount],
  );

  const handleHalf = useCallback(
    () => setAmount((prev) => Math.max(0.1, prev / 2)),
    [],
  );

  const handleDouble = useCallback(
    () => setAmount((prev) => Math.min(prev * 2, maxBetAmount)),
    [maxBetAmount],
  );

  const handleMax = useCallback(() => {
    if (user?.balance) {
      setAmount(Math.min(user.balance, maxBetAmount));
    }
  }, [user, maxBetAmount]);

  const handleAutoToggle = useCallback((checked: boolean) => {
    setIsAuto(checked);
    if (checked) {
      setAutoCashout((prev) => (!prev ? "2.00" : prev));
    }
  }, []);

  const handleAutoCashoutChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setAutoCashout(e.target.value);
    },
    [],
  );

  const wrapCashout = useCallback(
    async (fn: () => void | Promise<void>): Promise<void> => {
      setIsCashingOut(true);
      try {
        await fn();
      } finally {
        setIsCashingOut(false);
      }
    },
    [],
  );

  return {
    amount,
    autoCashout,
    isAuto,
    isCashingOut,
    parsedAutoCashout,
    handleAmountChange,
    handleHalf,
    handleDouble,
    handleMax,
    handleAutoToggle,
    handleAutoCashoutChange,
    wrapCashout,
  };
}
