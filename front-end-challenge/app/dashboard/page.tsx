"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Box, Typography, Button, Paper, Alert } from "@mui/material";
import Loading from "@/components/ui/Loading";

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated, isAdmin, logout } = useAuth();

  // Redireciona para login se não estiver autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, loading, router]);

  // Se estiver carregando ou não autenticado, não mostra nada
  if (loading || !isAuthenticated) {
    return <Loading />;
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundColor: "grey.50",
        py: 4,
      }}
    >
      <Box sx={{ maxWidth: 800, mx: "auto", px: 2 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom color="primary">
            Dashboard - Event Management System
          </Typography>

          <Alert severity="success" sx={{ mb: 3 }}>
            Login realizado com sucesso!
            {isAdmin && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2">
                  💡 Como você é admin, também tem acesso à{" "}
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => router.push("/admin")}
                    sx={{ textDecoration: "underline", p: 0, minWidth: "auto" }}
                  >
                    área administrativa
                  </Button>
                  .
                </Typography>
              </Box>
            )}
          </Alert>

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "space-between",
              flexWrap: "wrap",
            }}
          >
            <Button onClick={handleLogout}>Logout</Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
