"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Box, Typography, Paper, Alert } from "@mui/material";
import Loading from "@/components/ui/feedback/Loading";
import { ROUTES } from "@/constants";
import PageContainer from "@/components/ui/layout/PageContainer";
import LogoutButton from "@/components/ui/actions/LogoutButton";
import AddNewEventButton from "@/components/ui/actions/AddNewEventButton";
import ListAllEventsButton from "@/components/ui/actions/ListAllEventsButton";

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
    <PageContainer>
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
          <LogoutButton onClick={handleLogout} />
        </Box>

        <Alert severity="success" sx={{ mb: 3 }}>
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
            <AddNewEventButton
              onClick={() => router.push(ROUTES.ADMIN.EVENTS.ADD)}
            />

            <ListAllEventsButton
              onClick={() => router.push(ROUTES.DASHBOARD)}
            />
          </Box>
        </Box>
      </Paper>
    </PageContainer>
  );
}
