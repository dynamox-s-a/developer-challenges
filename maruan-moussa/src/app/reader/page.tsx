"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  Box,
  Container,
  Card,
  CardContent,
  CardActions,
  Typography,
  TextField,
  MenuItem,
  Button,
  Chip,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { CalendarMonth, LocationOn, Search } from "@mui/icons-material";
import { useMemo, useState } from "react";
import { categoryColors, categoryMap } from "@/constants/eventCategories";
import { useEvents } from "@/hooks/useEventQueries";



export default function ReaderPage() {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("Todos");
  const [sortBy, setSortBy] = useState("data");
  const {data: events = [], isLoading, isError } = useEvents();

  const now = useMemo(() => new Date(), []);

  const filteredAndSortedEvents = useMemo(() => {
    if (!events.length) return { future: [], past: [] };
  
    const normalizeDate = (date: Date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const today = normalizeDate(new Date());
  
    const searchLower = search.toLowerCase();
  
    let filtered = [...events].filter((e) => {
      const title = e.title?.toLowerCase() || "";
      const desc = e.description?.toLowerCase() || "";
      const loc = e.location?.toLowerCase() || "";
      return (
        title.includes(searchLower) ||
        desc.includes(searchLower) ||
        loc.includes(searchLower)
      );
    });
  
    if (filterCategory !== "Todos") {
      filtered = filtered.filter(
        (e) => e.category.toLowerCase() === filterCategory.toLowerCase()
      );
    }
  
    filtered.sort((a, b) => {
      if (sortBy === "nome") {
        return a.title.localeCompare(b.title);
      }
      return new Date(a.date).getTime() - new Date(b.date).getTime();
    });
  
    const future = filtered.filter(
      (e) => normalizeDate(new Date(e.date)) >= today
    );
    const past = filtered.filter(
      (e) => normalizeDate(new Date(e.date)) < today
    );
  
    return { future, past };
  }, [events, search, filterCategory, sortBy]);
  

  const { future, past } = filteredAndSortedEvents;

  return (
   <ProtectedRoute requiredRole="reader">
      <Box sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}>
        <Box sx={{ flex: 1, mt: 8 }}>
          <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* 🔍 Filtros */}
            <Box
              sx={{
                display: "flex",
                flexDirection: { xs: "column", sm: "row" },
                gap: 2,
                mb: 4,
              }}
            >
              <TextField
                fullWidth
                placeholder="Buscar eventos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <Search />
                    </InputAdornment>
                  ),
                }}
              />
              <TextField
                select
                fullWidth
                value={filterCategory}
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <MenuItem value="Todos">Todas as categorias</MenuItem>
                <MenuItem value="Conferência">Conferência</MenuItem>
                <MenuItem value="Workshop">Workshop</MenuItem>
                <MenuItem value="Webinar">Webinar</MenuItem>
                <MenuItem value="Networking">Networking</MenuItem>
                <MenuItem value="Outro">Outro</MenuItem>
              </TextField>
              <TextField
                select
                fullWidth
                value={sortBy}
                onChange={(e) =>
                  setSortBy(e.target.value as "data" | "nome")
                }
              >
                <MenuItem value="data">Ordenar por data</MenuItem>
                <MenuItem value="nome">Ordenar por nome</MenuItem>
              </TextField>
            </Box>
            {isLoading && (
              <Box sx={{ textAlign: "center", mt: 6 }}>
                <CircularProgress />
                <Typography sx={{ mt: 2 }}>Carregando eventos...</Typography>
              </Box>
            )}

            {isError && (
              <Typography
                color="error"
                sx={{ textAlign: "center", mt: 4, fontWeight: 500 }}
              >
                Erro ao carregar eventos. Tente novamente.
              </Typography>
            )}
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                fontWeight: 700,
                color: "primary.main",
                textTransform: "uppercase",
              }}
            >
              Eventos Futuros
            </Typography>
            {future.length === 0 ? (
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontStyle: "italic",
                  textAlign: "center",
                  mb: 6,
                }}
              >
                Nenhum evento futuro encontrado.
              </Typography>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "1fr 1fr 1fr",
                  },
                  gap: 3,
                  mb: 6,
                }}
              >
                {future.map((event) => (
                  <Card
                    key={event.id}
                    sx={{
                      backdropFilter: "blur(20px)",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <CardContent sx={{ flex: 1 }}>
                      <Box sx={{ mb: 2 }}>
                        <Chip
                          label={categoryMap[event.category] || event.category}
                          color={categoryColors[event.category] || "default"}
                          size="small"
                        />
                      </Box>
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        {event.title}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                          color: "text.secondary",
                        }}
                      >
                        <CalendarMonth sx={{ fontSize: 16, mr: 1 }} />
                        {event.date}
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 2,
                          color: "text.secondary",
                        }}
                      >
                        <LocationOn sx={{ fontSize: 16, mr: 1 }} />
                        {event.location}
                      </Box>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {event.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button
                        fullWidth
                        variant="contained"
                        sx={{
                          background:
                            "linear-gradient(135deg, #7C3AED 0%, #0891B2 100%)",
                        }}
                      >
                        Ver Detalhes
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Box>
            )}

            {/* 📆 Eventos Passados */}
            <Typography
              variant="h5"
              sx={{
                mb: 3,
                fontWeight: 700,
                color: "text.secondary",
                textTransform: "uppercase",
              }}
            >
              Eventos Passados
            </Typography>

            {past.length === 0 ? (
              <Typography
                variant="body1"
                sx={{
                  color: "text.secondary",
                  fontStyle: "italic",
                  textAlign: "center",
                }}
              >
                Nenhum evento passado encontrado.
              </Typography>
            ) : (
              <Box
                sx={{
                  display: "grid",
                  gridTemplateColumns: {
                    xs: "1fr",
                    sm: "1fr 1fr",
                    md: "1fr 1fr 1fr",
                  },
                  gap: 3,
                }}
              >
                {past.map((event) => (
                  <Card
                    key={event.id}
                    sx={{
                      backdropFilter: "blur(20px)",
                      background: "rgba(255, 255, 255, 0.05)",
                      border: "1px solid rgba(255, 255, 255, 0.1)",
                      opacity: 0.75,
                      display: "flex",
                      flexDirection: "column",
                      height: "100%",
                    }}
                  >
                    <CardContent sx={{ flex: 1 }}>
                      <Chip
                        label={event.category}
                        color={categoryColors[event.category] || "default"}
                        size="small"
                        sx={{ mb: 2 }}
                      />
                      <Typography variant="h6" sx={{ fontWeight: 700, mb: 1 }}>
                        {event.title}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 1,
                          color: "text.secondary",
                        }}
                      >
                        <CalendarMonth sx={{ fontSize: 16, mr: 1 }} />
                        {event.date}
                      </Box>
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          mb: 2,
                          color: "text.secondary",
                        }}
                      >
                        <LocationOn sx={{ fontSize: 16, mr: 1 }} />
                        {event.location}
                      </Box>
                      <Typography variant="body2" sx={{ color: "text.secondary" }}>
                        {event.description}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </Container>
        </Box>
      </Box>
    </ProtectedRoute>
  );
}
