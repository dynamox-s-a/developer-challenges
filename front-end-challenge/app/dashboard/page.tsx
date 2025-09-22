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
  TextField,
  MenuItem,
  Chip,
  FormControl,
  InputLabel,
  Select,
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

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated, isAdmin, logout } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingEvents, setLoadingEvents] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [locationFilter, setLocationFilter] = useState("");
  const [sortBy, setSortBy] = useState<"date" | "name">("date");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");

  // Redireciona para login se não estiver autenticado
  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/");
    }
  }, [isAuthenticated, loading, router]);

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

    if (isAuthenticated) {
      loadEvents();
    }
  }, [isAuthenticated]);

  // Função para filtrar e ordenar eventos
  const getFilteredAndSortedEvents = () => {
    const filteredEvents = events.filter((event) => {
      const matchesSearch =
        event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        event.description.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory =
        !categoryFilter || event.category === categoryFilter;
      const matchesLocation =
        !locationFilter ||
        event.location.toLowerCase().includes(locationFilter.toLowerCase());

      return matchesSearch && matchesCategory && matchesLocation;
    });

    // Ordenação - criamos uma cópia ordenada
    const sortedEvents = [...filteredEvents].sort((a, b) => {
      if (sortBy === "date") {
        const dateA = new Date(a.date).getTime();
        const dateB = new Date(b.date).getTime();
        return sortOrder === "asc" ? dateA - dateB : dateB - dateA;
      } else {
        const nameA = a.name.toLowerCase();
        const nameB = b.name.toLowerCase();
        if (sortOrder === "asc") {
          return nameA.localeCompare(nameB);
        } else {
          return nameB.localeCompare(nameA);
        }
      }
    });

    return sortedEvents;
  };

  // Separar eventos passados e futuros
  const now = new Date();
  const filteredEvents = getFilteredAndSortedEvents();
  const upcomingEvents = filteredEvents.filter(
    (event) => new Date(event.date) >= now
  );
  const pastEvents = filteredEvents.filter(
    (event) => new Date(event.date) < now
  );

  // Obter categorias únicas para o filtro
  const uniqueCategories = [
    ...new Set(events.map((event) => event.category)),
  ].sort();

  // Se estiver carregando ou não autenticado, não mostra nada
  if (loading || !isAuthenticated) {
    return <Loading />;
  }

  const handleLogout = () => {
    logout();
    router.push("/");
  };

  // Componente para renderizar lista de eventos
  const EventsList = ({
    events,
    title,
    emptyMessage,
    chipColor,
  }: {
    events: Event[];
    title: string;
    emptyMessage: string;
    chipColor: "success" | "default" | "error";
  }) => (
    <Box sx={{ mb: 3 }}>
      <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
        <Typography variant="h6">{title}</Typography>
        <Chip label={events.length} color={chipColor} size="small" />
      </Box>

      {events.length === 0 ? (
        <Alert severity="info">{emptyMessage}</Alert>
      ) : (
        <Paper elevation={1} sx={{ maxHeight: 300, overflow: "auto" }}>
          <List>
            {events.map((event, index) => (
              <div key={event.id}>
                <ListItem
                  onClick={
                    isAdmin
                      ? () => router.push(`/admin/events/edit/${event.id}`)
                      : undefined
                  }
                  sx={{
                    cursor: isAdmin ? "pointer" : "default",
                    "&:hover": isAdmin
                      ? { backgroundColor: "action.hover" }
                      : {},
                  }}
                >
                  <ListItemText
                    primary={
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "space-between",
                          alignItems: "center",
                        }}
                      >
                        <Typography variant="subtitle1" fontWeight="medium">
                          {event.name}
                        </Typography>
                        <Chip
                          label={event.category}
                          size="small"
                          variant="outlined"
                          sx={{ ml: 1 }}
                        />
                      </Box>
                    }
                    secondary={
                      <>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: "block" }}
                        >
                          📅 {new Date(event.date).toLocaleString("pt-BR")}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: "block" }}
                        >
                          📍 {event.location}
                        </Typography>
                        <Typography
                          component="span"
                          variant="body2"
                          color="text.secondary"
                          sx={{ display: "block", mt: 0.5 }}
                        >
                          {event.description}
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
  );

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
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 3,
            }}
          >
            <Typography variant="h4" color="primary">
              Dashboard - Event Management System
            </Typography>
            <Button variant="outlined" onClick={handleLogout}>
              Logout
            </Button>
          </Box>

          <Alert severity="success" sx={{ mb: 3 }}>
            Bem-vindo, {user?.email}!
            {isAdmin && (
              <Box sx={{ mt: 1 }}>
                <Typography variant="body2">
                  Como você é admin, também tem acesso à{" "}
                  <Button
                    variant="text"
                    size="small"
                    onClick={() => router.push("/admin")}
                    sx={{ textDecoration: "underline", p: 0, minWidth: "auto" }}
                  >
                    área administrativa
                  </Button>{" "}
                  e pode clicar nos eventos para editá-los.
                </Typography>
              </Box>
            )}
          </Alert>

          <Box sx={{ mb: 4 }}>
            {loadingEvents ? (
              <Typography>Carregando eventos...</Typography>
            ) : (
              <>
                <Paper elevation={0} sx={{ p: 3, mb: 3 }}>
                  <Typography variant="h6" gutterBottom>
                    Filtros e Ordenação
                  </Typography>

                  <Box
                    sx={{
                      display: "flex",
                      gap: 2,
                      flexWrap: "wrap",
                      alignItems: "center",
                    }}
                  >
                    <TextField
                      label="Buscar eventos"
                      placeholder="Nome ou descrição..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      size="small"
                      sx={{ minWidth: 200, flex: 1 }}
                    />

                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Categoria</InputLabel>
                      <Select
                        value={categoryFilter}
                        label="Categoria"
                        onChange={(e) => setCategoryFilter(e.target.value)}
                      >
                        <MenuItem value="">Todas</MenuItem>
                        {uniqueCategories.map((category) => (
                          <MenuItem key={category} value={category}>
                            {category}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>

                    <TextField
                      label="Local"
                      placeholder="Filtrar por local..."
                      value={locationFilter}
                      onChange={(e) => setLocationFilter(e.target.value)}
                      size="small"
                      sx={{ minWidth: 120 }}
                    />

                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Ordenar por</InputLabel>
                      <Select
                        value={sortBy}
                        label="Ordenar por"
                        onChange={(e) =>
                          setSortBy(e.target.value as "date" | "name")
                        }
                      >
                        <MenuItem value="date">Data</MenuItem>
                        <MenuItem value="name">Nome</MenuItem>
                      </Select>
                    </FormControl>

                    <FormControl size="small" sx={{ minWidth: 120 }}>
                      <InputLabel>Ordem</InputLabel>
                      <Select
                        value={sortOrder}
                        label="Ordem"
                        onChange={(e) =>
                          setSortOrder(e.target.value as "asc" | "desc")
                        }
                      >
                        <MenuItem value="asc">
                          {sortBy === "date" ? "Mais antigo" : "A → Z"}
                        </MenuItem>
                        <MenuItem value="desc">
                          {sortBy === "date" ? "Mais recente" : "Z → A"}
                        </MenuItem>
                      </Select>
                    </FormControl>

                    <Button
                      variant="contained"
                      onClick={() => {
                        setSearchTerm("");
                        setCategoryFilter("");
                        setLocationFilter("");
                        setSortBy("date");
                        setSortOrder("asc");
                      }}
                    >
                      Limpar Filtros
                    </Button>
                  </Box>
                </Paper>

                <Box sx={{ mb: 3, display: "flex", gap: 2, flexWrap: "wrap" }}>
                  <Chip label={`Total: ${events.length}`} color="primary" />
                  <Chip
                    label={`Próximos: ${upcomingEvents.length}`}
                    color="success"
                  />
                  <Chip
                    label={`Passados: ${pastEvents.length}`}
                    color="default"
                  />
                  {(searchTerm || categoryFilter || locationFilter) && (
                    <Chip
                      label={`Filtrados: ${filteredEvents.length}`}
                      color="secondary"
                      variant="outlined"
                    />
                  )}
                </Box>

                <EventsList
                  events={upcomingEvents}
                  title="Eventos Próximos"
                  emptyMessage="Nenhum evento próximo encontrado."
                  chipColor="success"
                />

                <EventsList
                  events={pastEvents}
                  title="Eventos Passados"
                  emptyMessage="Nenhum evento passado encontrado."
                  chipColor="default"
                />
              </>
            )}
          </Box>
        </Paper>
      </Box>
    </Box>
  );
}
