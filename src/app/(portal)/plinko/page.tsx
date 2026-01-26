import { Plinko } from "@/module/plinko/Plinko";
import { HistoryPanel } from "@/module/history-panel/HistoryPanel";
import { PageWrapper } from "@/shared/components/PageWrapper";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/app/providers/getQueryClient";
import { cookies } from "next/headers";
import { queryKeyFactories } from "@/config-api/keys";
import { plinkoApi } from "@/config-api/plinko/plinko.api";

export default async function PlinkoPage() {
  const queryClient = getQueryClient();
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  await queryClient.prefetchQuery({
    queryKey: queryKeyFactories.plinko.userHistory(10, 0),
    queryFn: () => plinkoApi.getUserHistory(10, 0, token),
  });

  return (
    <PageWrapper>
      <Plinko />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HistoryPanel />
      </HydrationBoundary>
    </PageWrapper>
  );
}
