import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";
import type { RootState } from "../store";

export function RequireAuth({ children }: { children: JSX.Element }) {
  const location = useLocation();

  const token = useSelector((s: RootState) => s.auth?.token ?? null);

  if (!token) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return children;
}