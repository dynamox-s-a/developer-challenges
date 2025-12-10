"use client";

import { Box, CircularProgress } from "@mui/material";
import { type ReactNode, useEffect } from "react";
import { initializeAuth } from "@/features/auth/authSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const { isLoading } = useAppSelector((state) => state.auth);
  const isInitialized = useAppSelector((state) => {
    // Auth is initialized if we've tried to load from storage
    // (either we found a user or we didn't, but we're no longer loading)
    return !state.auth.isLoading && state.auth.user !== undefined;
  });

  useEffect(() => {
    dispatch(initializeAuth());
  }, [dispatch]);

  // Show loading spinner while initializing auth from localStorage
  // This prevents flash of unauthenticated content
  if (!isInitialized && isLoading) {
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

  return <>{children}</>;
}
