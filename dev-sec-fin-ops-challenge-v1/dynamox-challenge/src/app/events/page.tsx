'use client';

import { useEffect } from 'react';
import { Box, Container, Typography, Alert } from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchEvents } from '@/store/slices/eventsSlice';
import ProtectedRoute from '@/components/ProtectedRoute';
import Navbar from '@/components/Navbar';
import EventsList from '@/components/EventsList';

function EventsView() {
  const dispatch = useAppDispatch();
  const { events, loading, error } = useAppSelector((state) => state.events);

  useEffect(() => {
    dispatch(fetchEvents());
  }, [dispatch]);

  return (
    <>
      <Navbar />
      <Container maxWidth="xl" sx={{ mt: 4, mb: 4 }}>
        <Box mb={3}>
          <Typography variant="h4" component="h1" gutterBottom>
            Events
          </Typography>
          <Typography variant="body1" color="text.secondary">
            Browse and discover upcoming and past events
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {error}
          </Alert>
        )}

        {loading && events.length === 0 ? (
          <Typography>Loading events...</Typography>
        ) : (
          <EventsList events={events} showPastSeparately />
        )}
      </Container>
    </>
  );
}

export default function EventsPage() {
  return (
    <ProtectedRoute requiredRole="reader">
      <EventsView />
    </ProtectedRoute>
  );
}
