'use client';

import type { Event } from '@/services/events/types';
import { format } from 'date-fns';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import CircularProgress from '@mui/material/CircularProgress';
import Image from 'next/image';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useEvents } from '@/services/events';

interface EventDetailsProps {
  params: {
    id: string;
  };
}

export default function EventDetails({ params }: EventDetailsProps) {
  const id = params.id;
  const { loading, error: fetchError } = useEvents();
  const event = useSelector((state: RootState) => 
    state.events.filteredItems.find((event: Event) => String(event.id) === id)
  );
  const error = fetchError || (!loading && !event ? 'Evento não encontrado' : null);



  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '80vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error || !event) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h5" color="error" align="center">
          {error}
        </Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={2} sx={{ overflow: 'hidden' }}>
        <Box sx={{ position: 'relative', width: '100%', height: '400px' }}>
          <Image
            src={event.imageUrl || '/fallback.jpg'}
            alt={event.title}
            fill
            style={{ objectFit: 'cover' }}
          />
        </Box>
        <Box sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom fontWeight="bold">
            {event.title}
          </Typography>
          <Box sx={{ 
            display: 'flex', 
            alignItems: 'center',
            gap: 1,
            color: 'text.secondary',
            mb: 3
          }}>
            <CalendarTodayIcon fontSize="small" />
            <Typography variant="body1">
              {format(new Date(event.date), "dd/MM/yyyy 'às' HH:mm'h'")}
            </Typography>
          </Box>
          <Typography variant="body1" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
            {event.description}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
