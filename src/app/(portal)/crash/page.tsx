import { PageWrapper } from "@/shared/components/PageWrapper";
import { Crash } from "@/module/crash/Crash";
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
    queryKey: queryKeyFactories.crash.userHistory(10, 0),
    queryFn: () => crashApi.getUserHistory(10, 0, token),
  });

  return (
    <PageWrapper>
      <Crash />
      <HydrationBoundary state={dehydrate(queryClient)}>
        <HistoryPanel />
      </HydrationBoundary>
    </PageWrapper>
  );
}
