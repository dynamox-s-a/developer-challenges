'use client';

import { Box, Button, Grid2, MenuItem, TextField, Typography } from '@mui/material';
import { useForm } from 'react-hook-form';
import { eventSchema, EventSchema } from '../_components/schema/eventSchema';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import { Event } from '@/types/event';

interface EventFormProps {
  initialData?: Event;
  onSubmit: (data: Event) => void;
}

const EventForm = ({ initialData, onSubmit }: EventFormProps) => {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<EventSchema>({
    resolver: zodResolver(eventSchema),
    defaultValues: initialData || {
      name: '',
      description: '',
      dateTime: new Date().toISOString(),
      location: '',
    },
  });

  const onSubmitForm = async (data: EventSchema) => {
    onSubmit(data as Event);
  };

  const handleCancel = () => {
    router.push('/events');
  };

  return (
    <>
      <Typography variant="h5" fontWeight={600} color="primary" sx={{ mt: 15, mx: { xs: 2, md: 15 } }}>
        {initialData ? 'Edit Event' : 'Create Event'}
      </Typography>
      <Box
        component="form"
        onSubmit={handleSubmit(onSubmitForm)}
        sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4, mx: { xs: 2, md: 15 } }}
      >
        <TextField
          label="Name"
          variant="outlined"
          data-testid="name-input"
          {...register('name')}
          error={!!errors.name}
          helperText={errors.name?.message}
          required
        />
        <TextField
          label="Description"
          variant="outlined"
          data-testid="description-input"
          multiline
          rows={3}
          {...register('description')}
          error={!!errors.description}
          helperText={errors.description?.message}
          required
        />
        <Grid2 container spacing={2}>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <TextField
              type="datetime-local"
              label="Date"
              variant="outlined"
              data-testid="date-input"
              slotProps={{ inputLabel: { shrink: true } }}
              {...register('dateTime')}
              error={!!errors.dateTime}
              helperText={errors.dateTime?.message}
              sx={{ width: '100%' }}
              required
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <TextField
              label="Location"
              variant="outlined"
              data-testid="location-input"
              {...register('location')}
              sx={{ width: '100%' }}
              error={!!errors.location}
              helperText={errors.location?.message}
              required
            />
          </Grid2>
          <Grid2 size={{ xs: 12, md: 4 }}>
            <TextField
              select
              label="Category"
              variant="outlined"
              data-testid="category-input"
              defaultValue={initialData?.category || 'Conference'}
              {...register('category')}
              sx={{ width: '100%' }}
              error={!!errors.category}
              helperText={errors.category?.message}
              required
            >
              <MenuItem value="Conference">Conference</MenuItem>
              <MenuItem value="Workshop">Workshop</MenuItem>
              <MenuItem value="Webinar">Webinar</MenuItem>
              <MenuItem value="Networking">Networking</MenuItem>
              <MenuItem value="Other">Other</MenuItem>
            </TextField>
          </Grid2>
        </Grid2>
        <Box component="footer" sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 10 }}>
          <Button variant="outlined" color="primary" onClick={handleCancel} data-testid="cancel-button">
            Cancel
          </Button>
          <Button variant="contained" color="secondary" type="submit" data-testid="save-button">
            Save
          </Button>
        </Box>
      </Box>
    </>
  );
};

export default EventForm;
