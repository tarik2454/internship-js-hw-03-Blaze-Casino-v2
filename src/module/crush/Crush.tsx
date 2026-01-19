import { Container } from "@/shared/components/Container";
import { Section } from "@/shared/components/Section";
import styles from "./Crush.module.scss";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import Image from "next/image";

export function Crush() {
  return (
    <>
      <Section className={styles.crushSection}>
        <Container>
          <div className={styles.crushWrapper}>
            <div className={styles.crushArea}>
              <p className={styles.crushAreaValue}>1.00X</p>
              <p className={styles.crushAreaDescription}>Waiting for bets...</p>
            </div>

            <div className={styles.settingsPanelWrapper}>
              <p className={styles.settingsPanelTitle}>Crash Configuration</p>
              <div className={styles.settingsPanel}>
                <div className={styles.inputWrapper}>
                  <Input
                    label="Bet Amount"
                    type="number"
                    placeholder="10.000"
                    labelClassName={styles.label}
                    inputClassName={styles.inputBetAmount}
                    stylesVariant="gameInput"
                  />
                  <Image
                    src="/images/common/dollar.svg"
                    alt="Dollar"
                    width={24}
                    height={24}
                    className={styles.dollarIcon}
                  />
                </div>

                <div className={styles.inputWrapper}>
                  <Input
                    label="Auto Cashout (optional)"
                    type="number"
                    placeholder="e.g 2.00"
                    labelClassName={styles.label}
                    inputClassName={styles.inputAutoCashout}
                    stylesVariant="gameInput"
                  />
                </div>
              </div>

              <div className={styles.buttonsWrapper}>
                <Button stylesVariant="redGradient">Place bet</Button>
                <Button stylesVariant="yellowGradient">Cashout</Button>
              </div>

              <div className={styles.resultsWrapper}>
                <p className={styles.resultItem}>
                  Current Multiplier:
                  <span className={styles.resultValue}>1.00X</span>
                </p>
                <p className={styles.resultItem}>
                  Potential Win:
                  <span className={styles.resultValue}>0.00$</span>
                </p>
              </div>
            </div>
          </div>
        </Container>
      </Section>
    </>
  );
}
