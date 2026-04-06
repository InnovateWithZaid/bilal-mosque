import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";

import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { MosqueDataProvider } from "@/contexts/MosqueDataContext";

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());

  return (
    <QueryClientProvider client={queryClient}>
      <MosqueDataProvider>
        <FavoritesProvider>
          <AdminAuthProvider>{children}</AdminAuthProvider>
        </FavoritesProvider>
      </MosqueDataProvider>
    </QueryClientProvider>
  );
}
