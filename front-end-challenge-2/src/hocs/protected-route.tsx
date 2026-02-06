"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { checkAuth } from "@/store/slices/authSlice";
import { CircularProgress, Box } from "@mui/material";

type UserRole = "admin" | "reader";

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles: UserRole[];
}

export default function ProtectedRoute({
  children,
  allowedRoles,
}: ProtectedRouteProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { user, isAuthenticated, loading } = useAppSelector(
    (state) => state.auth,
  );
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const verifyAuth = async () => {
      await dispatch(checkAuth());
      setIsChecking(false);
    };
    verifyAuth();
  }, [dispatch]);

  useEffect(() => {
    if (!isChecking && !loading) {
      if (!isAuthenticated) {
        router.replace("/login");
      } else if (user && !allowedRoles.includes(user.role)) {
        if (user.role === "admin") {
          router.replace("/admin");
        } else {
          router.replace("/events");
        }
      }
    }
  }, [isChecking, loading, isAuthenticated, user, allowedRoles, router]);

  if (isChecking || loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || (user && !allowedRoles.includes(user.role))) {
    return null;
  }

  return <>{children}</>;
}
