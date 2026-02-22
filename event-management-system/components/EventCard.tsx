import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  Button,
} from '@mui/material';

import { Event } from '@/types/event';

interface Props {
  event: Event;
  isAdmin?: boolean;
  onEdit?: (event: Event) => void;
  onDelete?: (id: number) => void;
}

export function EventCard({ 
  event, 
  isAdmin, 
  onEdit, 
  onDelete 
}: Props) {
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

            {isAdmin && (
            <Box mt={2} display="flex" gap={1}>
              <Button
                size="small"
                onClick={() => onEdit?.(event)}
              >
                Edit
              </Button>
              <Button
                size="small"
                color="error"
                onClick={() => onDelete?.(event.id)}
              >
                Delete
              </Button>
            </Box>
            )}
        </CardContent>
      </Card>
  );
}