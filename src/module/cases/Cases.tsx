"use client";

import { useCases } from "@/config-api/cases/useCases";
import { Container } from "@/shared/components/Container";
import { Section } from "@/shared/components/Section";
import styles from "./Cases.module.scss";
import Image from "next/image";
import Link from "next/link";
import { ROUTES } from "@/shared/constants/routes";

export function Cases() {
  const { data } = useCases();

  return (
    <Section>
      <Container>
        <ul className={styles.casesList}>
          {data?.cases.map(({ id, name, price, description }, index) => {
            const starsCount = index + 1;
            return (
              <li key={id} className={styles.caseItem}>
                <Link href={ROUTES.CASE_DETAIL(id)} className={styles.caseLink}>
                  <div className={styles.starsWrapper}>
                    {Array.from({ length: starsCount }).map((_, i) => (
                      <Image
                        key={i}
                        src="/images/cases/star.svg"
                        alt="Star"
                        width={16}
                        height={16}
                      />
                    ))}
                  </div>

                  <h3 className={styles.caseName}>{name}</h3>

                  <div className={styles.casePrice}>
                    {price}
                    <Image
                      src="/images/common/dollar.svg"
                      alt="Dollar"
                      width={16}
                      height={16}
                    />
                  </div>

                  <div className={styles.caseImageWrapper}>
                    <Image
                      src={"/images/cases/chest.svg"}
                      alt={name}
                      width={157}
                      height={84}
                      className={styles.caseImage}
                    />
                  </div>
                </Link>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
