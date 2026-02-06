import { PageWrapper } from "@/shared/components/PageWrapper";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "@/providers/getQueryClient";
import { queryKeyFactories } from "@/config-api/keys";
import { casesApi } from "@/config-api/cases/cases.api";
import { cookies } from "next/headers";
import { CaseDetail } from "@/module/case-detail/CaseDetail";
import { Breadcrumbs } from "@/shared/components/Breadcrumbs";

export default async function CaseDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const queryClient = getQueryClient();
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  await queryClient.prefetchQuery({
    queryKey: queryKeyFactories.cases.detail(id),
    queryFn: () => casesApi.getCase(id, token),
  });

  return (
    <PageWrapper>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <CaseDetail caseId={id} />
      </HydrationBoundary>
    </PageWrapper>
  );
}
