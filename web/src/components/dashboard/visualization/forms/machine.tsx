'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
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
} from '@mui/material'
import CloseIcon from '@mui/icons-material/Close'
import {
  registerRequestSchema,
  type registerRequest,
} from '@/lib/http/auth/services/auth.types'
import { authService } from '@/lib/http/auth'
import { useRouter } from 'next/navigation'
import { ErrorModal } from '@/components/errorModal'
import { type MachineDTO, MachineModel } from '@/lib/database/machine/schema'

interface RegisterDialogProps {
  open: boolean
  onClose: () => void
}

export default function MachineDialog({ open, onClose }: RegisterDialogProps) {
  const {
    register,
    handleSubmit,
    formState: { errors, isDirty },
    reset,
  } = useForm<MachineDTO>({
    resolver: zodResolver(MachineModel),
  })

  const router = useRouter()
  const [modalOpen, setModalOpen] = useState(false)
  const [modalError, setModalError] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    if (!open) {
      reset()
    }
  }, [open, reset])

  const onSubmit = async (data: MachineDTO) => {
    // const response = await fetch("/api/machine")
    // setIsSubmitting(true)
    // setModalError()
    // setModalOpen()
    // reset()
    // onClose()
  }

  return (
    <>
      <Dialog
        open={open}
        disableEscapeKeyDown={isDirty || isSubmitting}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            minHeight: '500px',
          },
        }}
      >
        <DialogTitle
          sx={{
            m: 0,
            p: 2,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <Typography
            variant="h5"
            component="div"
          >
            Registrar
          </Typography>
          <IconButton
            disabled={isSubmitting}
            sx={{
              color: theme => theme.palette.grey[500],
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>

        <DialogContent dividers>
          <Box
            component="form"
            sx={{
              display: 'flex',
              flexDirection: 'column',
              gap: 2,
              mt: 2,
            }}
            onSubmit={handleSubmit(onSubmit)}
          >
            <TextField
              label="Nome"
              variant="outlined"
              fullWidth
              {...register('Name')}
              error={!!errors.Name}
              helperText={errors.Name?.message}
              disabled={isSubmitting}
            />
            <TextField
              label="Email"
              variant="outlined"
              fullWidth
              {...register('Type')}
              error={!!errors.Type}
              helperText={errors.Type?.message}
              disabled={isSubmitting}
            />
          </Box>
        </DialogContent>

        <DialogActions sx={{ p: 2 }}>
          <Button
            disabled={isSubmitting}
            variant="outlined"
          >
            Cancelar
          </Button>
          <Button
            type="submit"
            form="register-form"
            variant="contained"
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Enviando...' : 'Registrar'}
          </Button>
        </DialogActions>
      </Dialog>

      <ErrorModal
        open={modalOpen}
        message={modalError}
        onClose={() => setModalOpen(false)}
      />
    </>
  )
}
