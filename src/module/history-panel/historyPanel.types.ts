import { ColumnDef } from "@tanstack/react-table";
import { CrashBet } from "@/config-api/crash/crash.types";
import { PlinkoDrop } from "@/config-api/plinko/plinko.types";
import { CaseOpening } from "@/config-api/cases/cases.types";
import { MinesHistoryItem } from "@/config-api/mines/mines.types";

export type GameType = "crash" | "cases" | "mines" | "plinko";
export type HistoryRow = CrashBet | PlinkoDrop | CaseOpening | MinesHistoryItem;
export type HistoryTableColumn = ColumnDef<HistoryRow>;
