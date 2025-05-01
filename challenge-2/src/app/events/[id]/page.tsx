'use client';

import type { Event } from '@/services/events/types';
import { format } from 'date-fns';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CategoryIcon from '@mui/icons-material/Category';
import CircularProgress from '@mui/material/CircularProgress';
import { useSelector } from 'react-redux';
import type { RootState } from '@/store';
import { useEvents } from '@/services/events';
import { alpha } from '@mui/material';

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
      <Paper
        elevation={0}
        sx={{
          position: 'relative',
          overflow: 'hidden',
          background: 'linear-gradient(135deg, var(--color-primary) 0%, var(--color-primary) 100%)',
          color: 'white',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at top right, rgba(255,255,255,0.1) 0%, transparent 60%)',
            pointerEvents: 'none'
          }
        }}
      >
        <Box
          sx={{
            p: { xs: 3, md: 6 },
            position: 'relative',
            zIndex: 1,
          }}
        >
          <Typography 
            variant="h3" 
            component="h1" 
            sx={{ 
              fontWeight: 700,
              mb: 4,
              fontSize: { xs: '2rem', md: '3rem' },
              lineHeight: 1.2
            }}
          >
            {event.title}
          </Typography>

          <Box sx={{ 
            display: 'flex',
            flexDirection: { xs: 'column', sm: 'row' },
            gap: 3,
            mb: 6,
            '& .info-item': {
              display: 'flex',
              alignItems: 'center',
              gap: 1,
              color: alpha('#fff', 0.9)
            }
          }}>
            <Box className="info-item">
              <CalendarTodayIcon />
              <Typography variant="h6" sx={{ fontWeight: 500 }}>
                {format(new Date(event.date), "dd/MM/yyyy 'às' HH:mm'h'")}
              </Typography>
            </Box>
            {event.location && (
              <Box className="info-item">
                <LocationOnIcon />
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {event.location}
                </Typography>
              </Box>
            )}
            {event.category && (
              <Box className="info-item">
                <CategoryIcon />
                <Typography variant="h6" sx={{ fontWeight: 500 }}>
                  {event.category}
                </Typography>
              </Box>
            )}
          </Box>

          <Typography 
            sx={{ 
              fontSize: '1.1rem',
              lineHeight: 1.8,
              color: alpha('#fff', 0.9),
              whiteSpace: 'pre-wrap',
              maxWidth: '800px'
            }}
          >
            {event.description}
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
}
