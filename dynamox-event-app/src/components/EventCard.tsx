'use client';

import { Event, EventCategory } from '@/types/event';
import { ChipProps } from '@mui/material/Chip';

import {
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Stack,
  Button,
} from '@mui/material';

import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';

import { format, isPast } from 'date-fns';

interface EventCardProps {
  event: Event;
  showActions?: boolean;
  onEdit?: (event: Event) => void;
  onDelete?: (id: string) => void;
}

const categoryColors: Record<EventCategory, ChipProps['color']> = {
  Conference: 'primary',
  Workshop: 'secondary',
  Webinar: 'success',
  Networking: 'warning',
  Other: 'default'
};

export function EventCard({
  event,
  showActions,
  onEdit,
  onDelete
}: EventCardProps) {

  const eventDate = new Date(event.dateTime);
  const past = isPast(eventDate);

  const categoryStyle = categoryColors[event.category] || categoryColors.Other;

  return (
    <Card
      sx={{
        opacity: past ? 0.7 : 1,
        transition: '0.2s',
        '&:hover': {
          transform: 'translateY(-2px)',
          boxShadow: 4
        }
      }}
    >
      <CardHeader
        title={
          <Stack spacing={1}>
            <Typography
              variant="h6"
              sx={{
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                overflow: 'hidden'
              }}
            >
              {event.name}
            </Typography>

            <Stack direction="row" spacing={1} alignItems="center">
              <Chip
                label={event.category}
                color={categoryStyle}
                size="small"
              />

              {past && (
                <Chip
                  label="Past"
                  size="small"
                  variant="filled"
                />
              )}
            </Stack>
          </Stack>
        }
      />

      <CardContent>

        <Stack spacing={2}>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <CalendarMonthIcon fontSize="small" />
            <Typography variant="body2" color="text.secondary">
              {format(eventDate, 'MMM d, yyyy · h:mm a')}
            </Typography>
          </Stack>

          <Stack
            direction="row"
            spacing={1}
            alignItems="center"
          >
            <LocationOnIcon fontSize="small" />
            <Typography
              variant="body2"
              color="text.secondary"
              noWrap
            >
              {event.location}
            </Typography>
          </Stack>

          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 3,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden'
            }}
          >
            {event.description}
          </Typography>

          {showActions && (
            <Stack
              direction="row"
              spacing={1}
              pt={1}
            >
              <Button
                variant="outlined"
                size="small"
                startIcon={<EditIcon />}
                onClick={() => onEdit?.(event)}
              >
                Editar
              </Button>

              <Button
                variant="contained"
                color="error"
                size="small"
                startIcon={<DeleteIcon />}
                onClick={() => onDelete?.(event.id)}
              >
                Excluir
              </Button>
            </Stack>
          )}

        </Stack>

      </CardContent>
    </Card>
  );
}