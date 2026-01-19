import { Container } from "@/shared/components/Container";
import { PageWrapper } from "@/shared/components/PageWrapper";
import { Crush } from "@/module/crush/Crush";
import { HistoryPanel } from "@/module/history-panel/HistoryPanel";
import { queryKeyFactories } from "@/config-api/keys";
import { getQueryClient } from "@/app/providers/getQueryClient";
import { cookies } from "next/headers";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { crashApi } from "@/config-api/crash/crash.api";

export default async function CrashPage() {
  const queryClient = getQueryClient();
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  await queryClient.prefetchQuery({
    queryKey: queryKeyFactories.crash.history(10, 0),
    queryFn: () => crashApi.getHistory(10, 0, token),
  });

  return (
    <PageWrapper>
      <Crush />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HistoryPanel />
      </HydrationBoundary>
    </PageWrapper>
  );
}
