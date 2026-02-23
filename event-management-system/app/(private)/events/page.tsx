'use client';

import { useEffect, useMemo, useState } from 'react';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  loadEvents,
  setSearch,
  setCategory,
  setSortBy,
  addEvent,
  updateEventInState,
  removeEvent,
} from '@/store/eventsSlice';
import { EventCard } from '@/components/events/EventCard';
import { EventForm } from '@/components/events/EventForm';
import { Event } from '@/types/event';
import {
  createEvent,
  updateEvent,
  deleteEvent,
} from '@/services/eventsService';

import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material';

export default function EventsPage() {
  const dispatch = useAppDispatch();

  const { user } = useAppSelector((state) => state.auth);
  const { items, loading, search, category, sortBy } =
    useAppSelector((state) => state.events);

  const isAdmin = user?.role === 'admin';

  const [openCreate, setOpenCreate] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [selectedEvent, setSelectedEvent] =
    useState<Event | null>(null);

  useEffect(() => {
    dispatch(loadEvents());
  }, [dispatch]);

  const now = useMemo(() => new Date(), []);

  const filteredEvents = useMemo(() => {
    return items
      .filter((event) => {
        const searchMatch =
          event.name.toLowerCase().includes(search.toLowerCase()) ||
          event.description
            .toLowerCase()
            .includes(search.toLowerCase());

        const categoryMatch =
          category === 'all' || event.category === category;

        return searchMatch && categoryMatch;
      })
      .sort((a, b) => {
        if (sortBy === 'name') {
          return a.name.localeCompare(b.name);
        }

        return (
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
        );
      });
  }, [items, search, category, sortBy]);

  const upcomingEvents = filteredEvents.filter(
    (event) => new Date(event.date) >= now
  );

  const pastEvents = filteredEvents.filter(
    (event) => new Date(event.date) < now
  );

  async function handleCreate(data: Omit<Event, 'id'>) {
  try {
    const createdEvent = await createEvent(data);
    dispatch(addEvent(createdEvent));
    setOpenCreate(false);
  } catch (error) {
    console.error('Error creating event', error);
  }
}

async function handleUpdate(data: Omit<Event, 'id'>) {
  if (!selectedEvent) return;

  try {
    const updatedEvent = await updateEvent(
      selectedEvent.id,
      data
    );
    dispatch(updateEventInState(updatedEvent));
    setOpenEdit(false);
    setSelectedEvent(null);
  } catch (error) {
    console.error('Error updating event', error);
  }
}

  async function handleDelete(id: number) {
    try {
      await deleteEvent(id);
      dispatch(removeEvent(id));
    } catch (error) {
      console.error('Error deleting event', error);
    }
  }

  return (
    <Box component="main" p={3}>
      <Typography variant="h4" mb={3}>
        Events
      </Typography>

      {!loading && items.length === 0 && (
        <Typography color="text.secondary">
          No events available.
        </Typography>
      )}

      {isAdmin && (
        <Button
          variant="contained"
          sx={{ mb: 3 }}
          onClick={() => setOpenCreate(true)}
        >
          Create Event
        </Button>
      )}

      <TextField
        label="Search events"
        fullWidth
        value={search}
        onChange={(e) => dispatch(setSearch(e.target.value))}
        sx={{ mb: 2 }}
      />

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Category</InputLabel>
        <Select
          value={category}
          label="Category"
          onChange={(e) =>
            dispatch(setCategory(e.target.value))
          }
        >
          <MenuItem value="all">All</MenuItem>
          <MenuItem value="Conference">Conference</MenuItem>
          <MenuItem value="Workshop">Workshop</MenuItem>
          <MenuItem value="Webinar">Webinar</MenuItem>
          <MenuItem value="Networking">Networking</MenuItem>
          <MenuItem value="Other">Other</MenuItem>
        </Select>
      </FormControl>

      <FormControl fullWidth sx={{ mb: 4 }}>
        <InputLabel>Sort by</InputLabel>
        <Select
          value={sortBy}
          label="Sort by"
          onChange={(e) =>
            dispatch(setSortBy(e.target.value))
          }
        >
          <MenuItem value="date">Date</MenuItem>
          <MenuItem value="name">Name</MenuItem>
        </Select>
      </FormControl>

      {upcomingEvents.length > 0 && (
        <>
          <Typography variant="h5" mb={2}>
            Upcoming Events
          </Typography>
          <Grid container spacing={2}>
            {upcomingEvents.map((event) => (
              <Grid
                key={event.id}
                size={{ xs: 12, md: 6, lg: 4 }}
                display="flex"
              >
                <EventCard
                  event={event}
                  isAdmin={isAdmin}
                  onEdit={(event) => {
                    setSelectedEvent(event);
                    setOpenEdit(true);
                  }}
                  onDelete={handleDelete}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {pastEvents.length > 0 && (
        <>
          <Typography variant="h5" mt={4} mb={2}>
            Past Events
          </Typography>
          <Grid container spacing={2}>
            {pastEvents.map((event) => (
              <Grid key={event.id} size={{ xs: 12, md: 6, lg: 4 }}>
                <EventCard
                  event={event}
                  isAdmin={isAdmin}
                  onEdit={(event) => {
                    setSelectedEvent(event);
                    setOpenEdit(true);
                  }}
                  onDelete={handleDelete}
                />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {loading && <CircularProgress />}

      {openCreate && (
        <EventForm
          open
          onClose={() => setOpenCreate(false)}
          onSubmit={handleCreate}
        />
      )}

      {openEdit && selectedEvent && (
        <EventForm
          open
          initialData={selectedEvent}
          onClose={() => {
            setOpenEdit(false);
            setSelectedEvent(null);
          }}
          onSubmit={handleUpdate}
        />
      )}
    </Box>
  );
}