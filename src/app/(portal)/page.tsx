import { GamesList } from "@/module/games-list/GamesList";
import { Container } from "@/shared/components/Container";
import { Chat } from "@/module/chat/Chat";
import { Leaderboard } from "@/module/leaderboard/Leaderboard";
import styles from "./page.module.scss";
import { PageWrapper } from "@/shared/components/PageWrapper";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "../../providers/getQueryClient";
import { leaderboardApi } from "@/config-api/leaderboard/leaderboard.api";
import { queryKeyFactories } from "@/config-api/keys";
import { cookies } from "next/headers";

export default async function Home() {
  const queryClient = getQueryClient();
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  await queryClient.prefetchQuery({
    queryKey: queryKeyFactories.leaderboard.all,
    queryFn: () => leaderboardApi.getLeaderboard(token),
  });

  return (
    <PageWrapper>
      <Container>
        <div className={styles.page}>
          <GamesList />
          <HydrationBoundary state={dehydrate(queryClient)}>
            <Leaderboard />
          </HydrationBoundary>
          <Chat />
        </div>
      </Container>
    </PageWrapper>
  );
}
