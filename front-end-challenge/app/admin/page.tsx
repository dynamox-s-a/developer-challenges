"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Box, Typography, Button, Paper, Alert } from "@mui/material";
import Loading from "@/components/ui/Loading";

export default function AdminPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated, isAdmin, logout } = useAuth();

  // Redireciona se não estiver autenticado ou não for admin
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/");
    } else if (!loading && isAuthenticated && !isAdmin) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  // Se estiver carregando ou não autorizado, não mostra nada
  if (loading || !isAuthenticated || !isAdmin) {
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
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box sx={{ flexGrow: 1 }}>
            <Typography variant="h4" gutterBottom color="primary">
              Painel Administrativo
            </Typography>
          </Box>

          <Alert severity="success" sx={{ mb: 4 }}>
            Bem-vindo ao painel administrativo! Você tem acesso completo ao
            sistema.
          </Alert>

          <Box>
            <Button onClick={handleLogout}>Logout</Button>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
