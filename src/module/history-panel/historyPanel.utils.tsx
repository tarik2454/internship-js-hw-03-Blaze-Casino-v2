import { createColumnHelper } from "@tanstack/react-table";
import { CrashBet } from "@/config-api/crash/crash.types";
import { HistoryTableColumn } from "./historyPanel.types";

const columnHelper = createColumnHelper<CrashBet>();

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
  columnHelper.accessor("createdAt", {
    header: "Time",
    cell: (info) => (
      <span className={styles.historyDate}>{formatDate(info.getValue())}</span>
    ),
  }),
  columnHelper.accessor("amount", {
    header: "Bet",
    cell: (info) => (
      <span className={styles.historyAmount}>${info.getValue()}</span>
    ),
  }),
  columnHelper.accessor("cashoutMultiplier", {
    header: "Multiplier",
    cell: (info) => {
      const isWon = info.row.original.status === "won";
      return (
        <span style={{ color: isWon ? "#82C91E" : "#C62121", fontWeight: 600 }}>
          {info.getValue()}
          {isWon ? "x" : "0x"}
        </span>
      );
    },
  }),
  columnHelper.accessor("winAmount", {
    header: "Win Amount",
    cell: (info) => {
      const isWon = info.row.original.status === "won";
      return (
        <span style={{ color: isWon ? "#82C91E" : "#C62121", fontWeight: 600 }}>
          ${isWon ? info.getValue() : "0.00"}
        </span>
      );
    },
  }),
  columnHelper.accessor("status", {
    header: "Status",
    cell: (info) => {
      const isWon = info.getValue() === "won";
      return (
        <span
          style={{
            color: isWon ? "#82C91E" : "#C62121",
            fontWeight: 600,
            textTransform: "capitalize",
          }}
        >
          {info.getValue()}
        </span>
      );
    },
  }),
];
