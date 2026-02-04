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
    const apiError = error as ApiError;
    const isNetworkOrConfig =
      apiError?.status == null ||
      apiError?.status === 0 ||
      apiError?.message?.toLowerCase().includes("network");
    const apiUrlSet =
      typeof process.env.NEXT_PUBLIC_API_URL === "string" &&
      process.env.NEXT_PUBLIC_API_URL.length > 0;

    return (
      <div className="flex h-screen w-full items-center justify-center bg-background text-error-foreground">
        <div className="text-center max-w-md px-4">
          <h1 className="text-2xl font-bold">Error loading profile</h1>
          <p className="mt-2">
            {apiError?.message ||
              "Please check your internet connection and try again."}
          </p>
          {isNetworkOrConfig && !apiUrlSet && (
            <p className="mt-3 text-sm opacity-90">
              On Vercel, set{" "}
              <code className="bg-black/20 px-1 rounded">
                NEXT_PUBLIC_API_URL
              </code>{" "}
              to your backend URL (e.g. https://api.example.com).
            </p>
          )}
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
