import { useState, useEffect } from "react";
import { Event, getEvents } from "../../app/services/events";
import CardAdminEvent from "./CardAdminEvent";
import { Box, Typography } from "@mui/material";

const CardAdminEventList = () => {
  const [events, setEvents] = useState<Event[]>([]);

  const fetchEvents = async () => {
    try {
      const data = await getEvents();
      setEvents(data);
    } catch (error) {
      console.error("Erro ao buscar os eventos:", error);
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  return (
    <Box sx={{ maxWidth: 1200, mx: "auto", mt: 4, px: 2 }}>
      <Typography
        variant="h5"
        sx={{ color: "white", textAlign: "center", mb: 3 }}
      >
        EVENTOS CADASTRADOS
      </Typography>
      <Box
        sx={{ borderRadius: 2, overflowX: "auto", padding: 2, color: "white" }}
      >
        {events.length > 0 ? (
          events.map((event) => (
            <CardAdminEvent
              key={event.id}
              event={event}
              onEventUpdated={fetchEvents}
            />
          ))
        ) : (
          <Typography color="white">Nenhum evento encontrado.</Typography>
        )}
      </Box>
    </Box>
  );
};

export default CardAdminEventList;
