'use client';

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  IconButton,
} from '@mui/material';
import { Event } from '@/types';
import { format } from 'date-fns';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EventIcon from '@mui/icons-material/Event';

interface EventCardProps {
  event: Event;
  isAdmin?: boolean;
  onEdit?: (event: Event) => void;
  onDelete?: (id: number) => void;
}

export default function EventCard({ event, isAdmin = false, onEdit, onDelete }: EventCardProps) {
  const eventDate = new Date(event.dateTime);
  const isPast = eventDate < new Date();

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
        opacity: isPast ? 0.8 : 1,
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={1}>
          <Typography variant="h6" component="h2" gutterBottom>
            {event.name}
          </Typography>
          <Chip
            label={event.category}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>

        {isPast && (
          <Chip
            label="Past Event"
            size="small"
            color="error"
            sx={{ mb: 1 }}
          />
        )}

        <Box display="flex" alignItems="center" gap={1} mb={1}>
          <EventIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {format(eventDate, 'PPP p')}
          </Typography>
        </Box>

        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <LocationOnIcon fontSize="small" color="action" />
          <Typography variant="body2" color="text.secondary">
            {event.location}
          </Typography>
        </Box>

        <Typography variant="body2" color="text.secondary">
          {event.description.length > 150
            ? `${event.description.substring(0, 150)}...`
            : event.description}
        </Typography>
      </CardContent>

      {isAdmin && (
        <CardActions>
          <Box display="flex" gap={1} width="100%" justifyContent="flex-end">
            <IconButton
              size="small"
              color="primary"
              onClick={() => onEdit?.(event)}
              aria-label="edit event"
            >
              <EditIcon />
            </IconButton>
            <IconButton
              size="small"
              color="error"
              onClick={() => onDelete?.(event.id)}
              aria-label="delete event"
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </CardActions>
      )}
    </Card>
  );
}
