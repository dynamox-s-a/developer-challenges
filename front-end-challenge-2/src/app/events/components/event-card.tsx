"use client";

import { Card, CardContent, Typography, Chip, Box } from "@mui/material";
import { Event as EventIcon, LocationOn, Category } from "@mui/icons-material";
import { Event } from "@/types";

interface EventCardProps {
  event: Event;
  isPast: boolean;
}

export default function EventCard({ event, isPast }: EventCardProps) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("pt-BR", {
      day: "2-digit",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <Card
      sx={{
        height: "100%",
        opacity: isPast ? 0.7 : 1,
        borderLeft: isPast ? "4px solid #bbb" : "4px solid #1976d2",
      }}
    >
      <CardContent>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "start",
            mb: 2,
          }}
        >
          <Typography variant="h6" component="h2" gutterBottom>
            {event.name}
          </Typography>
          {isPast && <Chip label="Encerrado" size="small" color="default" />}
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
          <EventIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {formatDate(event.date)}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 1, gap: 1 }}>
          <LocationOn fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {event.location}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", mb: 2, gap: 1 }}>
          <Category fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {event.category}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          {event.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
