"use client"

import { useAppDispatch, useAppSelector } from "@/store";
import { loadAuthFromStorage } from "@/store/authSlice";
import { Box, CircularProgress } from "@mui/material";
import { useRouter } from "next/navigation";
import { ReactNode, useEffect, useState } from "react"

interface ProtectedRouteProps {
    children: ReactNode;
    requiredRole?: "admin" | "reader";
}

export default function ProtectedRoute({
    children,
    requiredRole,
}: ProtectedRouteProps) {
    const router = useRouter();
    const dispatch = useAppDispatch();
    const { isAuthenticated, user } = useAppSelector((state) => state.auth);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        dispatch(loadAuthFromStorage());
        const timer = setTimeout(() => setIsLoading(false), 250)
        return () => clearTimeout(timer);
    }, [dispatch]);

    useEffect(() => {
        if (!isLoading) {
          if (!isAuthenticated) {
            router.replace("/");
            return;
          }
      
          if (requiredRole && user?.role !== requiredRole) {
            if (user?.role === "admin") {
              router.replace("/admin");
            } else if (user?.role === "reader") {
              router.replace("/reader");
            } else {
              router.replace("/");
            }
          }
        }
      }, [isAuthenticated, requiredRole, user, isLoading, router]);

    if(isLoading){
        return(
            <Box
            sx={{
              minHeight: "80vh",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <CircularProgress />
          </Box>
        );
    }

    if (!isAuthenticated) return null;
    if(requiredRole && user?.role !== requiredRole) return null;

    return <>{children}</>

}