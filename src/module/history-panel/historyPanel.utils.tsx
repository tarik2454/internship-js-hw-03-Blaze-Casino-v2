import { createColumnHelper } from "@tanstack/react-table";
import {
  HistoryTableColumn,
  HistoryRow,
  type GameType,
} from "./historyPanel.types";
import type { MinesHistoryItem } from "@/config-api/mines/mines.types";
import { getTranslations } from "@/i18n";
import type { Locale } from "@/i18n";

const columnHelper = createColumnHelper<HistoryRow>();

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString);
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");
  return `${day}.${month}.${year}, ${hours}:${minutes}:${seconds}`;
};

export const createColumns = (
  styles: Record<string, string>,
  gameType: GameType,
  locale: Locale = "en",
): HistoryTableColumn[] => {
  const t = getTranslations(locale);
  if (gameType === "cases") {
    return [
      columnHelper.display({
        id: "createdAt",
        header: t.history.time,
      cell: (info) => (
        <span className={styles.historyDate}>
          {formatDate(info.row.original.createdAt)}
        </span>
      ),
    }),
    columnHelper.display({
      id: "caseName",
        header: t.history.case,
        cell: (info) => {
          const row = info.row.original;
          const cn = "caseName" in row ? row.caseName : undefined;
          return cn ? (
            <span>{(t.cases.names as Record<string, string>)[cn] ?? cn}</span>
          ) : (
            <span>-</span>
          );
        },
      }),
      columnHelper.display({
        id: "itemName",
        header: t.history.item,
        cell: (info) => {
          const row = info.row.original;
          return "itemName" in row ? (
            <span>{row.itemName}</span>
          ) : (
            <span>-</span>
          );
        },
      }),
      columnHelper.display({
        id: "itemRarity",
        header: t.history.rarity,
        cell: (info) => {
          const row = info.row.original;
          const ir = "itemRarity" in row ? row.itemRarity : undefined;
          return ir ? (
            <span style={{ textTransform: "capitalize" }}>
              {(t.cases.rarities as Record<string, string>)[ir.toLowerCase()] ?? ir}
            </span>
          ) : (
            <span>-</span>
          );
        },
      }),
      columnHelper.display({
        id: "itemValue",
        header: t.history.value,
        cell: (info) => {
          const row = info.row.original;
          return "itemValue" in row ? (
            <span className={styles.historyAmount}>${row.itemValue}</span>
          ) : (
            <span>-</span>
          );
        },
      }),
      columnHelper.display({
        id: "profit",
        header: t.history.profit,
        cell: (info) => {
          const row = info.row.original;
          const profit = "profit" in row ? row.profit : 0;
          const isProfit = profit > 0;
          const sign = profit >= 0 ? "+" : "";
          return (
            <span
              style={{
                color: isProfit ? "var(--color-success)" : "var(--color-error)",
                fontWeight: 600,
              }}
            >
              {sign}
              {profit}
            </span>
          );
        },
      }),
    ];
  }

  if (gameType === "mines") {
    return [
      columnHelper.display({
        id: "time",
        header: t.history.time,
        cell: (info) => {
          const row = info.row.original as MinesHistoryItem;
          const date =
            "finishedAt" in row && row.finishedAt
              ? row.finishedAt
              : row.createdAt;
          return <span className={styles.historyDate}>{formatDate(date)}</span>;
        },
      }),
      columnHelper.display({
        id: "bet",
        header: t.history.bet,
        cell: (info) => {
          const row = info.row.original as MinesHistoryItem;
          return (
            <span className={styles.historyAmount}>
              ${Number(row.betAmount ?? 0).toFixed(2)}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "multiplier",
        header: t.history.multiplier,
        cell: (info) => {
          const row = info.row.original as MinesHistoryItem;
          const multiplier = row.cashoutMultiplier ?? 0;
          const isWon = row.status === "won" || row.status === "cashed_out";
          return (
            <span
              style={{
                color: isWon ? "var(--color-success)" : "var(--color-error)",
                fontWeight: 600,
              }}
            >
              {multiplier > 0 ? `${Number(multiplier).toFixed(2)}x` : "0x"}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "winAmount",
        header: t.history.winAmount,
        cell: (info) => {
          const row = info.row.original as MinesHistoryItem;
          const value = row.winAmount ?? 0;
          const isWon = row.status === "won" || row.status === "cashed_out";
          return (
            <span
              style={{
                color: isWon ? "var(--color-success)" : "var(--color-error)",
                fontWeight: 600,
              }}
            >
              ${Number(value).toFixed(2)}
            </span>
          );
        },
      }),
      columnHelper.display({
        id: "status",
        header: t.history.status,
        cell: (info) => {
          const row = info.row.original as MinesHistoryItem;
          const isWon = row.status === "won" || row.status === "cashed_out";
          const statusKey = isWon ? "won" : "lost";
          const label = t.history.statuses[statusKey];
          return (
            <span
              style={{
                color: isWon ? "var(--color-success)" : "var(--color-error)",
                fontWeight: 600,
              }}
            >
              {label}
            </span>
          );
        },
      }),
    ];
  }

  const columns: HistoryTableColumn[] = [
    columnHelper.display({
      id: "createdAt",
      header: t.history.time,
      cell: (info) => (
        <span className={styles.historyDate}>
          {formatDate(info.row.original.createdAt)}
        </span>
      ),
    }),
    columnHelper.display({
      id: "bet",
      header: t.history.bet,
      cell: (info) => {
        const row = info.row.original;
        const amount =
          "amount" in row
            ? row.amount
            : "betAmount" in row
              ? row.betAmount
              : "casePrice" in row
                ? row.casePrice
                : 0;
        return <span className={styles.historyAmount}>${amount}</span>;
      },
    }),
  ];

  if (gameType === "plinko") {
    columns.push(
      columnHelper.display({
        id: "lines",
        header: t.history.lines,
        cell: (info) => {
          const row = info.row.original;
          if ("linesCount" in row) {
            return <span>{row.linesCount}</span>;
          }
          return <span>-</span>;
        },
      }),
      columnHelper.display({
        id: "risk",
        header: t.history.risk,
        cell: (info) => {
          const row = info.row.original;
          if ("riskLevel" in row) {
            const riskKey = row.riskLevel as keyof typeof t.history.riskLevels;
            return (
              <span style={{ textTransform: "capitalize" }}>
                {t.history.riskLevels[riskKey] ?? row.riskLevel}
              </span>
            );
          }
          return <span>-</span>;
        },
      }),
    );
  }

  columns.push(
    columnHelper.display({
      id: "multiplier",
      header: t.history.multiplier,
      cell: (info) => {
        const row = info.row.original;
        let multiplier: number | string | undefined;
        let isWon = false;

        if ("cashoutMultiplier" in row) {
          multiplier = row.cashoutMultiplier;
          isWon = row.status === "won";
        } else if ("avgMultiplier" in row) {
          multiplier = parseFloat(row.avgMultiplier);
          isWon =
            "status" in row && row.status != null
              ? row.status === "won"
              : row.totalWin > 0;
        }

        return (
          <span
            style={{ color: isWon ? "var(--color-success)" : "var(--color-error)", fontWeight: 600 }}
          >
            {multiplier ? `${multiplier}x` : "0x"}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: "winAmount",
      header: t.history.winAmount,
      cell: (info) => {
        const row = info.row.original;
        let winAmount: number | undefined;
        let isWon = false;

        if ("winAmount" in row) {
          winAmount = row.winAmount;
          isWon = row.status === "won";
        } else if ("totalWin" in row) {
          winAmount = row.totalWin;
          isWon =
            "status" in row && row.status != null
              ? row.status === "won"
              : row.totalWin > 0;
        } else if ("itemValue" in row) {
          winAmount = row.itemValue;
          isWon = row.profit > 0;
        }

        return (
          <span
            style={{ color: isWon ? "var(--color-success)" : "var(--color-error)", fontWeight: 600 }}
          >
            ${isWon ? (winAmount || 0).toFixed(2) : "0.00"}
          </span>
        );
      },
    }),
    columnHelper.display({
      id: "win",
      header: t.history.win,
      cell: (info) => {
        const row = info.row.original;
        let isWon = false;

        if ("status" in row && row.status != null) {
          isWon = row.status === "won";
        } else if ("totalWin" in row) {
          isWon = (row.totalWin as number) > 0;
        } else if ("profit" in row) {
          isWon = (row.profit as number) > 0;
        }

        return (
          <span
            style={{
              color: isWon ? "var(--color-success)" : "var(--color-error)",
              fontWeight: 600,
              textTransform: "capitalize",
            }}
          >
            {t.history.statuses[isWon ? "won" : "lost"]}
          </span>
        );
      },
    }),
  );

  return columns;
};
