import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

import { getJson, removeValue, setJson } from "@/lib/storage";

type AdminRole = "core_admin" | "mosque_admin" | null;

type StoredAuth = {
  role: Exclude<AdminRole, null>;
  mosqueId?: string;
};

type AdminAuthContextValue = {
  isAuthenticated: boolean;
  role: AdminRole;
  assignedMosqueId: string | null;
  ready: boolean;
  loginCoreAdmin: (pin: string) => Promise<boolean>;
  loginMosqueAdmin: (mosqueId: string, pin: string) => Promise<boolean>;
  logout: () => Promise<void>;
};

const STORAGE_KEY = "bilal_native_admin_auth";
const CORE_ADMIN_PIN = "0000";
const MOSQUE_ADMIN_PIN = "1234";

const AdminAuthContext = createContext<AdminAuthContextValue | undefined>(undefined);

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [ready, setReady] = useState(false);
  const [role, setRole] = useState<AdminRole>(null);
  const [assignedMosqueId, setAssignedMosqueId] = useState<string | null>(null);

  useEffect(() => {
    getJson<StoredAuth | null>(STORAGE_KEY, null).then((auth) => {
      if (auth?.role) {
        setRole(auth.role);
        setAssignedMosqueId(auth.mosqueId ?? null);
      }

      setReady(true);
    });
  }, []);

  const loginCoreAdmin = async (pin: string) => {
    if (pin !== CORE_ADMIN_PIN) {
      return false;
    }

    setRole("core_admin");
    setAssignedMosqueId(null);
    await setJson<StoredAuth>(STORAGE_KEY, { role: "core_admin" });
    return true;
  };

  const loginMosqueAdmin = async (mosqueId: string, pin: string) => {
    if (!mosqueId || pin !== MOSQUE_ADMIN_PIN) {
      return false;
    }

    setRole("mosque_admin");
    setAssignedMosqueId(mosqueId);
    await setJson<StoredAuth>(STORAGE_KEY, { role: "mosque_admin", mosqueId });
    return true;
  };

  const logout = async () => {
    setRole(null);
    setAssignedMosqueId(null);
    await removeValue(STORAGE_KEY);
  };

  const value = useMemo<AdminAuthContextValue>(
    () => ({
      isAuthenticated: role !== null,
      role,
      assignedMosqueId,
      ready,
      loginCoreAdmin,
      loginMosqueAdmin,
      logout,
    }),
    [assignedMosqueId, ready, role],
  );

  return <AdminAuthContext.Provider value={value}>{children}</AdminAuthContext.Provider>;
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext);
  if (!context) {
    throw new Error("useAdminAuth must be used within AdminAuthProvider");
  }

  return context;
}
