import { HistoryPanel } from "@/module/history-panel/HistoryPanel";
import { PageWrapper } from "@/shared/components/PageWrapper";
import { Cases } from "@/module/cases/Cases";
import { dehydrate, HydrationBoundary, useQuery } from "@tanstack/react-query";
import { getQueryClient } from "@/app/providers/getQueryClient";
import { queryKeyFactories } from "@/config-api/keys";
import { casesApi } from "@/config-api/cases/cases.api";
import { cookies } from "next/headers";

export default async function CasePage() {
  const queryClient = getQueryClient();
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  await queryClient.prefetchQuery({
    queryKey: queryKeyFactories.cases.userHistory(10, 0),
    queryFn: () => casesApi.getUserHistory(10, 0, token),
  });

  await queryClient.prefetchQuery({
    queryKey: queryKeyFactories.cases.all(),
    queryFn: () => casesApi.getCases(token),
  });

  return (
    <PageWrapper>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Cases />
        <HistoryPanel />
      </HydrationBoundary>
    </PageWrapper>
  );
}
