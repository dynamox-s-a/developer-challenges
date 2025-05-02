"use client";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
  Box,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import type { Event } from "@/services/events/types";

interface EventDetailsModalProps {
  event: Event | null;
  open: boolean;
  onClose: () => void;
  onEdit: (event: Event) => void;
  onDelete: (event: Event) => void;
}

export default function EventDetailsModal({
  event,
  open,
  onClose,
  onEdit,
  onDelete,
}: EventDetailsModalProps) {
  if (!event) return null;

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      sx={{
        "& .MuiDialog-paper": {
          borderRadius: 2,
        },
      }}
    >
      <DialogTitle
        sx={{
          m: 0,
          p: 2,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h6" component="div" sx={{ fontWeight: 600 }}>
          Detalhes do Evento
        </Typography>
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            color: "grey.500",
          }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      <DialogContent dividers>
        <Box sx={{ py: 1 }}>
          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Título
          </Typography>
          <Typography variant="body1" paragraph>
            {event.title}
          </Typography>

          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Descrição
          </Typography>
          <Typography variant="body1" paragraph>
            {event.description}
          </Typography>

          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Data
          </Typography>
          <Typography variant="body1" paragraph>
            {new Date(event.date).toLocaleDateString("pt-BR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>

          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Local
          </Typography>
          <Typography variant="body1" paragraph>
            {event.location}
          </Typography>

          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Categoria
          </Typography>
          <Typography variant="body1" paragraph>
            {event.category}
          </Typography>

          <Typography variant="subtitle2" color="text.secondary" gutterBottom>
            Status
          </Typography>
          <Typography variant="body1" sx={{ color: new Date(event.date) > new Date() ? "success.main" : "text.secondary" }}>
            {new Date(event.date) > new Date() ? "Ativo" : "Finalizado"}
          </Typography>
        </Box>
      </DialogContent>
      <DialogActions sx={{ px: 3, py: 2, gap: 1 }}>
        <Button
          variant="outlined"
          color="inherit"
          onClick={onClose}
          size="large"
        >
          Fechar
        </Button>
        <Button
          variant="contained"
          color="primary"
          startIcon={<EditIcon />}
          onClick={() => {
            onEdit(event);
            onClose();
          }}
          size="large"
          sx={{ bgcolor: "var(--color-primary)" }}
        >
          Editar
        </Button>
        <Button
          variant="contained"
          color="error"
          startIcon={<DeleteIcon />}
          onClick={() => {
            onDelete(event);
            onClose();
          }}
          size="large"
        >
          Excluir
        </Button>
      </DialogActions>
    </Dialog>
  );
}
