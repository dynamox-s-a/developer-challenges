import { useState, useEffect } from "react";
import { Event, getEvents } from "../../app/services/events";
import { Box, Typography, Button, Alert } from "@mui/material";
import CardAdmin from "./CardAdmin";
import SortBar from "../sortBar/SortBar";

interface CardAdminListProps {
  events: Event[];
  searchTerm: string;
}

const CardAdminList = ({
  events: initialEvents,
  searchTerm,
}: CardAdminListProps) => {
  const [events, setEvents] = useState<Event[]>([]);
  const [sortedEvents, setSortedEvents] = useState<Event[]>([]);
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

  useEffect(() => {
    const filtered = events.filter((event) =>
      event.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setSortedEvents(filtered);
  }, [events, searchTerm]);

  const sortByName = () => {
    const sorted = [...sortedEvents].sort((a, b) =>
      a.name.localeCompare(b.name)
    );
    setSortedEvents(sorted);
  };

  const sortByDate = () => {
    const sorted = [...sortedEvents].sort(
      (a, b) => new Date(a.datetime).getTime() - new Date(b.datetime).getTime()
    );
    setSortedEvents(sorted);
  };

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

      {sortedEvents.length > 0 && (
        <SortBar sortByName={sortByName} sortByDate={sortByDate} />
      )}

      <Box
        sx={{ borderRadius: 2, overflowX: "auto", padding: 2, color: "white" }}
      >
        {sortedEvents.length > 0 ? (
          <CardAdmin
            events={sortedEvents}
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
