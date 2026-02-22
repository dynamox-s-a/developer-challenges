'use client';

import { useEffect } from 'react';

import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadEvents } from '@/store/eventsSlice';
import { EventCard } from '@/components/EventCard';

import Grid from '@mui/material/Grid';
import {
  TextField,
  Typography,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Box,
} from '@mui/material';

import {
  setSearch,
  setCategory,
  setSortBy,
} from '@/store/eventsSlice';

export default function EventsPage() {
  const dispatch = useAppDispatch();
  const { items, loading, search, category, sortBy } = useAppSelector((state) => state.events);

  useEffect(() => {
    dispatch(loadEvents());
  }, [dispatch]);

  const now = new Date();

  const filteredEvents = items
  .filter((event) => {
    const searchMatch =
      event.name.toLowerCase().includes(search.toLowerCase()) ||
      event.description.toLowerCase().includes(search.toLowerCase());

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
  
  const upcomingEvents = filteredEvents.filter(
    (event) => new Date(event.date) >= now
  );

  const pastEvents = filteredEvents.filter(
    (event) => new Date(event.date) < now
  );

  return (
    <Box>
      <Typography variant="h4" mb={3}>
        Events
      </Typography>
      {!loading && items.length === 0 && (
        <Typography color="text.secondary">
          No events available.
        </Typography>
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
          onChange={(e) => dispatch(setCategory(e.target.value))}
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
          onChange={(e) => dispatch(setSortBy(e.target.value))}
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
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={event.id}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {pastEvents.length > 0 && (
        <>
          <Typography variant="h5" mb={2}>
            Past Events
          </Typography>
          <Grid container spacing={2}>
            {pastEvents.map((event) => (
              <Grid size={{ xs: 12, md: 6, lg: 4 }} key={event.id}>
                <EventCard event={event} />
              </Grid>
            ))}
          </Grid>
        </>
      )}

      {loading && <Typography>Loading...</Typography>}
    </Box>
  );
}