"use client";

import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  MenuItem,
  Box,
  Alert,
} from "@mui/material";
import { EventCategory, CreateEventRequest, Event } from "@/types";

interface EventFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (event: CreateEventRequest) => Promise<void>;
  event?: Event | null;
  mode: "create" | "edit";
}

const categories: EventCategory[] = [
  "Conference",
  "Workshop",
  "Webinar",
  "Networking",
  "Other",
];

export default function EventFormDialog({
  open,
  onClose,
  onSubmit,
  event = null,
  mode,
}: EventFormDialogProps) {
  const [formData, setFormData] = useState<CreateEventRequest>({
    name: event?.name || "",
    dateTime: event?.dateTime ? event.dateTime.slice(0, 16) : "",
    location: event?.location || "",
    description: event?.description || "",
    category: event?.category || "Conference",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (field: keyof CreateEventRequest, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Event name is required";
    }

    if (!formData.dateTime) {
      newErrors.dateTime = "Date and time are required";
    } else {
      const selectedDate = new Date(formData.dateTime);
      const now = new Date();
      if (selectedDate <= now) {
        newErrors.dateTime = "Event date must be in the future";
      }
    }

    if (!formData.location.trim()) {
      newErrors.location = "Location is required";
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required";
    } else if (formData.description.trim().length < 50) {
      newErrors.description = "Description must be at least 50 characters";
    }

    if (!formData.category) {
      newErrors.category = "Category is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) {
      return;
    }

    setSubmitting(true);
    try {
      await onSubmit({
        ...formData,
        dateTime: new Date(formData.dateTime).toISOString(),
      });
      handleClose();
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleClose = () => {
    setFormData({
      name: "",
      dateTime: "",
      location: "",
      description: "",
      category: "Conference",
    });
    setErrors({});
    onClose();
  };

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="md" fullWidth>
      <DialogTitle>
        {mode === "create" ? "Create New Event" : "Edit Event"}
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 2 }}>
          <TextField
            label="Event Name"
            value={formData.name}
            onChange={(e) => handleChange("name", e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            required
            fullWidth
          />

          <TextField
            label="Date and Time"
            type="datetime-local"
            value={formData.dateTime}
            onChange={(e) => handleChange("dateTime", e.target.value)}
            error={!!errors.dateTime}
            helperText={errors.dateTime}
            required
            fullWidth
            InputLabelProps={{ shrink: true }}
          />

          <TextField
            label="Location"
            value={formData.location}
            onChange={(e) => handleChange("location", e.target.value)}
            error={!!errors.location}
            helperText={errors.location}
            required
            fullWidth
          />

          <TextField
            label="Category"
            select
            value={formData.category}
            onChange={(e) => handleChange("category", e.target.value)}
            error={!!errors.category}
            helperText={errors.category}
            required
            fullWidth
          >
            {categories.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Description"
            value={formData.description}
            onChange={(e) => handleChange("description", e.target.value)}
            error={!!errors.description}
            helperText={
              errors.description ||
              `${formData.description.length}/50 minimum characters`
            }
            required
            fullWidth
            multiline
            rows={4}
          />

          {Object.keys(errors).length > 0 && (
            <Alert severity="error">
              Please fix the errors above before submitting
            </Alert>
          )}
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose} disabled={submitting}>
          Cancel
        </Button>
        <Button
          onClick={handleSubmit}
          variant="contained"
          disabled={submitting}
        >
          {submitting
            ? "Submitting..."
            : mode === "create"
              ? "Create"
              : "Update"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}
