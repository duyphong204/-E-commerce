import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthStore } from '@/features/auth';

export interface ProtectedRouteProps {
  children: React.ReactNode;
  role?: 'admin' | 'customer';
}

export function ProtectedRoute({ children, role }: ProtectedRouteProps) {
  const { user } = useAuthStore();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}

export default ProtectedRoute;
