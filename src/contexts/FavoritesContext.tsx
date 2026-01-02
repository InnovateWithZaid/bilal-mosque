import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';

interface FavoritesContextType {
  favorites: string[];
  addFavorite: (mosqueId: string) => void;
  removeFavorite: (mosqueId: string) => void;
  toggleFavorite: (mosqueId: string) => void;
  isFavorite: (mosqueId: string) => boolean;
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(undefined);

const STORAGE_KEY = 'bilal-favorites';

export const FavoritesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(favorites));
  }, [favorites]);

  const addFavorite = useCallback((mosqueId: string) => {
    setFavorites(prev => {
      if (prev.includes(mosqueId)) return prev;
      return [...prev, mosqueId];
    });
  }, []);

  const removeFavorite = useCallback((mosqueId: string) => {
    setFavorites(prev => prev.filter(id => id !== mosqueId));
  }, []);

  const toggleFavorite = useCallback((mosqueId: string) => {
    setFavorites(prev => {
      if (prev.includes(mosqueId)) {
        return prev.filter(id => id !== mosqueId);
      }
      return [...prev, mosqueId];
    });
  }, []);

  const isFavorite = useCallback((mosqueId: string) => {
    return favorites.includes(mosqueId);
  }, [favorites]);

  return (
    <FavoritesContext.Provider value={{ favorites, addFavorite, removeFavorite, toggleFavorite, isFavorite }}>
      {children}
    </FavoritesContext.Provider>
  );
};

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (context === undefined) {
    throw new Error('useFavorites must be used within a FavoritesProvider');
  }
  return context;
};
