"use client";

import { yupResolver } from "@hookform/resolvers/yup";
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
} from "@mui/material";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import type { InferType } from "yup";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { CreateEventPayload, Event, EventCategory } from "@/types";
import { EVENT_CATEGORIES } from "../constants";
import { createEvent, updateEvent } from "../eventsSlice";
import { formatDateTimeForInput, getMinDateTime } from "../utils";
import { eventSchema } from "../validations";

type EventFormData = InferType<typeof eventSchema>;

interface EventFormProps {
  event?: Event;
  onSuccess?: () => void;
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
      name: "",
      dateTime: "",
      location: "",
      description: "",
      category: "",
    },
    mode: "onBlur",
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
        router.push("/admin/events");
      }
    } catch {
      // Error is handled by Redux state
    }
  };

  const handleCancel = () => {
    router.push("/admin/events");
  };

  // Watch description for character count
  const description = watch("description", "");

  return (
    <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TextField
        {...register("name")}
        fullWidth
        id="name"
        label="Event Name"
        error={!!errors.name}
        helperText={errors.name?.message}
        disabled={isLoading}
        required
        sx={{ mb: 3 }}
        inputProps={{ "data-testid": "event-name-input" }}
      />

      <TextField
        {...register("dateTime")}
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
          htmlInput: {
            min: getMinDateTime(),
            "data-testid": "event-datetime-input",
          },
        }}
        sx={{ mb: 3 }}
      />

      <TextField
        {...register("location")}
        fullWidth
        id="location"
        label="Location"
        error={!!errors.location}
        helperText={errors.location?.message}
        disabled={isLoading}
        required
        sx={{ mb: 3 }}
        inputProps={{ "data-testid": "event-location-input" }}
      />

      <Controller
        name="category"
        control={control}
        render={({ field, fieldState: { error: fieldError } }) => (
          <FormControl fullWidth error={!!fieldError} required sx={{ mb: 3 }}>
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
            {fieldError && (
              <FormHelperText>{fieldError.message}</FormHelperText>
            )}
          </FormControl>
        )}
      />

      <TextField
        {...register("description")}
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
        inputProps={{ "data-testid": "event-description-input" }}
      />

      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
        <Button
          variant="outlined"
          onClick={handleCancel}
          disabled={isLoading}
          type="button"
          data-testid="event-cancel-button"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="contained"
          disabled={isLoading}
          startIcon={isLoading ? <CircularProgress size={20} /> : undefined}
          data-testid="event-submit-button"
        >
          {isLoading
            ? isEditing
              ? "Updating..."
              : "Creating..."
            : isEditing
              ? "Update Event"
              : "Create Event"}
        </Button>
      </Box>
    </Box>
  );
}
