"use client";

import { useState, useCallback } from "react";
import { useCurrentUser } from "@/config-api/user/useUser";
import { SettingsPanelProps } from "../types";
import type {
  RiskLevel,
  LinesCount,
  BallsCount,
} from "@/config-api/plinko/plinko.types";

export function useSettingsPanel({
  showPlinkoOptions,
  onPlaceBet,
  onCashout,
  riskLevel: propsRisk,
  linesCount: propsLines,
  ballsCount: propsBalls,
  onRiskChange,
  onLinesChange,
  onBallsChange,
}: Pick<
  SettingsPanelProps,
  | "showPlinkoOptions"
  | "onPlaceBet"
  | "onCashout"
  | "riskLevel"
  | "linesCount"
  | "ballsCount"
  | "onRiskChange"
  | "onLinesChange"
  | "onBallsChange"
>) {
  const { data: user } = useCurrentUser();
  const [amount, setAmount] = useState<number>(10);
  const [autoCashout, setAutoCashout] = useState<string>("2.00");
  const [isAuto, setIsAuto] = useState(false);
  const [isCashingOut, setIsCashingOut] = useState(false);

  const [localRisk, setLocalRisk] = useState<RiskLevel>("medium");
  const [localLines, setLocalLines] = useState<LinesCount>(12);
  const [localBalls, setLocalBalls] = useState<BallsCount>(1);

  const riskLevel = propsRisk ?? localRisk;
  const linesCount = propsLines ?? localLines;
  const ballsCount = propsBalls ?? localBalls;

  const setRiskLevel = onRiskChange ?? setLocalRisk;
  const setLinesCount = onLinesChange ?? setLocalLines;
  const setBallsCount = onBallsChange ?? setLocalBalls;

  const handleAmountChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = parseFloat(e.target.value);
      setAmount(isNaN(value) ? 0 : value);
    },
    [],
  );

  const handleHalf = useCallback(
    () => setAmount((prev) => Math.max(0.1, prev / 2)),
    [],
  );

  const handleDouble = useCallback(() => setAmount((prev) => prev * 2), []);

  const handleMax = useCallback(() => {
    if (user?.balance) {
      setAmount(Math.min(user.balance, 10000));
    }
  }, [user]);

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

  const handlePlaceBet = useCallback(() => {
    const parsedAutoCashout = parseFloat(autoCashout.replace(",", "."));
    onPlaceBet({
      amount,
      autoCashout:
        isAuto && !isNaN(parsedAutoCashout) ? parsedAutoCashout : undefined,
      ...(showPlinkoOptions && {
        riskLevel,
        linesCount,
        ballsCount,
      }),
    });
  }, [
    autoCashout,
    amount,
    isAuto,
    onPlaceBet,
    showPlinkoOptions,
    riskLevel,
    linesCount,
    ballsCount,
  ]);

  const handleCashout = useCallback(async () => {
    if (!onCashout) return;
    setIsCashingOut(true);
    try {
      await onCashout();
    } finally {
      setIsCashingOut(false);
    }
  }, [onCashout]);

  return {
    amount,
    autoCashout,
    isAuto,
    isCashingOut,
    riskLevel,
    linesCount,
    ballsCount,
    handleAmountChange,
    handleHalf,
    handleDouble,
    handleMax,
    handleAutoToggle,
    handleAutoCashoutChange,
    handlePlaceBet,
    handleCashout,
    setRiskLevel,
    setLinesCount,
    setBallsCount,
  };
}
