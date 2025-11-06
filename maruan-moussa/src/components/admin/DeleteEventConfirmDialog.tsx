"use client";

import type React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Box,
  Typography,
  Avatar,
  Divider,
  useTheme,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import { useDeleteEvent } from "@/hooks/useEventQueries";
import toast from "react-hot-toast";
import type { EventModel } from "@/dto/EventModelDto";

interface DeleteConfirmDialogProps {
  open: boolean;
  onClose: () => void;
  event?: EventModel | null;
}

export function DeleteEventConfirmDialog({
  open,
  onClose,
  event,
}: DeleteConfirmDialogProps): React.ReactElement {
  const { mutate: deleteEvent, isPending } = useDeleteEvent();
  const theme = useTheme();
  const isLight = theme.palette.mode === "light";

  const handleConfirmDelete = () => {
    if (!event?.id) return;

    deleteEvent(event.id, {
      onSuccess: () => {
        toast.success(`Evento "${event.title}" deletado com sucesso!`);
        onClose();
      },
      onError: () => {
        toast.error("Falha ao deletar o evento.");
      },
    });
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
      PaperProps={{
        sx: {
          background: isLight
            ? "rgba(255,255,255,0.85)"
            : "rgba(25,25,25,0.6)",
          backdropFilter: "blur(12px)",
          borderRadius: 4,
          boxShadow: isLight
            ? "0 8px 32px rgba(0,0,0,0.08)"
            : "0 8px 32px rgba(0,0,0,0.6)",
          border: isLight
            ? "1px solid rgba(0,0,0,0.05)"
            : "1px solid rgba(255,255,255,0.08)",
          transition: "all 0.3s ease",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          textAlign: "center",
          background: "linear-gradient(90deg, #3b82f6, #7c3aed)", // mesmo degradê do header
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 1,
        }}
      >
        Confirmar Exclusão
      </DialogTitle>

      <Divider
        sx={{
          borderColor: isLight
            ? "rgba(239,68,68,0.3)"
            : "rgba(124,58,237,0.25)",
          mb: 2,
        }}
      />

      <DialogContent sx={{ textAlign: "center" }}>
        <Avatar
          sx={{
            width: 64,
            height: 64,
            mx: "auto",
            mb: 2,
            background: "rgba(239,68,68,0.15)",
            color: "#ef4444",
          }}
        >
          <DeleteIcon fontSize="large" />
        </Avatar>

        <Typography
          variant="body1"
          sx={{
            color: theme.palette.text.primary,
            fontWeight: 500,
            mb: 1,
          }}
        >
          Deseja realmente excluir o evento{" "}
          <Box
            component="span"
            sx={{
              fontWeight: 700,
              background: "linear-gradient(90deg, #3b82f6, #7c3aed)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              display: "inline-block",
            }}
          >
            {event?.title}
          </Box>
          ?
        </Typography>

        <Typography
          variant="body2"
          sx={{
            color: theme.palette.text.secondary,
            mb: 2,
          }}
        >
          Esta ação é irreversível e removerá permanentemente o registro deste evento.
        </Typography>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={isPending}
          sx={{
            color: "#7c3aed",
            borderColor: "rgba(124,58,237,0.3)",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              borderColor: "#7c3aed",
              background:
                "linear-gradient(90deg, rgba(124,58,237,0.08), rgba(59,130,246,0.08))",
            },
          }}
        >
          Cancelar
        </Button>
        <Button
          onClick={handleConfirmDelete}
          variant="contained"
          disabled={isPending}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            py: 1,
            borderRadius: "10px",
            background: "#ef4444", // vermelho sólido
            color: "#fff",
            boxShadow: "0 4px 12px rgba(239,68,68,0.35)",
            transition: "all 0.3s ease",
            "&:hover": {
              background: "#dc2626",
              boxShadow: "0 6px 18px rgba(239,68,68,0.45)",
              transform: "translateY(-1px)",
            },
          }}
        >
          {isPending ? "Deletando..." : "Deletar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
