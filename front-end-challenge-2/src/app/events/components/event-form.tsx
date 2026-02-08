"use client";

import { useState, useEffect } from "react";
import { useAppDispatch } from "@/store/hooks";

import {
  Box,
  TextField,
  Button,
  MenuItem,
  CircularProgress,
} from "@mui/material";
import { CreateEventDto, Event } from "@/types";
import { createEvent, updateEvent } from "@/store/event/eventsThunk";
import { validateEventForm } from "@/utils/validation";
import { EVENT_CATEGORIES } from "@/constants/events";

interface EventFormProps {
  event?: Event | null;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function EventForm({
  event,
  onSuccess,
  onCancel,
}: EventFormProps) {
  const dispatch = useAppDispatch();
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const [formData, setFormData] = useState<CreateEventDto>({
    name: "",
    date: "",
    location: "",
    description: "",
    category: "Conferência",
  });

  useEffect(() => {
    console.log("Evento recebido para edição:", event);
    if (event) {
      const dateObj = new Date(event.date);
      const localDate = new Date(
        dateObj.getTime() - dateObj.getTimezoneOffset() * 60000,
      )
        .toISOString()
        .slice(0, 16);

      setFormData({
        name: event.name,
        date: localDate,
        location: event.location,
        description: event.description,
        category: event.category,
      });
    }
  }, [event]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const validationErrors = validateEventForm(formData);
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);

    try {
      const eventData = {
        name: formData.name,
        date: new Date(formData.date).toISOString(),
        location: formData.location,
        description: formData.description,
        category: formData.category,
      };

      if (event?.id) {
        await dispatch(updateEvent({ id: event.id, eventData }));
      } else {
        await dispatch(createEvent(eventData));
      }

      onSuccess();
    } catch (error) {
      console.error("Erro ao salvar evento:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2 }}>
      <TextField
        fullWidth
        label="Nome do Evento"
        name="name"
        value={formData.name}
        onChange={handleChange}
        margin="normal"
        required
        error={!!errors.name}
        helperText={errors.name}
      />

      <TextField
        fullWidth
        label="Data e Hora"
        name="date"
        type="datetime-local"
        value={formData.date}
        onChange={handleChange}
        margin="normal"
        required
        slotProps={{
          inputLabel: {
            shrink: true,
          },
        }}
        error={!!errors.date}
        helperText={errors.date}
      />

      <TextField
        fullWidth
        label="Local"
        name="location"
        value={formData.location}
        onChange={handleChange}
        margin="normal"
        required
        error={!!errors.location}
        helperText={errors.location}
      />

      <TextField
        fullWidth
        label="Descrição"
        name="description"
        value={formData.description}
        onChange={handleChange}
        margin="normal"
        required
        multiline
        rows={4}
        error={!!errors.description}
        helperText={
          errors.description ||
          `${formData.description.length}/50 caracteres mínimos`
        }
      />

      <TextField
        fullWidth
        select
        label="Categoria"
        name="category"
        value={formData.category}
        onChange={handleChange}
        margin="normal"
        required
        error={!!errors.category}
        helperText={errors.category}
      >
        {EVENT_CATEGORIES.map((cat) => (
          <MenuItem key={cat} value={cat}>
            {cat}
          </MenuItem>
        ))}
      </TextField>

      <Box sx={{ display: "flex", gap: 2, mt: 3 }}>
        <Button onClick={onCancel} variant="outlined" fullWidth>
          Cancelar
        </Button>
        <Button type="submit" variant="contained" fullWidth disabled={loading}>
          {loading ? (
            <CircularProgress size={24} />
          ) : event ? (
            "Atualizar"
          ) : (
            "Criar"
          )}
        </Button>
      </Box>
    </Box>
  );
}
