---
name: react-hook-form-yup
description: Build type-safe forms with React Hook Form and Yup schema validation in Next.js applications. Use when creating forms, implementing validation schemas, integrating with MUI components, handling form state, or implementing complex validation rules with TypeScript.
---

# React Hook Form + Yup Validation

## Overview

This skill provides patterns for building performant, type-safe forms using React Hook Form with Yup schema validation in Next.js applications with Material UI.

## Installation

```bash
npm install react-hook-form @hookform/resolvers yup
```

## Core Concepts

### Basic Setup with useForm

```tsx
'use client';

import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';

// 1. Define the schema
const schema = yup.object({
  name: yup.string().required('Name is required'),
  email: yup.string().email('Invalid email').required('Email is required'),
}).required();

// 2. Infer TypeScript type from schema
type FormData = yup.InferType<typeof schema>;

// 3. Use in component
function MyForm() {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: yupResolver(schema),
  });

  const onSubmit = async (data: FormData) => {
    console.log(data); // Fully typed!
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      {errors.name && <p>{errors.name.message}</p>}

      <input {...register('email')} />
      {errors.email && <p>{errors.email.message}</p>}

      <button type="submit" disabled={isSubmitting}>
        Submit
      </button>
    </form>
  );
}
```

## MUI Integration Patterns

### TextField with React Hook Form

```tsx
import { TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

// For simple inputs, use register directly
<TextField
  {...register('name')}
  error={!!errors.name}
  helperText={errors.name?.message}
  label="Name"
  fullWidth
/>

// For controlled components, use Controller
<Controller
  name="description"
  control={control}
  render={({ field, fieldState: { error } }) => (
    <TextField
      {...field}
      error={!!error}
      helperText={error?.message}
      label="Description"
      multiline
      rows={4}
      fullWidth
    />
  )}
/>
```

### Select with React Hook Form

```tsx
import { FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';
import { Controller } from 'react-hook-form';

<Controller
  name="category"
  control={control}
  render={({ field, fieldState: { error } }) => (
    <FormControl fullWidth error={!!error}>
      <InputLabel>Category</InputLabel>
      <Select {...field} label="Category">
        <MenuItem value="">Select a category</MenuItem>
        <MenuItem value="Conference">Conference</MenuItem>
        <MenuItem value="Workshop">Workshop</MenuItem>
        <MenuItem value="Webinar">Webinar</MenuItem>
      </Select>
      {error && <FormHelperText>{error.message}</FormHelperText>}
    </FormControl>
  )}
/>
```

### DateTimePicker with React Hook Form

```tsx
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { Controller } from 'react-hook-form';

<Controller
  name="dateTime"
  control={control}
  render={({ field, fieldState: { error } }) => (
    <DateTimePicker
      {...field}
      label="Date and Time"
      minDateTime={new Date()}
      slotProps={{
        textField: {
          fullWidth: true,
          error: !!error,
          helperText: error?.message,
        },
      }}
    />
  )}
/>
```

## Yup Schema Patterns

### Common Validation Rules

```typescript
import * as yup from 'yup';

const schema = yup.object({
  // Required string with min/max length
  name: yup
    .string()
    .required('Name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters'),

  // Email validation
  email: yup
    .string()
    .required('Email is required')
    .email('Invalid email address'),

  // Password with pattern
  password: yup
    .string()
    .required('Password is required')
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
      'Must contain uppercase, lowercase, and number'
    ),

  // Confirm password
  confirmPassword: yup
    .string()
    .required('Please confirm password')
    .oneOf([yup.ref('password')], 'Passwords must match'),

  // Number validation
  age: yup
    .number()
    .required('Age is required')
    .positive('Must be positive')
    .integer('Must be an integer')
    .min(18, 'Must be at least 18'),

  // Date validation (future date)
  eventDate: yup
    .date()
    .required('Date is required')
    .min(new Date(), 'Date must be in the future'),

  // Select/enum validation
  category: yup
    .string()
    .required('Category is required')
    .oneOf(
      ['Conference', 'Workshop', 'Webinar', 'Networking', 'Other'],
      'Invalid category'
    ),

  // URL validation
  website: yup
    .string()
    .url('Must be a valid URL')
    .nullable(),

  // Phone number
  phone: yup
    .string()
    .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number')
    .nullable(),

  // Array validation
  tags: yup
    .array()
    .of(yup.string().required())
    .min(1, 'At least one tag is required')
    .max(5, 'Maximum 5 tags allowed'),

  // Conditional validation
  hasCompany: yup.boolean(),
  companyName: yup.string().when('hasCompany', {
    is: true,
    then: (schema) => schema.required('Company name is required'),
    otherwise: (schema) => schema.nullable(),
  }),
}).required();
```

### Custom Validation

```typescript
// Custom test for description length
const eventSchema = yup.object({
  description: yup
    .string()
    .required('Description is required')
    .test(
      'min-length-trimmed',
      'Description must be at least 50 characters',
      (value) => (value?.trim().length || 0) >= 50
    ),

  // Custom async validation (e.g., check if slug is unique)
  slug: yup
    .string()
    .required('Slug is required')
    .test('unique-slug', 'This slug is already taken', async (value) => {
      if (!value) return true;
      const response = await fetch(`/api/check-slug?slug=${value}`);
      const { available } = await response.json();
      return available;
    }),
}).required();
```

## Complete Event Form Example

```tsx
// components/events/EventForm.tsx
'use client';

import { useEffect } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from '@mui/material';
import { useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { createEvent, updateEvent } from '@/features/events/eventsSlice';
import type { CreateEventPayload, Event, EventCategory } from '@/types';

const EVENT_CATEGORIES: EventCategory[] = [
  'Conference',
  'Workshop',
  'Webinar',
  'Networking',
  'Other',
];

// Validation schema
const eventSchema = yup.object({
  name: yup
    .string()
    .required('Event name is required')
    .min(3, 'Name must be at least 3 characters')
    .max(100, 'Name must be less than 100 characters'),
  dateTime: yup
    .string()
    .required('Date and time is required')
    .test('future-date', 'Event date must be in the future', (value) => {
      if (!value) return false;
      return new Date(value) > new Date();
    }),
  location: yup
    .string()
    .required('Location is required')
    .min(3, 'Location must be at least 3 characters'),
  description: yup
    .string()
    .required('Description is required')
    .test(
      'min-length',
      'Description must be at least 50 characters',
      (value) => (value?.trim().length || 0) >= 50
    ),
  category: yup
    .string()
    .required('Category is required')
    .oneOf(EVENT_CATEGORIES, 'Please select a valid category'),
}).required();

type EventFormData = yup.InferType<typeof eventSchema>;

interface EventFormProps {
  event?: Event;
  onSuccess?: () => void;
}

// Format ISO date string to datetime-local input format
function formatDateTimeForInput(isoString: string): string {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function EventForm({ event, onSuccess }: EventFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.events);

  const isEditing = Boolean(event);

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<EventFormData>({
    resolver: yupResolver(eventSchema),
    defaultValues: {
      name: '',
      dateTime: '',
      location: '',
      description: '',
      category: '',
    },
  });

  // Initialize form with event data when editing
  useEffect(() => {
    if (event) {
      reset({
        name: event.name,
        dateTime: formatDateTimeForInput(event.dateTime),
        location: event.location,
        description: event.description,
        category: event.category,
      });
    }
  }, [event, reset]);

  const onSubmit = async (data: EventFormData) => {
    const payload: CreateEventPayload = {
      name: data.name.trim(),
      dateTime: new Date(data.dateTime).toISOString(),
      location: data.location.trim(),
      description: data.description.trim(),
      category: data.category as EventCategory,
    };

    try {
      if (isEditing && event) {
        await dispatch(updateEvent({ ...payload, id: event.id })).unwrap();
      } else {
        await dispatch(createEvent(payload)).unwrap();
      }

      if (onSuccess) {
        onSuccess();
      } else {
        router.push('/admin/events');
      }
    } catch {
      // Error is handled by Redux state
    }
  };

  const handleCancel = () => {
    router.push('/admin/events');
  };

  // Get minimum date for datetime input (current time)
  const getMinDateTime = (): string => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  // Watch description for character count
  const description = watch('description', '');

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TextField
        {...register('name')}
        fullWidth
        id="name"
        label="Event Name"
        error={!!errors.name}
        helperText={errors.name?.message}
        disabled={isLoading}
        required
        sx={{ mb: 3 }}
      />

      <TextField
        {...register('dateTime')}
        fullWidth
        id="dateTime"
        label="Date and Time"
        type="datetime-local"
        error={!!errors.dateTime}
        helperText={errors.dateTime?.message}
        disabled={isLoading}
        required
        slotProps={{
          inputLabel: { shrink: true },
          htmlInput: { min: getMinDateTime() },
        }}
        sx={{ mb: 3 }}
      />

      <TextField
        {...register('location')}
        fullWidth
        id="location"
        label="Location"
        error={!!errors.location}
        helperText={errors.location?.message}
        disabled={isLoading}
        required
        sx={{ mb: 3 }}
      />

      <Controller
        name="category"
        control={control}
        render={({ field, fieldState: { error } }) => (
          <FormControl fullWidth error={!!error} required sx={{ mb: 3 }}>
            <InputLabel id="category-label">Category</InputLabel>
            <Select
              {...field}
              labelId="category-label"
              id="category"
              label="Category"
              disabled={isLoading}
            >
              {EVENT_CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
            {error && <FormHelperText>{error.message}</FormHelperText>}
          </FormControl>
        )}
      />

      <TextField
        {...register('description')}
        fullWidth
        id="description"
        label="Description"
        multiline
        rows={4}
        error={!!errors.description}
        helperText={
          errors.description?.message ||
          `${description.length}/50 characters minimum`
        }
        disabled={isLoading}
        required
        sx={{ mb: 3 }}
      />

      <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
        <Button
          variant="outlined"
          onClick={handleCancel}
          disabled={isLoading}
          type="button"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : undefined}
        >
          {isLoading
            ? isEditing
              ? 'Updating...'
              : 'Creating...'
            : isEditing
              ? 'Update Event'
              : 'Create Event'}
        </Button>
      </Box>
    </Box>
  );
}
```

## Form State Management

### Useful useForm Options

```tsx
const {
  register,
  handleSubmit,
  control,
  reset,
  watch,
  setValue,
  getValues,
  trigger,
  formState: {
    errors,
    isSubmitting,
    isValid,
    isDirty,
    dirtyFields,
    touchedFields,
  },
} = useForm<FormData>({
  resolver: yupResolver(schema),
  defaultValues: {
    name: '',
    email: '',
  },
  mode: 'onBlur', // Validate on blur
  // mode: 'onChange', // Validate on change (more expensive)
  // mode: 'onSubmit', // Only validate on submit (default)
  // mode: 'onTouched', // Validate on first blur, then on change
  // mode: 'all', // Validate on blur and change
});
```

### Programmatic Form Control

```tsx
// Reset form with new values
reset({ name: 'New Name', email: 'new@email.com' });

// Set single field value
setValue('name', 'Updated Name', { shouldValidate: true });

// Get current values
const currentValues = getValues();
const nameValue = getValues('name');

// Watch specific fields for changes
const name = watch('name');
const [name, email] = watch(['name', 'email']);

// Trigger validation manually
await trigger(); // All fields
await trigger('name'); // Single field
await trigger(['name', 'email']); // Multiple fields
```

## Form Arrays (Dynamic Fields)

```tsx
import { useFieldArray } from 'react-hook-form';

const schema = yup.object({
  speakers: yup.array().of(
    yup.object({
      name: yup.string().required('Speaker name is required'),
      email: yup.string().email('Invalid email').required('Email is required'),
    })
  ).min(1, 'At least one speaker is required'),
}).required();

function SpeakersForm() {
  const { control, register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      speakers: [{ name: '', email: '' }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'speakers',
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      {fields.map((field, index) => (
        <Box key={field.id} sx={{ display: 'flex', gap: 2, mb: 2 }}>
          <TextField
            {...register(`speakers.${index}.name`)}
            label="Name"
            error={!!errors.speakers?.[index]?.name}
            helperText={errors.speakers?.[index]?.name?.message}
          />
          <TextField
            {...register(`speakers.${index}.email`)}
            label="Email"
            error={!!errors.speakers?.[index]?.email}
            helperText={errors.speakers?.[index]?.email?.message}
          />
          <Button onClick={() => remove(index)} disabled={fields.length === 1}>
            Remove
          </Button>
        </Box>
      ))}
      <Button onClick={() => append({ name: '', email: '' })}>
        Add Speaker
      </Button>
      <Button type="submit">Submit</Button>
    </form>
  );
}
```

## Best Practices

1. **Use yup.InferType** - Let TypeScript infer form types from schema
2. **Use Controller for complex components** - Select, DatePicker, custom components
3. **Use register for simple inputs** - TextField, input, textarea
4. **Set appropriate validation mode** - `onBlur` is good balance of UX and performance
5. **Use reset with useEffect** - For edit forms with async data
6. **Keep schemas in separate files** - Reuse across forms and tests
7. **Use watch sparingly** - Each watch triggers re-render on change
8. **Provide clear error messages** - User-friendly validation feedback
9. **Handle async validation** - Use `.test()` with async functions
10. **Type your schemas** - Use `yup.InferType<typeof schema>` for type safety
