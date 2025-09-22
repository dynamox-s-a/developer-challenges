"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { createEvent } from "@/lib/api/apiClients";
import FormEvent from "@/components/forms/FormEvent";
import { Box, Typography, Alert, Button } from "@mui/material";
import type { EventFormData } from "@/types";
import { ROUTES } from "@/constants";

export default function AddEventPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redireciona se não estiver autenticado
  if (!authLoading && !isAuthenticated) {
    router.push(ROUTES.HOME);
    return null;
  }

  // Se não for admin, pode acessar mas com aviso
  if (!authLoading && !isAdmin) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "grey.50", py: 4 }}>
        <Box sx={{ maxWidth: 800, mx: "auto", px: 2 }}>
          <Alert severity="warning" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Acesso Restrito
            </Typography>
            <Typography variant="body2">
              Apenas administradores podem cadastrar eventos. Entre em contato
              com um admin para solicitar permissões.
            </Typography>
            <Button
              variant="contained"
              onClick={() => router.push(ROUTES.DASHBOARD)}
              sx={{ mt: 2 }}
            >
              Voltar ao Dashboard
            </Button>
          </Alert>
        </Box>
      </Box>
    );
  }

  const handleSubmit = async (data: EventFormData) => {
    setLoading(true);
    setError(null);
    setSuccess(false);

    try {
      await createEvent({
        name: data.name,
        date: data.date,
        location: data.location,
        description: data.description,
        category: data.category,
      });

      setSuccess(true);

      // Redireciona após sucesso
      setTimeout(() => {
        router.push(ROUTES.DASHBOARD);
      }, 2000);
    } catch (err) {
      console.error("Erro ao criar evento:", err);
      setError("Erro ao criar evento. Verifique se a API está rodando.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(ROUTES.DASHBOARD);
  };

  if (authLoading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
        }}
      >
        <Typography variant="h6">Carregando...</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ minHeight: "100vh", backgroundColor: "grey.50", py: 4 }}>
      <Box sx={{ maxWidth: 800, mx: "auto", px: 2 }}>
        {success && (
          <Alert severity="success" sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>
              Evento Criado com Sucesso! 🎉
            </Typography>
            <Typography variant="body2">
              O evento foi adicionado ao sistema. Redirecionando para o painel
              administrativo...
            </Typography>
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="body2">{error}</Typography>
          </Alert>
        )}

        <FormEvent
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          loading={loading}
          title="Cadastrar Novo Evento"
        />
      </Box>
    </Box>
  );
}
