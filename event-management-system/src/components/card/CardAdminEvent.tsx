import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  TextField,
  IconButton,
  Typography,
  Box,
  Alert,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import DeleteIcon from "@mui/icons-material/Delete";
import CancelIcon from "@mui/icons-material/Cancel";
import { useEffect, useState } from "react";
import {
  Event,
  updateEvent,
  deleteEvent,
  postEvent,
} from "../../app/services/events";

const primaryColor = "#692746";

const StyledTableCellHead = styled(TableCell)(() => ({
  backgroundColor: primaryColor,
  color: "#ffffff",
  fontWeight: "bold",
}));

const StyledTableRow = styled(TableRow)(() => ({
  "&:nth-of-type(odd)": {
    backgroundColor: "#f5f5f5",
  },
  "&:nth-of-type(even)": {
    backgroundColor: "#ffffff",
  },
}));

interface Props {
  events: Event[];
  onRefresh: () => void;
  onDiscardNew: () => void;
}

const CardAdminEventTable = ({ events, onRefresh, onDiscardNew }: Props) => {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<
    "success" | "error" | null
  >(null);

  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedEvent, setEditedEvent] = useState<Partial<Event>>({});

  const isCreating = editingId === 0;

  const handleEdit = (event: Event) => {
    setEditingId(event.id!);
    setEditedEvent({ ...event });
  };

  const handleCancel = () => {
    if (isCreating) {
      onDiscardNew();
    }
    setEditingId(null);
    setEditedEvent({});
  };

  const handleChange = (field: keyof Event, value: string) => {
    setEditedEvent((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (
      !editedEvent.name ||
      !editedEvent.location ||
      !editedEvent.datetime ||
      !editedEvent.description ||
      editedEvent.description.length < 50
    ) {
      setAlertMessage(
        "Preencha todos os campos corretamente. A descrição deve ter no mínimo 50 caracteres."
      );
      setAlertSeverity("error");
      return;
    }

    try {
      if (isCreating) {
        await postEvent(editedEvent as Event);
      } else {
        await updateEvent(editedEvent.id!, editedEvent as Event);
      }
      setAlertMessage("Evento salvo com sucesso!");
      setAlertSeverity("success");
      setEditingId(null);
      setEditedEvent({});
      onRefresh();
    } catch (error) {
      setAlertMessage("Erro ao salvar o evento.");
      setAlertSeverity("error");
      console.error(error);
    }
  };

  const handleDelete = async (id: number) => {
    await deleteEvent(id);
    onRefresh();
  };

  useEffect(() => {
    const newEvent = events.find((e) => !e.id);
    if (newEvent) {
      setEditingId(0);
      setEditedEvent({ ...newEvent });
    }
  }, [events]);

  useEffect(() => {
    if (alertMessage && alertSeverity) {
      const timer = setTimeout(() => {
        setAlertMessage(null);
        setAlertSeverity(null);
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [alertMessage, alertSeverity]);

  return (
    <>
      {alertMessage && alertSeverity && (
        <Box
          sx={{
            mb: 2,
            position: "fixed",
            bottom: "10px",
            left: "942px",
            zIndex: 10,
          }}
        >
          <Alert
            variant="filled"
            severity={alertSeverity}
            onClose={() => {
              setAlertMessage(null);
              setAlertSeverity(null);
            }}
          >
            {alertMessage}
          </Alert>
        </Box>
      )}

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <StyledTableCellHead>Categoria</StyledTableCellHead>
              <StyledTableCellHead>Nome</StyledTableCellHead>
              <StyledTableCellHead>Data e Hora</StyledTableCellHead>
              <StyledTableCellHead>Localização</StyledTableCellHead>
              <StyledTableCellHead>Descrição</StyledTableCellHead>
              <StyledTableCellHead align="right">Ações</StyledTableCellHead>
            </TableRow>
          </TableHead>
          <TableBody>
            {events.map((event) => {
              const isEditing =
                editingId === event.id || (!event.id && editingId === 0);

              return (
                <StyledTableRow key={event.id ?? "new"}>
                  <TableCell>
                    {isEditing ? (
                      <TextField
                        value={editedEvent.category || ""}
                        onChange={(e) =>
                          handleChange("category", e.target.value)
                        }
                        variant="standard"
                        fullWidth
                        placeholder="Categoria"
                        InputProps={{
                          sx: {
                            "&:before": { borderBottomColor: primaryColor },
                            "&:after": { borderBottomColor: primaryColor },
                          },
                        }}
                      />
                    ) : (
                      <Typography>{event.category}</Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    {isEditing ? (
                      <TextField
                        value={editedEvent.name || ""}
                        onChange={(e) => handleChange("name", e.target.value)}
                        variant="standard"
                        fullWidth
                        placeholder="Nome"
                        InputProps={{
                          sx: {
                            "&:before": { borderBottomColor: primaryColor },
                            "&:after": { borderBottomColor: primaryColor },
                          },
                        }}
                      />
                    ) : (
                      <Typography
                        sx={{
                          color: primaryColor,
                          fontWeight: "bold",
                          textTransform: "uppercase",
                        }}
                      >
                        {event.name}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    {isEditing ? (
                      <TextField
                        type="datetime-local"
                        value={editedEvent.datetime?.slice(0, 16) || ""}
                        onChange={(e) =>
                          handleChange("datetime", e.target.value)
                        }
                        variant="standard"
                        fullWidth
                        InputProps={{
                          sx: {
                            "&:before": { borderBottomColor: primaryColor },
                            "&:after": { borderBottomColor: primaryColor },
                          },
                        }}
                      />
                    ) : (
                      <Typography>
                        {new Date(event.datetime).toLocaleString("pt-BR", {
                          dateStyle: "short",
                          timeStyle: "short",
                        })}
                      </Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    {isEditing ? (
                      <TextField
                        value={editedEvent.location || ""}
                        onChange={(e) =>
                          handleChange("location", e.target.value)
                        }
                        variant="standard"
                        fullWidth
                        placeholder="Local"
                        InputProps={{
                          sx: {
                            "&:before": { borderBottomColor: primaryColor },
                            "&:after": { borderBottomColor: primaryColor },
                          },
                        }}
                      />
                    ) : (
                      <Typography>{event.location}</Typography>
                    )}
                  </TableCell>

                  <TableCell>
                    {isEditing ? (
                      <TextField
                        value={editedEvent.description || ""}
                        onChange={(e) =>
                          handleChange("description", e.target.value)
                        }
                        variant="standard"
                        fullWidth
                        multiline
                        placeholder="Descrição"
                        InputProps={{
                          sx: {
                            "&:before": { borderBottomColor: primaryColor },
                            "&:after": { borderBottomColor: primaryColor },
                          },
                        }}
                      />
                    ) : (
                      <Typography>{event.description}</Typography>
                    )}
                  </TableCell>

                  <TableCell align="right">
                    {isEditing ? (
                      <>
                        <IconButton onClick={handleSave}>
                          <SaveIcon sx={{ color: primaryColor }} />
                        </IconButton>
                        <IconButton onClick={handleCancel}>
                          <CancelIcon sx={{ color: primaryColor }} />
                        </IconButton>
                      </>
                    ) : (
                      <>
                        <IconButton onClick={() => handleEdit(event)}>
                          <EditIcon sx={{ color: primaryColor }} />
                        </IconButton>
                        <IconButton onClick={() => handleDelete(event.id!)}>
                          <DeleteIcon sx={{ color: primaryColor }} />
                        </IconButton>
                      </>
                    )}
                  </TableCell>
                </StyledTableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CardAdminEventTable;
