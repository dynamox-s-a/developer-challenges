import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
} from '@mui/material';

import { Event } from '@/types/event';

interface Props {
  event: Event;
}

export function EventCard({ event }: Props) {
  return (
    <Card>
      <CardContent>
        <Box display="flex" justifyContent="space-between" mb={1}>
          <Typography variant="h6">{event.name}</Typography>
          <Chip label={event.category} size="small" />
        </Box>

        <Typography variant="body2" color="text.secondary">
          {new Date(event.date).toLocaleString()}
        </Typography>

        <Typography variant="body2" mt={1}>
          {event.location}
        </Typography>

        <Typography variant="body2" mt={2}>
          {event.description}
        </Typography>
      </CardContent>
    </Card>
  );
}