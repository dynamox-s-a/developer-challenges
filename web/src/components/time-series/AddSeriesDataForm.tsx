'use client'

import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import {
  Box,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Typography,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { useState } from 'react'
import type { CreateTimeSeriesPointDto } from '@/types/zod/timeSeries'
import { useCreateTimeSeriesPoints } from '@/hooks/api/timeSeries/useCreateTimeSeriesPoints'

const AddTimeSeriesFormSchema = z.object({
  monitoringPointId: z.string(),
  timestamp: z.string().min(1, 'Data/hora obrigatória'),
  value: z
    .string()
    .min(1, 'Valor obrigatório')
    .refine(val => !Number.isNaN(Number(val)) && Number(val) > 0, {
      message: 'Valor deve ser um número positivo',
    }),
  unit: z.string().optional(),
})

type AddTimeSeriesFormValues = z.infer<typeof AddTimeSeriesFormSchema>

interface AddTimeSeriesDataFormProps {
  open: boolean
  onClose: () => void
  monitoringPointId: string
  onSuccess?: () => void
}

export default function AddTimeSeriesDataForm({
  open,
  onClose,
  monitoringPointId,
  onSuccess,
}: AddTimeSeriesDataFormProps) {
  const { createPoints, loading: apiLoading } = useCreateTimeSeriesPoints()
  const [loading, setLoading] = useState(false)

  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<AddTimeSeriesFormValues>({
    resolver: zodResolver(AddTimeSeriesFormSchema),
    defaultValues: {
      monitoringPointId,
      timestamp: new Date().toISOString().slice(0, 16),
      value: '',
      unit: '',
    },
  })

  const onSubmit = async (formData: AddTimeSeriesFormValues) => {
    setLoading(true)
    try {
      const dto: CreateTimeSeriesPointDto = {
        monitoringPointId: formData.monitoringPointId,
        timestamp: new Date(formData.timestamp),
        value: parseFloat(formData.value),
        unit: formData.unit,
      }

      const result = await createPoints(dto)
      if (result.success) {
        reset()
        onSuccess?.()
        onClose()
      } else {
        alert(result.message || 'Erro ao cadastrar')
      }
    } catch {
      alert('Erro de rede')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog
      open={open}
      maxWidth="sm"
      fullWidth
    >
      <DialogTitle>
        <Box
          display="flex"
          justifyContent="space-between"
          alignItems="center"
        >
          <Typography variant="h6">Adicionar Leitura</Typography>
          <IconButton
            onClick={onClose}
            disabled={loading || apiLoading}
          >
            <CloseIcon />
          </IconButton>
        </Box>
      </DialogTitle>
      <form onSubmit={handleSubmit(onSubmit)}>
        <DialogContent dividers>
          <Box
            display="flex"
            flexDirection="column"
            gap={2}
          >
            <TextField
              label="Data/Hora"
              type="datetime-local"
              {...register('timestamp')}
              error={!!errors.timestamp}
              helperText={errors.timestamp?.message}
              disabled={loading || apiLoading}
              fullWidth
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Valor"
              type="number"
              {...register('value')}
              error={!!errors.value}
              helperText={errors.value?.message}
              disabled={loading || apiLoading}
              fullWidth
            />
            <TextField
              label="Unidade (opcional)"
              {...register('unit')}
              error={!!errors.unit}
              helperText={errors.unit?.message}
              disabled={loading || apiLoading}
              fullWidth
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={onClose}
            disabled={loading || apiLoading}
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            variant="contained"
            disabled={loading || apiLoading || !isDirty}
          >
            {loading || apiLoading ? 'Enviando...' : 'Adicionar'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  )
}
