"use client";

import { useEffect, useState } from "react";
import {
  Box,
  Container,
  Typography,
  Button,
  Alert,
  Snackbar,
} from "@mui/material";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  fetchEvents,
  createEvent,
  updateEvent,
  deleteEvent,
} from "@/store/slices/eventsSlice";
import ProtectedRoute from "@/components/ProtectedRoute";
import Navbar from "@/components/Navbar";
import EventsList from "@/components/EventsList";
import EventFormDialog from "@/components/EventFormDialog";
import AddIcon from "@mui/icons-material/Add";
import { CreateEventRequest, Event, UpdateEventRequest } from "@/types";

function AdminDashboard() {
  const dispatch = useAppDispatch();
  const { events, loading } = useAppSelector((state) => state.events);

  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<"create" | "edit">("create");
  const [selectedEvent, setSelectedEvent] = useState<Event | null>(null);
  const [snackbar, setSnackbar] = useState<{
    open: boolean;
    message: string;
    severity: "success" | "error";
  }>({
    open: false,
    message: "",
    severity: "success",
  });

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleCreateClick = () => {
    setDialogMode("create");
    setSelectedEvent(null);
    setDialogOpen(true);
  };

  const handleEditClick = (event: Event) => {
    setDialogMode("edit");
    setSelectedEvent(event);
    setDialogOpen(true);
  };

  const handleDeleteClick = async (id: number) => {
    if (window.confirm("Are you sure you want to delete this event?")) {
      try {
        await dispatch(deleteEvent(id)).unwrap();
        setSnackbar({
          open: true,
          message: "Event deleted successfully",
          severity: "success",
        });
      } catch {
        setSnackbar({
          open: true,
          message: "Failed to delete event",
          severity: "error",
        });
      }
    }
  };

  const handleFormSubmit = async (eventData: CreateEventRequest) => {
    try {
      if (dialogMode === "create") {
        await dispatch(createEvent(eventData)).unwrap();
        setSnackbar({
          open: true,
          message: "Event created successfully",
          severity: "success",
        });
      } else if (selectedEvent) {
        const updateData: UpdateEventRequest = {
          ...eventData,
          id: selectedEvent.id,
        };
        await dispatch(updateEvent(updateData)).unwrap();
        setSnackbar({
          open: true,
          message: "Event updated successfully",
          severity: "success",
        });
      }
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to ${dialogMode} event`,
        severity: "error",
      });
      throw error;
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
          mb={3}
        >
          <Typography variant="h4" component="h1">
            Admin Dashboard
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleCreateClick}
          >
            Create Event
          </Button>
        </Box>

        {loading && events.length === 0 ? (
          <Typography>Loading events...</Typography>
        ) : (
          <EventsList
            events={events}
            isAdmin
            onEdit={handleEditClick}
            onDelete={handleDeleteClick}
          />
        )}

        <EventFormDialog
          open={dialogOpen}
          onClose={() => setDialogOpen(false)}
          onSubmit={handleFormSubmit}
          event={selectedEvent}
          mode={dialogMode}
        />

        <Snackbar
          open={snackbar.open}
          autoHideDuration={6000}
          onClose={() => setSnackbar({ ...snackbar, open: false })}
        >
          <Alert
            onClose={() => setSnackbar({ ...snackbar, open: false })}
            severity={snackbar.severity}
            sx={{ width: "100%" }}
          >
            {snackbar.message}
          </Alert>
        </Snackbar>
      </Container>
    </>
  );
}

export default function AdminPage() {
  return (
    <ProtectedRoute requiredRole="admin">
      <AdminDashboard />
    </ProtectedRoute>
  );
}
