import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Mosque, Announcement } from '@/types';
import { mockMosques, mockAnnouncements } from '@/data/mockData';

interface MosqueDataContextType {
  mosques: Mosque[];
  announcements: Announcement[];
  addMosque: (mosque: Omit<Mosque, 'id' | 'lastUpdatedAt'>) => void;
  updateMosque: (id: string, mosque: Partial<Mosque>) => void;
  deleteMosque: (id: string) => void;
  addAnnouncement: (announcement: Omit<Announcement, 'id' | 'createdAt'>) => void;
  deleteAnnouncement: (id: string) => void;
  getMosqueById: (id: string) => Mosque | undefined;
}

const MosqueDataContext = createContext<MosqueDataContextType | undefined>(undefined);

const MOSQUES_STORAGE_KEY = 'bilal_mosques';
const ANNOUNCEMENTS_STORAGE_KEY = 'bilal_announcements';

export function MosqueDataProvider({ children }: { children: ReactNode }) {
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);

  // Load data from localStorage on mount
  useEffect(() => {
    const storedMosques = localStorage.getItem(MOSQUES_STORAGE_KEY);
    const storedAnnouncements = localStorage.getItem(ANNOUNCEMENTS_STORAGE_KEY);

    if (storedMosques) {
      try {
        const parsed = JSON.parse(storedMosques);
        setMosques(parsed.map((m: Mosque) => ({
          ...m,
          lastUpdatedAt: new Date(m.lastUpdatedAt),
        })));
      } catch {
        setMosques(mockMosques);
      }
    } else {
      setMosques(mockMosques);
      localStorage.setItem(MOSQUES_STORAGE_KEY, JSON.stringify(mockMosques));
    }

    if (storedAnnouncements) {
      try {
        const parsed = JSON.parse(storedAnnouncements);
        setAnnouncements(parsed.map((a: Announcement) => ({
          ...a,
          createdAt: new Date(a.createdAt),
          eventTime: a.eventTime ? new Date(a.eventTime) : undefined,
        })));
      } catch {
        setAnnouncements(mockAnnouncements);
      }
    } else {
      setAnnouncements(mockAnnouncements);
      localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(mockAnnouncements));
    }
  }, []);

  // Persist mosques to localStorage
  useEffect(() => {
    if (mosques.length > 0) {
      localStorage.setItem(MOSQUES_STORAGE_KEY, JSON.stringify(mosques));
    }
  }, [mosques]);

  // Persist announcements to localStorage
  useEffect(() => {
    if (announcements.length > 0) {
      localStorage.setItem(ANNOUNCEMENTS_STORAGE_KEY, JSON.stringify(announcements));
    }
  }, [announcements]);

  const addMosque = (mosqueData: Omit<Mosque, 'id' | 'lastUpdatedAt'>) => {
    const newMosque: Mosque = {
      ...mosqueData,
      id: `mosque_${Date.now()}`,
      lastUpdatedAt: new Date(),
    };
    setMosques(prev => [...prev, newMosque]);
  };

  const updateMosque = (id: string, mosqueData: Partial<Mosque>) => {
    setMosques(prev =>
      prev.map(m =>
        m.id === id
          ? { ...m, ...mosqueData, lastUpdatedAt: new Date() }
          : m
      )
    );
  };

  const deleteMosque = (id: string) => {
    setMosques(prev => prev.filter(m => m.id !== id));
    setAnnouncements(prev => prev.filter(a => a.mosqueId !== id));
  };

  const addAnnouncement = (announcementData: Omit<Announcement, 'id' | 'createdAt'>) => {
    const newAnnouncement: Announcement = {
      ...announcementData,
      id: `ann_${Date.now()}`,
      createdAt: new Date(),
    };
    setAnnouncements(prev => [...prev, newAnnouncement]);
  };

  const deleteAnnouncement = (id: string) => {
    setAnnouncements(prev => prev.filter(a => a.id !== id));
  };

  const getMosqueById = (id: string) => {
    return mosques.find(m => m.id === id);
  };

  return (
    <MosqueDataContext.Provider
      value={{
        mosques,
        announcements,
        addMosque,
        updateMosque,
        deleteMosque,
        addAnnouncement,
        deleteAnnouncement,
        getMosqueById,
      }}
    >
      {children}
    </MosqueDataContext.Provider>
  );
}

export function useMosqueData() {
  const context = useContext(MosqueDataContext);
  if (context === undefined) {
    throw new Error('useMosqueData must be used within a MosqueDataProvider');
  }
  return context;
}
