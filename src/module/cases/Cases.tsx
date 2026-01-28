"use client";

import { useCases } from "@/config-api/cases/useCases";
import { Container } from "@/shared/components/Container";
import { Section } from "@/shared/components/Section";
import styles from "./Cases.module.scss";
import Image from "next/image";

export function Cases() {
  const { data } = useCases();

  return (
    <Section>
      <Container>
        <ul className={styles.casesList}>
          {data?.cases.map(({ id, name, description }) => (
            <li key={id} className={styles.caseItem}>
              <h3>{name}</h3>
              <Image
                src={"/images/cases/chest.svg"}
                alt={name}
                width={100}
                height={100}
                className={styles.caseImage}
              />

              <p className={styles.caseDescription}>{description}</p>
            </li>
          ))}
        </ul>
      </Container>
    </Section>
  );
}
