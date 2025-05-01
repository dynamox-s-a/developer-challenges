"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from "@mui/material";
import type { Event } from "@/services/events/types";

interface DeleteConfirmationProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  event: Event | null;
}

export default function DeleteConfirmation({
  open,
  onClose,
  onConfirm,
  event,
}: DeleteConfirmationProps) {
  if (!event) return null;

  const handleConfirm = async () => {
    await onConfirm();
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        Confirmar exclusão
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          Deseja realmente excluir o evento "{event.title}"? Esta ação não
          poderá ser desfeita.
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancelar</Button>
        <Button onClick={handleConfirm} autoFocus color="error">
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}
