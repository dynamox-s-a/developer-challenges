"use client";

import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useAppSelector } from "@/lib/hooks";

export default function Home() {
  const router = useRouter();
  const { isAuthenticated, isLoading, user } = useAppSelector(
    (state) => state.auth,
  );

  useEffect(() => {
    // Wait for auth initialization
    if (isLoading) {
      return;
    }

    if (isAuthenticated && user) {
      // Redirect based on role
      const redirectPath = user.role === "admin" ? "/admin" : "/events";
      router.push(redirectPath);
    } else {
      // Redirect to login if not authenticated
      router.push("/login");
    }
  }, [isAuthenticated, isLoading, user, router]);

  // Show loading spinner while determining redirect
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
