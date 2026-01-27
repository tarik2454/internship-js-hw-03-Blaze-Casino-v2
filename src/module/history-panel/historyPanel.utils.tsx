import { createColumnHelper } from "@tanstack/react-table";
import { HistoryTableColumn, HistoryRow } from "./historyPanel.types";

const columnHelper = createColumnHelper<HistoryRow>();

export const formatDate = (dateString: string) => {
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
): HistoryTableColumn[] => [
  columnHelper.display({
    id: "createdAt",
    header: "Time",
    cell: (info) => (
      <span className={styles.historyDate}>{formatDate(info.row.original.createdAt)}</span>
    ),
  }),
  columnHelper.display({
    id: "bet",
    header: "Bet",
    cell: (info) => {
      const row = info.row.original;
      const amount = "amount" in row ? row.amount : row.betAmount;
      return <span className={styles.historyAmount}>${amount}</span>;
    },
  }),
  columnHelper.display({
    id: "lines",
    header: "Lines",
    cell: (info) => {
      const row = info.row.original;
      if ("linesCount" in row) {
        // Plinko
        return <span>{row.linesCount}</span>;
      }
      // Crash - пустая ячейка
      return <span>-</span>;
    },
  }),
  columnHelper.display({
    id: "risk",
    header: "Risk",
    cell: (info) => {
      const row = info.row.original;
      if ("riskLevel" in row) {
        // Plinko
        return (
          <span style={{ textTransform: "capitalize" }}>
            {row.riskLevel}
          </span>
        );
      }
      // Crash - пустая ячейка
      return <span>-</span>;
    },
  }),
  columnHelper.display({
    id: "multiplier",
    header: "Multiplier",
    cell: (info) => {
      const row = info.row.original;
      let multiplier: number | string | undefined;
      let isWon = false;

      if ("cashoutMultiplier" in row) {
        // Crash
        multiplier = row.cashoutMultiplier;
        isWon = row.status === "won";
      } else if ("avgMultiplier" in row) {
        // Plinko
        multiplier = parseFloat(row.avgMultiplier);
        isWon = row.totalWin > 0;
      }

      return (
        <span style={{ color: isWon ? "#82C91E" : "#C62121", fontWeight: 600 }}>
          {multiplier ? `${multiplier}x` : "0x"}
        </span>
      );
    },
  }),
  columnHelper.display({
    id: "winAmount",
    header: "Win Amount",
    cell: (info) => {
      const row = info.row.original;
      let winAmount: number | undefined;
      let isWon = false;

      if ("winAmount" in row) {
        // Crash
        winAmount = row.winAmount;
        isWon = row.status === "won";
      } else if ("totalWin" in row) {
        // Plinko
        winAmount = row.totalWin;
        isWon = row.totalWin > 0;
      }

      return (
        <span style={{ color: isWon ? "#82C91E" : "#C62121", fontWeight: 600 }}>
          ${isWon ? (winAmount || 0).toFixed(2) : "0.00"}
        </span>
      );
    },
  }),
  columnHelper.display({
    id: "win",
    header: "Win",
    cell: (info) => {
      const row = info.row.original;
      let isWon = false;

      if ("status" in row) {
        // Crash
        isWon = row.status === "won";
      } else if ("totalWin" in row) {
        // Plinko
        isWon = row.totalWin > 0;
      }

      return (
        <span
          style={{
            color: isWon ? "#82C91E" : "#C62121",
            fontWeight: 600,
            textTransform: "capitalize",
          }}
        >
          {isWon ? "won" : "lost"}
        </span>
      );
    },
  }),
];
