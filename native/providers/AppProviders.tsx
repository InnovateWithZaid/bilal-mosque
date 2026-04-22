import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import {
  PlusJakartaSans_400Regular,
  PlusJakartaSans_500Medium,
  PlusJakartaSans_600SemiBold,
  PlusJakartaSans_700Bold,
  PlusJakartaSans_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/plus-jakarta-sans";

import { LoadingState } from "@/components/LoadingState";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { MosqueDataProvider } from "@/contexts/MosqueDataContext";

export function AppProviders({ children }: { children: ReactNode }) {
  const [queryClient] = useState(() => new QueryClient());
  const [fontsLoaded] = useFonts({
    PlusJakartaSans_400Regular,
    PlusJakartaSans_500Medium,
    PlusJakartaSans_600SemiBold,
    PlusJakartaSans_700Bold,
    PlusJakartaSans_800ExtraBold,
  });

  if (!fontsLoaded) {
    return <LoadingState label="Preparing Bilal..." />;
  }

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
