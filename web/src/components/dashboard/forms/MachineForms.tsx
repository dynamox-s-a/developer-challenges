/** biome-ignore-all lint/suspicious/noImplicitAnyLet: idk*/
/** biome-ignore-all lint/correctness/useUniqueElementIds: idk */
'use client'

import { useState, useEffect } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  Typography,
  IconButton,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import { ErrorDialog } from '@/components/ui/error-dialog'
import { type CreateMachineDto, CreateMachineSchema } from '@/types/zod/machine'
import { useCreateMachine } from '@/hooks/api/machine/useCreateMachine'
import { useUpdateMachine } from '@/hooks/api/machine/useUpdateMachine'
import { useDeleteMachine } from '@/hooks/api/machine/useDeleteMachine'

interface MachineFormProps {
  open: boolean
  onClose: () => void
  machineId?: string
  initialData?: CreateMachineDto
  onSuccess?: () => void
}

export default function MachineForm({
  open,
  onClose,
  machineId,
  initialData,
  onSuccess,
}: MachineFormProps) {
  const isEditing = !!machineId

  const {
    createMachine,
    loading: createLoading,
    error: createError,
  } = useCreateMachine()
  const {
    updateMachine,
    loading: updateLoading,
    error: updateError,
  } = useUpdateMachine()
  const {
    deleteMachine,
    loading: deleteLoading,
    error: deleteError,
  } = useDeleteMachine()

  const submitLoading = isEditing ? updateLoading : createLoading
  const hookError = isEditing ? updateError : createError

  const isAnyLoading = submitLoading || deleteLoading

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<CreateMachineDto>({
    resolver: zodResolver(CreateMachineSchema),
    defaultValues: {
      Name: '',
      Type: 'Pump',
    },
  })

  const [modalOpen, setModalOpen] = useState(false)
  const [modalError, setModalError] = useState('')

  useEffect(() => {
    if (open && isEditing && initialData) {
      reset(initialData)
    }
  }, [open, isEditing, initialData, reset])

  useEffect(() => {
    if (!open && !isEditing) {
      reset()
    }
  }, [open, isEditing, reset])

  const onSubmit = async (data: CreateMachineDto) => {
    let response

    if (isEditing && machineId) {
      response = await updateMachine(machineId, data)
    } else {
      response = await createMachine(data)
    }

    if (response.success) {
      reset()
      onSuccess?.()
      onClose()
      return
    }

    setModalError(response.message || 'Erro desconhecido')
    setModalOpen(true)
  }

  const handleDelete = async () => {
    if (!machineId) return

    if (!window.confirm('Tem certeza que deseja deletar esta máquina?')) {
      return
    }

    const response = await deleteMachine(machineId)

    if (response.success) {
      onSuccess?.()
      onClose()
    } else {
      setModalError(response.message || 'Erro ao deletar máquina')
      setModalOpen(true)
    }
  }

  return (
    <>
      <Dialog
        open={open}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { minHeight: '500px' } }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
          component="div"
        >
          <Typography variant="h5">
            {isEditing ? 'Editar Máquina' : 'Registrar Máquina'}
          </Typography>
          <IconButton
            onClick={onClose}
            disabled={isAnyLoading}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <form
          onSubmit={handleSubmit(onSubmit)}
          id="machine-form"
        >
          <DialogContent dividers>
            <Box
              sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 2 }}
            >
              <TextField
                label="Nome"
                {...register('Name')}
                error={!!errors.Name}
                helperText={errors.Name?.message}
                disabled={isAnyLoading}
                fullWidth
              />

              <Controller
                name="Type"
                control={control}
                render={({ field, fieldState: { error } }) => (
                  <FormControl
                    fullWidth
                    error={!!error}
                    disabled={isAnyLoading}
                  >
                    <InputLabel>Model</InputLabel>
                    <Select
                      label="Type"
                      {...field}
                      required
                    >
                      <MenuItem value="Pump">Pump</MenuItem>
                      <MenuItem value="Fan">Fan</MenuItem>
                    </Select>
                  </FormControl>
                )}
              />
            </Box>

            {(hookError || deleteError) && (
              <Typography
                color="error"
                sx={{ mt: 2 }}
              >
                {hookError || deleteError}
              </Typography>
            )}
          </DialogContent>

          <DialogActions sx={{ p: 2 }}>
            <Box
              sx={{
                display: 'flex',
                justifyContent: 'space-between',
                width: '100%',
              }}
            >
              {isEditing && (
                <Button
                  onClick={handleDelete}
                  disabled={isAnyLoading}
                  color="error"
                  variant="outlined"
                >
                  {deleteLoading ? 'Deletando...' : 'Deletar'}
                </Button>
              )}

              <Box>
                <Button
                  onClick={onClose}
                  disabled={isAnyLoading}
                  variant="outlined"
                  color="secondary"
                  sx={{ mr: 1 }}
                >
                  Cancelar
                </Button>
                <Button
                  type="submit"
                  form="machine-form"
                  variant="contained"
                  disabled={isAnyLoading || !isDirty}
                  color="secondary"
                >
                  {submitLoading
                    ? isEditing
                      ? 'Atualizando...'
                      : 'Enviando...'
                    : isEditing
                      ? 'Atualizar'
                      : 'Registrar'}
                </Button>
              </Box>
            </Box>
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
