'use client';

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
} from '@mui/material';
import { Event } from '@/types/event';
import { useEffect, useState } from 'react';

interface Props {
  open: boolean;
  onClose: () => void;
  initialData?: Event | null;
  onSubmit: (data: Omit<Event, 'id'>) => void;
}

export function EventForm({
  open,
  onClose,
  initialData,
  onSubmit,
}: Props) {
  const [form, setForm] = useState<Omit<Event, 'id'>>({
    name: '',
    date: '',
    location: '',
    description: '',
    category: 'Conference',
  });

  useEffect(() => {
    if (initialData) {
      const { id, ...rest } = initialData;
      setForm(rest);
    } else if (open) {
        setForm({
            name: '',
            date: '',
            location: '',
            description: '',
            category: 'Conference',
        });
    }
  }, [initialData, open]);

  const handleChange = (field: string, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit(form);
    onClose();
  };

  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const newErrors: Record<string, string> = {};
    const now = new Date();
    const eventDate = new Date(form.date);

    if (!form.name.trim()) newErrors.name = 'Name is required';
    if (!form.date) { 
      newErrors.date = 'Date is required';
    } else if (isNaN(eventDate.getTime())) {
      newErrors.date = 'Invalid date format';
    } else if (eventDate < now) {
      newErrors.date = 'Date must be in the future';
    } else {
      const isCreating = !initialData;

      if (isCreating && eventDate < now) {
        newErrors.date = 'Date must be in the future';
      }
    }
    if (!form.location.trim()) newErrors.location = 'Location is required';
    if (!form.description.trim()) {
    newErrors.description = 'Description is required';
    } else if (form.description.length < 50) {
      newErrors.description =
        'Description must be at least 50 characters';
    }
    if (!form.category) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);

    return Object.keys(newErrors).length === 0;
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth>
      <DialogTitle>
        {initialData ? 'Edit Event' : 'Create Event'}
      </DialogTitle>

      <DialogContent>
        <TextField
          label="Name"
          fullWidth
          required
          margin="dense"
          value={form.name}
          error={!!errors.name}
          helperText={errors.name}
          onChange={(e) => handleChange('name', e.target.value)}
        />

        <TextField
          type="datetime-local"
          label="Date"
          fullWidth
          required
          margin="dense"
          value={form.date}
          error={!!errors.date}
          helperText={errors.date}
          onChange={(e) => handleChange('date', e.target.value)}
          slotProps={{
            htmlInput: {
              min: initialData 
              ? undefined
              : new Date().toISOString().slice(0, 16),
            },
            inputLabel: {shrink: true},
          }}
        />

        <TextField
          label="Location"
          fullWidth
          required
          margin="dense"
          value={form.location}
          error={!!errors.location}
          helperText={errors.location}
          onChange={(e) => handleChange('location', e.target.value)}
        />

        <TextField
          label="Description"
          fullWidth
          required
          multiline
          minRows={3}
          margin="dense"
          value={form.description}
          error={!!errors.description}
          helperText={errors.description}
          onChange={(e) =>
            handleChange('description', e.target.value)
          }
        />

        <TextField
          select
          label="Category"
          fullWidth
          margin="dense"
          value={form.category}
          error={!!errors.category}
          helperText={errors.category}
          onChange={(e) =>
            handleChange('category', e.target.value)
          }
        >
          {[
            'Conference',
            'Workshop',
            'Webinar',
            'Networking',
            'Other',
          ].map((cat) => (
            <MenuItem key={cat} value={cat}>
              {cat}
            </MenuItem>
          ))}
        </TextField>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSubmit}>
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
}