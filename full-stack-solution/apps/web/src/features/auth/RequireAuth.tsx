import { useEffect } from "react";
import Box from "@mui/material/Box";
import CircularProgress from "@mui/material/CircularProgress";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "@web/app/hooks";
import { paths } from "@web/routes/paths";
import { restoreSession } from "./auth.slice";

/**
 * Route guard for the private area.
 *
 * A token found in storage is validated against `GET /api/auth/me` before the
 * protected routes render, so a stale or tampered token cannot show the
 * dashboard. While that check runs the status is `unknown` and a spinner is
 * displayed — redirecting immediately would sign the user out on every reload.
 */
export function RequireAuth() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const status = useAppSelector((state) => state.auth.status);

  useEffect(() => {
    if (status === "unknown") {
      void dispatch(restoreSession());
    }
  }, [dispatch, status]);

  if (status === "unknown") {
    return (
      <Box
        sx={{
          alignItems: "center",
          display: "flex",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress aria-label="Checking session" />
      </Box>
    );
  }

  if (status === "anonymous") {
    // `state.from` lets the login page send the user back where they were.
    return <Navigate to={paths.login} replace state={{ from: location }} />;
  }

  return <Outlet />;
}
