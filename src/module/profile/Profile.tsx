"use client";

import { Section } from "@/shared/components/Section";
import { Container } from "@/shared/components/Container";
import { useCurrentUser } from "@/config-api/user/useUser";
import Image from "next/image";
import styles from "./Profile.module.scss";

export default function Profile() {
  const { data: currentUser } = useCurrentUser();

  console.log("currentUser", currentUser);

  return (
    <Section>
      <Container>
        <div>
          <Image
            src={currentUser?.avatarURL ?? ""}
            alt="User Avatar"
            width={96}
            height={96}
            className={styles.profileAvatar}
          />
          <h2>{currentUser?.username}</h2>
        </div>

        <div>
          <p>
            Total game <span>{currentUser?.gamesPlayed}</span>
          </p>
          <p>
            Win <span>{currentUser?.totalWon}</span>
          </p>
          <p>
            Loss
            <span>
              {currentUser?.totalWagered
                ? currentUser?.totalWagered - (currentUser?.totalWon ?? 0)
                : 0}
            </span>
          </p>
          <Image
            src="/images/common/dollar.svg"
            alt="Dollar"
            width={16}
            height={16}
          />
        </div>
      </Container>
    </Section>
  );
}
