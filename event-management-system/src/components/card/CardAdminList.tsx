import { useState, useEffect } from "react";
import { Event, getEvents } from "../../app/services/events";
import { Box, Typography, Button, Alert } from "@mui/material";
import CardAdmin from "./CardAdmin";

interface CardAdminListProps {
  events: Event[];
  searchTerm: string;
}

const CardAdminList = ({
  events: initialEvents,
  searchTerm,
}: CardAdminListProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [creating, setCreating] = useState(false);
  const [creationSuccess, setCreationSuccess] = useState(false);

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
      setCreating(false);
    } catch (error) {
      console.error("Erro ao buscar os eventos:", error);
    }
  };

  useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  const handleCreateNew = () => {
    if (creating) return;

    const newEvent: Event = {
      name: "",
      datetime: new Date().toISOString().slice(0, 16),
      location: "",
      description: "",
      category: "",
    };

    setCreating(true);
    setEvents((prev) => [{ ...newEvent }, ...prev]);
  };

  const handleDiscardNew = () => {
    setEvents((prev) => prev.filter((event) => event.id));
    setCreating(false);
  };

  const filteredEvents = events.filter((event) =>
    event.name.toLowerCase().includes(searchTerm.toLowerCase())
  );
  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4, px: 2 }}>
      <Typography
        variant="h5"
        sx={{ color: "white", textAlign: "center", mb: 3 }}
      >
        EVENTOS CADASTRADOS
      </Typography>
      {creationSuccess && (
        <Alert severity="success" sx={{ marginBottom: 2 }}>
          Evento criado com sucesso!
        </Alert>
      )}
      <Box sx={{ textAlign: "center", mb: 2 }}>
        <Button
          onClick={handleCreateNew}
          variant="outlined"
          disabled={creating}
          sx={{
            borderColor: "white",
            color: "white",
            textTransform: "none",
            maxWidth: "50%",
            "&:hover": { backgroundColor: "white", color: "#692746" },
          }}
        >
          Criar novo evento
        </Button>
      </Box>

      <Box
        sx={{ borderRadius: 2, overflowX: "auto", padding: 2, color: "white" }}
      >
        {filteredEvents.length > 0 ? (
          <CardAdmin
            events={filteredEvents}
            onRefresh={fetchEvents}
            onDiscardNew={handleDiscardNew}
          />
        ) : (
          <Typography color="white">Nenhum evento encontrado.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default CardAdminList;
