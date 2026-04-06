import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { mockAnnouncements, mockMosques } from "@/data/seed";
import { getJson, setJson } from "@/lib/storage";
import type { Announcement, Mosque, Report } from "@/types";

type MosqueDataContextValue = {
  ready: boolean;
  mosques: Mosque[];
  announcements: Announcement[];
  reports: Report[];
  refresh: () => Promise<void>;
  addMosque: (mosque: Omit<Mosque, "id" | "lastUpdatedAt">) => Promise<void>;
  updateMosque: (id: string, updates: Partial<Mosque>) => Promise<void>;
  deleteMosque: (id: string) => Promise<void>;
  addAnnouncement: (announcement: Omit<Announcement, "id" | "createdAt">) => Promise<void>;
  deleteAnnouncement: (id: string) => Promise<void>;
  addReport: (report: Omit<Report, "id" | "status" | "createdAt">) => Promise<void>;
  markReportReviewed: (id: string) => Promise<void>;
  getMosqueById: (id: string) => Mosque | undefined;
};

type StoredMosque = Omit<Mosque, "lastUpdatedAt"> & { lastUpdatedAt: string };
type StoredAnnouncement = Omit<Announcement, "createdAt" | "eventTime"> & { createdAt: string; eventTime?: string };
type StoredReport = Omit<Report, "createdAt"> & { createdAt: string };

const MOSQUES_KEY = "bilal_native_mosques";
const ANNOUNCEMENTS_KEY = "bilal_native_announcements";
const REPORTS_KEY = "bilal_native_reports";

const MosqueDataContext = createContext<MosqueDataContextValue | undefined>(undefined);

const serializeMosques = (items: Mosque[]): StoredMosque[] =>
  items.map((item) => ({ ...item, lastUpdatedAt: item.lastUpdatedAt.toISOString() }));

const serializeAnnouncements = (items: Announcement[]): StoredAnnouncement[] =>
  items.map((item) => ({
    ...item,
    createdAt: item.createdAt.toISOString(),
    eventTime: item.eventTime?.toISOString(),
  }));

const serializeReports = (items: Report[]): StoredReport[] =>
  items.map((item) => ({ ...item, createdAt: item.createdAt.toISOString() }));

const deserializeMosques = (items: StoredMosque[]): Mosque[] =>
  items.map((item) => ({ ...item, lastUpdatedAt: new Date(item.lastUpdatedAt) }));

const deserializeAnnouncements = (items: StoredAnnouncement[]): Announcement[] =>
  items.map((item) => ({
    ...item,
    createdAt: new Date(item.createdAt),
    eventTime: item.eventTime ? new Date(item.eventTime) : undefined,
  }));

const deserializeReports = (items: StoredReport[]): Report[] =>
  items.map((item) => ({ ...item, createdAt: new Date(item.createdAt) }));

export function MosqueDataProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [mosques, setMosques] = useState<Mosque[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [reports, setReports] = useState<Report[]>([]);

  const refresh = useCallback(async () => {
    const [storedMosques, storedAnnouncements, storedReports] = await Promise.all([
      getJson<StoredMosque[]>(MOSQUES_KEY, []),
      getJson<StoredAnnouncement[]>(ANNOUNCEMENTS_KEY, []),
      getJson<StoredReport[]>(REPORTS_KEY, []),
    ]);

    const nextMosques = storedMosques.length > 0 ? deserializeMosques(storedMosques) : mockMosques;
    const nextAnnouncements =
      storedAnnouncements.length > 0 ? deserializeAnnouncements(storedAnnouncements) : mockAnnouncements;
    const nextReports = storedReports.length > 0 ? deserializeReports(storedReports) : [];

    setMosques(nextMosques);
    setAnnouncements(nextAnnouncements);
    setReports(nextReports);

    if (storedMosques.length === 0) {
      await setJson(MOSQUES_KEY, serializeMosques(mockMosques));
    }

    if (storedAnnouncements.length === 0) {
      await setJson(ANNOUNCEMENTS_KEY, serializeAnnouncements(mockAnnouncements));
    }

    if (storedReports.length === 0) {
      await setJson(REPORTS_KEY, serializeReports([]));
    }

    setReady(true);
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const persistMosques = async (nextMosques: Mosque[]) => {
    setMosques(nextMosques);
    await setJson(MOSQUES_KEY, serializeMosques(nextMosques));
  };

  const persistAnnouncements = async (nextAnnouncements: Announcement[]) => {
    setAnnouncements(nextAnnouncements);
    await setJson(ANNOUNCEMENTS_KEY, serializeAnnouncements(nextAnnouncements));
  };

  const persistReports = async (nextReports: Report[]) => {
    setReports(nextReports);
    await setJson(REPORTS_KEY, serializeReports(nextReports));
  };

  const addMosque = async (mosque: Omit<Mosque, "id" | "lastUpdatedAt">) => {
    const next = [
      ...mosques,
      {
        ...mosque,
        id: `mosque_${Date.now()}`,
        lastUpdatedAt: new Date(),
      },
    ];

    await persistMosques(next);
  };

  const updateMosque = async (id: string, updates: Partial<Mosque>) => {
    const next = mosques.map((mosque) =>
      mosque.id === id ? { ...mosque, ...updates, lastUpdatedAt: new Date() } : mosque,
    );

    await persistMosques(next);
  };

  const deleteMosque = async (id: string) => {
    const nextMosques = mosques.filter((mosque) => mosque.id !== id);
    const nextAnnouncements = announcements.filter((announcement) => announcement.mosqueId !== id);
    const nextReports = reports.filter((report) => report.mosqueId !== id);

    await Promise.all([
      persistMosques(nextMosques),
      persistAnnouncements(nextAnnouncements),
      persistReports(nextReports),
    ]);
  };

  const addAnnouncement = async (announcement: Omit<Announcement, "id" | "createdAt">) => {
    const next = [
      {
        ...announcement,
        id: `announcement_${Date.now()}`,
        createdAt: new Date(),
      },
      ...announcements,
    ];

    await persistAnnouncements(next);
  };

  const deleteAnnouncement = async (id: string) => {
    await persistAnnouncements(announcements.filter((announcement) => announcement.id !== id));
  };

  const addReport = async (report: Omit<Report, "id" | "status" | "createdAt">) => {
    const next = [
      {
        ...report,
        id: `report_${Date.now()}`,
        createdAt: new Date(),
        status: "pending" as const,
      },
      ...reports,
    ];

    await persistReports(next);
  };

  const markReportReviewed = async (id: string) => {
    await persistReports(reports.map((report) => (report.id === id ? { ...report, status: "reviewed" } : report)));
  };

  const value = useMemo<MosqueDataContextValue>(
    () => ({
      ready,
      mosques,
      announcements,
      reports,
      refresh,
      addMosque,
      updateMosque,
      deleteMosque,
      addAnnouncement,
      deleteAnnouncement,
      addReport,
      markReportReviewed,
      getMosqueById: (id) => mosques.find((mosque) => mosque.id === id),
    }),
    [announcements, mosques, ready, refresh, reports],
  );

  return <MosqueDataContext.Provider value={value}>{children}</MosqueDataContext.Provider>;
}

export function useMosqueData() {
  const context = useContext(MosqueDataContext);
  if (!context) {
    throw new Error("useMosqueData must be used within MosqueDataProvider");
  }

  return context;
}
