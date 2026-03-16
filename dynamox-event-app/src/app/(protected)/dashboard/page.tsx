'use client'

import { useState } from 'react'
import { isPast } from 'date-fns'

import {
  useGetEventsQuery,
  useCreateEventMutation,
  useUpdateEventMutation,
  useDeleteEventMutation
} from '@/services/eventsApi'

import { Event } from '@/types/event'
import { EventCard } from '@/components/EventCard'
import { EventForm } from '@/components/EventForm'

import {
  Box,
  Typography,
  Button,
  Grid,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material'

import AddIcon from '@mui/icons-material/Add'
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth'
import BarChartIcon from '@mui/icons-material/BarChart'
import DashboardStats from '@/components/DashboardStats'
import { useToast } from '@/context/ToastProvider'

export default function AdminDashboard() {
  const { showToast } = useToast()

  const { data: events = [], isLoading } = useGetEventsQuery()

  const [createEvent] = useCreateEventMutation()
  const [updateEvent] = useUpdateEventMutation()
  const [deleteEvent] = useDeleteEventMutation()

  const [formOpen, setFormOpen] = useState(false)
  const [editingEvent, setEditingEvent] = useState<Event | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const upcoming = events.filter(e => !isPast(new Date(e.dateTime))).length
  const past = events.length - upcoming

  const handleEdit = (event: Event) => {
    setEditingEvent(event)
    setFormOpen(true)
  }

  const handleCreate = () => {
    setEditingEvent(null)
    setFormOpen(true)
  }

  const handleSubmit = async (data: Omit<Event, 'id'>) => {
    try {
      if (editingEvent) {
        await updateEvent({
          id: editingEvent.id,
          event: data
        }).unwrap()

        showToast("Evento atualizado com sucesso", "success")
      } else {
        await createEvent(data).unwrap()
        showToast("Evento criado com sucesso", "success")
      }

      setFormOpen(false)
    } catch (err: any) {
      showToast(err?.data?.message || "Falha ao processar evento", "error")
    }
  }

  const confirmDelete = async () => {

    if (deleteId) {
      try {
        await deleteEvent(deleteId).unwrap()
        setDeleteId(null)
        showToast("Evento excluído com sucesso", "success")
      } catch (err: any) {
        showToast(err?.data?.message || "Falha ao deletar evento", "error")
      }
    }

  }

  if (isLoading) {
    return <Typography>Carregando eventos...</Typography>
  }

  return (

    <Box p={3}>

      <Stack
        direction={{ xs: 'column', sm: 'row' }}
        justifyContent="space-between"
        alignItems="center"
        mb={3}
        spacing={2}
      >

        <Box>
          <Typography variant="h4" fontWeight={700}>
            Admin Dashboard
          </Typography>

          <Typography color="text.secondary">
            Gerencie todos os seus eventos
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleCreate}
        >
          Criar evento
        </Button>

      </Stack>

      <Grid container spacing={2} mb={3}>

        <DashboardStats value={events.length} label='Total de eventos' icon={<CalendarMonthIcon />} />
        <DashboardStats value={upcoming} label='Próximos eventos' icon={<BarChartIcon />} />
        <DashboardStats value={past} label='Eventos passados' icon={<CalendarMonthIcon />} />

      </Grid>

      <Grid container spacing={2}>

        {events.map(event => (

          <Grid
            key={event.id}
            size={{ xs: 12, md: 6, lg: 4 }}
          >

            <EventCard
              event={event}
              showActions
              onEdit={handleEdit}
              onDelete={(id) => setDeleteId(id)}
            />

          </Grid>

        ))}

      </Grid>


      {events.length === 0 && (

        <Box textAlign="center" py={10}>

          <CalendarMonthIcon sx={{ fontSize: 48, opacity: 0.4, mb: 2 }} />

          <Typography color="text.secondary">
            Ainda não há eventos.
          </Typography>

        </Box>

      )}

      <EventForm
        open={formOpen}
        onOpenChange={setFormOpen}
        event={editingEvent}
        onSubmit={handleSubmit}
      />

      <Dialog
        open={!!deleteId}
        onClose={() => setDeleteId(null)}
      >

        <DialogTitle>
          Excluir evento
        </DialogTitle>

        <DialogContent>

          <Typography>
            Esta ação não poderá ser desfeita. Tem certeza que deseja excluir este evento?
          </Typography>

        </DialogContent>

        <DialogActions>

          <Button
            onClick={() => setDeleteId(null)}
          >
            Cancelar
          </Button>

          <Button
            color="error"
            variant="contained"
            onClick={confirmDelete}
          >
            Excluir
          </Button>

        </DialogActions>

      </Dialog>

    </Box>

  )
}