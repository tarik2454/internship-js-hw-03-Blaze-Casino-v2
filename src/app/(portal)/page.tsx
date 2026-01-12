import { ListGames } from "@/module/list-games/ListGames";
import { Container } from "../../shared/components/Container";
import { Chat } from "@/module/chat/Chat";
import { Leaderboard } from "../../module/leaderboard/Leaderboard";
import styles from "./page.module.scss";
import { PageWrapper } from "@/shared/components/PageWrapper";

export default function Home() {
  return (
    <PageWrapper>
      <Container>
        <div className={styles.page}>
          <ListGames />
          <Leaderboard />
          <Chat />
        </div>
      </Container>
    </PageWrapper>
  );
}
