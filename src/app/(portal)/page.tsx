import { ListGames } from "@/module/list-games/ListGames";
import { Container } from "../../shared/components/Container";
import { Chat } from "@/module/chat/Chat";

export default function Home() {
  return (
    <Container>
      <ListGames />
      <Chat />
    </Container>
  );
}
