"use client";

import { useState, useCallback } from "react";
import { useCurrentUser } from "@/config-api/user/useUser";
import {
  SettingsPanelProps,
  MinesGridSize,
  MinesMineAmount,
  DEFAULT_MINES_GRID_SIZE,
  DEFAULT_MINES_MINE_AMOUNT,
} from "../types";
import type {
  RiskLevel,
  LinesCount,
  BallsCount,
} from "@/config-api/plinko/plinko.types";

export function useSettingsPanel({
  showPlinkoOptions,
  showMinesOptions,
  maxBetAmount = 10000,
  onPlaceBet,
  onCashout,
  riskLevel: propsRisk,
  linesCount: propsLines,
  ballsCount: propsBalls,
  gridSize: propsGridSize,
  mineAmount: propsMineAmount,
  onRiskChange,
  onLinesChange,
  onBallsChange,
  onGridSizeChange,
  onMineAmountChange,
}: Pick<
  SettingsPanelProps,
  | "showPlinkoOptions"
  | "showMinesOptions"
  | "maxBetAmount"
  | "onPlaceBet"
  | "onCashout"
  | "riskLevel"
  | "linesCount"
  | "ballsCount"
  | "gridSize"
  | "mineAmount"
  | "onRiskChange"
  | "onLinesChange"
  | "onBallsChange"
  | "onGridSizeChange"
  | "onMineAmountChange"
>) {
  const { data: user } = useCurrentUser();
  const [amount, setAmount] = useState<number>(10);
  const [autoCashout, setAutoCashout] = useState<string>("2.00");
  const [isAuto, setIsAuto] = useState(false);
  const [isCashingOut, setIsCashingOut] = useState(false);

  const [localRisk, setLocalRisk] = useState<RiskLevel>("medium");
  const [localLines, setLocalLines] = useState<LinesCount>(12);
  const [localBalls, setLocalBalls] = useState<BallsCount>(1);
  const [localGridSize, setLocalGridSize] =
    useState<MinesGridSize>(DEFAULT_MINES_GRID_SIZE);
  const [localMineAmount, setLocalMineAmount] =
    useState<MinesMineAmount>(DEFAULT_MINES_MINE_AMOUNT);

  const riskLevel = propsRisk ?? localRisk;
  const linesCount = propsLines ?? localLines;
  const ballsCount = propsBalls ?? localBalls;
  const gridSize = propsGridSize ?? localGridSize;
  const mineAmount = propsMineAmount ?? localMineAmount;

  const setRiskLevel = onRiskChange ?? setLocalRisk;
  const setLinesCount = onLinesChange ?? setLocalLines;
  const setBallsCount = onBallsChange ?? setLocalBalls;
  const setGridSize = onGridSizeChange ?? setLocalGridSize;
  const setMineAmount = onMineAmountChange ?? setLocalMineAmount;

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
      ...(showMinesOptions && { gridSize, mineAmount }),
    });
  }, [
    autoCashout,
    amount,
    isAuto,
    onPlaceBet,
    showPlinkoOptions,
    showMinesOptions,
    riskLevel,
    linesCount,
    ballsCount,
    gridSize,
    mineAmount,
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
    gridSize,
    mineAmount,
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
    setGridSize,
    setMineAmount,
  };
}
