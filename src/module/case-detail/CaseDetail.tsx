"use client";

import { useCase, useOpenCase } from "@/config-api/cases/useCases";
import { Container } from "@/shared/components/Container";
import { Section } from "@/shared/components/Section";
import { Button } from "@/shared/components/Button";
import styles from "./CaseDetail.module.scss";
import Image from "next/image";
import { Switch } from "@/shared/components/Switch";
import { CaseOpeningResponse } from "@/config-api/cases/cases.types";
import { useState } from "react";
import { OpeningResult } from "./components/OpeningResult";
import { CaseDetailItem } from "./CaseDetailItem";
import { CaseRoulette } from "./components/CaseRoulette";

interface CaseDetailProps {
  caseId: string;
}

export function CaseDetail({ caseId }: CaseDetailProps) {
  const [openingResult, setOpeningResult] =
    useState<CaseOpeningResponse | null>(null);
  const [isOpenResult, setIsOpenResult] = useState(false);
  const [withoutAnimation, setWithoutAnimation] = useState(false);
  const [rouletteDone, setRouletteDone] = useState(false);

  const { data: caseData, isLoading } = useCase(caseId);
  const { mutate: openCase, isPending } = useOpenCase();

  const handleCloseResult = (value: boolean) => {
    setIsOpenResult(value);
    if (!value) setRouletteDone(false);
  };

  const handleOpenCase = () => {
    if (!caseData) return;

    console.log(caseData);

    openCase(
      { id: caseId },
      {
        onSuccess: (response) => {
          setOpeningResult(response);
          setIsOpenResult(true);
        },
      },
    );
  };

  if (isLoading) {
    return (
      <Section>
        <Container>
          <div>Loading...</div>
        </Container>
      </Section>
    );
  }

  if (!caseData) {
    return (
      <Section>
        <Container>
          <div>Case not found</div>
        </Container>
      </Section>
    );
  }

  const showRoulette =
    isOpenResult &&
    openingResult &&
    !withoutAnimation &&
    caseData.items.length > 0 &&
    !rouletteDone;
  const showResult =
    isOpenResult && openingResult && (withoutAnimation || rouletteDone);

  return (
    <>
      {showRoulette && openingResult && caseData ? (
        <Section>
          <Container>
            <CaseRoulette
              items={caseData.items}
              winningItem={openingResult.item}
              onAnimationEnd={(skipped) =>
                skipped
                  ? setRouletteDone(true)
                  : setTimeout(() => setRouletteDone(true), 1000)
              }
            />
          </Container>
        </Section>
      ) : showResult && openingResult ? (
        <Section>
          <Container>
            <OpeningResult
              openingResult={openingResult}
              setIsOpenResult={handleCloseResult}
            />
          </Container>
        </Section>
      ) : (
        <Section>
          <Container>
            <div className={styles.caseDetail}>
              <div className={styles.GameArea}>
                <div>
                  <h1 className={styles.caseTitle}>
                    {caseData.name}
                    <span className={styles.casePrice}> ${caseData.price}</span>
                  </h1>

                  <div className={styles.caseImageWrapper}>
                    <Image
                      src="/images/cases/chest.svg"
                      alt={caseData.name}
                      className={styles.caseImage}
                      fill={true}
                    />
                  </div>
                </div>

                <aside className={styles.caseActions}>
                  <Button
                    onClick={handleOpenCase}
                    disabled={isPending}
                    stylesVariant="redGradient"
                    className={styles.openButton}
                  >
                    Open Case
                  </Button>

                  <div className={styles.switchWrapper}>
                    <Switch
                      checked={withoutAnimation}
                      onChange={() => setWithoutAnimation(!withoutAnimation)}
                      disabled={isPending}
                      className={styles.switch}
                    />
                    <span className={styles.switchLabel}>
                      without animation
                    </span>
                  </div>
                </aside>
              </div>

              <div className={styles.itemsList}>
                <h2 className={styles.itemsTitle}>Case content</h2>
                <ul className={styles.itemsGrid}>
                  {caseData.items.map((item) => (
                    <CaseDetailItem key={item.id} item={item} />
                  ))}
                </ul>
              </div>
            </div>
          </Container>
        </Section>
      )}
    </>
  );
}
