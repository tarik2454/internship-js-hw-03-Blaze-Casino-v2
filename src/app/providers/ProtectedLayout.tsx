"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/shared/constants/routes";
import { useCurrentUser } from "@/config-api/user/useUser";
import { Loader } from "@/shared/components/Loader";
import { ApiError } from "@/config-api/error.types";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();
  const { data, isError, isLoading, error } = useCurrentUser();

  useEffect(() => {
    if (!isLoading && (isError || !data)) {
      if (isError && (error as ApiError)?.status !== 401) {
        return;
      }
      router.push(ROUTES.LOGIN);
    }
  }, [isLoading, isError, data, router, error]);

  if (isLoading) {
    return <Loader />;
  }

  if (isError && (error as ApiError)?.status !== 401) {
    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-error-foreground">
        <div className="text-center">
          <h1 className="text-2xl font-bold">Error loading profile</h1>
          <p>Please check your internet connection and try again.</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 rounded bg-primary px-4 py-2 text-white"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  if (!data) {
    return <Loader />;
  }

  return <>{children}</>;
}
