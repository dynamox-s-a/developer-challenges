import { useState, useEffect } from "react";
import { Box, Typography, TextField, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import CancelIcon from "@mui/icons-material/Cancel";
import { Event, updateEvent } from "../../app/services/events";

interface CardAdminEventProps {
  event: Event;
  onEventUpdated: () => void;
}

const CardAdminEvent = ({ event, onEventUpdated }: CardAdminEventProps) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedEvent, setEditedEvent] = useState<{
    name: string;
    datetime: string;
    location: string;
    description: string;
    category: string;
  } | null>(null);

  useEffect(() => {
    if (event) {
      const eventDate = new Date(event.datetime);
      if (eventDate.getTime()) {
        setEditedEvent({
          name: event.name || "",
          datetime: eventDate.toISOString().slice(0, 16),
          location: event.location || "",
          description: event.description || "",
          category: event.category || "",
        });
      }
    }
  }, [event]);

  const handleChange = (field: keyof Event, value: string) => {
    setEditedEvent((prev) => ({ ...prev, [field]: value }));
  };

  const handleSave = async () => {
    if (
      !editedEvent?.name ||
      !editedEvent?.location ||
      !editedEvent?.description
    ) {
      alert("Preencha todos os campos corretamente!");
      return;
    }

    await updateEvent(event.id!, editedEvent);

    onEventUpdated();

    setIsEditing(false);
  };

  const handleCancel = () => {
    setEditedEvent({
      name: event.name || "",
      datetime: new Date(event.datetime).toISOString().slice(0, 16),
      location: event.location || "",
      description: event.description || "",
      category: event.category || "",
    });
    setIsEditing(false);
  };

  if (!editedEvent) return null;

  return (
    <Box>
      {isEditing ? (
        <TextField
          label="Título"
          value={editedEvent.name}
          onChange={(e) => handleChange("name", e.target.value)}
        />
      ) : (
        <Typography
          sx={{
            color: "white",
            fontSize: "1rem",
            textTransform: "uppercase",
            fontWeight: 800,
          }}
        >
          {event.name}
        </Typography>
      )}
      {isEditing ? (
        <TextField
          label="Data"
          type="datetime-local"
          value={editedEvent.datetime}
          onChange={(e) => handleChange("datetime", e.target.value)}
        />
      ) : (
        <Typography>{new Date(event.datetime).toLocaleString()}</Typography>
      )}
      {isEditing ? (
        <TextField
          label="Local"
          value={editedEvent.location}
          onChange={(e) => handleChange("location", e.target.value)}
        />
      ) : (
        <Typography>{event.location}</Typography>
      )}
      {isEditing ? (
        <TextField
          label="Descrição"
          value={editedEvent.description}
          onChange={(e) => handleChange("description", e.target.value)}
        />
      ) : (
        <Typography>{event.description}</Typography>
      )}

      <Box>
        {isEditing ? (
          <>
            <IconButton onClick={handleSave}>
              <SaveIcon
                sx={{
                  color: "white",
                }}
              />
            </IconButton>
          </>
        ) : (
          <div style={{ display: "flex", width: "100px" }}>
            <IconButton onClick={() => setIsEditing(true)}>
              <EditIcon
                sx={{
                  color: "white",
                }}
              />
            </IconButton>
            <IconButton onClick={handleCancel}>
              <CancelIcon
                sx={{
                  color: "white",
                }}
              />
            </IconButton>
          </div>
        )}
      </Box>
    </Box>
  );
};

export default CardAdminEvent;
