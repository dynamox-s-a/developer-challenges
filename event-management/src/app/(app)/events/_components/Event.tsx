import { Button, Card, CardContent, Typography } from '@mui/material';
import type { Event } from '@/types/event';
import { formatDate, formatTime } from '@/utils/dateTime';
import React from 'react';
import { useRouter } from 'next/navigation';

interface EventProps {
  event: Event;
  isAdmin: boolean;
  deleteEvent: (id: string) => void;
}

const EventCard = React.memo(({ event, isAdmin, deleteEvent }: EventProps) => {
  const router = useRouter();
  return (
    <Card sx={{ margin: 3 }}>
      <CardContent>
        <header>
          <Typography variant="h5" data-testid="event-name">
            {event.name}
          </Typography>
        </header>
        <main>
          <Typography data-testid="event-date">Date: {formatDate(event.dateTime)}</Typography>
          <Typography data-testid="event-time">Time: {formatTime(event.dateTime)}</Typography>
          <Typography data-testid="event-location">Location: {event.location}</Typography>
          <Typography data-testid="event-description">Description: {event.description}</Typography>
          <Typography data-testid="event-category">Category: {event.category}</Typography>
        </main>
        {isAdmin && (
          <footer style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => router.push(`/admin/${event.id}/edit`)}
              data-testid={`edit-button-${event.id}`}
            >
              Edit
            </Button>
            <Button
              variant="contained"
              color="secondary"
              onClick={() => deleteEvent(event.id)}
              data-testid={`delete-button-${event.id}`}
            >
              Delete
            </Button>
          </footer>
        )}
      </CardContent>
    </Card>
  );
});

EventCard.displayName = 'EventCard';

export default EventCard;
