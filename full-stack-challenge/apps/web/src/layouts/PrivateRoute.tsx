import { Box, CircularProgress } from '@mui/material';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { useAppSelector } from '../app/hooks';

/**
 * Renders the private routes only for a signed-in user. While the boot check
 * (`fetchMe`) is still running it waits, so a page reload with a valid cookie
 * doesn't flash the login page.
 */
export function PrivateRoute() {
  const status = useAppSelector((state) => state.auth.status);
  const location = useLocation();

  if (status === 'unknown') {
    return (
      <Box
        role="status"
        aria-label="Checking your session"
        sx={{ minHeight: '100vh', display: 'grid', placeItems: 'center' }}
      >
        <CircularProgress aria-hidden />
      </Box>
    );
  }

  if (status === 'unauthenticated') {
    // Remember where the user was going; LoginPage sends them back there.
    const from = `${location.pathname}${location.search}`;
    return <Navigate to="/login" replace state={{ from }} />;
  }

  return <Outlet />;
}
