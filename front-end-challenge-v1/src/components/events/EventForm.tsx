"use client";

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
import { useEffect, useState } from "react";
import { createEvent, updateEvent } from "@/features/events/eventsSlice";
import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import type { CreateEventPayload, Event, EventCategory } from "@/types";

const EVENT_CATEGORIES: EventCategory[] = [
  "Conference",
  "Workshop",
  "Webinar",
  "Networking",
  "Other",
];

interface FormData {
  name: string;
  dateTime: string;
  location: string;
  description: string;
  category: EventCategory | "";
}

interface FormErrors {
  name?: string;
  dateTime?: string;
  location?: string;
  description?: string;
  category?: string;
}

interface EventFormProps {
  event?: Event;
  onSuccess?: () => void;
}

// Format ISO date string to datetime-local input format
function formatDateTimeForInput(isoString: string): string {
  const date = new Date(isoString);
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function EventForm({ event, onSuccess }: EventFormProps) {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isLoading, error } = useAppSelector((state) => state.events);

  const isEditing = Boolean(event);

  const [formData, setFormData] = useState<FormData>({
    name: "",
    dateTime: "",
    location: "",
    description: "",
    category: "",
  });
  const [formErrors, setFormErrors] = useState<FormErrors>({});

  // Initialize form with event data when editing
  useEffect(() => {
    if (event) {
      setFormData({
        name: event.name,
        dateTime: formatDateTimeForInput(event.dateTime),
        location: event.location,
        description: event.description,
        category: event.category,
      });
    }
  }, [event]);

  const validateForm = (): boolean => {
    const errors: FormErrors = {};

    // Name validation
    if (!formData.name.trim()) {
      errors.name = "Event name is required";
    }

    // Date/Time validation
    if (!formData.dateTime) {
      errors.dateTime = "Date and time is required";
    } else {
      const selectedDate = new Date(formData.dateTime);
      const now = new Date();
      if (selectedDate <= now) {
        errors.dateTime = "Event date must be in the future";
      }
    }

    // Location validation
    if (!formData.location.trim()) {
      errors.location = "Location is required";
    }

    // Description validation
    if (!formData.description.trim()) {
      errors.description = "Description is required";
    } else if (formData.description.trim().length < 50) {
      errors.description = `Description must be at least 50 characters (currently ${formData.description.trim().length})`;
    }

    // Category validation
    if (!formData.category) {
      errors.category = "Category is required";
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleChange = (field: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));

    // Clear specific field error when user starts typing
    if (formErrors[field]) {
      setFormErrors((prev) => ({ ...prev, [field]: undefined }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    const payload: CreateEventPayload = {
      name: formData.name.trim(),
      dateTime: new Date(formData.dateTime).toISOString(),
      location: formData.location.trim(),
      description: formData.description.trim(),
      category: formData.category as EventCategory,
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

  // Get minimum date for datetime input (current time)
  const getMinDateTime = (): string => {
    const now = new Date();
    now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
    return now.toISOString().slice(0, 16);
  };

  return (
    <Box component="form" onSubmit={handleSubmit} noValidate>
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      <TextField
        fullWidth
        id="name"
        name="name"
        label="Event Name"
        value={formData.name}
        onChange={(e) => handleChange("name", e.target.value)}
        error={Boolean(formErrors.name)}
        helperText={formErrors.name}
        disabled={isLoading}
        required
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        id="dateTime"
        name="dateTime"
        label="Date and Time"
        type="datetime-local"
        value={formData.dateTime}
        onChange={(e) => handleChange("dateTime", e.target.value)}
        error={Boolean(formErrors.dateTime)}
        helperText={formErrors.dateTime}
        disabled={isLoading}
        required
        slotProps={{
          inputLabel: { shrink: true },
          htmlInput: { min: getMinDateTime() },
        }}
        sx={{ mb: 3 }}
      />

      <TextField
        fullWidth
        id="location"
        name="location"
        label="Location"
        value={formData.location}
        onChange={(e) => handleChange("location", e.target.value)}
        error={Boolean(formErrors.location)}
        helperText={formErrors.location}
        disabled={isLoading}
        required
        sx={{ mb: 3 }}
      />

      <FormControl
        fullWidth
        error={Boolean(formErrors.category)}
        required
        sx={{ mb: 3 }}
      >
        <InputLabel id="category-label">Category</InputLabel>
        <Select
          labelId="category-label"
          id="category"
          name="category"
          value={formData.category}
          label="Category"
          onChange={(e) => handleChange("category", e.target.value)}
          disabled={isLoading}
        >
          {EVENT_CATEGORIES.map((category) => (
            <MenuItem key={category} value={category}>
              {category}
            </MenuItem>
          ))}
        </Select>
        {formErrors.category && (
          <FormHelperText>{formErrors.category}</FormHelperText>
        )}
      </FormControl>

      <TextField
        fullWidth
        id="description"
        name="description"
        label="Description"
        multiline
        rows={4}
        value={formData.description}
        onChange={(e) => handleChange("description", e.target.value)}
        error={Boolean(formErrors.description)}
        helperText={
          formErrors.description ||
          `${formData.description.length}/50 characters minimum`
        }
        disabled={isLoading}
        required
        sx={{ mb: 3 }}
      />

      <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
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
