import { ListGames } from "@/module/list-games/ListGames";
import { Container } from "../../shared/components/Container";
import { Chat } from "@/module/chat/Chat";
import { Leaderboard } from "@/module/Leaderboard/Leaderboard";

export default function Home() {
  return (
    <Container>
      <Leaderboard />
      <ListGames />
      <Chat />
    </Container>
  );
}
