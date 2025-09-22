"use client";

import { useState, useEffect, use } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { getEventById, updateEvent, deleteEvent } from "@/lib/api/apiClients";
import FormEvent from "@/components/forms/FormEvent";
import { Box, Typography, Alert } from "@mui/material";
import type { EventFormData } from "@/types";
import { ROUTES } from "@/constants";

export default function EditEventPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [initialData, setInitialData] = useState<EventFormData | null>(null);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const resolvedParams = use(params);
  const eventId = resolvedParams.id;

  // Carrega dados do evento
  useEffect(() => {
    const loadEvent = async () => {
      try {
        const event = await getEventById(eventId);
        setInitialData({
          name: event.name,
          date: event.date,
          location: event.location,
          description: event.description,
          category: event.category,
        });
      } catch (err) {
        console.error("Erro ao carregar evento:", err);
        setError("Erro ao carregar dados do evento.");
      }
    };

    if (isAuthenticated && isAdmin) {
      loadEvent();
    }
  }, [eventId, isAuthenticated, isAdmin]);

  // Redireciona se não estiver autenticado
  if (!authLoading && !isAuthenticated) {
    router.push(ROUTES.HOME);
    return null;
  }

  // Se não for admin, mostra acesso negado
  if (!authLoading && !isAdmin) {
    return (
      <Box sx={{ minHeight: "100vh", backgroundColor: "grey.50", py: 4 }}>
        <Box sx={{ maxWidth: 800, mx: "auto", px: 2 }}>
          <Alert severity="warning">
            Apenas administradores podem editar eventos.
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
      await updateEvent(eventId, {
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
      console.error("Erro ao atualizar evento:", err);
      setError("Erro ao atualizar evento. Verifique se a API está rodando.");
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    router.push(ROUTES.DASHBOARD);
  };

  const handleDelete = async () => {
    if (
      !confirm(
        "Tem certeza que deseja excluir este evento? Esta ação não pode ser desfeita."
      )
    ) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      await deleteEvent(eventId);
      alert("Evento excluído com sucesso!");
      router.push(ROUTES.DASHBOARD);
    } catch (err) {
      console.error("Erro ao excluir evento:", err);
      setError("Erro ao excluir evento. Verifique se a API está rodando.");
    } finally {
      setLoading(false);
    }
  };

  if (authLoading || !initialData) {
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
            Evento atualizado com sucesso! Redirecionando...
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        <FormEvent
          onSubmit={handleSubmit}
          onCancel={handleCancel}
          onDelete={handleDelete}
          loading={loading}
          title="Editar Evento"
          initialData={initialData}
        />
      </Box>
    </Box>
  );
}
