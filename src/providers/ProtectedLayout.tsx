"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { ROUTES } from "@/shared/constants/routes";
import { useCurrentUser } from "@/config-api/user/useUser";
import { Loader } from "@/shared/components/Loader";
import { ApiError } from "@/config-api/error.types";
import styles from "./ProtectedLayout.module.scss";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();
  const { data, isError, isLoading, error } = useCurrentUser();

  const apiError = error as ApiError;
  const status = apiError?.status;
  const isAuthError =
    isError && (status === 401 || status === 403 || status === 404);

  useEffect(() => {
    if (!isLoading && isAuthError) {
      router.push(ROUTES.LOGIN);
    }
  }, [isLoading, isAuthError, router]);

  if (isLoading) {
    return <Loader />;
  }

  // Handle errors
  if (isError) {
    // If it's an auth error, the effect will handle redirect; show loader in meantime
    if (isAuthError) {
      return <Loader />;
    }

    // For non-auth errors (network, 500, etc.), show error UI
    const isNetworkOrConfig =
      status == null ||
      status === 0 ||
      apiError?.message?.toLowerCase().includes("network");
    const apiUrlSet =
      typeof process.env.NEXT_PUBLIC_API_URL === "string" &&
      process.env.NEXT_PUBLIC_API_URL.length > 0;

    return (
      <div className={styles.container}>
        <div className={styles.content}>
          <h1 className={styles.title}>Error loading profile</h1>
          <p className={styles.message}>
            {apiError?.message ||
              "Please check your internet connection and try again."}
          </p>
          {isNetworkOrConfig && !apiUrlSet && (
            <p className={styles.hint}>
              On Vercel, set{" "}
              <code className={styles.code}>NEXT_PUBLIC_API_URL</code> to your
              backend URL.
            </p>
          )}
          <button
            onClick={() => window.location.reload()}
            className={styles.retryButton}
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // If not loading and no error, but no data... theoretically shouldn't happen if API succeeds,
  // but if it does, show loader (or could handle as auth error)
  if (!data) {
    return <Loader />;
  }

  return <>{children}</>;
}
