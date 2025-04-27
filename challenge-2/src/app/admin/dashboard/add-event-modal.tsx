import { EVENT_CATEGORIES } from '@/constants/event-category'
import { useAppDispatch } from '@/store/store'
import { createEvent } from '@/store/thunk/event-thunk'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, MenuItem, Modal, TextField, Typography } from '@mui/material'
import { X } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

interface AddEventModal {
  open: boolean
  setOpen: (arg: boolean) => void
}

const style = {
  display: 'flex',
  flexDirection: 'column',
  gap: '32px',
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
}

export const addEventSchema = z.object({
  event_name: z.string().min(1, { message: 'Nome do evento é obrigatório' }),
  date_time: z
    .string({
      required_error: 'Data e hora são obrigatórias',
    })
    .refine(
      (value) => {
        const date = new Date(value)
        return date > new Date()
      },
      {
        message: 'A data e hora devem ser futuras',
      }
    ),
  location: z.string().min(5, { message: 'Local do evento obrigatório. Mínimo 5 caracteres' }),
  description: z.string().min(50, {
    message: 'Descrição deve ter no mínimo 50 caracteres',
  }),
  category: z.enum(EVENT_CATEGORIES, {
    required_error: 'Categoria é obrigatória',
  }),
})

export type AddEventSchemaType = z.infer<typeof addEventSchema>

export function AddEventModal({ open, setOpen }: AddEventModal) {
  const dispatch = useAppDispatch()

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm<AddEventSchemaType>({
    resolver: zodResolver(addEventSchema),
    defaultValues: {
      event_name: '',
      date_time: '',
      location: '',
      description: '',
      category: 'Conferência',
    },
  })

  async function handleCreateEvent(data: AddEventSchemaType) {
    try {
      const response = await dispatch(createEvent(data))
      console.log(response)
    } catch (error) {}
  }

  return (
    <Modal
      open={open}
      onClose={() => setOpen(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style}>
        <Box
          sx={{
            position: 'absolute',
            top: '-8px',
            right: '-6px',
            background: 'white',
            width: '30px',
            height: '30px',
            border: '1px solid #7c7c7c',
            borderRadius: '100%',
            justifyContent: 'center',
            alignItems: 'center',
            display: 'flex',
            cursor: 'pointer',
          }}
          onClick={() => setOpen(false)}
        >
          <X size={16} />
        </Box>
        <Typography id="modal-modal-title" variant="h6" component="h2">
          Criar evento
        </Typography>

        <form
          onSubmit={handleSubmit(handleCreateEvent)}
          style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}
        >
          <TextField
            label="Nome do evento"
            type="text"
            {...register('event_name')}
            error={!!errors.event_name}
            helperText={errors.event_name?.message}
            fullWidth
          />

          <TextField
            label="Data do evento"
            slotProps={{
              inputLabel: {
                shrink: true,
              },
            }}
            type="datetime-local"
            {...register('date_time')}
            error={!!errors.date_time}
            helperText={errors.date_time?.message}
            fullWidth
          />

          <TextField
            label="Endereço"
            type="text"
            {...register('location')}
            error={!!errors.location}
            helperText={errors.location?.message}
            fullWidth
          />

          <TextField
            label="Descrição"
            type="text"
            {...register('description')}
            error={!!errors.description}
            helperText={errors.description?.message}
            fullWidth
          />

          <TextField
            select
            label="Categoria"
            defaultValue="Conferência"
            {...register('category')}
            error={!!errors.category}
            helperText={errors.category?.message}
            fullWidth
          >
            {EVENT_CATEGORIES.map((category) => (
              <MenuItem key={category} value={category}>
                {category}
              </MenuItem>
            ))}
          </TextField>

          <Button
            type="submit"
            sx={{
              textWrap: 'nowrap',
              background: '#692746',
              fontSize: '14px',
              color: 'white',
            }}
          >
            Criar Evento
          </Button>
        </form>
      </Box>
    </Modal>
  )
}
