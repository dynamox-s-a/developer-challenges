"use client";

import ProtectedRoute from "@/components/auth/ProtectedRoute";
import {
  Box,
  Container,
  Typography,
  TextField,
  MenuItem,
  InputAdornment,
  CircularProgress,
} from "@mui/material";
import { Search } from "@mui/icons-material";
import { useMemo, useState } from "react";
import { categoryOptions } from "@/constants/eventCategories";
import { useEvents } from "@/hooks/useEventQueries";
import { usePagination } from "@/hooks/usePagination";
import { EventGrid } from "@/components/events/EventGrid";
import { EventModel } from "@/dto/EventModelDto";
import { PaginationControls } from "@/components/PaginationControls";

export default function ReaderPage() {
  const [search, setSearch] = useState("");
  const [filterCategory, setFilterCategory] = useState("Todos");
  const [sortBy, setSortBy] = useState<"data" | "nome">("data");
  const { data: events = [], isLoading, isError } = useEvents();

  const { future, past } = useMemo(() => {
    if (!events.length) return { future: [], past: [] };

    const normalizeDate = (date: Date) =>
      new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const today = normalizeDate(new Date());

    const searchLower = search.toLowerCase();
    let filtered = events.filter((e) => {
      const title = e.title?.toLowerCase() || "";
      return title.includes(searchLower);
    });

    if (filterCategory !== "Todos") {
      filtered = filtered.filter(
        (e) => e.category.toLowerCase() === filterCategory.toLowerCase()
      );
    }

    filtered.sort((a, b) => {
      if (sortBy === "nome") return a.title.localeCompare(b.title);
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

  const {
    paginatedData: paginatedFuture,
    currentPage: futurePage,
    totalPages: futureTotal,
    isFirstPage: isFirstFuture,
    isLastPage: isLastFuture,
    nextPage: nextFuture,
    prevPage: prevFuture,
  } = usePagination<EventModel>(future, 9);

  const {
    paginatedData: paginatedPast,
    currentPage: pastPage,
    totalPages: pastTotal,
    isFirstPage: isFirstPast,
    isLastPage: isLastPast,
    nextPage: nextPast,
    prevPage: prevPast,
  } = usePagination<EventModel>(past, 9);

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
                {categoryOptions.map((option) => (
                  <MenuItem key={option.value} value={option.value}>
                    {option.label}
                  </MenuItem>
                ))}
              </TextField>
              <TextField
                select
                fullWidth
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as "data" | "nome")}
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

            {paginatedFuture.length === 0 ? (
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
              <>
                <EventGrid events={paginatedFuture} />
                <PaginationControls
                  currentPage={futurePage}
                  totalPages={futureTotal}
                  onPrevPage={prevFuture}
                  onNextPage={nextFuture}
                  isFirstPage={isFirstFuture}
                  isLastPage={isLastFuture}
                />
              </>
            )}
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

            {paginatedPast.length === 0 ? (
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
              <>
                <EventGrid events={paginatedPast} faded />
                <PaginationControls
                  currentPage={pastPage}
                  totalPages={pastTotal}
                  onPrevPage={prevPast}
                  onNextPage={nextPast}
                  isFirstPage={isFirstPast}
                  isLastPage={isLastPast}
                />
              </>
            )}
          </Container>
        </Box>
      </Box>
    </ProtectedRoute>
  );
}
