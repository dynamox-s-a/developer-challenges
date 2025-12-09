---
name: event-management-domain
description: Build the Event Management System domain logic including event CRUD operations, validation rules, filtering, sorting, and business requirements. Use when implementing event forms, validation, category handling, date filtering for upcoming/past events, search functionality, or event-specific business logic.
---

# Event Management Domain

## Overview

This skill provides domain-specific patterns for the Event Management System, including data models, validation rules, business logic, and UI patterns specific to event management.

## Domain Model

### Event Entity

```typescript
// types/event.ts
export interface Event {
  id: string;
  name: string;
  date: string; // ISO 8601 format
  location: string;
  description: string;
  category: EventCategory;
  createdAt: string;
  createdBy: string;
}

export type EventCategory =
  | 'Conference'
  | 'Workshop'
  | 'Webinar'
  | 'Networking'
  | 'Other';

export const EVENT_CATEGORIES: EventCategory[] = [
  'Conference',
  'Workshop',
  'Webinar',
  'Networking',
  'Other',
];

// Form data for creating/editing events
export interface EventFormData {
  name: string;
  date: Date | null;
  location: string;
  description: string;
  category: EventCategory | '';
}

// Initial form state
export const initialEventFormData: EventFormData = {
  name: '',
  date: null,
  location: '',
  description: '',
  category: '',
};
```

### User Entity

```typescript
// types/user.ts
export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}

export type UserRole = 'admin' | 'reader';

// Pre-configured users for the system
export const DEMO_USERS = {
  admin: {
    email: 'admin@events.com',
    password: 'admin123',
  },
  reader: {
    email: 'reader@events.com',
    password: 'reader123',
  },
};
```

## Validation Rules

### Event Validation Schema

```typescript
// lib/validation/eventValidation.ts
export interface ValidationError {
  field: string;
  message: string;
}

export interface ValidationResult {
  isValid: boolean;
  errors: Record<string, string>;
}

// Validation constants
export const VALIDATION_RULES = {
  name: {
    required: true,
    minLength: 3,
    maxLength: 100,
  },
  description: {
    required: true,
    minLength: 50,
    maxLength: 2000,
  },
  location: {
    required: true,
    minLength: 3,
    maxLength: 200,
  },
  date: {
    required: true,
    mustBeFuture: true,
  },
  category: {
    required: true,
    validOptions: ['Conference', 'Workshop', 'Webinar', 'Networking', 'Other'],
  },
};

export function validateEvent(data: EventFormData): ValidationResult {
  const errors: Record<string, string> = {};

  // Name validation
  if (!data.name?.trim()) {
    errors.name = 'Event name is required';
  } else if (data.name.length < VALIDATION_RULES.name.minLength) {
    errors.name = `Name must be at least ${VALIDATION_RULES.name.minLength} characters`;
  } else if (data.name.length > VALIDATION_RULES.name.maxLength) {
    errors.name = `Name must be less than ${VALIDATION_RULES.name.maxLength} characters`;
  }

  // Date validation
  if (!data.date) {
    errors.date = 'Date and time is required';
  } else {
    const eventDate = new Date(data.date);
    const now = new Date();
    if (eventDate <= now) {
      errors.date = 'Event date must be in the future';
    }
  }

  // Location validation
  if (!data.location?.trim()) {
    errors.location = 'Location is required';
  } else if (data.location.length < VALIDATION_RULES.location.minLength) {
    errors.location = `Location must be at least ${VALIDATION_RULES.location.minLength} characters`;
  }

  // Description validation
  if (!data.description?.trim()) {
    errors.description = 'Description is required';
  } else if (data.description.length < VALIDATION_RULES.description.minLength) {
    errors.description = `Description must be at least ${VALIDATION_RULES.description.minLength} characters`;
  }

  // Category validation
  if (!data.category) {
    errors.category = 'Category is required';
  } else if (!VALIDATION_RULES.category.validOptions.includes(data.category)) {
    errors.category = 'Please select a valid category';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

// Field-level validation for real-time feedback
export function validateField(
  field: keyof EventFormData,
  value: unknown
): string | null {
  switch (field) {
    case 'name':
      if (!value || (typeof value === 'string' && !value.trim())) {
        return 'Event name is required';
      }
      if (typeof value === 'string' && value.length < 3) {
        return 'Name must be at least 3 characters';
      }
      return null;

    case 'date':
      if (!value) return 'Date is required';
      if (new Date(value as string) <= new Date()) {
        return 'Must be a future date';
      }
      return null;

    case 'location':
      if (!value || (typeof value === 'string' && !value.trim())) {
        return 'Location is required';
      }
      return null;

    case 'description':
      if (!value || (typeof value === 'string' && !value.trim())) {
        return 'Description is required';
      }
      if (typeof value === 'string' && value.length < 50) {
        return `${50 - value.length} more characters required`;
      }
      return null;

    case 'category':
      if (!value) return 'Category is required';
      return null;

    default:
      return null;
  }
}
```

## Event Filtering & Sorting

### Filter Logic

```typescript
// lib/events/filters.ts
import { Event, EventCategory } from '@/types/event';

export interface EventFilters {
  search: string;
  category: EventCategory | null;
  dateRange: 'all' | 'upcoming' | 'past';
  sortBy: 'date' | 'name';
  sortOrder: 'asc' | 'desc';
}

export const defaultFilters: EventFilters = {
  search: '',
  category: null,
  dateRange: 'all',
  sortBy: 'date',
  sortOrder: 'asc',
};

export function filterEvents(events: Event[], filters: EventFilters): Event[] {
  let filtered = [...events];
  const now = new Date();

  // Search filter (name, description, location)
  if (filters.search) {
    const searchLower = filters.search.toLowerCase();
    filtered = filtered.filter(
      (event) =>
        event.name.toLowerCase().includes(searchLower) ||
        event.description.toLowerCase().includes(searchLower) ||
        event.location.toLowerCase().includes(searchLower)
    );
  }

  // Category filter
  if (filters.category) {
    filtered = filtered.filter((event) => event.category === filters.category);
  }

  // Date range filter
  if (filters.dateRange === 'upcoming') {
    filtered = filtered.filter((event) => new Date(event.date) >= now);
  } else if (filters.dateRange === 'past') {
    filtered = filtered.filter((event) => new Date(event.date) < now);
  }

  // Sorting
  filtered.sort((a, b) => {
    let comparison = 0;

    if (filters.sortBy === 'date') {
      comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    } else if (filters.sortBy === 'name') {
      comparison = a.name.localeCompare(b.name);
    }

    return filters.sortOrder === 'asc' ? comparison : -comparison;
  });

  return filtered;
}

// Get events grouped by time period
export function groupEventsByPeriod(events: Event[]) {
  const now = new Date();

  return {
    upcoming: events.filter((event) => new Date(event.date) >= now),
    past: events.filter((event) => new Date(event.date) < now),
  };
}

// Get events by category
export function groupEventsByCategory(
  events: Event[]
): Record<EventCategory, Event[]> {
  return events.reduce(
    (acc, event) => {
      if (!acc[event.category]) {
        acc[event.category] = [];
      }
      acc[event.category].push(event);
      return acc;
    },
    {} as Record<EventCategory, Event[]>
  );
}
```

## Event Form Component

### Complete Event Form

```tsx
// components/events/EventForm.tsx
'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Stack,
  Alert,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import {
  Event,
  EventFormData,
  EVENT_CATEGORIES,
  initialEventFormData,
} from '@/types/event';
import { validateEvent, validateField } from '@/lib/validation/eventValidation';

interface EventFormProps {
  event?: Event; // For edit mode
  onSubmit: (data: EventFormData) => Promise<void>;
  onCancel: () => void;
  isLoading?: boolean;
}

export function EventForm({
  event,
  onSubmit,
  onCancel,
  isLoading = false,
}: EventFormProps) {
  const [formData, setFormData] = useState<EventFormData>(initialEventFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [submitError, setSubmitError] = useState<string | null>(null);

  const isEditMode = !!event;

  // Initialize form with event data for edit mode
  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name,
        date: new Date(event.date),
        location: event.location,
        description: event.description,
        category: event.category,
      });
    }
  }, [event]);

  const handleChange = (field: keyof EventFormData, value: unknown) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Real-time validation for touched fields
    if (touched[field]) {
      const error = validateField(field, value);
      setErrors((prev) => ({
        ...prev,
        [field]: error || '',
      }));
    }
  };

  const handleBlur = (field: keyof EventFormData) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    const error = validateField(field, formData[field]);
    setErrors((prev) => ({
      ...prev,
      [field]: error || '',
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitError(null);

    // Validate all fields
    const validation = validateEvent(formData);

    if (!validation.isValid) {
      setErrors(validation.errors);
      setTouched(
        Object.keys(formData).reduce(
          (acc, key) => ({ ...acc, [key]: true }),
          {}
        )
      );
      return;
    }

    try {
      await onSubmit(formData);
    } catch (error) {
      setSubmitError((error as Error).message);
    }
  };

  const descriptionLength = formData.description.length;
  const descriptionHelperText =
    descriptionLength < 50
      ? `${50 - descriptionLength} more characters required (minimum 50)`
      : `${descriptionLength}/2000 characters`;

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <Box component="form" onSubmit={handleSubmit} noValidate>
        {submitError && (
          <Alert severity="error" sx={{ mb: 3 }}>
            {submitError}
          </Alert>
        )}

        <Stack spacing={3}>
          {/* Event Name */}
          <TextField
            fullWidth
            label="Event Name"
            value={formData.name}
            onChange={(e) => handleChange('name', e.target.value)}
            onBlur={() => handleBlur('name')}
            error={touched.name && !!errors.name}
            helperText={touched.name && errors.name}
            required
            inputProps={{ maxLength: 100 }}
          />

          {/* Date and Time */}
          <DateTimePicker
            label="Date and Time"
            value={formData.date}
            onChange={(value) => handleChange('date', value)}
            minDate={new Date()}
            slotProps={{
              textField: {
                fullWidth: true,
                required: true,
                error: touched.date && !!errors.date,
                helperText: touched.date && errors.date,
                onBlur: () => handleBlur('date'),
              },
            }}
          />

          {/* Location */}
          <TextField
            fullWidth
            label="Location"
            value={formData.location}
            onChange={(e) => handleChange('location', e.target.value)}
            onBlur={() => handleBlur('location')}
            error={touched.location && !!errors.location}
            helperText={touched.location && errors.location}
            required
            placeholder="e.g., Convention Center, San Francisco or Online"
            inputProps={{ maxLength: 200 }}
          />

          {/* Description */}
          <TextField
            fullWidth
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange('description', e.target.value)}
            onBlur={() => handleBlur('description')}
            error={touched.description && !!errors.description}
            helperText={
              (touched.description && errors.description) || descriptionHelperText
            }
            required
            multiline
            rows={4}
            inputProps={{ maxLength: 2000 }}
          />

          {/* Category */}
          <FormControl
            fullWidth
            required
            error={touched.category && !!errors.category}
          >
            <InputLabel>Category</InputLabel>
            <Select
              value={formData.category}
              label="Category"
              onChange={(e) => handleChange('category', e.target.value)}
              onBlur={() => handleBlur('category')}
            >
              {EVENT_CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
            {touched.category && errors.category && (
              <FormHelperText>{errors.category}</FormHelperText>
            )}
          </FormControl>

          {/* Actions */}
          <Stack direction="row" spacing={2} justifyContent="flex-end">
            <Button variant="outlined" onClick={onCancel} disabled={isLoading}>
              Cancel
            </Button>
            <Button type="submit" variant="contained" disabled={isLoading}>
              {isLoading
                ? 'Saving...'
                : isEditMode
                  ? 'Update Event'
                  : 'Create Event'}
            </Button>
          </Stack>
        </Stack>
      </Box>
    </LocalizationProvider>
  );
}
```

## Event List with Filters

### Filter Component

```tsx
// components/events/EventFilters.tsx
'use client';

import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  ToggleButtonGroup,
  ToggleButton,
  InputAdornment,
  Stack,
} from '@mui/material';
import { Search, ArrowUpward, ArrowDownward } from '@mui/icons-material';
import { EventFilters, EVENT_CATEGORIES } from '@/types/event';

interface EventFiltersProps {
  filters: EventFilters;
  onFilterChange: (filters: Partial<EventFilters>) => void;
}

export function EventFiltersBar({
  filters,
  onFilterChange,
}: EventFiltersProps) {
  return (
    <Box sx={{ mb: 3 }}>
      <Stack
        direction={{ xs: 'column', md: 'row' }}
        spacing={2}
        alignItems={{ xs: 'stretch', md: 'center' }}
      >
        {/* Search */}
        <TextField
          placeholder="Search events..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          size="small"
          sx={{ minWidth: 250 }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />

        {/* Category Filter */}
        <FormControl size="small" sx={{ minWidth: 150 }}>
          <InputLabel>Category</InputLabel>
          <Select
            value={filters.category || ''}
            label="Category"
            onChange={(e) =>
              onFilterChange({
                category: (e.target.value as EventCategory) || null,
              })
            }
          >
            <MenuItem value="">All Categories</MenuItem>
            {EVENT_CATEGORIES.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Date Range Toggle */}
        <ToggleButtonGroup
          value={filters.dateRange}
          exclusive
          onChange={(_, value) => value && onFilterChange({ dateRange: value })}
          size="small"
        >
          <ToggleButton value="all">All</ToggleButton>
          <ToggleButton value="upcoming">Upcoming</ToggleButton>
          <ToggleButton value="past">Past</ToggleButton>
        </ToggleButtonGroup>

        {/* Sort Controls */}
        <FormControl size="small" sx={{ minWidth: 120 }}>
          <InputLabel>Sort By</InputLabel>
          <Select
            value={filters.sortBy}
            label="Sort By"
            onChange={(e) =>
              onFilterChange({ sortBy: e.target.value as 'date' | 'name' })
            }
          >
            <MenuItem value="date">Date</MenuItem>
            <MenuItem value="name">Name</MenuItem>
          </Select>
        </FormControl>

        <ToggleButtonGroup
          value={filters.sortOrder}
          exclusive
          onChange={(_, value) => value && onFilterChange({ sortOrder: value })}
          size="small"
        >
          <ToggleButton value="asc">
            <ArrowUpward fontSize="small" />
          </ToggleButton>
          <ToggleButton value="desc">
            <ArrowDownward fontSize="small" />
          </ToggleButton>
        </ToggleButtonGroup>
      </Stack>
    </Box>
  );
}
```

## Event Card Component

```tsx
// components/events/EventCard.tsx
'use client';

import {
  Card,
  CardContent,
  CardActions,
  Typography,
  Chip,
  Box,
  IconButton,
  Tooltip,
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
  Edit,
  Delete,
} from '@mui/icons-material';
import { Event } from '@/types/event';
import { useAuth } from '@/contexts/AuthContext';
import { formatEventDate, isEventPast } from '@/lib/events/utils';

interface EventCardProps {
  event: Event;
  onEdit?: (event: Event) => void;
  onDelete?: (event: Event) => void;
}

export function EventCard({ event, onEdit, onDelete }: EventCardProps) {
  const { isAdmin } = useAuth();
  const isPast = isEventPast(event.date);

  const categoryColors: Record<string, 'primary' | 'secondary' | 'success' | 'warning' | 'info'> = {
    Conference: 'primary',
    Workshop: 'secondary',
    Webinar: 'info',
    Networking: 'success',
    Other: 'warning',
  };

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        opacity: isPast ? 0.7 : 1,
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 4,
        },
      }}
    >
      <CardContent sx={{ flexGrow: 1 }}>
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
            mb: 2,
          }}
        >
          <Chip
            label={event.category}
            color={categoryColors[event.category]}
            size="small"
          />
          {isPast && (
            <Chip label="Past" size="small" variant="outlined" color="default" />
          )}
        </Box>

        <Typography variant="h6" component="h2" gutterBottom>
          {event.name}
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 1, color: 'text.secondary' }}>
          <CalendarToday fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2">
            {formatEventDate(event.date)}
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, color: 'text.secondary' }}>
          <LocationOn fontSize="small" sx={{ mr: 1 }} />
          <Typography variant="body2">{event.location}</Typography>
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            display: '-webkit-box',
            WebkitLineClamp: 3,
            WebkitBoxOrient: 'vertical',
          }}
        >
          {event.description}
        </Typography>
      </CardContent>

      {isAdmin && (onEdit || onDelete) && (
        <CardActions sx={{ justifyContent: 'flex-end', pt: 0 }}>
          {onEdit && (
            <Tooltip title="Edit">
              <IconButton size="small" onClick={() => onEdit(event)}>
                <Edit fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
          {onDelete && (
            <Tooltip title="Delete">
              <IconButton
                size="small"
                color="error"
                onClick={() => onDelete(event)}
              >
                <Delete fontSize="small" />
              </IconButton>
            </Tooltip>
          )}
        </CardActions>
      )}
    </Card>
  );
}
```

## Utility Functions

```typescript
// lib/events/utils.ts
import { format, formatDistanceToNow, isPast, isFuture } from 'date-fns';

export function formatEventDate(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'PPP p'); // e.g., "April 20, 2025 at 2:00 PM"
}

export function formatEventDateShort(dateString: string): string {
  const date = new Date(dateString);
  return format(date, 'MMM d, yyyy'); // e.g., "Apr 20, 2025"
}

export function getRelativeTime(dateString: string): string {
  const date = new Date(dateString);
  return formatDistanceToNow(date, { addSuffix: true });
}

export function isEventPast(dateString: string): boolean {
  return isPast(new Date(dateString));
}

export function isEventUpcoming(dateString: string): boolean {
  return isFuture(new Date(dateString));
}

export function sortEventsByDate(events: Event[], order: 'asc' | 'desc'): Event[] {
  return [...events].sort((a, b) => {
    const comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
    return order === 'asc' ? comparison : -comparison;
  });
}
```

## Best Practices

1. **Validate on client and server** - Never trust client-side validation alone
2. **Use TypeScript strictly** - Type all domain entities and functions
3. **Implement proper error handling** - Show user-friendly error messages
4. **Provide real-time feedback** - Validate fields as users type (after blur)
5. **Handle edge cases** - Empty states, loading states, error states
6. **Keep domain logic separate** - Don't mix UI with business rules
7. **Use date-fns for dates** - Consistent date handling across the app
8. **Memoize filtered results** - Use useMemo or createSelector for performance
