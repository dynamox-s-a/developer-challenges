"use client";

import { useEffect, useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { verifyToken } from "@/store/slices/authSlice";
import { Box, CircularProgress } from "@mui/material";

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: "admin" | "reader";
}

export default function ProtectedRoute({
  children,
  requiredRole,
}: ProtectedRouteProps) {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, loading } = useAppSelector(
    (state) => state.auth,
  );
  const [isChecking, setIsChecking] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      if (!isAuthenticated) {
        try {
          await dispatch(verifyToken()).unwrap();
        } catch {
          router.push("/login");
          return;
        }
      }
      setIsChecking(false);
    };

    checkAuth();
  }, [dispatch, isAuthenticated, router]);

  useEffect(() => {
    if (!isChecking && !loading) {
      if (!isAuthenticated) {
        router.push("/login");
      } else if (requiredRole && user?.role !== requiredRole) {
        if (user?.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/events");
        }
      }
    }
  }, [
    isAuthenticated,
    user,
    requiredRole,
    router,
    isChecking,
    loading,
    pathname,
  ]);

  if (isChecking || loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (!isAuthenticated || (requiredRole && user?.role !== requiredRole)) {
    return null;
  }

  return <>{children}</>;
}
