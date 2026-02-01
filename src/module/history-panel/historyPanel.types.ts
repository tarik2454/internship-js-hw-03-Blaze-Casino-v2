import { ColumnDef } from "@tanstack/react-table";
import { CrashBet } from "@/config-api/crash/crash.types";
import { PlinkoDrop } from "@/config-api/plinko/plinko.types";

export type HistoryRow = CrashBet | PlinkoDrop;
export type HistoryTableColumn = ColumnDef<HistoryRow>;
