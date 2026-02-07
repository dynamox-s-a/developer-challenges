"use client";

import { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";

import {
  Container,
  Box,
  Typography,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { Event } from "@/types";
import EventForm from "@/app/events/components/event-form";
import EventsTable from "./components/event-table";
import DeleteDialog from "./components/delete-dialog";
import { deleteEvent, fetchEvents } from "@/store/event/eventsThunk";

export default function AdminPage() {
  const dispatch = useAppDispatch();
  const { events, loading } = useAppSelector((state) => state.events);

  const [openDialog, setOpenDialog] = useState(false);
  const [editingEvent, setEditingEvent] = useState<Event | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [eventToDelete, setEventToDelete] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  const handleOpenDialog = (event?: Event) => {
    setEditingEvent(event || null);
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
    setEditingEvent(null);
  };

  const handleDeleteClick = (id: number) => {
    setEventToDelete(id);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (eventToDelete) {
      await dispatch(deleteEvent(eventToDelete));
      setDeleteConfirmOpen(false);
      setEventToDelete(null);
    }
  };

  const handleCancelDelete = () => {
    setDeleteConfirmOpen(false);
    setEventToDelete(null);
  };

  return (
    <>
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h4" component="h1">
            Gerenciar Eventos
          </Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => handleOpenDialog()}
          >
            Novo Evento
          </Button>
        </Box>

        <EventsTable
          events={events}
          loading={loading}
          onEdit={handleOpenDialog}
          onDelete={handleDeleteClick}
        />
      </Container>

      <Dialog
        open={openDialog}
        onClose={handleCloseDialog}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {editingEvent ? "Editar Evento" : "Novo Evento"}
        </DialogTitle>
        <DialogContent>
          <EventForm
            event={editingEvent}
            onSuccess={handleCloseDialog}
            onCancel={handleCloseDialog}
          />
        </DialogContent>
      </Dialog>

      <DeleteDialog
        open={deleteConfirmOpen}
        onConfirm={handleConfirmDelete}
        onCancel={handleCancelDelete}
      />
    </>
  );
}
