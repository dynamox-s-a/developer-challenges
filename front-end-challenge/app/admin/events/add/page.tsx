"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/hooks/useAuth";
import { createEvent } from "@/lib/api/apiClients";
import FormEvent from "@/components/forms/FormEvent";
import { Typography, Alert } from "@mui/material";
import type { EventFormData } from "@/types";
import { ROUTES } from "@/constants";
import Loading from "@/components/ui/feedback/Loading";
import AlertMessage from "@/components/ui/feedback/AlertMessage";
import PageContainer from "@/components/ui/layout/PageContainer";

export default function AddEventPage() {
  const router = useRouter();
  const { isAuthenticated, isAdmin, loading: authLoading } = useAuth();
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Redireciona se não estiver autenticado
  useEffect(() => {
    if (!authLoading && (!isAuthenticated || !isAdmin)) {
      router.push(ROUTES.HOME);
    }
  }, [authLoading, isAuthenticated, isAdmin, router]);

  // Retorna loading enquanto verifica autenticação
  if (authLoading) {
    return <Loading />;
  }

  // Retorna null se não estiver autenticado (o useEffect irá redirecionar)
  if (!isAuthenticated || !isAdmin) {
    return null;
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
    router.back();
  };

  return (
    <PageContainer>
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

      {error && <AlertMessage message={error} />}

      <FormEvent
        onSubmit={handleSubmit}
        onCancel={handleCancel}
        loading={loading}
        title="Cadastrar Novo Evento"
      />
    </PageContainer>
  );
}
