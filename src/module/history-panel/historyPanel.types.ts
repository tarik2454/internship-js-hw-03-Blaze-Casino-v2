import { ColumnDef } from "@tanstack/react-table";
import { CrashBet } from "@/config-api/crash/crash.types";
import { PlinkoDrop } from "@/config-api/plinko/plinko.types";
import { CaseOpening } from "@/config-api/cases/cases.types";

export type GameType = "crash" | "cases" | "mines" | "plinko";
export type HistoryRow = CrashBet | PlinkoDrop | CaseOpening;
export type HistoryTableColumn = ColumnDef<HistoryRow>;
