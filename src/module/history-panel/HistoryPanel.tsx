"use client";

import { useMemo } from "react";
import { Section } from "../../shared/components/Section";
import { Container } from "../../shared/components/Container";
import styles from "./HistoryPanel.module.scss";
import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from "@tanstack/react-table";
import { useGameHistory } from "./useGameHistory";
import { createColumns } from "./historyPanel.utils";

export function HistoryPanel() {
  const { data: history } = useGameHistory();

  const columns = useMemo(() => createColumns(styles), []);

  const tableData = useMemo(() => {
    if (!history) return [];
    if ("bets" in history) return history.bets;
    if ("drops" in history) return history.drops;
    return [];
  }, [history]);

  const table = useReactTable({
    data: tableData,
    columns,
    getCoreRowModel: getCoreRowModel(),
    getRowId: (row) => {
      if ("betId" in row) return row.betId;
      if ("id" in row) return row.id;
      return row._id;
    },
  });

  return (
    <Section className={styles.historySection}>
      <Container>
        <h2 className={styles.historyPanelTitle}>Game history</h2>

        <div className={styles.historyTableWrapper}>
          <table className={styles.historyTable}>
            <thead>
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id} className={styles.historyHeader}>
                  {headerGroup.headers.map((header) => (
                    <th key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody>
              {table.getRowModel().rows.map((row) => (
                <tr key={row.id} className={styles.historyItem}>
                  {row.getVisibleCells().map((cell) => (
                    <td key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Container>
    </Section>
  );
}
