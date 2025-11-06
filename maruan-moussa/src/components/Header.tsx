"use client";

import { AppBar, Toolbar, Typography, IconButton, Box, Button } from "@mui/material";
import DarkModeIcon from "@mui/icons-material/DarkMode";
import LightModeIcon from "@mui/icons-material/LightMode";
import { useThemeMode } from "@/context/ThemeContext";
import { useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/store";
import { useEffect } from "react";
import { loadAuthFromStorage, logout } from "@/store/authSlice";
import { useMediaQuery } from "@/hooks/useMediaQuery";

export default function Header() {
  const { mode, toggleTheme } = useThemeMode();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated, user } = useAppSelector((state) => state.auth);
  const isMobile = useMediaQuery("(max-width: 600px)");

  useEffect(() => {
    dispatch(loadAuthFromStorage())
  }, [dispatch]);

  const handleAuthAction = () => {
    if (isAuthenticated) {
      dispatch(logout());
      router.push("/");

    } else {
      router.push("/login")
    }
  }

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        backdropFilter: "blur(12px)",
        backgroundColor:
          mode === "dark" ? "rgba(18,18,18,0.9)" : "rgba(255,255,255,0.8)",
        color: mode === "dark" ? "#fff" : "#111",
        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
        transition: "background-color 0.3s ease",
      }}
    >
      <Toolbar
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          py: 1,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <Box
            component="img"
            src="/logo.svg"
            alt="Logo"
            sx={{
              width: 30,
              height: 30,
              borderRadius: "50%",
              objectFit: "cover",
              boxShadow: "0 0 8px rgba(124,58,237,0.4)",
            }}
          />

          <Typography
            variant="h5"
            fontWeight={700}
            sx={{
              fontSize: { xs: "1.1rem", sm: "1.4rem" }, 
              letterSpacing: 0.5,
              background: "linear-gradient(90deg, #3b82f6, #7c3aed, #3b82f6)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              whiteSpace: "nowrap",
            }}
          >
            {user?.role === "admin"
              ? (isMobile ? "Admin Panel" : "Painel do Administrador")
              : isAuthenticated
                ? "Eventos"
                : "Event Manager"}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            variant="contained"
            onClick={handleAuthAction}
            sx={{
              borderRadius: "10px",
              textTransform: "none",
              fontWeight: 600,
              px: { xs: 2, sm: 3 },
              py: { xs: 0.7, sm: 1 },
              fontSize: { xs: "0.85rem", sm: "0.8rem" }, // menor no mobile
              background: "linear-gradient(135deg, #7C3AED 0%, #0891B2 100%)",
              "&:hover": {
                background: "linear-gradient(135deg, #6D28D9 0%, #0E7490 100%)",
                transform: "translateY(-2px)",
              },
            }}
          >
            {isAuthenticated ? "Logout" : "Login"}
          </Button>

          <IconButton
            onClick={toggleTheme}
            aria-label="toggle-theme"
            sx={{
              transition: "transform 0.2s ease",
              "&:hover": { transform: "scale(1.1)" },
            }}
          >
            {mode === "light" ? <DarkModeIcon /> : <LightModeIcon />}
          </IconButton>
        </Box>
      </Toolbar>
    </AppBar>
  );
}
