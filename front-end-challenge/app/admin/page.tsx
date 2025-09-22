"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Alert,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import Loading from "@/components/ui/Loading";
import { getEvents } from "@/lib/api/apiClients";

interface Event {
  id: number;
  name: string;
  date: string;
  location: string;
  description: string;
  category: string;
}

export default function AdminPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated, isAdmin, logout } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);

  // Redireciona se não estiver autenticado ou não for admin
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/");
    } else if (!loading && isAuthenticated && !isAdmin) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isAdmin, loading, router]);

  // Carrega eventos
  useEffect(() => {
    const loadEvents = async () => {
      try {
        const eventsData = await getEvents();
        setEvents(eventsData);
      } catch (error) {
        console.error("Erro ao carregar eventos:", error);
      } finally {
        setLoadingEvents(false);
      }
    };

    if (isAuthenticated && isAdmin) {
      loadEvents();
    }
  }, [isAuthenticated, isAdmin]);

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
            Bem-vindo ao painel administrativo, {user?.email}! Você tem acesso
            completo ao sistema.
          </Alert>

          <Box sx={{ mb: 4 }}>
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
                    Cadastrar Evento
                  </Typography>
                </Box>
              </Button>
            </Box>
          </Box>

          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Eventos Cadastrados
            </Typography>

            {loadingEvents ? (
              <Typography>Carregando eventos...</Typography>
            ) : events.length === 0 ? (
              <Alert severity="info">Nenhum evento cadastrado ainda.</Alert>
            ) : (
              <Paper elevation={1} sx={{ maxHeight: 400, overflow: "auto" }}>
                <List>
                  {events.map((event, index) => (
                    <div key={event.id}>
                      <ListItem
                        onClick={() =>
                          router.push(`/admin/events/edit/${event.id}`)
                        }
                        sx={{
                          cursor: "pointer",
                          "&:hover": { backgroundColor: "action.hover" },
                        }}
                      >
                        <ListItemText
                          primary={event.name}
                          secondary={
                            <>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                                sx={{ display: "block" }}
                              >
                                📅{" "}
                                {new Date(event.date).toLocaleString("pt-BR")}
                              </Typography>
                              <Typography
                                component="span"
                                variant="body2"
                                color="text.secondary"
                                sx={{ display: "block" }}
                              >
                                📍 {event.location} • {event.category}
                              </Typography>
                            </>
                          }
                        />
                      </ListItem>
                      {index < events.length - 1 && <Divider />}
                    </div>
                  ))}
                </List>
              </Paper>
            )}
          </Box>

          <Button variant="outlined" onClick={handleLogout}>
            Logout
          </Button>
        </Paper>
      </Box>
    </Box>
  );
}
