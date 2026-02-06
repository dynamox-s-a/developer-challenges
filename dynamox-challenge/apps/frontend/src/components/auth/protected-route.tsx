import * as React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { paths } from '@/paths';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

export function ProtectedRoute({ children }: ProtectedRouteProps): React.JSX.Element {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  if (!isAuthenticated) {
    return <Navigate to={paths.auth.signIn} replace />;
  }

  return <>{children}</>;
}
