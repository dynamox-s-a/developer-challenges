"use client";

import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Box, Typography, Paper, Alert, Button } from "@mui/material";
import {
  Loading,
  EventsList,
  EventFilters,
  StatsChips,
  LogoutButton,
  AppContainer,
  PageHeader,
} from "@/components/ui";
import { getEvents } from "@/lib/api/apiClients";
import type { Event } from "@/types";
import { ROUTES } from "@/constants";

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
    router.push(ROUTES.HOME);
  };

  const handleClearFilters = () => {
    setSearchTerm("");
    setCategoryFilter("");
    setLocationFilter("");
    setSortBy("date");
    setSortOrder("asc");
  };

  const hasFilters = Boolean(searchTerm || categoryFilter || locationFilter);

  return (
    <AppContainer>
      <Paper elevation={3} sx={{ p: 4 }}>
        <PageHeader
          title="Dashboard - Event Management System"
          action={<LogoutButton onClick={handleLogout} />}
        />

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
              <EventFilters
                searchTerm={searchTerm}
                categoryFilter={categoryFilter}
                locationFilter={locationFilter}
                sortBy={sortBy}
                sortOrder={sortOrder}
                onSearchChange={setSearchTerm}
                onCategoryChange={setCategoryFilter}
                onLocationChange={setLocationFilter}
                onSortByChange={setSortBy}
                onSortOrderChange={setSortOrder}
                onClearFilters={() => {
                  setSearchTerm("");
                  setCategoryFilter("");
                  setLocationFilter("");
                  setSortBy("date");
                  setSortOrder("asc");
                }}
                categories={uniqueCategories}
              />

              <StatsChips
                totalEvents={events.length}
                upcomingEvents={upcomingEvents.length}
                pastEvents={pastEvents.length}
                filteredEvents={filteredEvents.length}
                hasFilters={hasFilters}
              />

              <EventsList
                events={upcomingEvents}
                title="Eventos Próximos"
                emptyMessage="Nenhum evento próximo encontrado."
                chipColor="success"
                isAdmin={isAdmin}
              />

              <EventsList
                events={pastEvents}
                title="Eventos Passados"
                emptyMessage="Nenhum evento passado encontrado."
                chipColor="default"
                isAdmin={isAdmin}
              />
            </>
          )}
        </Box>
      </Paper>
    </AppContainer>
  );
}
