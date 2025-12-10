"use client";

import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect } from "react";
import { useAppSelector } from "@/lib/hooks";
import type { UserRole } from "@/types";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedRoles?: UserRole[];
  redirectTo?: string;
}

export function ProtectedRoute({
  children,
  allowedRoles,
  redirectTo = "/login",
}: ProtectedRouteProps) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    // Wait for auth initialization
    if (isLoading) {
      return;
    }

    // Redirect to login if not authenticated
    if (!isAuthenticated) {
      router.push(redirectTo);
      return;
    }

    // Check role-based access if allowedRoles is specified
    if (allowedRoles && user && !allowedRoles.includes(user.role)) {
      // Redirect to appropriate page based on role
      const roleRedirect = user.role === "admin" ? "/admin" : "/events";
      router.push(roleRedirect);
    }
  }, [isAuthenticated, isLoading, user, allowedRoles, redirectTo, router]);

  // Show loading while checking auth
  if (isLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  // Don't render children if not authenticated
  if (!isAuthenticated) {
    return null;
  }

  // Don't render children if role is not allowed
  if (allowedRoles && user && !allowedRoles.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
