/** biome-ignore-all lint/correctness/useUniqueElementIds: need to have Id */
'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog, DialogTitle, DialogContent, DialogActions,
  Button, TextField, Box, Typography, IconButton, FormControl, InputLabel, Select, MenuItem
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { ErrorDialog } from '@/components/ui/dialogs/ErrorDialog'
import { type CreateMachineDto, CreateMachineSchema } from '@/types/zod/machine'
import { useCreateMachine } from '@/hooks/api/useMachine'

interface MachineFormProps {
  open: boolean
  onClose: () => void
}

export default function MachineForm({ open, onClose }: MachineFormProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<CreateMachineDto>({
    resolver: zodResolver(CreateMachineSchema),
    defaultValues: {
      name: '',
      type: 'Pump'
    }
  })

  const { createMachine, error: hookError, loading } = useCreateMachine()

  const [modalOpen, setModalOpen] = useState(false)
  const [modalError, setModalError] = useState('')

  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  const onSubmit = async (data: CreateMachineDto) => {
    const response = await createMachine(data)

    if (response.success) {
      reset()
      onClose()
      return
    }

    setModalError(response.message || 'Erro desconhecido')
    setModalOpen(true)
  }

  return (
    <>
      <Dialog
        open={open}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { minHeight: '500px' } }}
      >
        <DialogTitle sx={{ 
          m: 0, p: 2, 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}
          component="div"
        >
          <Typography variant="h5">Registrar Máquina</Typography>
          <IconButton onClick={onClose} disabled={loading}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form onSubmit={handleSubmit(onSubmit)} id="machine-form">
          <DialogContent dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}>
              <TextField
                label="Nome"
                {...register('name')}
                error={!!errors.name}
                helperText={errors.name?.message}
                disabled={loading}
                fullWidth
              />
              
              <FormControl fullWidth error={!!errors.type} disabled={loading}>
                <InputLabel>Tipo</InputLabel>
                <Select label="Tipo" {...register('type')} required={true}>
                  <MenuItem value="Pump">Pump</MenuItem>
                  <MenuItem value="Fan">Fan</MenuItem>
                </Select>
              </FormControl>
            </Box>

            {hookError && (
              <Typography color="error" sx={{ mt: 2 }}>
                {hookError}
              </Typography>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Button
              onClick={onClose}
              disabled={loading}
              variant="outlined"
            >
              Cancelar
            </Button>
            <Button
              type="submit"
              form="machine-form"
              variant="contained"
              disabled={loading || !isDirty}
            >
              {loading ? 'Enviando...' : 'Registrar'}
            </Button>
          </DialogActions>
        </form>
      </Dialog>

      <ErrorDialog
        open={modalOpen}
        message={modalError}
        onClose={() => setModalOpen(false)}
      />
    </>
  )
}
