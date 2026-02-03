"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useEffect } from "react";
import { getQueryClient } from "./getQueryClient";
import { QueryClient } from "@tanstack/react-query";

// TypeScript declaration for browser DevTools
declare global {
  interface Window {
    __TANSTACK_QUERY_CLIENT__: QueryClient;
  }
}

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const queryClient = getQueryClient();

  // Expose QueryClient to browser DevTools
  useEffect(() => {
    if (typeof window !== "undefined") {
      window.__TANSTACK_QUERY_CLIENT__ = queryClient;
    }
  }, [queryClient]);

  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}
