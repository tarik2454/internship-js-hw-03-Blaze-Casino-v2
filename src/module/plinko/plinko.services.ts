import { MULTIPLIER_THEME } from "./plinko.constants";

export const getMultiplierColor = (
  multiplier: number,
  maxMultiplier?: number,
): string => {
  if (maxMultiplier && maxMultiplier > 0) {
    const ratio = multiplier / maxMultiplier;
    if (ratio >= 0.9) return MULTIPLIER_THEME.darkRed;
    if (ratio >= 0.8) return MULTIPLIER_THEME.red;
    if (ratio >= 0.5) return MULTIPLIER_THEME.orange;
    if (ratio >= 0.3) return MULTIPLIER_THEME.yellow;
    if (ratio >= 0.15) return MULTIPLIER_THEME.yellow;
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
