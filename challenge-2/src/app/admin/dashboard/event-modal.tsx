import { Event } from '@/@types/event'
import { EVENT_CATEGORIES } from '@/constants/event-category'
import { useAppDispatch } from '@/store/store'
import { createEvent, updateEvent } from '@/store/thunk/event-thunk'
import { zodResolver } from '@hookform/resolvers/zod'
import { Box, Button, MenuItem, Modal, TextField, Typography } from '@mui/material'
import { X } from 'lucide-react'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

interface EventModal {
  open: boolean
  setOpen: (arg: boolean) => void
  selectedEvent?: Event
  mode: 'create' | 'edit'
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

export const eventSchema = z.object({
  event_name: z.string().min(1, { message: 'Nome do evento é obrigatório' }),
  date_time: z
    .string()
    .refine((val) => !isNaN(new Date(val).getTime()), {
      message: 'Data inválida',
    })
    .refine((val) => new Date(val) > new Date(), {
      message: 'Data deve ser futura',
    })
    .refine(
      (val) => {
        const selectedDate = new Date(val)
        const maxDate = new Date()
        maxDate.setFullYear(maxDate.getFullYear() + 3)
        return selectedDate <= maxDate
      },
      {
        message: 'Escolha um período de até 2 anos no futuro',
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

export type EventSchemaType = z.infer<typeof eventSchema>

export function EventModal({ open, setOpen, selectedEvent, mode }: EventModal) {
  const dispatch = useAppDispatch()

  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
    setValue,
  } = useForm<EventSchemaType>({
    resolver: zodResolver(eventSchema),
    defaultValues: {
      event_name: '',
      date_time: '',
      location: '',
      description: '',
      category: 'Conferência',
    },
  })

  useEffect(() => {
    if (mode === 'edit' && selectedEvent) {
      setValue('event_name', selectedEvent.event_name)
      setValue('date_time', selectedEvent.date_time)
      setValue('location', selectedEvent.location)
      setValue('description', selectedEvent.description)
      setValue('category', selectedEvent.category)
    }
  }, [mode, selectedEvent, setValue])

  async function onSubmitEventForm(data: EventSchemaType) {
    try {
      if (mode === 'edit' && selectedEvent) {
        const formattedEvent = {
          ...selectedEvent, // evento original
          ...data, // evento info's editadas
        }

        dispatch(updateEvent(formattedEvent))

        toast.success('Evento editado com sucesso')
      }

      if (mode === 'create') {
        dispatch(createEvent(data))
        toast.success('Evento criado com sucesso')
      }

      reset()
      setOpen(false)
    } catch (error) {
      toast.error(`Não foi possível ${mode === 'edit' ? 'editar' : 'criar'} o evento`)
      console.log(error)
    }
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
            border: '1px solid #e4e4e4',
            boxShadow: 'rgba(0, 0, 0, 0.1) 0px 4px 12px;',
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
          {mode === 'create' ? 'Criar evento' : 'Editar evento'}
        </Typography>

        <form
          onSubmit={handleSubmit(onSubmitEventForm)}
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
              textTransform: 'none',
            }}
          >
            {mode === 'create' ? 'Criar evento' : 'Editar evento'}
          </Button>
        </form>
      </Box>
    </Modal>
  )
}
