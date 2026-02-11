"use client";

import { useState, useMemo } from "react";
import {
  Box,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  Select,
  Typography,
  Paper,
  Stack,
} from "@mui/material";
import { Event, EventCategory } from "@/types";
import EventCard from "./EventCard";

interface EventsListProps {
  events: Event[];
  isAdmin?: boolean;
  showPastSeparately?: boolean;
  onEdit?: (event: Event) => void;
  onDelete?: (id: number) => void;
}

type SortOption = "date-asc" | "date-desc" | "name-asc" | "name-desc";

const categories: EventCategory[] = [
  "Conference",
  "Workshop",
  "Webinar",
  "Networking",
  "Other",
];

export default function EventsList({
  events,
  isAdmin = false,
  showPastSeparately = false,
  onEdit,
  onDelete,
}: EventsListProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterCategory, setFilterCategory] = useState<EventCategory | "all">(
    "all",
  );
  const [sortBy, setSortBy] = useState<SortOption>("date-asc");

  const { upcomingEvents, pastEvents } = useMemo(() => {
    const now = new Date();
    const upcoming: Event[] = [];
    const past: Event[] = [];

    events.forEach((event) => {
      if (new Date(event.dateTime) > now) {
        upcoming.push(event);
      } else {
        past.push(event);
      }
    });

    return { upcomingEvents: upcoming, pastEvents: past };
  }, [events]);

  const filterAndSort = (eventsList: Event[]) => {
    let filtered = eventsList;

    if (searchTerm) {
      filtered = filtered.filter(
        (event) =>
          event.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          event.location.toLowerCase().includes(searchTerm.toLowerCase()),
      );
    }

    if (filterCategory !== "all") {
      filtered = filtered.filter((event) => event.category === filterCategory);
    }

    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "date-asc":
          return (
            new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()
          );
        case "date-desc":
          return (
            new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()
          );
        case "name-asc":
          return a.name.localeCompare(b.name);
        case "name-desc":
          return b.name.localeCompare(a.name);
        default:
          return 0;
      }
    });

    return sorted;
  };

  const filteredUpcomingEvents = filterAndSort(upcomingEvents);
  const filteredPastEvents = filterAndSort(pastEvents);

  const renderEventGrid = (eventsList: Event[], title?: string) => (
    <>
      {title && (
        <Typography variant="h5" gutterBottom sx={{ mt: title ? 4 : 0, mb: 2 }}>
          {title}
        </Typography>
      )}
      {eventsList.length === 0 ? (
        <Paper sx={{ p: 4, textAlign: "center" }}>
          <Typography variant="body1" color="text.secondary">
            No events found
          </Typography>
        </Paper>
      ) : (
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "1fr",
              sm: "repeat(2, 1fr)",
              md: "repeat(3, 1fr)",
            },
            gap: 3,
          }}
        >
          {eventsList.map((event) => (
            <EventCard
              key={event.id}
              event={event}
              isAdmin={isAdmin}
              onEdit={onEdit}
              onDelete={onDelete}
            />
          ))}
        </Box>
      )}
    </>
  );

  return (
    <Box>
      {/* Filters */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Stack spacing={2} direction={{ xs: "column", md: "row" }}>
          <TextField
            fullWidth
            label="Search events"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, description, or location"
          />
          <FormControl fullWidth>
            <InputLabel>Category</InputLabel>
            <Select
              value={filterCategory}
              onChange={(e) =>
                setFilterCategory(e.target.value as EventCategory | "all")
              }
              label="Category"
            >
              <MenuItem value="all">All Categories</MenuItem>
              {categories.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel>Sort By</InputLabel>
            <Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              label="Sort By"
            >
              <MenuItem value="date-asc">Date (Earliest First)</MenuItem>
              <MenuItem value="date-desc">Date (Latest First)</MenuItem>
              <MenuItem value="name-asc">Name (A-Z)</MenuItem>
              <MenuItem value="name-desc">Name (Z-A)</MenuItem>
            </Select>
          </FormControl>
        </Stack>
      </Paper>

      {/* Events Display */}
      {showPastSeparately ? (
        <>
          {renderEventGrid(filteredUpcomingEvents, "Upcoming Events")}
          {filteredPastEvents.length > 0 &&
            renderEventGrid(filteredPastEvents, "Past Events")}
        </>
      ) : (
        renderEventGrid([...filteredUpcomingEvents, ...filteredPastEvents])
      )}
    </Box>
  );
}
