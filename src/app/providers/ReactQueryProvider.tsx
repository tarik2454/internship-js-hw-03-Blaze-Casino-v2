"use client";

import { QueryClientProvider } from "@tanstack/react-query";
import { ReactNode, useState } from "react";
import { queryClient } from "@/shared/api/queryClient";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

export function ReactQueryProvider({ children }: { children: ReactNode }) {
  const [client] = useState(queryClient);

  return (
    <QueryClientProvider client={client}>
      {children}
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
