"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { checkAuth } from "@/store/auth/authSlice";
import { CircularProgress, Box } from "@mui/material";

export default function Home() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user, loading } = useAppSelector(
    (state) => state.auth,
  );
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      await dispatch(checkAuth());
      setIsCheckingAuth(false);
    };
    checkAuthentication();
  }, [dispatch]);

  useEffect(() => {
    if (!isCheckingAuth && !loading) {
      if (isAuthenticated && user) {
        if (user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/events");
        }
      } else {
        router.push("/login");
      }
    }
  }, [isAuthenticated, user, loading, isCheckingAuth, router]);

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
