"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Button,
} from "@mui/material";

interface DeleteDialogProps {
  open: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}

export default function DeleteDialog({
  open,
  onConfirm,
  onCancel,
}: DeleteDialogProps) {
  return (
    <Dialog open={open} onClose={onCancel}>
      <DialogTitle>Confirmar Exclusão</DialogTitle>
      <DialogContent>
        <Typography color="text.primary">
          Tem certeza que deseja excluir este evento? Esta ação não pode ser
          desfeita.
        </Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={onCancel}>Cancelar</Button>
        <Button onClick={onConfirm} color="error" variant="contained">
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}
