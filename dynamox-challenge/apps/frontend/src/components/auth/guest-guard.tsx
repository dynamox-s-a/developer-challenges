'use client';

import * as React from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store/store';
import { paths } from '@/paths';

export interface GuestGuardProps {
  children: React.ReactNode;
}

export function GuestGuard({ children }: GuestGuardProps): React.JSX.Element | null {
  debugger;
  const navigate = useNavigate();
  const isAuthenticated = useSelector((state: RootState) => state.auth.isAuthenticated);
  const [isChecking, setIsChecking] = React.useState<boolean>(true);

  React.useEffect(() => {
    if (isAuthenticated) {
      navigate(paths.machine.list, { replace: true });
    } else {
      setIsChecking(false);
    }
  }, [isAuthenticated, navigate]);

  // Show nothing while checking or if authenticated (will redirect)
  if (isChecking || isAuthenticated) {
    return null;
  }

  return <React.Fragment>{children}</React.Fragment>;
}
