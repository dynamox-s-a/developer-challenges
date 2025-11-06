"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  MenuItem,
  TextField,
  useTheme,
} from "@mui/material";
import { Controller, useWatch } from "react-hook-form";
import { useEffect, useMemo } from "react";
import toast from "react-hot-toast";
import { EventModel } from "@/dto/EventModelDto";
import { useCreateEvent, useUpdateEvent } from "@/hooks/useEventQueries";
import { useFormValidation } from "@/hooks/useFormValidation";
import { categoryOptions } from "@/constants/eventCategories";
import { EventFormSchema, eventSchema } from "../../../validations/eventSchema";
import {
  LocalizationProvider,
  DatePicker,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { ptBR } from "date-fns/locale";

interface EventModalProps {
  open: boolean;
  onClose: () => void;
  editingEvent?: EventModel;
}

export const EventFormModal = ({
  open,
  onClose,
  editingEvent,
}: EventModalProps) => {
  const theme = useTheme();
  const { mutate: createEvent, isPending: creating } = useCreateEvent();
  const { mutate: updateEvent, isPending: updating } = useUpdateEvent();

  const defaultValues = useMemo<EventFormSchema>(
    () => ({
      title: "",
      date: "",
      time: "",
      location: "",
      category: "outro",
      description: "",
    }),
    []
  );

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useFormValidation<EventFormSchema>(eventSchema, { defaultValues });

  useEffect(() => {
    reset(editingEvent ? { ...defaultValues, ...editingEvent } : defaultValues);
  }, [editingEvent, open, reset, defaultValues]);

  const onSubmit = (data: EventFormSchema) => {
    if (editingEvent?.id) {
      updateEvent(
        { id: editingEvent.id, data },
        {
          onSuccess: () => {
            toast.success("Evento atualizado com sucesso!");
            onClose();
            reset();
          },
          onError: () => toast.error("Erro ao atualizar o evento!"),
        }
      );
    } else {
      createEvent(data, {
        onSuccess: () => {
          toast.success("Evento criado com sucesso!");
          onClose();
          reset();
        },
        onError: () => toast.error("Erro ao criar o evento!"),
      });
    }
  };

  const description = useWatch({
    control,
    name: "description",
    defaultValue: "",
  });

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          background:
            theme.palette.mode === "light"
              ? "rgba(255,255,255,0.85)"
              : "rgba(25,25,25,0.6)",
          backdropFilter: "blur(12px)",
          borderRadius: 4,
          boxShadow:
            theme.palette.mode === "light"
              ? "0 8px 32px rgba(0,0,0,0.08)"
              : "0 8px 32px rgba(0,0,0,0.6)",
          border:
            theme.palette.mode === "light"
              ? "1px solid rgba(0,0,0,0.05)"
              : "1px solid rgba(255,255,255,0.08)",
          transition: "all 0.3s ease",
          maxHeight: "90vh",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <DialogTitle
        sx={{
          fontWeight: 700,
          textAlign: "center",
          background: "linear-gradient(90deg, #3b82f6, #7c3aed, #3b82f6)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          mb: 1,
        }}
      >
        {editingEvent ? "Editar Evento" : "Novo Evento"}
      </DialogTitle>

      <Divider
        sx={{
          borderColor:
            theme.palette.mode === "light"
              ? "rgba(59,130,246,0.2)"
              : "rgba(124,58,237,0.2)",
          mb: 2,
        }}
      />
      <DialogContent
        sx={{
          overflowY: "auto",
          px: { xs: 2, sm: 3 },
          pb: 2,
          maxHeight: "70vh",
          "&::-webkit-scrollbar": { width: 6 },
          "&::-webkit-scrollbar-thumb": {
            background: "linear-gradient(180deg, #7c3aed, #3b82f6)",
            borderRadius: 8,
          },
          "&::-webkit-scrollbar-thumb:hover": {
            background: "linear-gradient(180deg, #6d28d9, #2563eb)",
          },
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <Controller
            name="title"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Nome do Evento"
                fullWidth
                error={!!errors.title}
                helperText={errors.title?.message}
              />
            )}
          />
          <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={ptBR}>
            <Box sx={{ display: "flex", gap: 2 }}>
              <Controller
                name="date"
                control={control}
                render={({ field }) => (
                  <DatePicker
                    label="Data"
                    value={field.value ? new Date(field.value) : null}
                    onChange={(newValue) => {
                      if (newValue) field.onChange(newValue.toISOString().split("T")[0]);
                    }}
                    format="dd/MM/yyyy"
                    closeOnSelect
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.date,
                        helperText: errors.date?.message,
                      },
                      popper: {
                        sx: {
                          "& .MuiPaper-root": {
                            background:
                              theme.palette.mode === "dark"
                                ? "rgba(18,18,18,0.95)"
                                : "rgba(255,255,255,0.9)",
                            backdropFilter: "blur(14px)",
                            borderRadius: "14px",
                            border: "1px solid rgba(124,58,237,0.25)",
                            boxShadow:
                              "0 8px 24px rgba(0,0,0,0.4), inset 0 0 12px rgba(124,58,237,0.15)",
                            color: theme.palette.text.primary,
                            transition: "all 0.25s ease",

                            "& .MuiPickersDay-root": {
                              color:
                                theme.palette.mode === "dark"
                                  ? "#cfc2ff"
                                  : "#4b0082",
                              fontWeight: 500,
                              "&:hover": {
                                background:
                                  "linear-gradient(90deg, rgba(124,58,237,0.2), rgba(59,130,246,0.2))",
                              },
                              "&.Mui-selected": {
                                background:
                                  "linear-gradient(90deg, #3b82f6, #7c3aed)",
                                color: "#fff",
                                boxShadow: "0 0 10px rgba(124,58,237,0.4)",
                              },
                            },
                            "& .MuiPickersCalendarHeader-label": {
                              color: "#a78bfa",
                              fontWeight: 600,
                            },
                            "& .MuiTypography-root": {
                              color: "#a78bfa",
                            },
                            "&::-webkit-scrollbar": { width: 6 },
                            "&::-webkit-scrollbar-thumb": {
                              background:
                                "linear-gradient(180deg, #7c3aed, #3b82f6)",
                              borderRadius: 8,
                            },
                          },
                        },
                      },
                    }}
                  />
                )}
              />
              <Controller
                name="time"
                control={control}
                render={({ field }) => (
                  <TimePicker
                    label="Hora"
                    closeOnSelect
                    value={field.value ? new Date(`1970-01-01T${field.value}`) : null}
                    onChange={(newValue) => {
                      if (newValue) {
                        const hours = newValue.getHours().toString().padStart(2, "0");
                        const minutes = newValue
                          .getMinutes()
                          .toString()
                          .padStart(2, "0");
                        field.onChange(`${hours}:${minutes}`);
                      }
                    }}
                    slotProps={{
                      textField: {
                        fullWidth: true,
                        error: !!errors.time,
                        helperText: errors.time?.message,
                      },
                      popper: {
                        sx: {
                          "& .MuiPaper-root": {
                            background:
                              theme.palette.mode === "dark"
                                ? "rgba(18,18,18,0.95)"
                                : "rgba(255,255,255,0.9)",
                            backdropFilter: "blur(14px)",
                            borderRadius: "14px",
                            border: "1px solid rgba(124,58,237,0.25)",
                            boxShadow:
                              "0 8px 24px rgba(0,0,0,0.4), inset 0 0 12px rgba(124,58,237,0.15)",
                            color: theme.palette.text.primary,
                            transition: "all 0.25s ease",
                            "& .MuiTypography-root": {
                              fontSize: "0.85rem",
                              color: "#cfc2ff",
                              "&:hover": { color: "#a78bfa" },
                            },
                            "&::-webkit-scrollbar": { width: 6 },
                            "&::-webkit-scrollbar-thumb": {
                              background:
                                "linear-gradient(180deg, #7c3aed, #3b82f6)",
                              borderRadius: 8,
                            },
                          },
                        },
                      },
                    }}
                  />
                )}
              />
            </Box>
          </LocalizationProvider>
          <Box sx={{ display: "flex", gap: 2 }}>
            <Controller
              name="location"
              control={control}
              render={({ field }) => (
                <TextField
                  {...field}
                  label="Localização"
                  fullWidth
                  error={!!errors.location}
                  helperText={errors.location?.message}
                />
              )}
            />

            <Controller
              name="category"
              control={control}
              defaultValue="outro"
              render={({ field }) => (
                <TextField
                  select
                  label="Categoria"
                  fullWidth
                  {...field}
                  error={!!errors.category}
                  helperText={errors.category?.message}
                >
                  {categoryOptions.map((opt) => (
                    <MenuItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </MenuItem>
                  ))}
                </TextField>
              )}
            />
          </Box>

          {/* Descrição com contador */}
          <Controller
            name="description"
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                label="Descrição"
                fullWidth
                multiline
                minRows={3}
                maxRows={6}
                error={!!errors.description}
                helperText={
                  errors.description?.message ||
                  `${description?.length || 0}/500 caracteres`
                }
              />
            )}
          />
        </Box>
      </DialogContent>

      <DialogActions
        sx={{
          px: 3,
          pb: 2,
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Button
          onClick={onClose}
          variant="outlined"
          disabled={creating || updating}
          sx={{
            color: "#7c3aed",
            borderColor: "rgba(124,58,237,0.3)",
            textTransform: "none",
            fontWeight: 600,
            "&:hover": {
              borderColor: "#7c3aed",
              background:
                "linear-gradient(90deg, rgba(124,58,237,0.08), rgba(59,130,246,0.08))",
            },
          }}
        >
          Cancelar
        </Button>

        <Button
          onClick={handleSubmit(onSubmit)}
          variant="contained"
          disabled={creating || updating}
          sx={{
            textTransform: "none",
            fontWeight: 600,
            px: 3,
            py: 1,
            borderRadius: "10px",
            background: "linear-gradient(90deg, #3b82f6, #7c3aed)",
            color: "#fff",
            boxShadow: "0 4px 12px rgba(0,0,0,0.08)",
            "&:hover": {
              background: "linear-gradient(90deg, #2563eb, #6d28d9)",
              boxShadow: "0 6px 16px rgba(0,0,0,0.15)",
            },
          }}
        >
          {creating || updating
            ? "Salvando..."
            : editingEvent
              ? "Atualizar"
              : "Criar"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
