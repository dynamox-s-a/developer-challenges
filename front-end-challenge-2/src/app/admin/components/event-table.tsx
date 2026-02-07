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
              <strong>Nome</strong>
            </TableCell>
            <TableCell>
              <strong>Data/Hora</strong>
            </TableCell>
            <TableCell>
              <strong>Local</strong>
            </TableCell>
            <TableCell>
              <strong>Categoria</strong>
            </TableCell>
            <TableCell align="right">
              <strong>Ações</strong>
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
                  component="span"
                  sx={{
                    display: "flex",
                    justifyContent: "center",
                    border: "1px solid",
                    padding: "4px 8px",
                    borderColor: "primary.main",
                    color: "primary.main",
                    borderRadius: "8px",
                    fontWeight: "bold",
                    width: "100px",
                    fontSize: "12px",
                  }}
                >
                  {event.category}
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
