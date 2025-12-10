"use client";

import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import { Box, Card, CardContent, Chip, Typography } from "@mui/material";
import type { Event, EventCategory } from "@/types";

const CATEGORY_COLORS: Record<
  EventCategory,
  "primary" | "secondary" | "success" | "warning" | "info"
> = {
  Conference: "primary",
  Workshop: "success",
  Webinar: "info",
  Networking: "secondary",
  Other: "warning",
};

interface EventCardProps {
  event: Event;
}

export function EventCard({ event }: EventCardProps) {
  const eventDate = new Date(event.dateTime);
  const isUpcoming = eventDate > new Date();

  const formattedDate = eventDate.toLocaleDateString("en-US", {
    weekday: "short",
    year: "numeric",
    month: "short",
    day: "numeric",
  });

  const formattedTime = eventDate.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });

  return (
    <Card
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        transition: "box-shadow 0.2s ease-in-out",
        "&:hover": {
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            mb: 1.5,
          }}
        >
          <Chip
            label={event.category}
            color={CATEGORY_COLORS[event.category]}
            size="small"
          />
          <Chip
            label={isUpcoming ? "Upcoming" : "Past"}
            variant="outlined"
            color={isUpcoming ? "success" : "default"}
            size="small"
          />
        </Box>

        <Typography variant="h6" component="h3" gutterBottom>
          {event.name}
        </Typography>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
          <CalendarTodayIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {formattedDate}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 1 }}>
          <AccessTimeIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {formattedTime}
          </Typography>
        </Box>

        <Box sx={{ display: "flex", alignItems: "center", gap: 0.5, mb: 2 }}>
          <LocationOnIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {event.location}
          </Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 3,
            WebkitBoxOrient: "vertical",
          }}
        >
          {event.description}
        </Typography>
      </CardContent>
    </Card>
  );
}
