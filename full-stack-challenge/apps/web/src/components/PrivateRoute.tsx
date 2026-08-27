import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { Box, CircularProgress } from '@mui/material';
import { useAppSelector } from '../app/hooks';

export function PrivateRoute() {
  const location = useLocation();
  const { accessToken, user, initialized } = useAppSelector((state) => state.auth);

  if (!initialized) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
      </Box>
    );
  }

  if (!accessToken || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}
