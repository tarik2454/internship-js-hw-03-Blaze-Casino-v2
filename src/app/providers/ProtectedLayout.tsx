"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/shared/constants/routes";
import { useCurrentUser } from "@/config-api/user/useUser";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();
  const { data, isError, isLoading } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && (isError || !data)) {
      router.push(ROUTES.LOGIN);
    }
  }, [isLoading, isError, data, router]);

  if (isLoading || isError || !data) {
    return null;
  }

  return <>{children}</>;
}
