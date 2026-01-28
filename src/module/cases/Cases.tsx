"use client";

import { useCases } from "@/config-api/cases/useCases";
import { Container } from "@/shared/components/Container";
import { Section } from "@/shared/components/Section";
import styles from "./Cases.module.scss";

export function Cases() {
  const { data: cases } = useCases();

  return (
    <Section>
      <Container>
        <ul className={styles.casesList}>
          {cases?.cases.map(({ id, name }) => (
            <li key={id} className={styles.caseItem}>
              <h3>{name}</h3>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
