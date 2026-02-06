import * as React from 'react';
import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { paths } from '@/paths';

export default function NotFound(): React.JSX.Element {
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);

  const redirectPath = isAuthenticated ? paths.machine.list : paths.auth.signUp;

  return <Navigate to={redirectPath} replace />;
}
