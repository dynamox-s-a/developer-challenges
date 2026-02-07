"use client";

import { useEffect, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchEvents } from "@/store/slices/eventsSlice";
import {
  Container,
  Box,
  Typography,
  Grid,
  CircularProgress,
  Paper,
  Divider,
} from "@mui/material";

import EventFilters from "./components/event-filter";
import EventCard from "./components/event-card";

export default function EventsPage() {
  const dispatch = useAppDispatch();
  const { events, loading, filters } = useAppSelector((state) => state.events);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [sortBy, setSortBy] = useState("date-asc");

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const filteredEvents = useMemo(() => {
    const now = new Date();
    let filtered = [...events];

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (categoryFilter !== "Todas") {
      filtered = filtered.filter((event) => event.category === categoryFilter);
    }

    const future = filtered.filter((event) => new Date(event.date) > now);
    const past = filtered.filter((event) => new Date(event.date) <= now);

    const sortFn = (a: (typeof events)[0], b: (typeof events)[0]) => {
      switch (sortBy) {
        case "date-asc":
          return new Date(a.date).getTime() - new Date(b.date).getTime();
        case "date-desc":
          return new Date(b.date).getTime() - new Date(a.date).getTime();
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    };

    future.sort(sortFn);
    past.sort(sortFn);

    let combined = [...future, ...past];

    if (filters.timeFilter === "past") combined = past;
    else if (filters.timeFilter === "upcoming") combined = future;

    return combined;
  }, [events, searchTerm, categoryFilter, sortBy, filters.timeFilter]);

  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "80vh",
        }}
      >
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        Eventos
      </Typography>

      <EventFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        categoryFilter={categoryFilter}
        onCategoryChange={setCategoryFilter}
        sortBy={sortBy}
        onSortChange={setSortBy}
      />

      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          {filters.timeFilter === "all"
            ? "Todos os Eventos"
            : filters.timeFilter === "upcoming"
              ? `Próximos Eventos (${filteredEvents.length})`
              : `Eventos Encerrados (${filteredEvents.length})`}
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {filteredEvents.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              Nenhum evento encontrado.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {filteredEvents.map((event) => (
              <Grid key={event.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <EventCard
                  event={event}
                  isPast={new Date(event.date) <= new Date()}
                />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
}
