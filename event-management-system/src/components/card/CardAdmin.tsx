import {
  Box,
  Typography,
  Card,
  CardContent,
  CardActions,
  TextField,
  Alert,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
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
import IconButton from "../button/IconButton";

const primaryColor = "#692746";

const Container = styled(Box)(() => ({
  maxWidth: 1080,
  margin: "0 auto",
  display: "flex",
  flexDirection: "column",
  gap: "16px",
}));

interface Props {
  events: Event[];
  onRefresh: () => void;
  onDiscardNew: () => void;
}

const CardAdmin = ({ events, onRefresh, onDiscardNew }: Props) => {
  const [alertMessage, setAlertMessage] = useState<string | null>(null);
  const [alertSeverity, setAlertSeverity] = useState<
    "success" | "error" | null
  >(null);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedEvent, setEditedEvent] = useState<Partial<Event>>({});

  const isCreating = editingId === 0;

  // Extrair categorias únicas
  const categories = Array.from(
    new Set(events.map((e) => e.category).filter(Boolean))
  );

  const handleEdit = (event: Event) => {
    setEditingId(event.id!);
    setEditedEvent({ ...event });
  };

  const handleCancel = () => {
    if (isCreating) onDiscardNew();
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
      !editedEvent.category ||
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
            left: "50%",
            transform: "translateX(-50%)",
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

      <Container>
        {events.map((event) => {
          const isEditing =
            editingId === event.id || (!event.id && editingId === 0);

          return (
            <Card key={event.id ?? "new"} variant="outlined">
              <CardContent>
                {isEditing ? (
                  <FormControl fullWidth variant="standard" sx={{ mb: 1 }}>
                    <InputLabel sx={{ color: primaryColor }}>
                      Categoria
                    </InputLabel>
                    <Select
                      value={editedEvent.category || ""}
                      onChange={(e) => handleChange("category", e.target.value)}
                      label="Categoria"
                      sx={{
                        "&:before": { borderBottomColor: primaryColor },
                        "&:after": { borderBottomColor: primaryColor },
                      }}
                    >
                      {categories.map((category) => (
                        <MenuItem key={category} value={category}>
                          {category}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <Typography sx={{ color: "text.secondary", fontSize: 14 }}>
                    {event.category}
                  </Typography>
                )}

                {isEditing ? (
                  <TextField
                    value={editedEvent.name || ""}
                    onChange={(e) => handleChange("name", e.target.value)}
                    label="Nome"
                    fullWidth
                    variant="standard"
                    sx={{ mb: 1 }}
                    InputProps={{
                      sx: {
                        "&:before": { borderBottomColor: primaryColor },
                        "&:after": { borderBottomColor: primaryColor },
                      },
                    }}
                  />
                ) : (
                  <Typography variant="h5" component="div">
                    {event.name}
                  </Typography>
                )}

                {isEditing ? (
                  <>
                    <TextField
                      value={editedEvent.location || ""}
                      onChange={(e) => handleChange("location", e.target.value)}
                      label="Local"
                      fullWidth
                      variant="standard"
                      sx={{ mb: 1 }}
                      InputProps={{
                        sx: {
                          "&:before": { borderBottomColor: primaryColor },
                          "&:after": { borderBottomColor: primaryColor },
                        },
                      }}
                    />
                    <TextField
                      type="datetime-local"
                      value={editedEvent.datetime?.slice(0, 16) || ""}
                      onChange={(e) => handleChange("datetime", e.target.value)}
                      label="Data e Hora"
                      fullWidth
                      variant="standard"
                      sx={{ mb: 1 }}
                      InputProps={{
                        sx: {
                          "&:before": { borderBottomColor: primaryColor },
                          "&:after": { borderBottomColor: primaryColor },
                        },
                      }}
                    />
                  </>
                ) : (
                  <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
                    {event.location} -{" "}
                    {new Date(event.datetime).toLocaleString("pt-BR", {
                      dateStyle: "short",
                      timeStyle: "short",
                    })}
                  </Typography>
                )}

                {isEditing ? (
                  <TextField
                    value={editedEvent.description || ""}
                    onChange={(e) =>
                      handleChange("description", e.target.value)
                    }
                    label="Descrição"
                    fullWidth
                    multiline
                    minRows={3}
                    variant="standard"
                    InputProps={{
                      sx: {
                        "&:before": { borderBottomColor: primaryColor },
                        "&:after": { borderBottomColor: primaryColor },
                      },
                    }}
                  />
                ) : (
                  <Typography variant="body2">{event.description}</Typography>
                )}
              </CardContent>
              <CardActions sx={{ justifyContent: "flex-start" }}>
                {isEditing ? (
                  <div>
                    <IconButton onClick={handleSave}>
                      <SaveIcon sx={{ color: primaryColor }} />
                    </IconButton>
                    <IconButton onClick={handleCancel}>
                      <CancelIcon sx={{ color: primaryColor }} />
                    </IconButton>
                  </div>
                ) : (
                  <div>
                    <IconButton onClick={() => handleEdit(event)}>
                      <EditIcon sx={{ color: primaryColor }} />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(event.id!)}>
                      <DeleteIcon sx={{ color: primaryColor }} />
                    </IconButton>
                  </div>
                )}
              </CardActions>
            </Card>
          );
        })}
      </Container>
    </>
  );
};

export default CardAdmin;
