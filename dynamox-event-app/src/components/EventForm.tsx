'use client'

import { useState, useEffect } from 'react'
import { Event, EventCategory } from '@/types/event'

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Typography,
  MenuItem,
  Stack
} from '@mui/material'

const categories: EventCategory[] = [
  'Conference',
  'Workshop',
  'Webinar',
  'Networking',
  'Other'
]

interface EventFormDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  event?: Event | null
  onSubmit: (data: Omit<Event, 'id'>) => void
}

type EventForm = Omit<Event, 'id'>

const emptyForm: EventForm = {
  name: '',
  dateTime: '',
  location: '',
  description: '',
  category: 'Conference'
}

export const EventForm = ({
  open,
  onOpenChange,
  event,
  onSubmit
}: EventFormDialogProps) => {

  const [form, setForm] = useState<EventForm>(emptyForm)
  const [errors, setErrors] = useState<Record<string, string>>({})

  useEffect(() => {
    if (event) {
      setForm({
        name: event.name,
        dateTime: event.dateTime,
        location: event.location,
        description: event.description,
        category: event.category
      })
    } else {
      setForm(emptyForm)
    }

    setErrors({})
  }, [event, open])

  const updateField = (field: keyof EventForm, value: string) => {
    setForm(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const validate = () => {

    const errs: Record<string, string> = {}

    if (!form.name.trim())
      errs.name = 'Nome do evento é obrigatório'

    if (!form.dateTime)
      errs.dateTime = 'Data e hora são obrigatórios'
    else if (new Date(form.dateTime) <= new Date())
      errs.dateTime = 'Deve ser uma data no futuro'

    if (!form.location.trim())
      errs.location = 'Localização é obrigatória'

    if (!form.description.trim())
      errs.description = 'Descrição é obrigatória'
    else if (form.description.length < 50)
      errs.description = 'Descrição deve ter no mínimo 50 caractéres'

    if (!form.category)
      errs.category = 'Categoria é obrigatória'

    setErrors(errs)

    return Object.keys(errs).length === 0

  }

  const handleSubmit = (e: React.MouseEvent<HTMLButtonElement>) => {

    e.preventDefault()

    if (!validate()) return

    onSubmit({
      ...form,
      name: form.name.trim(),
      location: form.location.trim(),
      description: form.description.trim()
    })

    onOpenChange(false)

  }

  const isFormValid =
    form.name.trim() &&
    form.location.trim() &&
    form.description.trim().length >= 50 &&
    form.dateTime &&
    new Date(form.dateTime) > new Date()

  return (

    <Dialog
      open={open}
      onClose={() => onOpenChange(false)}
      maxWidth="sm"
      fullWidth
    >

      <DialogTitle>
        {event ? 'Editar Evento' : 'Criar Evento'}
      </DialogTitle>

      <DialogContent>

        <Typography
          variant="body2"
          color="text.secondary"
          mb={2}
        >
          {event
            ? 'Atualize os dados do evento abaixo.'
            : 'Preencha os detalhes abaixo para criar um novo evento.'}
        </Typography>

        <Stack
          component="form"
          spacing={2}
        >

          <TextField
            label="Nome do evento *"
            value={form.name}
            onChange={e => updateField('name', e.target.value)}
            error={!!errors.name}
            helperText={errors.name}
            fullWidth
          />

          <TextField
            label="Data e Hora *"
            type="datetime-local"
            value={form.dateTime}
            onChange={e => updateField('dateTime', e.target.value)}
            error={!!errors.dateTime}
            helperText={errors.dateTime}
            slotProps={{
              inputLabel: { shrink: true }
            }}
            fullWidth
          />

          <TextField
            label="Localização *"
            value={form.location}
            onChange={e => updateField('location', e.target.value)}
            error={!!errors.location}
            helperText={errors.location}
            fullWidth
          />

          <TextField
            select
            label="Categoria *"
            value={form.category}
            onChange={e =>
              updateField('category', e.target.value)
            }
            error={!!errors.category}
            helperText={errors.category}
            fullWidth
          >
            {categories.map(c => (
              <MenuItem key={c} value={c}>
                {c}
              </MenuItem>
            ))}
          </TextField>

          <TextField
            label="Descrição *"
            multiline
            rows={4}
            value={form.description}
            onChange={e => updateField('description', e.target.value)}
            error={!!errors.description}
            helperText={
              errors.description || `${form.description.length}/50`
            }
            fullWidth
          />

        </Stack>

      </DialogContent>

      <DialogActions>

        <Button onClick={() => onOpenChange(false)}>
          Cancel
        </Button>

        <Button
          variant="contained"
          onClick={handleSubmit}
          disabled={!isFormValid}
        >
          {event ? 'Atualizar Evento' : 'Criar Evento'}
        </Button>

      </DialogActions>

    </Dialog>

  )
}