import { useAppDispatch } from '@/store/store'
import { deleteEvent } from '@/store/thunk/event-thunk'
import { Box, Button, Modal, Typography } from '@mui/material'
import { X } from 'lucide-react'
import { toast } from 'sonner'

interface DeleteEventModal {
  open: boolean
  setOpen: (arg: boolean) => void
  selectedEventId: string
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

export function DeleteEventModal({ open, setOpen, selectedEventId }: DeleteEventModal) {
  const dispatch = useAppDispatch()

  async function handleDeleteEvent(eventId: string) {
    try {
      dispatch(deleteEvent(eventId))
      toast.success('Evento deletado com sucesso')
      setOpen(false)
    } catch (error) {
      console.log(error)
      toast.error('Erro ao deletar evento')
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
          Tem certeza que deseja deletar o evento ?
        </Typography>

        <Box sx={{ display: 'flex', gap: '8px', justifyContent: 'end' }}>
          <Button variant="contained" onClick={() => handleDeleteEvent(selectedEventId)}>
            Excluir
          </Button>

          <Button variant="outlined" onClick={() => setOpen(false)}>
            Voltar
          </Button>
        </Box>
      </Box>
    </Modal>
  )
}
