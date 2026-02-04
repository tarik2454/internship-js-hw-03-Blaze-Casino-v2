import Profile from "@/module/profile/Profile";
import { PageWrapper } from "@/shared/components/PageWrapper";
import Bonus from "@/module/bonus/Bonus";
import { queryKeyFactories } from "@/config-api/keys";
import { getQueryClient } from "@/providers/getQueryClient";
import { cookies } from "next/headers";
import { userApi } from "@/config-api/user/user.api";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { bonusApi } from "@/config-api/bonus/bonus.api";

export default async function ProfilePage() {
  const queryClient = getQueryClient();
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  await queryClient.prefetchQuery({
    queryKey: queryKeyFactories.user.current(),
    queryFn: () => userApi.getCurrentUser(token),
  });

  await queryClient.prefetchQuery({
    queryKey: queryKeyFactories.bonus.status(),
    queryFn: () => bonusApi.getBonusStatus(token),
  });

  return (
    <PageWrapper>
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Profile />
        <Bonus />
      </HydrationBoundary>
    </PageWrapper>
  );
}
