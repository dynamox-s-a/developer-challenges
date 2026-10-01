import Box from '@mui/material/Box';
import { useEffect } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router';
import { LoadingIndicator } from '../../components/loading-indicator';
import { RetryAlert } from '../../components/retry-alert';
import { useAppDispatch, useAppSelector } from '../../store/hooks';
import { fetchSession } from './session-slice';

/**
 * Guards the private routes. The browser cannot read the httpOnly cookie, so the only
 * way to know about the session is to ask the API; until it answers, nothing private is
 * shown. The API rejects every private request on its own anyway (ADR 0003).
 */
export function RequireSession() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const { status, checking, error } = useAppSelector((state) => state.session);

  useEffect(() => {
    if (status === 'unknown' && !checking && !error) {
      void dispatch(fetchSession());
    }
  }, [dispatch, status, checking, error]);

  if (status === 'authenticated') {
    return <Outlet />;
  }
  if (status === 'anonymous') {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }
  if (error) {
    return (
      <Box sx={{ p: 3, maxWidth: 480, mx: 'auto' }}>
        <RetryAlert message={error} onRetry={() => void dispatch(fetchSession())} />
      </Box>
    );
  }
  return <LoadingIndicator label="Checking the session" />;
}
