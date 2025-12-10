"use client";

import EventIcon from "@mui/icons-material/Event";
import {
  Alert,
  Box,
  CircularProgress,
  Grid,
  Paper,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  EventCard,
  EventFilters,
  EventTabPanel,
  EventTabs,
  useEvents,
} from "@/features/events";
import type { EventTabValue } from "@/features/events";

export default function EventsPage() {
  const [activeTab, setActiveTab] = useState<EventTabValue>("upcoming");

  const {
    upcomingEvents,
    pastEvents,
    isLoading,
    error,
    filters,
    setSearch,
    setCategory,
    setSortField,
    toggleSortOrder,
    resetFilters,
    clearError,
  } = useEvents();

  const currentEvents = activeTab === "upcoming" ? upcomingEvents : pastEvents;

  return (
    <>
      {/* Page Title */}
      <Typography variant="h4" component="h1" sx={{ mb: 3 }}>
        Events
      </Typography>

      {/* Error Alert */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }} onClose={clearError}>
          {error}
        </Alert>
      )}

      {/* Filters */}
      <Paper sx={{ p: 2, mb: 3 }}>
        <EventFilters
          filters={filters}
          onSearchChange={setSearch}
          onCategoryChange={setCategory}
          onSortFieldChange={setSortField}
          onSortOrderToggle={toggleSortOrder}
          onReset={resetFilters}
        />
      </Paper>

      {/* Tabs */}
      <Paper sx={{ mb: 3 }}>
        <EventTabs
          value={activeTab}
          onChange={setActiveTab}
          upcomingCount={upcomingEvents.length}
          pastCount={pastEvents.length}
        />

        {/* Loading State */}
        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", py: 8 }}>
            <CircularProgress />
          </Box>
        ) : (
          <>
            {/* Upcoming Events Panel */}
            <EventTabPanel value="upcoming" currentValue={activeTab}>
              {upcomingEvents.length === 0 ? (
                <EmptyState
                  message={
                    filters.search || filters.category
                      ? "No upcoming events match your filters."
                      : "No upcoming events scheduled."
                  }
                />
              ) : (
                <EventGrid events={upcomingEvents} />
              )}
            </EventTabPanel>

            {/* Past Events Panel */}
            <EventTabPanel value="past" currentValue={activeTab}>
              {pastEvents.length === 0 ? (
                <EmptyState
                  message={
                    filters.search || filters.category
                      ? "No past events match your filters."
                      : "No past events found."
                  }
                />
              ) : (
                <EventGrid events={pastEvents} />
              )}
            </EventTabPanel>
          </>
        )}
      </Paper>

      {/* Results Summary */}
      {!isLoading && currentEvents.length > 0 && (
        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ textAlign: "center" }}
        >
          Showing {currentEvents.length}{" "}
          {activeTab === "upcoming" ? "upcoming" : "past"} event
          {currentEvents.length !== 1 ? "s" : ""}
          {(filters.search || filters.category) && " (filtered)"}
        </Typography>
      )}
    </>
  );
}

// Event Grid Component
function EventGrid({
  events,
}: {
  events: ReturnType<typeof useEvents>["upcomingEvents"];
}) {
  return (
    <Grid container spacing={3} sx={{ px: 2 }}>
      {events.map((event) => (
        <Grid size={{ xs: 12, sm: 6, md: 4 }} key={event.id}>
          <EventCard event={event} />
        </Grid>
      ))}
    </Grid>
  );
}

// Empty State Component
function EmptyState({ message }: { message: string }) {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        py: 8,
        px: 2,
      }}
    >
      <EventIcon sx={{ fontSize: 64, color: "text.disabled", mb: 2 }} />
      <Typography variant="h6" color="text.secondary">
        {message}
      </Typography>
    </Box>
  );
}
