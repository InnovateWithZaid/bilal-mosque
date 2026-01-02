import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type AdminRole = 'core_admin' | 'mosque_admin' | null;

interface AdminAuthContextType {
  isAuthenticated: boolean;
  role: AdminRole;
  assignedMosqueId: string | null;
  loginCoreAdmin: (pin: string) => boolean;
  loginMosqueAdmin: (mosqueId: string, pin: string) => boolean;
  logout: () => void;
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined);

// Demo PINs - NOT SECURE FOR PRODUCTION
const CORE_ADMIN_PIN = '0000';
const MOSQUE_ADMIN_PIN = '1234';

export const AdminAuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [role, setRole] = useState<AdminRole>(null);
  const [assignedMosqueId, setAssignedMosqueId] = useState<string | null>(null);

  useEffect(() => {
    const authData = sessionStorage.getItem('admin_auth');
    if (authData) {
      try {
        const { role, mosqueId } = JSON.parse(authData);
        setIsAuthenticated(true);
        setRole(role);
        setAssignedMosqueId(mosqueId || null);
      } catch {
        sessionStorage.removeItem('admin_auth');
      }
    }
  }, []);

  const loginCoreAdmin = (pin: string): boolean => {
    if (pin === CORE_ADMIN_PIN) {
      setIsAuthenticated(true);
      setRole('core_admin');
      setAssignedMosqueId(null);
      sessionStorage.setItem('admin_auth', JSON.stringify({ role: 'core_admin' }));
      return true;
    }
    return false;
  };

  const loginMosqueAdmin = (mosqueId: string, pin: string): boolean => {
    if (pin === MOSQUE_ADMIN_PIN && mosqueId) {
      setIsAuthenticated(true);
      setRole('mosque_admin');
      setAssignedMosqueId(mosqueId);
      sessionStorage.setItem('admin_auth', JSON.stringify({ role: 'mosque_admin', mosqueId }));
      return true;
    }
    return false;
  };

  const logout = () => {
    setIsAuthenticated(false);
    setRole(null);
    setAssignedMosqueId(null);
    sessionStorage.removeItem('admin_auth');
  };

  return (
    <AdminAuthContext.Provider value={{ 
      isAuthenticated, 
      role, 
      assignedMosqueId, 
      loginCoreAdmin, 
      loginMosqueAdmin, 
      logout 
    }}>
      {children}
    </AdminAuthContext.Provider>
  );
};

export const useAdminAuth = () => {
  const context = useContext(AdminAuthContext);
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider');
  }
  return context;
};
