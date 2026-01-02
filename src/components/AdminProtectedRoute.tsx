import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAdminAuth } from '@/contexts/AdminAuthContext';

interface AdminProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'core_admin' | 'mosque_admin';
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children, requiredRole = 'core_admin' }) => {
  const { isAuthenticated, role } = useAdminAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    const loginPath = requiredRole === 'mosque_admin' ? '/mosque-admin/login' : '/admin/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    const loginPath = requiredRole === 'mosque_admin' ? '/mosque-admin/login' : '/admin/login';
    return <Navigate to={loginPath} state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
