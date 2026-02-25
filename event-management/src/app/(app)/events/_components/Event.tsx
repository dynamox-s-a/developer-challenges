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
          <Typography variant="h5">{event.name}</Typography>
        </header>
        <main>
          <Typography>Date: {formatDate(event.dateTime)}</Typography>
          <Typography>Time: {formatTime(event.dateTime)}</Typography>
          <Typography>Location: {event.location}</Typography>
          <Typography>Description: {event.description}</Typography>
          <Typography>Category: {event.category}</Typography>
        </main>
        {isAdmin && (
          <footer style={{ display: 'flex', justifyContent: 'flex-end', gap: 10 }}>
            <Button variant="outlined" color="primary" onClick={() => router.push(`/admin/${event.id}/edit`)}>
              Edit
            </Button>
            <Button variant="contained" color="secondary" onClick={() => deleteEvent(event.id)}>
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
