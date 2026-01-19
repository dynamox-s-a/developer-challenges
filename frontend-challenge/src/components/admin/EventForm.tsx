'use client'

import { useState, useEffect, useCallback } from 'react'
import {
    TextField,
    Button,
    Select,
    MenuItem,
    Box,
    Stack,
} from '@mui/material'
import { EVENT_CATEGORIES } from '@/utils/eventHelpers'
import type { EventCategory, Event } from '@/types/Event'

interface FormData extends Omit<Event, 'id'> { }

interface EventFormProps {
    onSubmit: (event: FormData) => void
    initialData?: Event
    loading?: boolean
}

const INITIAL_FORM_STATE: FormData = {
    name: '',
    date: '',
    location: '',
    description: '',
    category: 'Conferência',
}

const MIN_DESCRIPTION_LENGTH = 50

const validateForm = (form: FormData): Record<string, string> => {
    const errors: Record<string, string> = {}

    if (!form.name.trim()) {
        errors.name = 'Nome é obrigatório'
    }

    if (!form.date) {
        errors.date = 'Data é obrigatória'
    } else if (new Date(form.date) <= new Date()) {
        errors.date = 'Data deve ser no futuro'
    }

    if (!form.location.trim()) {
        errors.location = 'Local é obrigatório'
    }

    if (!form.description.trim()) {
        errors.description = 'Descrição é obrigatória'
    } else if (form.description.length < MIN_DESCRIPTION_LENGTH) {
        errors.description = `Descrição mínima de ${MIN_DESCRIPTION_LENGTH} caracteres`
    }

    if (!form.category) {
        errors.category = 'Categoria é obrigatória'
    }

    return errors
}

export default function EventForm({
    onSubmit,
    initialData,
    loading = false,
}: EventFormProps) {
    const [form, setForm] = useState<FormData>(INITIAL_FORM_STATE)
    const [errors, setErrors] = useState<Record<string, string>>({})

    useEffect(() => {
        if (initialData) {
            setForm({
                name: initialData.name,
                date: initialData.date,
                location: initialData.location,
                description: initialData.description,
                category: initialData.category,
            })
        } else {
            setForm(INITIAL_FORM_STATE)
        }
    }, [initialData])

    // Remove erro do campo quando o usuário começar a editar
    const handleFieldChange = useCallback(
        (field: keyof FormData, value: string) => {
            setForm(prev => ({ ...prev, [field]: value }))

            if (errors[field]) {
                setErrors(prev => {
                    const newErrors = { ...prev }
                    delete newErrors[field]
                    return newErrors
                })
            }
        },
        [errors]
    )

    const handleSubmit = useCallback(() => {
        const validationErrors = validateForm(form)

        if (Object.keys(validationErrors).length === 0) {
            onSubmit(form)
            setForm(INITIAL_FORM_STATE)
        } else {
            setErrors(validationErrors)
        }
    }, [form, onSubmit])

    const descriptionCharCount = `${form.description.length}/${MIN_DESCRIPTION_LENGTH}`

    return (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
                label="Nome do Evento"
                fullWidth
                value={form.name}
                onChange={e => handleFieldChange('name', e.target.value)}
                error={!!errors.name}
                helperText={errors.name}
                disabled={loading}
                data-cy="event-name-input"
            />

            <TextField
                type="datetime-local"
                label="Data e Hora"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={form.date}
                onChange={e => handleFieldChange('date', e.target.value)}
                error={!!errors.date}
                helperText={errors.date}
                disabled={loading}
                data-cy="event-date-input"
            />

            <TextField
                label="Local"
                fullWidth
                value={form.location}
                onChange={e => handleFieldChange('location', e.target.value)}
                error={!!errors.location}
                helperText={errors.location}
                disabled={loading}
                data-cy="event-location-input"
            />

            <TextField
                label="Descrição"
                multiline
                rows={4}
                fullWidth
                value={form.description}
                onChange={e => handleFieldChange('description', e.target.value)}
                error={!!errors.description}
                helperText={`${errors.description || `Caracteres: ${descriptionCharCount}`}`}
                disabled={loading}
                data-cy="event-description-input"
            />

            <Select
                value={form.category}
                onChange={e => handleFieldChange('category', e.target.value as EventCategory)}
                error={!!errors.category}
                disabled={loading}
                data-cy="event-category-select"
            >
                {Object.entries(EVENT_CATEGORIES).map(([key, value]) => (
                    <MenuItem key={key} value={value}>
                        {value}
                    </MenuItem>
                ))}
            </Select>

            <Stack direction="row" spacing={1}>
                <Button
                    variant="contained"
                    onClick={handleSubmit}
                    disabled={loading}
                    fullWidth
                    data-cy="save-event-button"
                >
                    {loading ? 'Salvando...' : 'Salvar'}
                </Button>
            </Stack>
        </Box>
    )
}
