"use client";

import AddIcon from "@mui/icons-material/Add";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Container,
  Typography,
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { EventsTable } from "@/components/events";
import { sortEvents } from "@/features/events/eventsSelectors";
import { clearError, fetchEvents } from "@/features/events/eventsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { SortOrder } from "@/types";

export default function AdminEventsPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { events, isLoading, error } = useAppSelector((state) => state.events);

  const [sortField, setSortField] = useState<"name" | "dateTime">("dateTime");
  const [sortOrder, setSortOrder] = useState<SortOrder>("asc");

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleSortChange = useCallback(
    (field: "name" | "dateTime") => {
      if (field === sortField) {
        setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
      } else {
        setSortField(field);
        setSortOrder("asc");
      }
    },
    [sortField],
  );

  const handleCreateEvent = () => {
    router.push("/admin/events/new");
  };

  const handleBackToDashboard = () => {
    router.push("/admin");
  };

  const sortedEvents = sortEvents(events, sortField, sortOrder);

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 4,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBackToDashboard}
            sx={{ mr: 1 }}
          >
            Dashboard
          </Button>
          <Typography variant="h4" component="h1">
            Manage Events
          </Typography>
        </Box>
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreateEvent}
        >
          Create Event
        </Button>
      </Box>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          onClose={() => dispatch(clearError())}
        >
          {error}
        </Alert>
      )}

      {isLoading && events.length === 0 ? (
        <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
          <CircularProgress />
        </Box>
      ) : (
        <EventsTable
          events={sortedEvents}
          sortField={sortField}
          sortOrder={sortOrder}
          onSortChange={handleSortChange}
        />
      )}
    </Container>
  );
}
