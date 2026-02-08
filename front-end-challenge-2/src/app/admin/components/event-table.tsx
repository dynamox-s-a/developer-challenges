"use client";

import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  CircularProgress,
  Box,
  Typography,
  Chip,
} from "@mui/material";
import { Edit, Delete } from "@mui/icons-material";
import { Event } from "@/types";

interface EventsTableProps {
  events: Event[];
  loading: boolean;
  onEdit: (event: Event) => void;
  onDelete: (id: number) => void;
}

export default function EventsTable({
  events,
  loading,
  onEdit,
  onDelete,
}: EventsTableProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
        <CircularProgress />
      </Box>
    );
  }

  if (events.length === 0) {
    return (
      <Paper sx={{ p: 4, textAlign: "center" }}>
        <Typography variant="body1" color="text.secondary">
          Nenhum evento cadastrado. Clique em Novo Evento para começar.
        </Typography>
      </Paper>
    );
  }

  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>
              <Typography
                component="h2"
                gutterBottom
                color="text.primary"
                fontWeight="bold"
              >
                Nome
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                component="h2"
                gutterBottom
                color="text.primary"
                fontWeight="bold"
              >
                Data/Hora
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                component="h2"
                gutterBottom
                color="text.primary"
                fontWeight="bold"
              >
                Local
              </Typography>
            </TableCell>
            <TableCell>
              <Typography
                component="h2"
                gutterBottom
                color="text.primary"
                fontWeight="bold"
              >
                Categoria
              </Typography>
            </TableCell>
            <TableCell align="right">
              <Typography
                component="h2"
                gutterBottom
                color="text.primary"
                fontWeight="bold"
              >
                Ações
              </Typography>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {events.map((event) => (
            <TableRow key={event.id}>
              <TableCell>{event.name}</TableCell>
              <TableCell>{formatDate(event.date)}</TableCell>
              <TableCell>{event.location}</TableCell>
              <TableCell>
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "start",
                    mb: 2,
                  }}
                >
                  <Chip label={event.category} size="small" color="default" />
                </Box>
              </TableCell>
              <TableCell align="right">
                <IconButton
                  color="primary"
                  onClick={() => onEdit(event)}
                  size="small"
                  aria-label="Editar evento"
                >
                  <Edit sx={{ fontSize: "18px" }} />
                </IconButton>
                <IconButton
                  color="error"
                  onClick={() => onDelete(event.id!)}
                  size="small"
                  aria-label="Deletar evento"
                >
                  <Delete sx={{ fontSize: "18px" }} />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}
