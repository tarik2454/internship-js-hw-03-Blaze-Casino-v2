import { Header } from "@/module/header/Header";
import ProtectedLayout from "../../providers/ProtectedLayout";
import { SoundProvider } from "../../providers/SoundProvider";
import { dehydrate, HydrationBoundary } from "@tanstack/react-query";
import { getQueryClient } from "../../providers/getQueryClient";
import { userApi } from "@/config-api/user/user.api";
import { queryKeyFactories } from "@/config-api/keys";
import { cookies } from "next/headers";

export default async function PortalLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const queryClient = getQueryClient();
  const cookieStore = await cookies();
  const token = cookieStore.get("accessToken")?.value;

  await queryClient.prefetchQuery({
    queryKey: queryKeyFactories.user.current(),
    queryFn: () => userApi.getCurrentUser(token),
  });

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProtectedLayout>
        <SoundProvider>
          <Header />
          <main>{children}</main>
        </SoundProvider>
      </ProtectedLayout>
    </HydrationBoundary>
  );
}
