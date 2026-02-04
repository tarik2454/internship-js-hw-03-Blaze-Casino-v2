"use client";

import { useBonus } from "@/config-api/bonus/useBonus";
import { Container } from "@/shared/components/Container";
import { Section } from "@/shared/components/Section";

export default function Bonus() {
  const { data: bonusStatusData } = useBonus();

  console.log("bonusStatusData", bonusStatusData);

  return (
    <Section>
      <Container>
        <h2>Bonus</h2>
      </Container>
    </Section>
  );
}
