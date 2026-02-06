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
  const { events, loading } = useAppSelector((state) => state.events);

  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [sortBy, setSortBy] = useState("date-asc");

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const { futureEvents, pastEvents } = useMemo(() => {
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

    filtered.sort((a, b) => {
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
    });

    const future = filtered.filter((event) => new Date(event.date) > now);
    const past = filtered.filter((event) => new Date(event.date) <= now);

    return { futureEvents: future, pastEvents: past };
  }, [events, searchTerm, categoryFilter, sortBy]);

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

      <Box sx={{ mb: 4 }}>
        <Typography variant="h5" component="h2" gutterBottom>
          Próximos Eventos ({futureEvents.length})
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {futureEvents.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              Nenhum evento futuro encontrado.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {futureEvents.map((event) => (
              <Grid key={event.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <EventCard event={event} isPast={false} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>

      <Box>
        <Typography variant="h5" component="h2" gutterBottom>
          Eventos Encerrados ({pastEvents.length})
        </Typography>
        <Divider sx={{ mb: 3 }} />

        {pastEvents.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: "center" }}>
            <Typography variant="body1" color="text.secondary">
              Nenhum evento passado encontrado.
            </Typography>
          </Paper>
        ) : (
          <Grid container spacing={3}>
            {pastEvents.map((event) => (
              <Grid key={event.id} size={{ xs: 12, sm: 6, md: 4 }}>
                <EventCard event={event} isPast={true} />
              </Grid>
            ))}
          </Grid>
        )}
      </Box>
    </Container>
  );
}
