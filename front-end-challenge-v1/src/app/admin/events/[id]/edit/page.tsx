"use client";

import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Paper,
  Typography,
} from "@mui/material";
import { useParams, useRouter } from "next/navigation";
import { useEffect } from "react";
import { EventForm } from "@/components/events";
import { selectEventById } from "@/features/events/eventsSelectors";
import { clearError, fetchEvents } from "@/features/events/eventsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";

export default function EditEventPage() {
  const router = useRouter();
  const params = useParams();
  const dispatch = useAppDispatch();

  const eventId = params.id as string;
  const event = useAppSelector((state) => selectEventById(state, eventId));
  const { isLoading, error, events } = useAppSelector((state) => state.events);

  useEffect(() => {
    // Fetch events if not already loaded
    if (events.length === 0) {
      dispatch(fetchEvents());
    }
  }, [dispatch, events.length]);

  useEffect(() => {
    return () => {
      dispatch(clearError());
    };
  }, [dispatch]);

  const handleBack = () => {
    router.push("/admin/events");
  };

  // Show loading while fetching events
  if (isLoading && events.length === 0) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
        <CircularProgress />
      </Box>
    );
  }

  // Show error if event not found
  if (!event && events.length > 0) {
    return (
      <>
        <Box sx={{ mb: 4 }}>
          <Button
            startIcon={<ArrowBackIcon />}
            onClick={handleBack}
            sx={{ mb: 2 }}
          >
            Back to Events
          </Button>
        </Box>
        <Alert severity="error">
          Event not found. The event may have been deleted or the ID is invalid.
        </Alert>
      </>
    );
  }

  return (
    <>
      <Box sx={{ mb: 4 }}>
        <Button
          startIcon={<ArrowBackIcon />}
          onClick={handleBack}
          sx={{ mb: 2 }}
        >
          Back to Events
        </Button>
        <Typography variant="h4" component="h1">
          Edit Event
        </Typography>
        {event && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            Editing: {event.name}
          </Typography>
        )}
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <Paper sx={{ p: 4 }}>{event && <EventForm event={event} />}</Paper>
    </>
  );
}
