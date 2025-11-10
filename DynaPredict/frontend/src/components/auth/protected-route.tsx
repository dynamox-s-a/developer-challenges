import React, { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../features/store";
import { logout } from "../../features/auth-slice";



export const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const dispatch = useDispatch();
  const isLogged = useSelector((state: RootState) => state.auth.isLogged);

  useEffect(() => {
    const getToken = () => {
      try {
        return (
          localStorage.getItem("access_token") || localStorage.getItem("token")
        );
      } catch {
        return null;
      }
    };

    const checkAndLogout = () => {
      const token = getToken();
      if (!token && isLogged) {
        dispatch(logout());
      }
    };

    checkAndLogout();

    const onStorage = (e: StorageEvent) => {
      if (!e.key) return;
      if (["access_token", "token", "refresh_token"].includes(e.key)) {
        checkAndLogout();
      }
    };

    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [isLogged, dispatch]);

  return isLogged ? <>{children}</> : <Navigate to="/login" replace />;
};
