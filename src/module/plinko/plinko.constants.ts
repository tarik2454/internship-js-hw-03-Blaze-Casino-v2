import type {
  RiskLevel,
  LinesCount,
  BallsCount,
} from "@/config-api/plinko/plinko.types";

export const PLINKO_RISK_LEVELS: RiskLevel[] = ["low", "medium", "high"];

export const PLINKO_LINES: LinesCount[] = [8, 10, 12, 14, 16];

export const PLINKO_BALLS: BallsCount[] = [1, 2, 5, 10];

export const MULTIPLIER_THEME = {
  darkRed: "#C62121",
  red: "#D34521",
  orange: "#D38321",
  yellow: "#D3B621",
  green: "#82C91E",
};
