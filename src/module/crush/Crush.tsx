"use client";

import { useState } from "react";
import { Container } from "@/shared/components/Container";
import { Section } from "@/shared/components/Section";
import styles from "./Crush.module.scss";
import { Input } from "@/shared/components/Input";
import { Button } from "@/shared/components/Button";
import Image from "next/image";
import { Switch } from "@/shared/components/Switch";
import { DollarBtnIcon } from "@/shared/icons/dollar-btn";
import { WalletBtnIcon } from "@/shared/icons/wallet-btn";

export function Crush() {
  const [isAuto, setIsAuto] = useState(false);

  return (
    <>
      <Section className={styles.crushSection}>
        <Container>
          <div className={styles.crushWrapper}>
            <div className={styles.crushArea}>
              <p className={styles.crushAreaValue}>1.00X</p>
              <p className={styles.crushAreaDescription}>Waiting for bets...</p>
            </div>

            <aside className={styles.settingsPanelWrapper}>
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

                  <div className={styles.betButtonsWrapper}>
                    <Button className={styles.betButton}>1/2</Button>
                    <Button className={styles.betButton}>x2</Button>
                    <Button className={styles.betButton}>Max</Button>
                  </div>

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

                  <Switch
                    checked={isAuto}
                    onChange={setIsAuto}
                    disabled={false}
                    className={styles.switchCashout}
                  />
                </div>
              </div>

              <div className={styles.actionButtonsWrapper}>
                <Button
                  stylesVariant="redGradient"
                  className={styles.actionButton}
                >
                  Place Bet
                  <span className={styles.actionButtonIcon}>
                    <DollarBtnIcon />
                  </span>
                </Button>
                <Button
                  stylesVariant="yellowGradient"
                  className={styles.actionButton}
                >
                  Cashout
                  <span className={styles.actionButtonIcon}>
                    <WalletBtnIcon />
                  </span>
                </Button>
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
            </aside>
          </div>
        </Container>
      </Section>
    </>
  );
}
