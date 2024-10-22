import React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { RootState } from '../../features/store';

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export const ProtectedRoute = ({ children }: ProtectedRouteProps) => {
  const { isLogged } = useSelector((state: RootState) => state.auth as { isLogged: boolean });

  if (!isLogged) {
    return <Navigate to="/login" replace />;
  }
  return <>{children}</>;
};
