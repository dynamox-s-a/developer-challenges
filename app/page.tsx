"use client";
import { Box, CircularProgress } from "@mui/material";
import { useSession } from "next-auth/react";
import { redirect } from "next/navigation";

export default function Home() {
  const { data: session, status } = useSession();
  if (status === "loading") {
    return (
      <Box className="main-loading">
        <CircularProgress />
      </Box>
    );
  }
  if (status === "unauthenticated") redirect("/login");
  redirect("/dashboard");
}
