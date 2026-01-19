"use client";

import { Section } from "../../shared/components/Section";
import { Container } from "../../shared/components/Container";
import styles from "./HistoryPanel.module.scss";
import {
  useReactTable,
  ColumnResizeMode,
  getCoreRowModel,
  ColumnDef,
  flexRender,
  ColumnResizeDirection,
} from "@tanstack/react-table";
import { useGameHistory } from "./useGameHistory";

export function HistoryPanel() {
  const { data: history, isLoading, error } = useGameHistory();

  return (
    <Section>
      <Container>
        <h2 className={styles.historyPanelTitle}>Game history</h2>
        {isLoading && <div>Loading...</div>}
        {error && <div>Error: {error.message}</div>}
        {history && (
          <div>
            <table>
              <thead>
                <tr>
                  <th>Time</th>
                  <th>Bet</th>
                  <th>Multiplier</th>
                  <th>Win Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
            </table>
          </div>
        )}
      </Container>
    </Section>
  );
}
