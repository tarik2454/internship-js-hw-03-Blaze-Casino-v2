import { MULTIPLIER_THEME } from "./plinko.constants";

export const formatMultiplier = (value: number): string => {
  if (Number.isInteger(value)) {
    return value.toString();
  }

  return value.toFixed(1);
};

export const getMultiplierColor = (
  multiplier: number,
  maxMultiplier?: number,
): string => {
  if (maxMultiplier && maxMultiplier > 0) {
    const ratio = multiplier / maxMultiplier;
    if (ratio >= 0.85) return MULTIPLIER_THEME.darkRed;
    if (ratio >= 0.7) return MULTIPLIER_THEME.red;
    if (ratio >= 0.3) return MULTIPLIER_THEME.orange;
    if (ratio >= 0.08) return MULTIPLIER_THEME.yellow;
    return MULTIPLIER_THEME.green;
  }

  if (multiplier >= 100) {
    return MULTIPLIER_THEME.darkRed;
  }
  if (multiplier >= 41) {
    return MULTIPLIER_THEME.red;
  }
  if (multiplier >= 10) {
    return MULTIPLIER_THEME.orange;
  }
  if (multiplier >= 3) {
    return MULTIPLIER_THEME.yellow;
  }
  return MULTIPLIER_THEME.green;
};
