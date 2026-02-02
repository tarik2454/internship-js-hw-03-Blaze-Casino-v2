import { Chat } from "@/module/chat/Chat";
import { HistoryPanel } from "@/module/history-panel/HistoryPanel";
import { Mines } from "@/module/mines/Mines";
import { PageWrapper } from "@/shared/components/PageWrapper";
import { getQueryClient } from "@/app/providers/getQueryClient";
import { cookies } from "next/headers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { queryKeyFactories } from "@/config-api/keys";
import { minesApi } from "@/config-api/mines/mines.api";

export default async function MinesPage() {
  const queryClient = getQueryClient();
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  await queryClient.prefetchQuery({
    queryKey: queryKeyFactories.mines.userHistory(10, 0),
    queryFn: () => minesApi.getHistory(10, 0, token),
  });

  return (
    <PageWrapper>
      <Mines />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HistoryPanel />
      </HydrationBoundary>
    </PageWrapper>
  );
}
