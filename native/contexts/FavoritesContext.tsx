import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { getJson, setJson } from "@/lib/storage";

type FavoritesContextValue = {
  favorites: string[];
  ready: boolean;
  addFavorite: (mosqueId: string) => Promise<void>;
  removeFavorite: (mosqueId: string) => Promise<void>;
  toggleFavorite: (mosqueId: string) => Promise<void>;
  isFavorite: (mosqueId: string) => boolean;
};

const STORAGE_KEY = "bilal_native_favorites";
const FavoritesContext = createContext<FavoritesContextValue | undefined>(undefined);

export function FavoritesProvider({ children }: { children: ReactNode }) {
  const [favorites, setFavorites] = useState<string[]>([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    getJson<string[]>(STORAGE_KEY, []).then((value) => {
      setFavorites(value);
      setReady(true);
    });
  }, []);

  const persist = useCallback(async (nextValue: string[]) => {
    setFavorites(nextValue);
    await setJson(STORAGE_KEY, nextValue);
  }, []);

  const addFavorite = useCallback(
    async (mosqueId: string) => {
      if (favorites.includes(mosqueId)) {
        return;
      }

      await persist([...favorites, mosqueId]);
    },
    [favorites, persist],
  );

  const removeFavorite = useCallback(
    async (mosqueId: string) => {
      await persist(favorites.filter((id) => id !== mosqueId));
    },
    [favorites, persist],
  );

  const toggleFavorite = useCallback(
    async (mosqueId: string) => {
      if (favorites.includes(mosqueId)) {
        await removeFavorite(mosqueId);
        return;
      }

      await addFavorite(mosqueId);
    },
    [addFavorite, favorites, removeFavorite],
  );

  const value = useMemo<FavoritesContextValue>(
    () => ({
      favorites,
      ready,
      addFavorite,
      removeFavorite,
      toggleFavorite,
      isFavorite: (mosqueId) => favorites.includes(mosqueId),
    }),
    [addFavorite, favorites, ready, removeFavorite, toggleFavorite],
  );

  return <FavoritesContext.Provider value={value}>{children}</FavoritesContext.Provider>;
}

export function useFavorites() {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within FavoritesProvider");
  }

  return context;
}
