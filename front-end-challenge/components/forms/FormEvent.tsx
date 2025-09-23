"use client";

import {
  TextField,
  Paper,
  Typography,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from "@mui/material";
import { EventNote } from "@mui/icons-material";
import { useState } from "react";
import type { EventFormData, FormEventProps } from "../../types/forms";
import {
  formatDateForInput,
  getCurrentDateForInput,
  validateEventForm,
} from "../../utils";
import DeleteButton from "../ui/actions/DeleteButton";
import SaveButton from "../ui/actions/SaveButton";
import CancelButton from "../ui/actions/CancelButton";

const CATEGORIES = [
  "Workshop",
  "Conference",
  "Webinar",
  "Meetup",
  "Seminar",
  "Training",
  "Networking",
  "Hackathon",
  "Competition",
  "Other",
];

export default function FormEvent({
  onSubmit,
  onCancel,
  onDelete,
  loading = false,
  title = "Cadastrar Evento",
  initialData = {},
  className,
}: FormEventProps) {
  const [formData, setFormData] = useState<EventFormData>({
    name: initialData.name || "",
    date: initialData.date
      ? formatDateForInput(initialData.date)
      : getCurrentDateForInput(),
    location: initialData.location || "",
    description: initialData.description || "",
    category: initialData.category || "",
  });

  const [errors, setErrors] = useState<Partial<EventFormData>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Limpa erro do campo quando usuário começa a digitar
    if (errors[name as keyof EventFormData]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const handleSelectChange = (field: keyof EventFormData, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Limpa erro do campo
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: undefined,
      }));
    }
  };

  const validateForm = (): boolean => {
    const validationErrors = validateEventForm(formData, [...CATEGORIES]);
    setErrors(validationErrors);
    return Object.keys(validationErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (validateForm()) {
      // Converte a data para ISO string
      const submitData: EventFormData = {
        ...formData,
        date: new Date(formData.date).toISOString(),
      };

      onSubmit(submitData);
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    }
  };

  return (
    <Paper
      elevation={3}
      className={className}
      sx={{ p: 4, maxWidth: 600, mx: "auto" }}
    >
      <Box sx={{ display: "flex", alignItems: "center", mb: 4 }}>
        <EventNote sx={{ fontSize: 32, color: "primary.main", mr: 2 }} />
        <Typography variant="h5" component="h2" color="primary.main">
          {title}
        </Typography>
      </Box>

      <form onSubmit={handleSubmit}>
        <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
          <TextField
            name="name"
            label="Nome do Evento"
            value={formData.name}
            onChange={handleInputChange}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
            required
            disabled={loading}
            placeholder="Ex: Workshop de React.js"
          />

          <TextField
            name="date"
            label="Data e Hora do Evento"
            type="datetime-local"
            value={formData.date}
            onChange={handleInputChange}
            error={!!errors.date}
            helperText={errors.date}
            fullWidth
            required
            disabled={loading}
            slotProps={{
              htmlInput: {
                min: new Date().toISOString().slice(0, 16),
              },
              inputLabel: {
                shrink: true,
              },
            }}
          />

          <TextField
            name="location"
            label="Local do Evento"
            value={formData.location}
            onChange={handleInputChange}
            error={!!errors.location}
            helperText={errors.location}
            fullWidth
            required
            disabled={loading}
            placeholder="Ex: São Paulo Tech Hub"
          />

          <FormControl fullWidth required error={!!errors.category}>
            <InputLabel id="category-label">Categoria</InputLabel>
            <Select
              labelId="category-label"
              label="Categoria"
              value={formData.category}
              onChange={(e) => handleSelectChange("category", e.target.value)}
              disabled={loading}
            >
              {CATEGORIES.map((category) => (
                <MenuItem key={category} value={category}>
                  {category}
                </MenuItem>
              ))}
            </Select>
            {errors.category && (
              <Typography
                variant="caption"
                color="error"
                sx={{ mt: 0.5, ml: 2 }}
              >
                {errors.category}
              </Typography>
            )}
          </FormControl>

          <TextField
            name="description"
            label="Descrição do Evento"
            value={formData.description}
            onChange={handleInputChange}
            error={!!errors.description}
            helperText={errors.description}
            fullWidth
            required
            disabled={loading}
            multiline
            rows={4}
            placeholder="Descreva os detalhes do evento, objetivos, público-alvo, etc."
          />

          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "space-between",
              mt: 2,
            }}
          >
            <Box sx={{ display: "flex", gap: 2 }}>
              {onCancel && (
                <CancelButton onClick={handleCancel} loading={loading} />
              )}
              <SaveButton loading={loading} />
            </Box>

            {onDelete && <DeleteButton onClick={onDelete} loading={loading} />}
          </Box>
        </Box>
      </form>
    </Paper>
  );
}
