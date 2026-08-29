import { Box, CircularProgress } from "@mui/material";
import { useEffect } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../app/hooks";
import { sessionExpired } from "./authSlice";

export function ProtectedRoute() {
  const dispatch = useAppDispatch();
  const status = useAppSelector((state) => state.auth.status);
  const expiresAt = useAppSelector((state) => state.auth.session?.expiresAt);
  const location = useLocation();

  useEffect(() => {
    if (status !== "authenticated" || !expiresAt) {
      return;
    }
    const remaining = Date.parse(expiresAt) - Date.now();
    if (remaining <= 0) {
      dispatch(sessionExpired());
      return;
    }
    const timer = window.setTimeout(
      () => dispatch(sessionExpired()),
      Math.min(remaining, 2_147_483_647)
    );
    return () => window.clearTimeout(timer);
  }, [dispatch, expiresAt, status]);

  if (status === "checking") {
    return (
      <Box
        alignItems="center"
        aria-label="Checking session"
        display="flex"
        justifyContent="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (status !== "authenticated") {
    return <Navigate replace state={{ from: location.pathname }} to="/login" />;
  }

  return <Outlet />;
}
