"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { SESSION_ROUTES } from "@/module/session/session.constants";

interface ProtectedLayoutProps {
  children: React.ReactNode;
}

export default function ProtectedLayout({ children }: ProtectedLayoutProps) {
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("accessToken");
    if (!token) {
      router.push(SESSION_ROUTES.LOGIN);
    }
  }, [router]);

  return <>{children}</>;
}
