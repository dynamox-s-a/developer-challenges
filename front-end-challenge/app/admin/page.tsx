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
      <Box sx={{ maxWidth: 800, mx: "auto", px: 2 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h4" color="primary">
              Painel Administrativo
            </Typography>
            <Button variant="outlined" onClick={handleLogout}>
              Logout
            </Button>
          </Box>

          <Alert severity="success" sx={{ mb: 4 }}>
            Bem-vindo ao painel administrativo, {user?.email}! Você tem acesso
            completo ao sistema.
          </Alert>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Gerenciamento de Eventos
            </Typography>

            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: 2,
                mt: 2,
              }}
            >
              <Button
                variant="contained"
                color="primary"
                size="large"
                onClick={() => router.push("/admin/events/add")}
                sx={{ p: 2 }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Cadastrar Novo Evento
                  </Typography>
                </Box>
              </Button>

              <Button
                variant="outlined"
                color="primary"
                size="large"
                onClick={() => router.push("/dashboard")}
                sx={{ p: 2 }}
              >
                <Box>
                  <Typography variant="subtitle1" fontWeight="bold">
                    Ver Todos os Eventos
                  </Typography>
                </Box>
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
